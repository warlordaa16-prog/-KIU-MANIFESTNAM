import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  INITIAL_MEMBERS,
  INITIAL_HOMES,
  INITIAL_DEPARTMENTS,
  INITIAL_EVENTS,
  INITIAL_ATTENDANCE,
  INITIAL_INCOME,
  INITIAL_EXPENSES,
  INITIAL_BUDGETS,
  INITIAL_PROJECTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MESSAGES,
} from './src/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

app.use(express.json({ limit: '15mb' }));

// Persistent Server State File
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'fellowship-db.json');

interface FellowshipServerStore {
  members: any[];
  homes: any[];
  departments: any[];
  events: any[];
  attendance: any[];
  income: any[];
  expenses: any[];
  budgets: any[];
  projects: any[];
  auditLogs: any[];
  messages: any[];
  lastUpdated: string;
}

const defaultStore: FellowshipServerStore = {
  members: [],
  homes: [],
  departments: INITIAL_DEPARTMENTS,
  events: [],
  attendance: [],
  income: [],
  expenses: [],
  budgets: [],
  projects: [],
  auditLogs: [
    {
      id: 'aud-init-001',
      timestamp: new Date().toISOString(),
      userName: 'Model Admin',
      userRole: 'Model Admin',
      module: 'System',
      action: 'Workspace Initialized',
      targetEntityId: 'sys-init',
      details: 'System database emptied and ready for live multi-party data entry.',
      result: 'Success',
    },
  ],
  messages: [],
  lastUpdated: new Date().toISOString(),
};

function loadStore(): FellowshipServerStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.members)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Server DB] Error loading file, falling back to defaults:', err);
  }
  saveStore(defaultStore);
  return { ...defaultStore };
}

function saveStore(store: FellowshipServerStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    store.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server DB] Error saving to disk:', err);
  }
}

let currentStore = loadStore();

// Track connected operators and sockets
interface ConnectedClient {
  ws: WebSocket;
  id: string;
  userName: string;
  role: string;
  activeTab: string;
  connectedAt: string;
  lastPing: number;
}

const clients = new Map<string, ConnectedClient>();

function getActiveOperators() {
  const opMap = new Map<string, { name: string; count: number; activeTab: string; lastSeen: string }>();
  for (const client of clients.values()) {
    const existing = opMap.get(client.userName);
    if (existing) {
      existing.count += 1;
      existing.lastSeen = new Date().toISOString();
    } else {
      opMap.set(client.userName, {
        name: client.userName,
        count: 1,
        activeTab: client.activeTab || 'dashboard',
        lastSeen: new Date().toISOString(),
      });
    }
  }
  return Array.from(opMap.values());
}

function broadcast(event: string, payload: any, senderWs?: WebSocket) {
  const message = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  for (const client of clients.values()) {
    if (client.ws.readyState === WebSocket.OPEN) {
      if (!senderWs || client.ws !== senderWs) {
        client.ws.send(message);
      }
    }
  }
}

function broadcastAll(event: string, payload: any) {
  broadcast(event, payload, undefined);
}

