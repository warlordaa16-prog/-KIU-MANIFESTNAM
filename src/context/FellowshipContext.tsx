import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Member,
  HomeGroup,
  Department,
  FellowshipEvent,
  AttendanceRecord,
  IncomeRecord,
  ExpenseRecord,
  Budget,
  FinancialProject,
  AuditLog,
  CommunicationMessage,
  UserRole,
  AttendanceStatus,
  PaymentMethod,
  CollaborativeOperator,
  CollaborativeEvent,
  QueuedSyncItem,
  ThemeKey,
} from '../types';
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
  INITIAL_OPERATORS,
} from '../mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  operator?: string;
}

interface FellowshipContextType {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUserName: string;
  setCurrentUserName: (name: string) => void;

  // Active Multi-Party Operator State
  operators: CollaborativeOperator[];
  activeOperator: CollaborativeOperator;
  setActiveOperatorName: (name: string) => void;
  addCustomOperator: (name: string, roleTitle?: string, deskName?: string) => void;

  // Real-Time & Offline Collaboration
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  wsConnected: boolean;
  offlineQueue: QueuedSyncItem[];
  syncOfflineQueue: () => Promise<void>;
  simulateConcurrentEntryDemo: () => Promise<void>;
  recentLiveEvents: CollaborativeEvent[];

  // Navigation & UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeEventId: string | null;
  setActiveEventId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data Collections
  members: Member[];
  homes: HomeGroup[];
  departments: Department[];
  events: FellowshipEvent[];
  attendance: AttendanceRecord[];
  income: IncomeRecord[];
  expenses: ExpenseRecord[];
  budgets: Budget[];
  projects: FinancialProject[];
  auditLogs: AuditLog[];
  messages: CommunicationMessage[];

  // Actions
  addMember: (
    memberData: Omit<Member, 'id' | 'registrationDate'>,
    autoOnboardFirstTimer?: boolean
  ) => Member;
  updateMember: (id: string, updates: Partial<Member>, reason?: string) => void;
  deleteMember: (id: string, reason?: string) => void;
  deleteMembers: (ids: string[], reason?: string) => void;
  run7DayAutoUpdate: (force?: boolean) => Promise<{ updatedCount: number; details: string[] }>;
  autoUpdateConfig: import('../types').AutoUpdateConfig;
  setAutoUpdateConfig: React.Dispatch<React.SetStateAction<import('../types').AutoUpdateConfig>>;

  addHome: (homeData: Omit<HomeGroup, 'id'>) => HomeGroup;
  updateHome: (id: string, updates: Partial<HomeGroup>) => void;
  deleteHome: (id: string) => void;
  assignMemberToHome: (memberId: string, homeId: string | undefined) => void;
  assignMembersToHome: (memberIds: string[], homeId: string) => void;
  setHomeLeader: (
    homeId: string,
    leaderName: string,
    leaderPhone: string,
    leaderEmail?: string
  ) => void;
  autoGroupByHostel: () => { createdCount: number; assignedCount: number };

  addDepartment: (deptData: Omit<Department, 'id'>) => Department;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  clearAllGroups: () => void;

  addEvent: (eventData: Omit<FellowshipEvent, 'id'>) => FellowshipEvent;
  updateEvent: (id: string, updates: Partial<FellowshipEvent>) => void;

  recordAttendance: (
    record: Omit<AttendanceRecord, 'id' | 'date' | 'time'>
  ) => AttendanceRecord;
  batchCheckIn: (
    eventId: string,
    memberIds: string[],
    status: AttendanceStatus,
    recordedBy: string,
    checkInMethod: AttendanceRecord['checkInMethod']
  ) => void;

  addIncome: (incomeData: Omit<IncomeRecord, 'id'>) => IncomeRecord;
  addExpense: (
    expenseData: Omit<ExpenseRecord, 'id' | 'status'>,
    submitForApproval?: boolean
  ) => ExpenseRecord;
  approveExpense: (id: string, approvedBy: string) => void;
  rejectExpense: (id: string, reason: string) => void;
  disburseExpense: (
    id: string,
    paidBy: string,
    paymentMethod: PaymentMethod,
    receiptAttachment?: string
  ) => void;

  addBudget: (budgetData: Omit<Budget, 'id' | 'totalSpent'>) => Budget;
  updateBudget: (id: string, updates: Partial<Budget>) => void;

  addProject: (projectData: Omit<FinancialProject, 'id' | 'totalIncome' | 'totalExpenses'>) => FinancialProject;
  updateProject: (id: string, updates: Partial<FinancialProject>) => void;

  sendMessage: (msg: Omit<CommunicationMessage, 'id' | 'timestamp'>) => CommunicationMessage;

  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;

  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', operator?: string) => void;
  removeToast: (id: string) => void;

  resetToDefaults: () => void;
  emptyModelForUse: () => void;
  loadDemoData: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonString: string) => boolean;

  // Helpers
  formatUGX: (amount: number) => string;
  hasPermission: (module: string, action: string) => boolean;

  // Theming & Watermark Customization
  currentTheme: ThemeKey;
  setCurrentTheme: (theme: ThemeKey) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (opacity: number) => void;
  isWatermarkGlow: boolean;
  setIsWatermarkGlow: (glow: boolean) => void;
}

const FellowshipContext = createContext<FellowshipContextType | undefined>(undefined);

const STORAGE_PREFIX = 'mfms_prod_v1_';