// WebSocket Connection Management
wss.on('connection', (ws: WebSocket, req) => {
  const clientId = 'c_' + Math.random().toString(36).substring(2, 9);
  const clientInfo: ConnectedClient = {
    ws,
    id: clientId,
    userName: 'Anibal',
    role: 'Model Admin',
    activeTab: 'dashboard',
    connectedAt: new Date().toISOString(),
    lastPing: Date.now(),
  };

  clients.set(clientId, clientInfo);

  // Send initial welcome & full current state
  ws.send(
    JSON.stringify({
      event: 'state:init',
      payload: {
        store: currentStore,
        clientId,
        activeOperators: getActiveOperators(),
      },
    })
  );

  // Notify everyone of presence
  broadcastAll('presence:update', {
    activeOperators: getActiveOperators(),
    totalConnections: clients.size,
  });

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      clientInfo.lastPing = Date.now();

      switch (msg.type) {
        case 'client:identify': {
          clientInfo.userName = msg.userName || 'Operator';
          clientInfo.role = msg.role || 'Model Admin';
          clientInfo.activeTab = msg.activeTab || 'dashboard';
          broadcastAll('presence:update', {
            activeOperators: getActiveOperators(),
            totalConnections: clients.size,
            recentJoin: clientInfo.userName,
          });
          break;
        }

        case 'client:ping': {
          ws.send(JSON.stringify({ event: 'server:pong', timestamp: Date.now() }));
          break;
        }

        case 'member:create': {
          const { member, operator } = msg;
          if (!member || !member.id) break;

          // Check if duplicate ID exists
          const existingIdx = currentStore.members.findIndex((m) => m.id === member.id);
          const sanitizedMember = {
            ...member,
            createdBy: member.createdBy || operator || clientInfo.userName,
            createdAt: member.createdAt || new Date().toISOString(),
            updatedBy: member.updatedBy || operator || clientInfo.userName,
            updatedAt: new Date().toISOString(),
          };

          if (existingIdx >= 0) {
            currentStore.members[existingIdx] = sanitizedMember;
          } else {
            currentStore.members = [sanitizedMember, ...currentStore.members];
          }

          // Add to audit log
          const auditEntry = {
            id: 'aud-' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
            userName: operator || clientInfo.userName,
            userRole: 'Model Admin',
            module: 'Members',
            action: 'Member Registered',
            targetEntityId: member.id,
            details: `${operator || clientInfo.userName} registered ${member.fullName} (${member.id}) - ${member.hostelOrResidence || 'General'}`,
            result: 'Success',
          };
          currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];

          saveStore(currentStore);

          // Broadcast to all clients (including sender for confirmation)
          broadcastAll('member:created', {
            member: sanitizedMember,
            operator: operator || clientInfo.userName,
            auditLog: auditEntry,
          });
          break;
        }

        case 'member:update': {
          const { id, updates, operator, reason } = msg;
          const idx = currentStore.members.findIndex((m) => m.id === id);
          if (idx >= 0) {
            const updatedMember = {
              ...currentStore.members[idx],
              ...updates,
              updatedBy: operator || clientInfo.userName,
              updatedAt: new Date().toISOString(),
              lastActionNote: reason || updates.lastActionNote,
            };
            currentStore.members[idx] = updatedMember;

            const auditEntry = {
              id: 'aud-' + Date.now().toString(36),
              timestamp: new Date().toISOString(),
              userName: operator || clientInfo.userName,
              userRole: 'Model Admin',
              module: 'Members',
              action: 'Member Updated',
              targetEntityId: id,
              details: `${operator || clientInfo.userName} updated ${updatedMember.fullName}${reason ? `: ${reason}` : ''}`,
              result: 'Success',
            };
            currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];

            saveStore(currentStore);

            broadcastAll('member:updated', {
              member: updatedMember,
              operator: operator || clientInfo.userName,
              auditLog: auditEntry,
            });
          }
          break;
        }

        case 'member:delete': {
          const { id, operator } = msg;
          const memberToDelete = currentStore.members.find((m) => m.id === id);
          currentStore.members = currentStore.members.filter((m) => m.id !== id);

          const auditEntry = {
            id: 'aud-' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
            userName: operator || clientInfo.userName,
            userRole: 'Model Admin',
            module: 'Members',
            action: 'Member Removed',
            targetEntityId: id,
            details: `${operator || clientInfo.userName} removed member ${memberToDelete ? memberToDelete.fullName : id}`,
            result: 'Warning',
          };
          currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];

          saveStore(currentStore);

          broadcastAll('member:deleted', {
            id,
            operator: operator || clientInfo.userName,
            auditLog: auditEntry,
          });
          break;
        }

        case 'member:batch_delete': {
          const { ids, operator } = msg;
          if (Array.isArray(ids) && ids.length > 0) {
            const countBefore = currentStore.members.length;
            currentStore.members = currentStore.members.filter((m) => !ids.includes(m.id));
            const deletedCount = countBefore - currentStore.members.length;

            const auditEntry = {
              id: 'aud-' + Date.now().toString(36),
              timestamp: new Date().toISOString(),
              userName: operator || clientInfo.userName,
              userRole: 'Model Admin',
              module: 'Members',
              action: 'Batch Members Deleted',
              targetEntityId: 'batch-delete',
              details: `${operator || clientInfo.userName} batch deleted ${deletedCount} member records.`,
              result: 'Warning',
            };
            currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];

            saveStore(currentStore);

            broadcastAll('member:batch_deleted', {
              ids,
              operator: operator || clientInfo.userName,
              deletedCount,
              auditLog: auditEntry,
            });
          }
          break;
        }

        case 'family:delete': {
          const { id, operator } = msg;
          const homeToDelete = currentStore.homes.find((h) => h.id === id);
          currentStore.homes = currentStore.homes.filter((h) => h.id !== id);
          currentStore.members = currentStore.members.map((m) => (m.homeId === id ? { ...m, homeId: undefined } : m));

          const auditEntry = {
            id: 'aud-' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
            userName: operator || clientInfo.userName,
            userRole: 'Model Admin',
            module: 'Homes',
            action: 'Fellowship Family Deleted',
            targetEntityId: id,
            details: `${operator || clientInfo.userName} removed fellowship family ${homeToDelete ? homeToDelete.name : id}`,
            result: 'Warning',
          };
          currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];

          saveStore(currentStore);

          broadcastAll('family:deleted', {
            id,
            operator: operator || clientInfo.userName,
            auditLog: auditEntry,
          });
          break;
        }

        case 'auto_update:trigger': {
          const { force, operator } = msg;
          const result = run7DayAutoUpdate(!!force, operator || clientInfo.userName);
          ws.send(JSON.stringify({ event: 'auto_update:result', payload: result }));
          break;
        }

        case 'family:create': {
          const { home, operator } = msg;
          if (!home || !home.id) break;
          currentStore.homes = [home, ...currentStore.homes];

          const auditEntry = {
            id: 'aud-' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
            userName: operator || clientInfo.userName,
            userRole: 'Model Admin',
            module: 'Homes',
            action: 'Fellowship Family Created',
            targetEntityId: home.id,
            details: `${operator || clientInfo.userName} created fellowship family ${home.name} (${home.zone})`,
            result: 'Success',
          };
          currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];

          saveStore(currentStore);
          broadcastAll('family:created', { home, operator, auditLog: auditEntry });
          break;
        }

        case 'family:update': {
          const { id, updates, operator } = msg;
          const idx = currentStore.homes.findIndex((h) => h.id === id);
          if (idx >= 0) {
            currentStore.homes[idx] = { ...currentStore.homes[idx], ...updates };
            saveStore(currentStore);
            broadcastAll('family:updated', { home: currentStore.homes[idx], operator });
          }
          break;
        }

        case 'family:assign': {
          const { memberIds, homeId, operator } = msg;
          const targetHome = currentStore.homes.find((h) => h.id === homeId);
          currentStore.members = currentStore.members.map((m) => {
            if (memberIds.includes(m.id)) {
              return {
                ...m,
                homeId,
                updatedBy: operator || clientInfo.userName,
                updatedAt: new Date().toISOString(),
              };
            }
            return m;
          });

          const auditEntry = {
            id: 'aud-' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
            userName: operator || clientInfo.userName,
            userRole: 'Model Admin',
            module: 'Homes',
            action: 'Family Assigned',
            targetEntityId: homeId,
            details: `${operator || clientInfo.userName} assigned ${memberIds.length} member(s) to ${targetHome ? targetHome.name : 'Family'}`,
            result: 'Success',
          };
          currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];

          saveStore(currentStore);
          broadcastAll('family:assigned', { memberIds, homeId, operator, auditLog: auditEntry });
          break;
        }

        case 'attendance:record': {
          const { record, operator } = msg;
          currentStore.attendance = [record, ...currentStore.attendance];
          saveStore(currentStore);
          broadcastAll('attendance:recorded', { record, operator });
          break;
        }

        case 'batch:sync_offline': {
          // Reconcile batch actions queued while offline
          const { actions, operator } = msg;
          if (Array.isArray(actions)) {
            for (const item of actions) {
              if (item.action === 'createMember' && item.payload) {
                const m = item.payload;
                const existing = currentStore.members.findIndex((x) => x.id === m.id);
                if (existing >= 0) {
                  currentStore.members[existing] = { ...m, updatedBy: item.operator || operator };
                } else {
                  currentStore.members = [{ ...m, createdBy: item.operator || operator }, ...currentStore.members];
                }
              } else if (item.action === 'updateMember' && item.payload) {
                const { id, updates } = item.payload;
                const idx = currentStore.members.findIndex((x) => x.id === id);
                if (idx >= 0) {
                  currentStore.members[idx] = { ...currentStore.members[idx], ...updates, updatedBy: item.operator || operator };
                }
              }
            }
            const syncAudit = {
              id: 'aud-' + Date.now().toString(36),
              timestamp: new Date().toISOString(),
              userName: operator || clientInfo.userName,
              userRole: 'Model Admin',
              module: 'System',
              action: 'Offline Batch Synced',
              details: `${operator || clientInfo.userName} synced ${actions.length} offline queued entries.`,
              result: 'Success',
            };
            currentStore.auditLogs = [syncAudit, ...currentStore.auditLogs];
            saveStore(currentStore);

            broadcastAll('store:resynced', {
              store: currentStore,
              operator: operator || clientInfo.userName,
              syncedCount: actions.length,
            });
          }
          break;
        }

        case 'state:empty': {
          const { operator } = msg;
          currentStore = {
            members: [],
            homes: [],
            departments: INITIAL_DEPARTMENTS,
            events: [],
            attendance: [],
            income: [],
            expenses: [],
            budgets: [],
            projects: [],
            auditLogs: [
              {
                id: 'aud-' + Date.now().toString(36),
                timestamp: new Date().toISOString(),
                userName: operator || clientInfo.userName,
                userRole: 'Model Admin',
                module: 'System',
                action: 'Database Emptied',
                targetEntityId: 'model-empty',
                details: `${operator || clientInfo.userName} emptied the model. Ready for live data entry.`,
                result: 'Warning',
              },
            ],
            messages: [],
            lastUpdated: new Date().toISOString(),
          };
          saveStore(currentStore);
          broadcastAll('store:resynced', {
            store: currentStore,
            operator: operator || clientInfo.userName,
            syncedCount: 0,
            reason: 'Model emptied and prepared for live use',
          });
          break;
        }

        case 'state:load_demo': {
          const { operator } = msg;
          currentStore = {
            members: INITIAL_MEMBERS,
            homes: INITIAL_HOMES,
            departments: INITIAL_DEPARTMENTS,
            events: INITIAL_EVENTS,
            attendance: INITIAL_ATTENDANCE,
            income: INITIAL_INCOME,
            expenses: INITIAL_EXPENSES,
            budgets: INITIAL_BUDGETS,
            projects: INITIAL_PROJECTS,
            auditLogs: [
              ...INITIAL_AUDIT_LOGS,
              {
                id: 'aud-' + Date.now().toString(36),
                timestamp: new Date().toISOString(),
                userName: operator || clientInfo.userName,
                userRole: 'Model Admin',
                module: 'System',
                action: 'Demo Data Loaded',
                targetEntityId: 'demo-load',
                details: `${operator || clientInfo.userName} loaded demo records for preview.`,
                result: 'Success',
              },
            ],
            messages: INITIAL_MESSAGES,
            lastUpdated: new Date().toISOString(),
          };
          saveStore(currentStore);
          broadcastAll('store:resynced', {
            store: currentStore,
            operator: operator || clientInfo.userName,
            syncedCount: currentStore.members.length,
            reason: 'Demo records loaded',
          });
          break;
        }

        case 'state:reset': {
          currentStore = {
            members: [],
            homes: [],
            departments: INITIAL_DEPARTMENTS,
            events: [],
            attendance: [],
            income: [],
            expenses: [],
            budgets: [],
            projects: [],
            auditLogs: [
              {
                id: 'aud-' + Date.now().toString(36),
                timestamp: new Date().toISOString(),
                userName: clientInfo.userName,
                userRole: 'Model Admin',
                module: 'System',
                action: 'Platform Reset',
                targetEntityId: 'sys-reset',
                details: `${clientInfo.userName} reset the platform to clean state.`,
                result: 'Warning',
              },
            ],
            messages: [],
            lastUpdated: new Date().toISOString(),
          };
          saveStore(currentStore);
          broadcastAll('store:resynced', {
            store: currentStore,
            operator: clientInfo.userName,
            syncedCount: 0,
          });
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('[WebSocket] Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    broadcastAll('presence:update', {
      activeOperators: getActiveOperators(),
      totalConnections: clients.size,
    });
  });

  ws.on('error', (err) => {
    console.error('[WebSocket] Socket error:', err);
    clients.delete(clientId);
  });
});

// Periodic heartbeat to clean dead sockets
setInterval(() => {
  const now = Date.now();
  for (const [id, client] of clients.entries()) {
    if (client.ws.readyState !== WebSocket.OPEN) {
      clients.delete(id);
    } else if (now - client.lastPing > 45000) {
      try {
        client.ws.ping();
      } catch {
        clients.delete(id);
      }
    }
  }
}, 15000);

// REST API Endpoints (works as fallback or for direct HTTP calls)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connections: clients.size,
    activeOperators: getActiveOperators(),
    membersCount: currentStore.members.length,
    homesCount: currentStore.homes.length,
  });
});

app.get('/api/sync/state', (req, res) => {
  res.json({
    store: currentStore,
    activeOperators: getActiveOperators(),
    serverTime: new Date().toISOString(),
  });
});

app.post('/api/sync/batch', (req, res) => {
  const { actions, operator } = req.body;
  if (!Array.isArray(actions)) {
    return res.status(400).json({ error: 'actions must be an array' });
  }

  for (const item of actions) {
    if (item.action === 'createMember' && item.payload) {
      const m = item.payload;
      const existing = currentStore.members.findIndex((x) => x.id === m.id);
      if (existing >= 0) {
        currentStore.members[existing] = { ...m, updatedBy: item.operator || operator };
      } else {
        currentStore.members = [{ ...m, createdBy: item.operator || operator }, ...currentStore.members];
      }
    } else if (item.action === 'updateMember' && item.payload) {
      const { id, updates } = item.payload;
      const idx = currentStore.members.findIndex((x) => x.id === id);
      if (idx >= 0) {
        currentStore.members[idx] = { ...currentStore.members[idx], ...updates, updatedBy: item.operator || operator };
      }
    }
  }

  const syncAudit = {
    id: 'aud-' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    userName: operator || 'Batch Sync',
    userRole: 'Model Admin',
    module: 'System',
    action: 'Offline Batch Synced via REST',
    details: `${operator || 'Operator'} synced ${actions.length} offline queued entries.`,
    result: 'Success',
  };
  currentStore.auditLogs = [syncAudit, ...currentStore.auditLogs];
  saveStore(currentStore);

  broadcastAll('store:resynced', {
    store: currentStore,
    operator: operator || 'REST Client',
    syncedCount: actions.length,
  });

  res.json({ success: true, count: actions.length, store: currentStore });
});