const makeUniqueId = (prefix: string): string => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${ts}-${rand}`;
};

export const FellowshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read URL query parameter for active operator (e.g. ?operator=Marcus or ?operator=Anibal)
  const initialOperatorName = (() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlOp = params.get('operator');
      if (urlOp) return urlOp;
      const saved = localStorage.getItem(`${STORAGE_PREFIX}active_operator`);
      if (saved) return saved;
    }
    return 'Anibal';
  })();

  const [currentUserName, setCurrentUserNameState] = useState<string>(initialOperatorName);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Model Admin');

  // Operators list
  const [operators, setOperators] = useState<CollaborativeOperator[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}operators`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_OPERATORS;
  });

  const activeOperator: CollaborativeOperator = operators.find(
    (o) => o.name.toLowerCase() === currentUserName.toLowerCase()
  ) || {
    id: `op-${currentUserName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    name: currentUserName,
    roleTitle: 'Data Entry Operator',
    avatarColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-400',
    deskName: 'Fellowship Intake Desk',
    isOnline: true,
  };

  const setActiveOperatorName = (name: string) => {
    setCurrentUserNameState(name);
    localStorage.setItem(`${STORAGE_PREFIX}active_operator`, name);
    showToast(`Switched active operator to ${name}`, 'info', name);
    // Notify server of operator switch
    sendWsMessage({
      type: 'client:identify',
      userName: name,
      role: currentUserRole,
      activeTab,
    });
  };

  const addCustomOperator = (name: string, roleTitle = 'Desk Officer', deskName = 'Registration Desk') => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const colors = ['bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-lime-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newOp: CollaborativeOperator = {
      id: `op-${Date.now().toString(36)}`,
      name: cleanName,
      roleTitle,
      avatarColor: randomColor,
      badgeBg: 'bg-slate-800',
      badgeBorder: 'border-slate-600',
      badgeText: 'text-slate-200',
      deskName,
      isOnline: true,
      entriesCount: 0,
    };
    const updated = [...operators, newOp];
    setOperators(updated);
    localStorage.setItem(`${STORAGE_PREFIX}operators`, JSON.stringify(updated));
    setActiveOperatorName(cleanName);
  };

  // 7-Day Auto-Update Engine State
  const [autoUpdateConfig, setAutoUpdateConfig] = useState<import('../types').AutoUpdateConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}autoupdate_config`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      enabled: true,
      intervalDays: 7,
      autoPromoteFirstTimers: true,
      autoAssignHostelFamily: true,
      lastRunTimestamp: new Date().toISOString(),
      totalUpdatedCount: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}autoupdate_config`, JSON.stringify(autoUpdateConfig));
  }, [autoUpdateConfig]);

  // Online / Offline State
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_PREFIX}simulated_offline`) === 'true';
  });

  const isOnline = browserOnline && !isSimulatedOffline;

  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [recentLiveEvents, setRecentLiveEvents] = useState<CollaborativeEvent[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<QueuedSyncItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}offline_queue`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Theming & Watermark Controls
  const [currentTheme, setCurrentThemeState] = useState<ThemeKey>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}theme`) as ThemeKey) || 'obsidian-kiu';
  });

  const [watermarkOpacity, setWatermarkOpacityState] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}watermark_opacity`);
    return saved ? parseFloat(saved) : 0.35;
  });

  const [isWatermarkGlow, setIsWatermarkGlowState] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}watermark_glow`);
    return saved !== null ? saved === 'true' : true;
  });

  const setCurrentTheme = (theme: ThemeKey) => {
    setCurrentThemeState(theme);
    localStorage.setItem(`${STORAGE_PREFIX}theme`, theme);
  };

  const setWatermarkOpacity = (opacity: number) => {
    setWatermarkOpacityState(opacity);
    localStorage.setItem(`${STORAGE_PREFIX}watermark_opacity`, opacity.toString());
  };

  const setIsWatermarkGlow = (glow: boolean) => {
    setIsWatermarkGlowState(glow);
    localStorage.setItem(`${STORAGE_PREFIX}watermark_glow`, glow ? 'true' : 'false');
  };

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeEventId, setActiveEventId] = useState<string | null>('evt-2026-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Main Collections initialized in clean ready-for-use state
  const [members, setMembers] = useState<Member[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(`${STORAGE_PREFIX}members`);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [homes, setHomes] = useState<HomeGroup[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(`${STORAGE_PREFIX}homes`);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DEPARTMENTS;
    const saved = localStorage.getItem(`${STORAGE_PREFIX}departments`);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_DEPARTMENTS;
  });

  const [events, setEvents] = useState<FellowshipEvent[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(`${STORAGE_PREFIX}attendance`);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [income, setIncome] = useState<IncomeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}income`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_INCOME;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}expenses`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_EXPENSES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}budgets`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BUDGETS;
  });

  const [projects, setProjects] = useState<FinancialProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}projects`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PROJECTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}auditLogs`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}messages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_MESSAGES;
  });

  // Local storage persistence effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}members`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}homes`, JSON.stringify(homes));
  }, [homes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}departments`, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}attendance`, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}offline_queue`, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Toast notification helper
  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', operator?: string) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, operator }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cross-tab BroadcastChannel sync for instant multi-tab coordination
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('manifest_fellowship_multiuser_sync');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'cross_tab:member_created') {
          setMembers((prev) => {
            if (prev.some((m) => m.id === payload.member.id)) return prev;
            return [payload.member, ...prev];
          });
          if (payload.operator !== currentUserName) {
            showToast(
              `⚡ ${payload.operator} registered ${payload.member.fullName}`,
              'success',
              payload.operator
            );
          }
        } else if (type === 'cross_tab:member_updated') {
          setMembers((prev) =>
            prev.map((m) => (m.id === payload.member.id ? payload.member : m))
          );
          if (payload.operator !== currentUserName) {
            showToast(`✏️ ${payload.operator} updated ${payload.member.fullName}`, 'info', payload.operator);
          }
        } else if (type === 'cross_tab:family_created') {
          setHomes((prev) => {
            if (prev.some((h) => h.id === payload.home.id)) return prev;
            return [payload.home, ...prev];
          });
        } else if (type === 'cross_tab:member_deleted') {
          setMembers((prev) => prev.filter((m) => m.id !== payload.id));
          if (payload.operator !== currentUserName) {
            showToast(`🗑️ ${payload.operator} deleted member ${payload.id}`, 'warning', payload.operator);
          }
        } else if (type === 'cross_tab:member_batch_deleted') {
          if (Array.isArray(payload.ids)) {
            setMembers((prev) => prev.filter((m) => !payload.ids.includes(m.id)));
            if (payload.operator !== currentUserName) {
              showToast(`🗑️ ${payload.operator} deleted ${payload.ids.length} members`, 'warning', payload.operator);
            }
          }
        } else if (type === 'cross_tab:family_deleted') {
          setHomes((prev) => prev.filter((h) => h.id !== payload.id));
          setMembers((prev) => prev.map((m) => (m.homeId === payload.id ? { ...m, homeId: undefined } : m)));
        } else if (type === 'cross_tab:state_empty') {
          setMembers([]);
          setHomes([]);
          setAttendance([]);
          setOfflineQueue([]);
          if (payload.operator !== currentUserName) {
            showToast(`🗑️ ${payload.operator} emptied the database. Ready for live data entry.`, 'info', payload.operator);
          }
        } else if (type === 'cross_tab:load_demo') {
          setMembers(INITIAL_MEMBERS);
          setHomes(INITIAL_HOMES);
          setDepartments(INITIAL_DEPARTMENTS);
          if (payload.operator !== currentUserName) {
            showToast(`✨ ${payload.operator} loaded demo dataset.`, 'info', payload.operator);
          }
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [currentUserName, showToast]);

  // WebSocket Client Setup
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<any>(null);

  const sendWsMessage = useCallback((msg: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined' || isSimulatedOffline) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsConnected(true);
        // Identify ourselves
        socket.send(
          JSON.stringify({
            type: 'client:identify',
            userName: currentUserName,
            role: currentUserRole,
            activeTab,
          })
        );
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { event: evType, payload } = data;

          switch (evType) {
            case 'state:init': {
              if (payload?.store) {
                const s = payload.store;
                if (Array.isArray(s.members)) setMembers(s.members);
                if (Array.isArray(s.homes)) setHomes(s.homes);
                if (Array.isArray(s.departments)) setDepartments(s.departments);
                if (Array.isArray(s.events)) setEvents(s.events);
                if (Array.isArray(s.attendance)) setAttendance(s.attendance);
                if (Array.isArray(s.income)) setIncome(s.income);
                if (Array.isArray(s.expenses)) setExpenses(s.expenses);
                if (Array.isArray(s.budgets)) setBudgets(s.budgets);
                if (Array.isArray(s.projects)) setProjects(s.projects);
                if (Array.isArray(s.auditLogs)) setAuditLogs(s.auditLogs);
                if (Array.isArray(s.messages)) setMessages(s.messages);
              }
              break;
            }

            case 'presence:update': {
              if (Array.isArray(payload?.activeOperators)) {
                // Update online status in operators
                setOperators((prev) =>
                  prev.map((op) => {
                    const found = payload.activeOperators.find(
                      (active: any) => active.name.toLowerCase() === op.name.toLowerCase()
                    );
                    return {
                      ...op,
                      isOnline: !!found,
                      lastSeen: found ? found.lastSeen : op.lastSeen,
                    };
                  })
                );
              }
              break;
            }

            case 'member:created': {
              const { member, operator, auditLog } = payload;
              if (member && member.id) {
                setMembers((prev) => {
                  if (prev.some((m) => m.id === member.id)) {
                    return prev.map((m) => (m.id === member.id ? member : m));
                  }
                  return [member, ...prev];
                });
                if (auditLog) {
                  setAuditLogs((prev) => [auditLog, ...prev]);
                }
                const liveEv: CollaborativeEvent = {
                  id: 'ce-' + Date.now(),
                  type: 'member:create',
                  operator: operator || 'Operator',
                  timestamp: new Date().toISOString(),
                  entityId: member.id,
                  entityName: member.fullName,
                  details: `Registered at ${member.hostelOrResidence || 'Fellowship'}`,
                };
                setRecentLiveEvents((prev) => [liveEv, ...prev.slice(0, 20)]);

                if (operator !== currentUserName) {
                  showToast(
                    `🟢 ${operator} entered member: ${member.fullName} (${member.hostelOrResidence || 'KIU'})`,
                    'success',
                    operator
                  );
                }
              }
              break;
            }

            case 'member:updated': {
              const { member, operator, auditLog } = payload;
              if (member && member.id) {
                setMembers((prev) =>
                  prev.map((m) => (m.id === member.id ? member : m))
                );
                if (auditLog) {
                  setAuditLogs((prev) => [auditLog, ...prev]);
                }
                const liveEv: CollaborativeEvent = {
                  id: 'ce-' + Date.now(),
                  type: 'member:update',
                  operator: operator || 'Operator',
                  timestamp: new Date().toISOString(),
                  entityId: member.id,
                  entityName: member.fullName,
                  details: `Updated member record`,
                };
                setRecentLiveEvents((prev) => [liveEv, ...prev.slice(0, 20)]);

                if (operator !== currentUserName) {
                  showToast(`✏️ ${operator} updated ${member.fullName}`, 'info', operator);
                }
              }
              break;
            }

            case 'member:deleted': {
              const { id, operator, auditLog } = payload;
              setMembers((prev) => prev.filter((m) => m.id !== id));
              if (auditLog) setAuditLogs((prev) => [auditLog, ...prev]);
              if (operator !== currentUserName) {
                showToast(`🗑️ ${operator} removed member ${id}`, 'warning', operator);
              }
              break;
            }

            case 'member:batch_deleted': {
              const { ids, operator, auditLog, deletedCount } = payload;
              if (Array.isArray(ids)) {
                setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));
                if (auditLog) setAuditLogs((prev) => [auditLog, ...prev]);
                if (operator !== currentUserName) {
                  showToast(`🗑️ ${operator} deleted ${deletedCount || ids.length} members`, 'warning', operator);
                }
              }
              break;
            }

            case 'family:deleted': {
              const { id, operator, auditLog } = payload;
              setHomes((prev) => prev.filter((h) => h.id !== id));
              setMembers((prev) => prev.map((m) => (m.homeId === id ? { ...m, homeId: undefined } : m)));
              if (auditLog) setAuditLogs((prev) => [auditLog, ...prev]);
              if (operator !== currentUserName) {
                showToast(`🏠 ${operator} deleted family ${id}`, 'warning', operator);
              }
              break;
            }

            case 'family:created': {
              const { home, operator, auditLog } = payload;
              if (home && home.id) {
                setHomes((prev) => {
                  if (prev.some((h) => h.id === home.id)) return prev;
                  return [home, ...prev];
                });
                if (auditLog) setAuditLogs((prev) => [auditLog, ...prev]);
                if (operator !== currentUserName) {
                  showToast(`🏠 ${operator} created Fellowship Family "${home.name}"`, 'success', operator);
                }
              }
              break;
            }

            case 'family:updated': {
              const { home, operator } = payload;
              if (home && home.id) {
                setHomes((prev) => prev.map((h) => (h.id === home.id ? home : h)));
                if (operator !== currentUserName) {
                  showToast(`🏠 ${operator} updated ${home.name}`, 'info', operator);
                }
              }
              break;
            }

            case 'family:assigned': {
              const { memberIds, homeId, operator, auditLog } = payload;
              setMembers((prev) =>
                prev.map((m) => (memberIds.includes(m.id) ? { ...m, homeId } : m))
              );
              if (auditLog) setAuditLogs((prev) => [auditLog, ...prev]);
              break;
            }

            case 'store:resynced': {
              const { store, operator, syncedCount, reason } = payload;
              if (store) {
                if (Array.isArray(store.members)) setMembers(store.members);
                if (Array.isArray(store.homes)) setHomes(store.homes);
                if (Array.isArray(store.departments)) setDepartments(store.departments);
                if (Array.isArray(store.events)) setEvents(store.events);
                if (Array.isArray(store.attendance)) setAttendance(store.attendance);
                if (Array.isArray(store.income)) setIncome(store.income);
                if (Array.isArray(store.expenses)) setExpenses(store.expenses);
                if (Array.isArray(store.budgets)) setBudgets(store.budgets);
                if (Array.isArray(store.projects)) setProjects(store.projects);
                if (Array.isArray(store.auditLogs)) setAuditLogs(store.auditLogs);
                if (Array.isArray(store.messages)) setMessages(store.messages);
                showToast(reason || `⚡ Synchronized ${syncedCount !== undefined ? syncedCount : 'all'} records with server`, 'info', operator);
              }
              break;
            }

            default:
              break;
          }
        } catch (err) {
          console.error('[Client WS] Parse error:', err);
        }
      };

      socket.onclose = () => {
        setWsConnected(false);
        // Retry connection every 4 seconds if online
        if (!isSimulatedOffline && navigator.onLine) {
          reconnectTimerRef.current = setTimeout(connectWebSocket, 4000);
        }
      };

      socket.onerror = () => {
        setWsConnected(false);
      };
    } catch (err) {
      console.error('[Client WS] Connection setup failed:', err);
      setWsConnected(false);
    }
  }, [currentUserName, currentUserRole, activeTab, isSimulatedOffline, showToast]);

  // Connect on mount / status change
  useEffect(() => {
    if (isOnline) {
      connectWebSocket();
    } else {
      if (wsRef.current) {
        wsRef.current.close();
      }
      setWsConnected(false);
    }

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [isOnline, connectWebSocket]);

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setBrowserOnline(true);
      showToast('Network connection detected! Reconnecting...', 'info');
    };
    const handleOffline = () => {
      setBrowserOnline(false);
      showToast('Offline Mode: Changes will be safely queued locally.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Toggle Simulated Offline Mode
  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      localStorage.setItem(`${STORAGE_PREFIX}simulated_offline`, next ? 'true' : 'false');
      if (next) {
        showToast('Airplane / Field Offline Mode Activated! Entering data locally.', 'warning');
      } else {
        showToast('Returned to Online Mode! Auto-syncing pending entries...', 'success');
      }
      return next;
    });
  };

  // Sync Offline Queue
  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) {
      showToast('No pending offline entries to sync.', 'info');
      return;
    }

    try {
      // Send over WebSocket if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'batch:sync_offline',
            actions: offlineQueue,
            operator: currentUserName,
          })
        );
      } else {
        // Fallback to REST API
        await fetch('/api/sync/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actions: offlineQueue,
            operator: currentUserName,
          }),
        });
      }

      showToast(`Successfully synced ${offlineQueue.length} offline entries!`, 'success', currentUserName);
      setOfflineQueue([]);
      localStorage.removeItem(`${STORAGE_PREFIX}offline_queue`);
    } catch (err) {
      console.error('[Sync Error]', err);
      showToast('Failed to sync offline items. Will retry automatically.', 'error');
    }
  };

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0 && wsConnected) {
      syncOfflineQueue();
    }
  }, [isOnline, wsConnected]);

  // 7-Day Auto-Update Engine background cycle
  useEffect(() => {
    if (!autoUpdateConfig.enabled) return;

    // Run check on mount after short delay
    const initialTimer = setTimeout(() => {
      run7DayAutoUpdate(false);
    }, 2500);

    // Periodic check every 15 minutes
    const intervalTimer = setInterval(() => {
      run7DayAutoUpdate(false);
    }, 15 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [autoUpdateConfig.enabled]);

  // Format UGX
  const formatUGX = (amount: number): string => {
    return `UGX ${Number(amount || 0).toLocaleString('en-US')}`;
  };

  // ID Generators
  const generateMemberId = (): string => {
    const currentYear = new Date().getFullYear();
    let maxNum = 0;
    members.forEach((m) => {
      const match = m.id.match(/^MAN-\d{4}-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    const nextNum = Math.max(members.length + 1, maxNum + 1);
    const padded = String(nextNum).padStart(6, '0');
    return `MAN-${currentYear}-${padded}`;
  };

  // Add Member
  const addMember = (
    memberData: Omit<Member, 'id' | 'registrationDate'>,
    autoOnboardFirstTimer = true
  ): Member => {
    const id = generateMemberId();
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    // Auto-match or create Hostel Family Group
    const enteredHostel = (memberData.hostelOrResidence || memberData.residence || '').trim();
    let assignedHomeId = memberData.homeId;

    if (!assignedHomeId && enteredHostel && enteredHostel.toLowerCase() !== 'not specified') {
      const cleanHostelLower = enteredHostel.toLowerCase();
      const matchedHome = homes.find(
        (h) =>
          (h.hostelOrResidence && h.hostelOrResidence.toLowerCase() === cleanHostelLower) ||
          h.name.toLowerCase() === `${cleanHostelLower} fellowship family` ||
          h.name.toLowerCase() === cleanHostelLower ||
          h.location.toLowerCase() === cleanHostelLower ||
          h.name.toLowerCase().includes(cleanHostelLower)
      );

      if (matchedHome) {
        assignedHomeId = matchedHome.id;
      } else {
        const slug = cleanHostelLower.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
        const autoHomeId = `home-${slug}-${makeUniqueId('h')}`;
        const autoHome: HomeGroup = {
          id: autoHomeId,
          name: `${enteredHostel} Fellowship Family`,
          zone: 'Hostel & Residence Network',
          leaderId: 'PENDING',
          leaderName: 'Leader Pending Assignment',
          leaderPhone: '',
          leaderEmail: '',
          meetingDay: 'Weekly Fellowship Gathering',
          location: enteredHostel,
          hostelOrResidence: enteredHostel,
          description: `Fellowship family group for members residing at ${enteredHostel}.`,
          targetCount: 20,
        };
        setHomes((prev) => [...prev, autoHome]);
        assignedHomeId = autoHomeId;

        // Broadcast family creation
        if (isOnline && wsRef.current?.readyState === WebSocket.OPEN) {
          sendWsMessage({ type: 'family:create', home: autoHome, operator: currentUserName });
        }
      }
    }

    const newMember: Member = {
      ...memberData,
      id,
      homeId: assignedHomeId,
      registrationDate: today,
      createdBy: currentUserName,
      createdAt: nowIso,
      updatedBy: currentUserName,
      updatedAt: nowIso,
      lastActionNote: `Entered by ${currentUserName}`,
    };

    // Update state locally
    setMembers((prev) => [newMember, ...prev]);

    // Broadcast across tabs
    broadcastChannelRef.current?.postMessage({
      type: 'cross_tab:member_created',
      payload: { member: newMember, operator: currentUserName },
    });

    const auditEntry: AuditLog = {
      id: 'aud-' + Date.now().toString(36),
      timestamp: nowIso,
      userName: currentUserName,
      userRole: currentUserRole,
      module: 'Members',
      action: 'Member Registered',
      targetEntityId: id,
      details: `${currentUserName} entered ${newMember.fullName} (${id}) - Status: ${newMember.status}${assignedHomeId ? ' - Assigned to Hostel Family' : ''}`,
      result: 'Success',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    // Network handling: WebSocket or Queue
    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({
        type: 'member:create',
        member: newMember,
        operator: currentUserName,
      });
      showToast(
        `Registered ${newMember.fullName}! Reflected live as entered by ${currentUserName}`,
        'success',
        currentUserName
      );
    } else {
      // Offline mode: queue action
      const queuedItem: QueuedSyncItem = {
        id: makeUniqueId('q'),
        action: 'createMember',
        operator: currentUserName,
        timestamp: nowIso,
        payload: newMember,
      };
      setOfflineQueue((prev) => [...prev, queuedItem]);
      showToast(
        `Offline: ${newMember.fullName} saved locally as entered by ${currentUserName}. Will auto-sync when online.`,
        'warning',
        currentUserName
      );
    }

    return newMember;
  };

  // Update Member
  const updateMember = (id: string, updates: Partial<Member>, reason?: string) => {
    const nowIso = new Date().toISOString();
    let updatedMemberObj: Member | null = null;

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = {
            ...m,
            ...updates,
            updatedBy: currentUserName,
            updatedAt: nowIso,
            lastActionNote: reason || `Updated by ${currentUserName}`,
          };
          updatedMemberObj = updated;
          return updated;
        }
        return m;
      })
    );

    if (updatedMemberObj) {
      broadcastChannelRef.current?.postMessage({
        type: 'cross_tab:member_updated',
        payload: { member: updatedMemberObj, operator: currentUserName },
      });

      const auditEntry: AuditLog = {
        id: 'aud-' + Date.now().toString(36),
        timestamp: nowIso,
        userName: currentUserName,
        userRole: currentUserRole,
        module: 'Members',
        action: 'Member Updated',
        targetEntityId: id,
        details: `${currentUserName} updated ${updates.fullName || id}: ${Object.keys(updates).join(', ')}`,
        result: 'Success',
      };
      setAuditLogs((prev) => [auditEntry, ...prev]);

      if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendWsMessage({
          type: 'member:update',
          id,
          updates,
          operator: currentUserName,
          reason,
        });
      } else {
        const queuedItem: QueuedSyncItem = {
          id: makeUniqueId('q'),
          action: 'updateMember',
          operator: currentUserName,
          timestamp: nowIso,
          payload: { id, updates },
        };
        setOfflineQueue((prev) => [...prev, queuedItem]);
      }

      showToast(`Updated record for ${id} (by ${currentUserName})`, 'info', currentUserName);
    }
  };

  // Delete Single Member (Direct User Deletion Access)
  const deleteMember = (id: string, reason = 'User requested deletion') => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));

    const auditEntry: AuditLog = {
      id: 'aud-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      userName: currentUserName,
      userRole: currentUserRole,
      module: 'Members',
      action: 'Member Deleted',
      targetEntityId: id,
      details: `${currentUserName} deleted member ${member?.fullName || id} (${reason})`,
      result: 'Warning',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    broadcastChannelRef.current?.postMessage({
      type: 'cross_tab:member_deleted',
      payload: { id, operator: currentUserName },
    });

    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'member:delete', id, operator: currentUserName });
    } else {
      const queuedItem: QueuedSyncItem = {
        id: makeUniqueId('q'),
        action: 'deleteMember',
        operator: currentUserName,
        timestamp: new Date().toISOString(),
        payload: { id },
      };
      setOfflineQueue((prev) => [...prev, queuedItem]);
    }

    showToast(`Member ${member?.fullName || id} deleted by ${currentUserName}`, 'warning', currentUserName);
  };

  // Batch Delete Members (Multiple Selection Deletion Access)
  const deleteMembers = (ids: string[], reason = 'Batch user deletion') => {
    if (!ids || ids.length === 0) return;
    const count = ids.length;
    setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));

    const auditEntry: AuditLog = {
      id: 'aud-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      userName: currentUserName,
      userRole: currentUserRole,
      module: 'Members',
      action: 'Batch Members Deleted',
      targetEntityId: 'batch-delete',
      details: `${currentUserName} deleted ${count} member record(s) (${reason})`,
      result: 'Warning',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    broadcastChannelRef.current?.postMessage({
      type: 'cross_tab:member_batch_deleted',
      payload: { ids, operator: currentUserName },
    });

    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'member:batch_delete', ids, operator: currentUserName });
    } else {
      const queuedItem: QueuedSyncItem = {
        id: makeUniqueId('q'),
        action: 'batchDeleteMember',
        operator: currentUserName,
        timestamp: new Date().toISOString(),
        payload: { ids },
      };
      setOfflineQueue((prev) => [...prev, queuedItem]);
    }

    showToast(`Deleted ${count} member records`, 'warning', currentUserName);
  };

  // 7-Day Auto-Update Engine
  const run7DayAutoUpdate = async (force = false): Promise<{ updatedCount: number; details: string[] }> => {
    const now = new Date();
    let updatedCount = 0;
    const updateDetails: string[] = [];

    const updatedMembers = members.map((member) => {
      const regDateStr = member.registrationDate || member.createdAt;
      const regDate = regDateStr ? new Date(regDateStr) : now;
      const diffMs = now.getTime() - regDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays >= 7 || force) {
        let changed = false;
        const updates: Partial<Member> = {};

        if (member.status === 'First Timer' || member.isFirstTimer) {
          updates.status = 'Returning Visitor';
          updates.isFirstTimer = false;
          updates.lastActionNote = `7-Day Auto-Update: First Timer promoted to Returning Visitor (${diffDays} days registered)`;
          changed = true;
        }

        if (!member.homeId && member.hostelOrResidence) {
          const cleanH = member.hostelOrResidence.trim().toLowerCase();
          const matched = homes.find(
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
          updatedCount++;
          updateDetails.push(`${member.fullName} (${updates.status || 'Assigned Family'})`);
          return {
            ...member,
            ...updates,
            updatedBy: '7-Day Auto Engine',
            updatedAt: now.toISOString(),
          };
        }
      }
      return member;
    });

    if (updatedCount > 0) {
      setMembers(updatedMembers);
      const auditLog: AuditLog = {
        id: 'aud-' + Date.now().toString(36),
        timestamp: now.toISOString(),
        userName: '7-Day Auto Engine',
        userRole: 'Model Admin',
        module: 'System',
        action: '7-Day Lifecycle Auto-Update',
        targetEntityId: 'batch-7day-update',
        details: `7-Day Auto Engine updated ${updatedCount} member record(s): ${updateDetails.slice(0, 3).join(', ')}${updateDetails.length > 3 ? '...' : ''}`,
        result: 'Success',
      };
      setAuditLogs((prev) => [auditLog, ...prev]);

      if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendWsMessage({ type: 'auto_update:trigger', force, operator: currentUserName });
      }

      showToast(`⚡ 7-Day Auto-Update: ${updatedCount} member(s) progressed!`, 'success', '7-Day Engine');
    } else {
      showToast('7-Day Auto-Update: All records are up to date.', 'info');
    }

    setAutoUpdateConfig((prev) => ({
      ...prev,
      lastRunTimestamp: now.toISOString(),
      totalUpdatedCount: prev.totalUpdatedCount + updatedCount,
    }));

    return { updatedCount, details: updateDetails };
  };

  // Homes / Families Management
  const addHome = (homeData: Omit<HomeGroup, 'id'>): HomeGroup => {
    const slug = homeData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
    const id = `home-${slug}-${makeUniqueId('h')}`;
    const newHome: HomeGroup = { ...homeData, id };
    setHomes((prev) => [...prev, newHome]);

    broadcastChannelRef.current?.postMessage({
      type: 'cross_tab:family_created',
      payload: { home: newHome, operator: currentUserName },
    });

    const auditEntry: AuditLog = {
      id: 'aud-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      userName: currentUserName,
      userRole: currentUserRole,
      module: 'Homes',
      action: 'Fellowship Family Created',
      targetEntityId: id,
      details: `${currentUserName} created fellowship family: ${newHome.name}`,
      result: 'Success',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'family:create', home: newHome, operator: currentUserName });
    }
    showToast(`Created Fellowship Family: ${newHome.name}`, 'success', currentUserName);
    return newHome;
  };

  const updateHome = (id: string, updates: Partial<HomeGroup>) => {
    setHomes((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'family:update', id, updates, operator: currentUserName });
    }
    showToast(`Updated Family settings`, 'info');
  };

  const deleteHome = (id: string) => {
    const home = homes.find((h) => h.id === id);
    setHomes((prev) => prev.filter((h) => h.id !== id));
    setMembers((prev) => prev.map((m) => (m.homeId === id ? { ...m, homeId: undefined } : m)));

    const auditEntry: AuditLog = {
      id: 'aud-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      userName: currentUserName,
      userRole: currentUserRole,
      module: 'Homes',
      action: 'Fellowship Family Deleted',
      targetEntityId: id,
      details: `${currentUserName} deleted fellowship family: ${home?.name || id}`,
      result: 'Warning',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    showToast(`Family ${home?.name || id} removed`, 'warning');
  };

  const assignMemberToHome = (memberId: string, homeId: string | undefined) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, homeId, updatedBy: currentUserName, updatedAt: new Date().toISOString() } : m))
    );
    const targetHome = homeId ? homes.find((h) => h.id === homeId) : null;
    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'family:assign', memberIds: [memberId], homeId, operator: currentUserName });
    }
    showToast(targetHome ? `Assigned to ${targetHome.name} (by ${currentUserName})` : 'Removed from family', 'info');
  };

  const assignMembersToHome = (memberIds: string[], homeId: string) => {
    setMembers((prev) =>
      prev.map((m) => (memberIds.includes(m.id) ? { ...m, homeId, updatedBy: currentUserName, updatedAt: new Date().toISOString() } : m))
    );
    const targetHome = homes.find((h) => h.id === homeId);
    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'family:assign', memberIds, homeId, operator: currentUserName });
    }
    showToast(`Assigned ${memberIds.length} members to ${targetHome?.name || 'family'} (by ${currentUserName})`, 'success');
  };

  const setHomeLeader = (
    homeId: string,
    leaderName: string,
    leaderPhone: string,
    leaderEmail?: string
  ) => {
    updateHome(homeId, { leaderName, leaderPhone, leaderEmail });
  };

  const autoGroupByHostel = (): { createdCount: number; assignedCount: number } => {
    const unassigned = members.filter((m) => !m.homeId);
    let createdCount = 0;
    let assignedCount = 0;
    const currentHomes = [...homes];

    const hostelMap = new Map<string, string[]>();
    unassigned.forEach((m) => {
      const h = (m.hostelOrResidence || m.residence || '').trim();
      if (h && h.toLowerCase() !== 'not specified') {
        const arr = hostelMap.get(h) || [];
        arr.push(m.id);
        hostelMap.set(h, arr);
      }
    });

    const updatedMembers = [...members];

    hostelMap.forEach((memberIds, hostelName) => {
      let home = currentHomes.find(
        (hg) =>
          (hg.hostelOrResidence && hg.hostelOrResidence.toLowerCase() === hostelName.toLowerCase()) ||
          hg.name.toLowerCase().includes(hostelName.toLowerCase())
      );

      if (!home) {
        const slug = hostelName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
        home = {
          id: `home-${slug}-${makeUniqueId('h')}`,
          name: `${hostelName} Fellowship Family`,
          zone: 'Hostel & Residence Network',
          leaderId: 'PENDING',
          leaderName: 'Leader Pending Assignment',
          leaderPhone: '',
          leaderEmail: '',
          meetingDay: 'Weekly Fellowship Gathering',
          location: hostelName,
          hostelOrResidence: hostelName,
          description: `Auto-generated fellowship family for residents of ${hostelName}`,
          targetCount: 20,
        };
        currentHomes.push(home);
        createdCount++;
      }

      memberIds.forEach((id) => {
        const idx = updatedMembers.findIndex((m) => m.id === id);
        if (idx !== -1 && home) {
          updatedMembers[idx] = { ...updatedMembers[idx], homeId: home.id, updatedBy: currentUserName };
          assignedCount++;
        }
      });
    });

    setHomes(currentHomes);
    setMembers(updatedMembers);

    showToast(
      `Auto-grouped by hostel! ${createdCount} new families created, ${assignedCount} members placed.`,
      'success',
      currentUserName
    );
    return { createdCount, assignedCount };
  };

  const addDepartment = (deptData: Omit<Department, 'id'>): Department => {
    const id = `dept-${makeUniqueId('d')}`;
    const newDept: Department = { ...deptData, id };
    setDepartments((prev) => [...prev, newDept]);
    showToast(`Added Ministry: ${newDept.name}`, 'success');
    return newDept;
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast(`Updated ministry details`, 'info');
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    showToast(`Ministry removed`, 'warning');
  };

  const clearAllGroups = () => {
    setHomes([]);
    setMembers((prev) => prev.map((m) => ({ ...m, homeId: undefined })));
    showToast('All fellowship families cleared', 'warning');
  };

  // Events & Attendance
  const addEvent = (eventData: Omit<FellowshipEvent, 'id'>): FellowshipEvent => {
    const id = `evt-${makeUniqueId('e')}`;
    const newEvent: FellowshipEvent = { ...eventData, id };
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`Created Event: ${newEvent.name}`, 'success');
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<FellowshipEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast(`Updated event`, 'info');
  };

  const recordAttendance = (
    recordData: Omit<AttendanceRecord, 'id' | 'date' | 'time'>
  ): AttendanceRecord => {
    const id = `att-${makeUniqueId('a')}`;
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const record: AttendanceRecord = {
      ...recordData,
      id,
      date,
      time,
      recordedBy: currentUserName,
    };
    setAttendance((prev) => [record, ...prev]);

    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'attendance:record', record, operator: currentUserName });
    }
    showToast(`Attendance checked in by ${currentUserName}`, 'success', currentUserName);
    return record;
  };

  const batchCheckIn = (
    eventId: string,
    memberIds: string[],
    status: AttendanceStatus,
    recordedBy: string,
    checkInMethod: AttendanceRecord['checkInMethod']
  ) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const evt = events.find((e) => e.id === eventId);
    const eventName = evt ? evt.name : 'Weekly Fellowship';

    const newRecords: AttendanceRecord[] = memberIds.map((mId) => {
      const member = members.find((m) => m.id === mId);
      return {
        id: `att-${makeUniqueId('a')}`,
        memberId: mId,
        memberName: member ? member.fullName : 'Fellowship Member',
        memberPhone: member ? member.phone : '',
        eventId,
        eventName,
        date,
        time,
        status,
        recordedBy: currentUserName,
        checkInMethod,
      };
    });

    setAttendance((prev) => [...newRecords, ...prev]);
    showToast(`Checked in ${memberIds.length} members (by ${currentUserName})`, 'success', currentUserName);
  };

  // Finances
  const addIncome = (incomeData: Omit<IncomeRecord, 'id'>): IncomeRecord => {
    const id = `TXN-INC-${Date.now().toString(36).toUpperCase()}`;
    const record: IncomeRecord = { ...incomeData, id, receivedBy: currentUserName };
    setIncome((prev) => [record, ...prev]);
    showToast(`Recorded income: ${formatUGX(record.amount)} (by ${currentUserName})`, 'success', currentUserName);
    return record;
  };

  const addExpense = (
    expenseData: Omit<ExpenseRecord, 'id' | 'status'>,
    submitForApproval = true
  ): ExpenseRecord => {
    const id = `TXN-EXP-${Date.now().toString(36).toUpperCase()}`;
    const record: ExpenseRecord = {
      ...expenseData,
      id,
      requestedBy: currentUserName,
      status: submitForApproval ? 'Pending Approval' : 'Draft',
    };
    setExpenses((prev) => [record, ...prev]);
    showToast(`Submitted expense: ${formatUGX(record.amount)}`, 'info');
    return record;
  };

  const approveExpense = (id: string, approvedBy: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: 'Approved', approvedBy, approvalDate: new Date().toISOString().split('T')[0] }
          : e
      )
    );
    showToast(`Expense approved`, 'success');
  };

  const rejectExpense = (id: string, reason: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Rejected', rejectionReason: reason } : e))
    );
    showToast(`Expense rejected`, 'warning');
  };

  const disburseExpense = (
    id: string,
    paidBy: string,
    paymentMethod: PaymentMethod,
    receiptAttachment?: string
  ) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: 'Disbursed', paidBy, paymentMethod, receiptAttachment }
          : e
      )
    );
    showToast(`Expense marked disbursed`, 'success');
  };

  const addBudget = (budgetData: Omit<Budget, 'id' | 'totalSpent'>): Budget => {
    const id = `bgt-${makeUniqueId('b')}`;
    const record: Budget = { ...budgetData, id, totalSpent: 0, createdBy: currentUserName };
    setBudgets((prev) => [...prev, record]);
    showToast(`Created budget "${record.title}"`, 'success');
    return record;
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    showToast(`Updated budget`, 'info');
  };

  const addProject = (
    projectData: Omit<FinancialProject, 'id' | 'totalIncome' | 'totalExpenses'>
  ): FinancialProject => {
    const id = `proj-${makeUniqueId('p')}`;
    const record: FinancialProject = { ...projectData, id, totalIncome: 0, totalExpenses: 0 };
    setProjects((prev) => [...prev, record]);
    showToast(`Created project "${record.title}"`, 'success');
    return record;
  };

  const updateProject = (id: string, updates: Partial<FinancialProject>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast(`Updated project`, 'info');
  };

  const sendMessage = (
    msgData: Omit<CommunicationMessage, 'id' | 'timestamp'>
  ): CommunicationMessage => {
    const id = `msg-${makeUniqueId('m')}`;
    const record: CommunicationMessage = {
      ...msgData,
      id,
      timestamp: new Date().toISOString(),
      senderName: currentUserName,
    };
    setMessages((prev) => [record, ...prev]);
    showToast(`Dispatched message: ${record.title}`, 'success');
    return record;
  };

  const addAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const log: AuditLog = {
      ...logData,
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Concurrent Multi-Party Simulation Demo
  // Demonstrates >6 people (Anibal, Marcus, Ahebwa, Grace, David, Sarah) entering data simultaneously!
  const simulateConcurrentEntryDemo = async () => {
    showToast('🚀 Launching 6-Party Concurrent Entry Simulation...', 'info');

    const demoEntries = [
      {
        operator: 'Anibal',
        firstName: 'Brenda',
        lastName: 'Kembabazi',
        gender: 'Female' as const,
        phone: '+256 772 884 102',
        hostel: 'Nana Hostel',
        portfolio: 'Schools' as const,
        course: 'Bachelor of Medicine & Surgery',
        year: 1,
      },
      {
        operator: 'Marcus',
        firstName: 'Trevor',
        lastName: 'Musoke',
        gender: 'Male' as const,
        phone: '+256 701 334 918',
        hostel: 'Olympia Hostel',
        portfolio: 'Schools' as const,
        course: 'B.Sc Software Engineering',
        year: 2,
      },
      {
        operator: 'Ahebwa',
        firstName: 'Faith',
        lastName: 'Kemigisha',
        gender: 'Female' as const,
        phone: '+256 788 552 140',
        hostel: 'Akamwesi Hostel',
        portfolio: 'Schools' as const,
        course: 'Bachelor of Laws (LLB)',
        year: 3,
      },
      {
        operator: 'Grace',
        firstName: 'Daniel',
        lastName: 'Mwesigwa',
        gender: 'Male' as const,
        phone: '+256 754 771 003',
        hostel: 'Prestige Hostel',
        portfolio: 'Schools' as const,
        course: 'Bachelor of Pharmacy',
        year: 2,
      },
      {
        operator: 'David',
        firstName: 'Ritah',
        lastName: 'Nalukwago',
        gender: 'Female' as const,
        phone: '+256 776 220 941',
        hostel: 'Bunga Residence',
        portfolio: 'Alumni' as const,
        course: 'KIU Finance Graduate & Business Analyst',
        year: 4,
      },
      {
        operator: 'Sarah',
        firstName: 'Victor',
        lastName: 'Okot',
        gender: 'Male' as const,
        phone: '+256 703 661 582',
        hostel: 'Ideal Hostel',
        portfolio: 'Community' as const,
        course: 'IT Consultant & Campus Mentor',
        year: 4,
      },
    ];

    // Fire simulated entries with short staggered intervals (300ms) to illustrate live concurrency
    for (let i = 0; i < demoEntries.length; i++) {
      const entry = demoEntries[i];
      await new Promise((resolve) => setTimeout(resolve, 350));

      const memberId = `MAN-${new Date().getFullYear()}-${String(members.length + i + 10).padStart(6, '0')}`;
      const nowIso = new Date().toISOString();

      const newM: Member = {
        id: memberId,
        fullName: `${entry.lastName} ${entry.firstName}`,
        firstName: entry.firstName,
        lastName: entry.lastName,
        preferredName: entry.firstName,
        gender: entry.gender,
        phone: entry.phone,
        email: `${entry.firstName.toLowerCase()}.${entry.lastName.toLowerCase()}@manifest.org`,
        hostelOrResidence: entry.hostel,
        residence: entry.hostel,
        portfolio: entry.portfolio,
        studentInfo: {
          isStudent: entry.portfolio === 'Schools',
          campus: 'Kampala International University (KIU)',
          course: entry.course,
          yearOfStudy: entry.year,
        },
        status: i % 2 === 0 ? 'First Timer' : 'Active',
        isFirstTimer: i % 2 === 0,
        dateOfFirstAttendance: nowIso.split('T')[0],
        registrationDate: nowIso.split('T')[0],
        howFoundManifest: 'Campus Outreach',
        departmentIds: [],
        createdBy: entry.operator,
        createdAt: nowIso,
        updatedBy: entry.operator,
        updatedAt: nowIso,
        lastActionNote: `Live entry by ${entry.operator}`,
      };

      setMembers((prev) => [newM, ...prev]);

      const auditLog: AuditLog = {
        id: 'aud-' + Date.now().toString(36) + '-' + i,
        timestamp: nowIso,
        userName: entry.operator,
        userRole: 'Model Admin',
        module: 'Members',
        action: 'Member Registered',
        targetEntityId: memberId,
        details: `${entry.operator} entered ${newM.fullName} (${entry.hostel}) - Portfolio: ${entry.portfolio}`,
        result: 'Success',
      };
      setAuditLogs((prev) => [auditLog, ...prev]);

      const liveEv: CollaborativeEvent = {
        id: 'ce-' + Date.now() + '-' + i,
        type: 'member:create',
        operator: entry.operator,
        timestamp: nowIso,
        entityId: memberId,
        entityName: newM.fullName,
        details: `Entered by ${entry.operator} at ${entry.hostel}`,
      };
      setRecentLiveEvents((prev) => [liveEv, ...prev.slice(0, 20)]);

      // Broadcast over WebSocket and cross-tab channel
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendWsMessage({ type: 'member:create', member: newM, operator: entry.operator });
      }
      broadcastChannelRef.current?.postMessage({
        type: 'cross_tab:member_created',
        payload: { member: newM, operator: entry.operator },
      });

      showToast(
        `🟢 ${entry.operator} entered: ${newM.fullName} (${entry.hostel})`,
        'success',
        entry.operator
      );
    }

    showToast('✅ All 6 parties successfully entered data in real-time!', 'success');
  };

  const hasPermission = () => true;

  const emptyModelForUse = () => {
    const nowIso = new Date().toISOString();
    setMembers([]);
    setHomes([]);
    setAttendance([]);
    setEvents([]);
    setIncome([]);
    setExpenses([]);
    setOfflineQueue([]);

    const auditEntry: AuditLog = {
      id: 'aud-' + Date.now().toString(36),
      timestamp: nowIso,
      userName: currentUserName,
      userRole: currentUserRole,
      module: 'System',
      action: 'Database Emptied',
      targetEntityId: 'model-empty',
      details: `${currentUserName} emptied member database. Platform is pristine and ready for live multi-party data entry.`,
      result: 'Warning',
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    localStorage.setItem(`${STORAGE_PREFIX}members`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}homes`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}attendance`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}offline_queue`, JSON.stringify([]));

    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'state:empty', operator: currentUserName });
    }
    broadcastChannelRef.current?.postMessage({
      type: 'cross_tab:state_empty',
      payload: { operator: currentUserName },
    });

    showToast('Platform emptied & ready for live data entry!', 'info', currentUserName);
  };

  const loadDemoData = () => {
    setMembers(INITIAL_MEMBERS);
    setHomes(INITIAL_HOMES);
    setDepartments(INITIAL_DEPARTMENTS);
    setEvents(INITIAL_EVENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setIncome(INITIAL_INCOME);
    setExpenses(INITIAL_EXPENSES);
    setBudgets(INITIAL_BUDGETS);
    setProjects(INITIAL_PROJECTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMessages(INITIAL_MESSAGES);
    setOfflineQueue([]);

    localStorage.setItem(`${STORAGE_PREFIX}members`, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(`${STORAGE_PREFIX}homes`, JSON.stringify(INITIAL_HOMES));

    if (isOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendWsMessage({ type: 'state:load_demo', operator: currentUserName });
    }
    broadcastChannelRef.current?.postMessage({
      type: 'cross_tab:load_demo',
      payload: { operator: currentUserName },
    });

    showToast('Demo dataset loaded with 18 multi-party records!', 'success', currentUserName);
  };

  const resetToDefaults = () => {
    emptyModelForUse();
  };

  const exportBackupJson = () => {
    const data = {
      members,
      homes,
      departments,
      events,
      attendance,
      income,
      expenses,
      budgets,
      projects,
      auditLogs,
      messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifest-fellowship-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded successfully', 'success');
  };

  const importBackupJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.members) setMembers(data.members);
      if (data.homes) setHomes(data.homes);
      if (data.departments) setDepartments(data.departments);
      showToast('Database imported successfully', 'success');
      return true;
    } catch {
      showToast('Invalid backup file JSON', 'error');
      return false;
    }
  };

  const value: FellowshipContextType = {
    currentUserRole,
    setCurrentUserRole,
    currentUserName,
    setCurrentUserName: setCurrentUserNameState,

    operators,
    activeOperator,
    setActiveOperatorName,
    addCustomOperator,

    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    wsConnected,
    offlineQueue,
    syncOfflineQueue,
    simulateConcurrentEntryDemo,
    recentLiveEvents,

    activeTab,
    setActiveTab,
    activeEventId,
    setActiveEventId,
    searchQuery,
    setSearchQuery,

    members,
    homes,
    departments,
    events,
    attendance,
    income,
    expenses,
    budgets,
    projects,
    auditLogs,
    messages,

    addMember,
    updateMember,
    deleteMember,
    deleteMembers,
    run7DayAutoUpdate,
    autoUpdateConfig,
    setAutoUpdateConfig,

    addHome,
    updateHome,
    deleteHome,
    assignMemberToHome,
    assignMembersToHome,
    setHomeLeader,
    autoGroupByHostel,

    addDepartment,
    updateDepartment,
    deleteDepartment,
    clearAllGroups,

    addEvent,
    updateEvent,

    recordAttendance,
    batchCheckIn,

    addIncome,
    addExpense,
    approveExpense,
    rejectExpense,
    disburseExpense,

    addBudget,
    updateBudget,

    addProject,
    updateProject,

    sendMessage,
    addAuditLog,

    toasts,
    showToast,
    removeToast,

    resetToDefaults,
    emptyModelForUse,
    loadDemoData,
    exportBackupJson,
    importBackupJson,

    formatUGX,
    hasPermission,

    currentTheme,
    setCurrentTheme,
    watermarkOpacity,
    setWatermarkOpacity,
    isWatermarkGlow,
    setIsWatermarkGlow,
  };

  return <FellowshipContext.Provider value={value}>{children}</FellowshipContext.Provider>;
};

export const useFellowship = () => {
  const context = useContext(FellowshipContext);
  if (!context) {
    throw new Error('useFellowship must be used within a FellowshipProvider');
  }
  return context;
};