// 7-Day Auto-Update Engine Function
function run7DayAutoUpdate(force = false, operator = '7-Day Auto Engine') {
  const now = new Date();
  let updatedCount = 0;
  const updateDetails: string[] = [];

  for (let i = 0; i < currentStore.members.length; i++) {
    const member = currentStore.members[i];
    const regDateStr = member.registrationDate || member.createdAt;
    const regDate = regDateStr ? new Date(regDateStr) : now;
    const diffMs = now.getTime() - regDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 7 || force) {
      let changed = false;
      const updates: any = {};

      if (member.status === 'First Timer' || member.isFirstTimer) {
        updates.status = 'Returning Visitor';
        updates.isFirstTimer = false;
        updates.lastActionNote = `7-Day Auto-Update: Promoted from First Timer to Returning Visitor (${diffDays} days since registration)`;
        changed = true;
      }

      if (!member.homeId && member.hostelOrResidence) {
        const cleanH = member.hostelOrResidence.trim().toLowerCase();
        const matched = currentStore.homes.find(
          (h) =>
            h.hostelOrResidence?.toLowerCase() === cleanH ||
            h.name.toLowerCase().includes(cleanH)
        );
        if (matched) {
          updates.homeId = matched.id;
          changed = true;
        }
      }

      if (changed) {
        currentStore.members[i] = {
          ...member,
          ...updates,
          updatedBy: operator,
          updatedAt: now.toISOString(),
        };
        updatedCount++;
        updateDetails.push(`${member.fullName} (${updates.status || 'Assigned to Family'})`);
      }
    }
  }

  if (updatedCount > 0) {
    const auditEntry = {
      id: 'aud-' + Date.now().toString(36),
      timestamp: now.toISOString(),
      userName: operator,
      userRole: 'Model Admin',
      module: 'System',
      action: '7-Day Lifecycle Auto-Update',
      targetEntityId: 'batch-7day-update',
      details: `${operator} automatically updated ${updatedCount} member(s) completing 7-day cycle: ${updateDetails.slice(0, 3).join(', ')}${updateDetails.length > 3 ? '...' : ''}`,
      result: 'Success',
    };
    currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];
    saveStore(currentStore);

    broadcastAll('store:resynced', {
      store: currentStore,
      operator,
      syncedCount: updatedCount,
      reason: '7-day auto update completed',
    });
  }

  return { updatedCount, updateDetails, timestamp: now.toISOString() };
}

// Run 7-day auto-update check every 15 minutes
setInterval(() => {
  try {
    run7DayAutoUpdate(false, '7-Day Auto Service');
  } catch (err) {
    console.error('[7-Day Auto Service Error]', err);
  }
}, 15 * 60 * 1000);

// REST: Trigger 7-Day Auto Update
app.post('/api/auto-update-7days', (req, res) => {
  const force = req.body?.force === true;
  const operator = req.body?.operator || '7-Day Auto Engine';
  const result = run7DayAutoUpdate(force, operator);
  res.json({ success: true, ...result, store: currentStore });
});

// REST: Single Member Delete
app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const operator = (req.query.operator as string) || 'Operator';
  const memberToDelete = currentStore.members.find((m) => m.id === id);
  currentStore.members = currentStore.members.filter((m) => m.id !== id);

  const auditEntry = {
    id: 'aud-' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    userName: operator,
    userRole: 'Model Admin',
    module: 'Members',
    action: 'Member Deleted',
    targetEntityId: id,
    details: `${operator} deleted member ${memberToDelete ? memberToDelete.fullName : id}`,
    result: 'Warning',
  };
  currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];
  saveStore(currentStore);

  broadcastAll('member:deleted', { id, operator, auditLog: auditEntry });
  res.json({ success: true, id });
});

// REST: Batch Delete Members
app.post('/api/members/batch-delete', (req, res) => {
  const { ids, operator } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be array' });
  const countBefore = currentStore.members.length;
  currentStore.members = currentStore.members.filter((m) => !ids.includes(m.id));
  const deletedCount = countBefore - currentStore.members.length;

  const auditEntry = {
    id: 'aud-' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    userName: operator || 'Batch Delete',
    userRole: 'Model Admin',
    module: 'Members',
    action: 'Batch Members Deleted',
    targetEntityId: 'batch-delete',
    details: `${operator || 'Operator'} deleted ${deletedCount} member records`,
    result: 'Warning',
  };
  currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];
  saveStore(currentStore);

  broadcastAll('member:batch_deleted', { ids, operator: operator || 'Batch Delete', deletedCount, auditLog: auditEntry });
  res.json({ success: true, count: deletedCount });
});

// REST: Delete Fellowship Family
app.delete('/api/homes/:id', (req, res) => {
  const { id } = req.params;
  const operator = (req.query.operator as string) || 'Operator';
  const homeToDelete = currentStore.homes.find((h) => h.id === id);
  currentStore.homes = currentStore.homes.filter((h) => h.id !== id);
  currentStore.members = currentStore.members.map((m) => (m.homeId === id ? { ...m, homeId: undefined } : m));

  const auditEntry = {
    id: 'aud-' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    userName: operator,
    userRole: 'Model Admin',
    module: 'Homes',
    action: 'Fellowship Family Deleted',
    targetEntityId: id,
    details: `${operator} deleted fellowship family ${homeToDelete?.name || id}`,
    result: 'Warning',
  };
  currentStore.auditLogs = [auditEntry, ...currentStore.auditLogs];
  saveStore(currentStore);

  broadcastAll('family:deleted', { id, operator, auditLog: auditEntry });
  res.json({ success: true, id });
});

// REST: Empty Model & Make Ready for Live Use
app.post('/api/model/empty', (req, res) => {
  const operator = req.body?.operator || 'Model Admin';
  currentStore = {
    members: [],
    homes: [],
    departments: INITIAL_DEPARTMENTS,
    events: [],
    attendance: [],
    income: [],
    expenses: [],
    budgets: [],
    projects: [],
    auditLogs: [
      {
        id: 'aud-' + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        userName: operator,
        userRole: 'Model Admin',
        module: 'System',
        action: 'Database Emptied',
        targetEntityId: 'model-empty',
        details: `${operator} emptied the database. Model is pristine and ready for live multi-party entry.`,
        result: 'Warning',
      },
    ],
    messages: [],
    lastUpdated: new Date().toISOString(),
  };
  saveStore(currentStore);
  broadcastAll('store:resynced', {
    store: currentStore,
    operator,
    syncedCount: 0,
    reason: 'Database emptied and ready for use',
  });
  res.json({ success: true, message: 'Model emptied and ready for use', store: currentStore });
});

// REST: Load Demo Dataset
app.post('/api/model/load-demo', (req, res) => {
  const operator = req.body?.operator || 'Model Admin';
  currentStore = {
    members: INITIAL_MEMBERS,
    homes: INITIAL_HOMES,
    departments: INITIAL_DEPARTMENTS,
    events: INITIAL_EVENTS,
    attendance: INITIAL_ATTENDANCE,
    income: INITIAL_INCOME,
    expenses: INITIAL_EXPENSES,
    budgets: INITIAL_BUDGETS,
    projects: INITIAL_PROJECTS,
    auditLogs: [
      ...INITIAL_AUDIT_LOGS,
      {
        id: 'aud-' + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        userName: operator,
        userRole: 'Model Admin',
        module: 'System',
        action: 'Demo Dataset Loaded',
        targetEntityId: 'demo-dataset',
        details: `${operator} loaded demo dataset with 18 multi-portfolio members for inspection.`,
        result: 'Success',
      },
    ],
    messages: INITIAL_MESSAGES,
    lastUpdated: new Date().toISOString(),
  };
  saveStore(currentStore);
  broadcastAll('store:resynced', {
    store: currentStore,
    operator,
    syncedCount: currentStore.members.length,
    reason: 'Demo dataset loaded',
  });
  res.json({ success: true, count: currentStore.members.length, store: currentStore });
});

// Vite middleware for Dev or Static file serving for Prod
async function setupApp() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Manifest Fellowship Server] Running on http://0.0.0.0:${PORT} (WS on /ws)`);
  });
}

setupApp().catch((err) => {
  console.error('[Manifest Fellowship Server] Fatal startup error:', err);
  process.exit(1);
});
