import React, { createContext, useContext, useState, useEffect } from 'react';
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
} from '../mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FellowshipContextType {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUserName: string;
  setCurrentUserName: (name: string) => void;
  
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
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
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
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  resetToDefaults: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonString: string) => boolean;

  // Helpers
  formatUGX: (amount: number) => string;
  hasPermission: (module: string, action: string) => boolean;

  // Theming & Watermark Customization
  currentTheme: import('../types').ThemeKey;
  setCurrentTheme: (theme: import('../types').ThemeKey) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (opacity: number) => void;
  isWatermarkGlow: boolean;
  setIsWatermarkGlow: (glow: boolean) => void;
}

const FellowshipContext = createContext<FellowshipContextType | undefined>(undefined);

const STORAGE_PREFIX = 'mfms_v1_';

// Helper to guarantee globally unique IDs across rapid sync operations and sessions
const makeUniqueId = (prefix: string): string => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  const counter = Math.floor(Math.random() * 10000).toString(36);
  return `${prefix}-${ts}-${counter}-${rand}`;
};

const sanitizeItemsWithUniqueIds = <T extends { id: string }>(items: T[], prefix: string): T[] => {
  const seenIds = new Set<string>();
  return items.map((item) => {
    if (!item.id || seenIds.has(item.id)) {
      const newId = makeUniqueId(prefix);
      seenIds.add(newId);
      return { ...item, id: newId };
    }
    seenIds.add(item.id);
    return item;
  });
};

export const FellowshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRoleState] = useState<UserRole>(() => {
    return 'Model Admin';
  });

  const [currentUserName, setCurrentUserName] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_PREFIX}username`) || 'Kigozi Joshua (Admin)';
  });

  // Theming & Watermark Controls
  const [currentTheme, setCurrentThemeState] = useState<import('../types').ThemeKey>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}theme`) as import('../types').ThemeKey) || 'obsidian-kiu';
  });

  const [watermarkOpacity, setWatermarkOpacityState] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}watermark_opacity`);
    return saved ? parseFloat(saved) : 0.35; // Default strong watermark fill
  });

  const [isWatermarkGlow, setIsWatermarkGlowState] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}watermark_glow`);
    return saved !== null ? saved === 'true' : true;
  });

  const setCurrentTheme = (theme: import('../types').ThemeKey) => {
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

  // State collections initialized from localStorage or mockData
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}members_v2`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Member[];
        const sanitized = sanitizeItemsWithUniqueIds(parsed, 'MAN');
        return sanitized.map((m) => ({
          ...m,
          departmentIds: m.departmentIds?.filter((d) => d !== 'dept-admin'),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [homes, setHomes] = useState<HomeGroup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}homes_v2`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'home');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}departments_v2`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Department[];
        return parsed.filter((d) => d.id !== 'dept-admin' && !d.name.toLowerCase().includes('finance'));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [events, setEvents] = useState<FellowshipEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'evt');
      } catch {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}attendance_v2`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'att');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [income, setIncome] = useState<IncomeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}income_v2`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'inc');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}expenses_v2`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'exp');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}budgets_v2`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'bdg');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [projects, setProjects] = useState<FinancialProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}projects_v2`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'prj');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}auditLogs`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'aud');
      } catch {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}messages`);
    if (saved) {
      try {
        return sanitizeItemsWithUniqueIds(JSON.parse(saved), 'msg');
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}members_v2`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}homes_v2`, JSON.stringify(homes));
  }, [homes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}departments_v2`, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}attendance_v2`, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}income_v2`, JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}expenses_v2`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}budgets_v2`, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}projects_v2`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}messages`, JSON.stringify(messages));
  }, [messages]);

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUserRoleState(role);
    localStorage.setItem(`${STORAGE_PREFIX}role`, role);
    showToast(`Switched active view role to: ${role}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = makeUniqueId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: makeUniqueId('aud'),
      timestamp: new Date().toISOString(),
      userName: log.userName || currentUserName,
      userRole: log.userRole || currentUserRole,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const formatUGX = (amount: number): string => {
    return `UGX ${Number(amount || 0).toLocaleString('en-US')}`;
  };

  // Generate next MAN member ID
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

    // Automatic Hostel / Residence Family Group assignment
    const enteredHostel = (memberData.hostelOrResidence || memberData.residence || '').trim();
    let assignedHomeId = memberData.homeId;

    if (!assignedHomeId && enteredHostel && enteredHostel.toLowerCase() !== 'not specified') {
      const cleanHostelLower = enteredHostel.toLowerCase();
      // Look for existing home group matching this hostel
      const matchedHome = homes.find(
        (h) =>
          (h.hostelOrResidence && h.hostelOrResidence.toLowerCase() === cleanHostelLower) ||
          h.name.toLowerCase() === `${cleanHostelLower} fellowship family` ||
          h.name.toLowerCase() === cleanHostelLower ||
          h.location.toLowerCase() === cleanHostelLower ||
          h.name.toLowerCase().includes(cleanHostelLower) ||
          cleanHostelLower.includes(h.name.toLowerCase())
      );

      if (matchedHome) {
        assignedHomeId = matchedHome.id;
      } else {
        // Automatically create the fellowship family group for this hostel
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
      }
    }

    const newMember: Member = {
      ...memberData,
      id,
      homeId: assignedHomeId,
      registrationDate: today,
    };

    setMembers((prev) => [newMember, ...prev]);

    addAuditLog({
      module: 'Members',
      action: 'Member Registered',
      targetEntityId: id,
      details: `Registered ${newMember.fullName} (${id}) - Status: ${newMember.status}${assignedHomeId ? ' - Assigned to Hostel Family' : ''}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    if (newMember.isFirstTimer || newMember.status === 'First Timer') {
      showToast(`✨ First-Timer welcomed! ID: ${id}. Assigned to ${enteredHostel || 'Fellowship'} Family.`, 'success');
    } else {
      showToast(`Member registered successfully! Assigned ID: ${id}`, 'success');
    }

    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updates };

          // If hostel changed and homeId was not explicitly given, re-sync to matching home
          if (updates.hostelOrResidence && updates.homeId === undefined) {
            const cleanHostelLower = updates.hostelOrResidence.trim().toLowerCase();
            if (cleanHostelLower && cleanHostelLower !== 'not specified') {
              const matchedHome = homes.find(
                (h) =>
                  (h.hostelOrResidence && h.hostelOrResidence.toLowerCase() === cleanHostelLower) ||
                  h.name.toLowerCase() === `${cleanHostelLower} fellowship family` ||
                  h.location.toLowerCase() === cleanHostelLower ||
                  h.name.toLowerCase().includes(cleanHostelLower)
              );
              if (matchedHome) {
                updated.homeId = matchedHome.id;
              }
            }
          }

          return updated;
        }
        return m;
      })
    );

    addAuditLog({
      module: 'Members',
      action: 'Member Profile Updated',
      targetEntityId: id,
      details: `Updated fields for member ${id}: ${Object.keys(updates).join(', ')}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Updated member record ${id}`, 'info');
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    addAuditLog({
      module: 'Members',
      action: 'Member Archived/Deleted',
      targetEntityId: id,
      details: `Removed member ${member?.fullName || id}`,
      result: 'Warning',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast(`Member ${id} archived`, 'warning');
  };

  const addHome = (homeData: Omit<HomeGroup, 'id'>): HomeGroup => {
    const slug = homeData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
    const id = `home-${slug}-${makeUniqueId('h')}`;
    const newHome: HomeGroup = { ...homeData, id };
    setHomes((prev) => [...prev, newHome]);
    addAuditLog({
      module: 'Homes',
      action: 'Home Group Created',
      targetEntityId: id,
      details: `Created new home fellowship: ${newHome.name} in zone ${newHome.zone}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast(`Created Home: ${newHome.name}`, 'success');
    return newHome;
  };

  const updateHome = (id: string, updates: Partial<HomeGroup>) => {
    setHomes((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    showToast(`Updated Home settings`, 'info');
  };

  const deleteHome = (id: string) => {
    const home = homes.find((h) => h.id === id);
    setHomes((prev) => prev.filter((h) => h.id !== id));
    // Also unassign members from this home
    setMembers((prev) => prev.map((m) => (m.homeId === id ? { ...m, homeId: undefined } : m)));
    addAuditLog({
      module: 'Homes',
      action: 'Home Group Deleted',
      targetEntityId: id,
      details: `Removed home fellowship: ${home?.name || id}`,
      result: 'Warning',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast(`Home group ${home?.name || id} removed`, 'warning');
  };

  // Assign a specific member with their details to a group/family
  const assignMemberToHome = (memberId: string, homeId: string | undefined) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, homeId } : m))
    );
    const targetHome = homeId ? homes.find((h) => h.id === homeId) : null;
    showToast(
      targetHome ? `Assigned to ${targetHome.name}` : `Removed from family group`,
      'info'
    );
  };

  // Batch assign multiple members with their details to a specific group/family
  const assignMembersToHome = (memberIds: string[], homeId: string) => {
    setMembers((prev) =>
      prev.map((m) => (memberIds.includes(m.id) ? { ...m, homeId } : m))
    );
    const targetHome = homes.find((h) => h.id === homeId);
    showToast(
      `Assigned ${memberIds.length} members to ${targetHome?.name || 'group'}`,
      'success'
    );
  };

  // Enter / assign the person that is going to head a specific group (leader name, phone, email)
  const setHomeLeader = (
    homeId: string,
    leaderName: string,
    leaderPhone: string,
    leaderEmail?: string
  ) => {
    setHomes((prev) =>
      prev.map((h) =>
        h.id === homeId
          ? {
              ...h,
              leaderName: leaderName.trim(),
              leaderPhone: leaderPhone.trim(),
              leaderEmail: leaderEmail?.trim() || undefined,
            }
          : h
      )
    );
    addAuditLog({
      module: 'Homes',
      action: 'Group Head Assigned',
      targetEntityId: homeId,
      details: `Designated ${leaderName} as Head of Group for ${homeId}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast(`Leader ${leaderName} designated as Head of Group!`, 'success');
  };

  // Automatic grouping: scans all registered members and groups everyone in the same hostel into their family group
  const autoGroupByHostel = (): { createdCount: number; assignedCount: number } => {
    let createdCount = 0;
    let assignedCount = 0;
    let currentHomes = [...homes];

    const getNormalizedKey = (str: string) =>
      str.toLowerCase().replace(/fellowship family|cell group|home|hostel/g, '').trim();

    const memberUpdates: Record<string, string> = {};

    members.forEach((m) => {
      const hostel = (m.hostelOrResidence || m.residence || '').trim();
      if (!hostel || hostel.toLowerCase() === 'not specified') return;

      const normHostel = getNormalizedKey(hostel);
      let matched = currentHomes.find(
        (h) =>
          (h.hostelOrResidence && getNormalizedKey(h.hostelOrResidence) === normHostel) ||
          getNormalizedKey(h.name) === normHostel ||
          getNormalizedKey(h.location) === normHostel ||
          (normHostel.length > 3 && getNormalizedKey(h.name).includes(normHostel))
      );

      if (!matched) {
        const slug = hostel.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
        const autoHomeId = `home-${slug}-${makeUniqueId('h')}`;
        const autoHome: HomeGroup = {
          id: autoHomeId,
          name: `${hostel} Fellowship Family`,
          zone: 'Hostel & Residence Network',
          leaderId: 'PENDING',
          leaderName: 'Leader Pending Assignment',
          leaderPhone: '',
          leaderEmail: '',
          meetingDay: 'Weekly Cell Gathering',
          location: hostel,
          hostelOrResidence: hostel,
          description: `Fellowship family group for members residing at ${hostel}.`,
          targetCount: 20,
        };
        currentHomes.push(autoHome);
        matched = autoHome;
        createdCount++;
      }

      if (m.homeId !== matched.id) {
        memberUpdates[m.id] = matched.id;
        assignedCount++;
      }
    });

    if (createdCount > 0) {
      setHomes(currentHomes);
    }

    if (assignedCount > 0) {
      setMembers((prev) =>
        prev.map((m) => (memberUpdates[m.id] ? { ...m, homeId: memberUpdates[m.id] } : m))
      );
    }

    showToast(
      `Auto-grouped: ${assignedCount} members organized across ${currentHomes.length} hostel families.`,
      'success'
    );

    return { createdCount, assignedCount };
  };

  const addDepartment = (deptData: Omit<Department, 'id'>): Department => {
    const slug = deptData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
    const id = `dept-${slug}-${makeUniqueId('d')}`;
    const newDept: Department = { ...deptData, id };
    setDepartments((prev) => [...prev, newDept]);
    addAuditLog({
      module: 'Departments',
      action: 'Department Created',
      targetEntityId: id,
      details: `Created new department: ${newDept.name} (${newDept.code})`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast(`Created Department / Ministry: ${newDept.name}`, 'success');
    return newDept;
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast(`Updated department settings`, 'info');
  };

  const deleteDepartment = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    addAuditLog({
      module: 'Departments',
      action: 'Department Deleted',
      targetEntityId: id,
      details: `Removed department: ${dept?.name || id}`,
      result: 'Warning',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast(`Department ${dept?.name || id} removed`, 'warning');
  };

  const clearAllGroups = () => {
    setHomes([]);
    setDepartments([]);
    addAuditLog({
      module: 'Homes',
      action: 'All Groups Cleared',
      targetEntityId: 'all',
      details: 'All home cells and departments cleared by user for fresh data entry',
      result: 'Warning',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast('Fellowship groups emptied. Ready for custom entry.', 'info');
  };

  const addEvent = (eventData: Omit<FellowshipEvent, 'id'>): FellowshipEvent => {
    const id = `evt-${new Date().getFullYear()}-${String(events.length + 1).padStart(2, '0')}-${makeUniqueId('e').slice(-4)}`;
    const newEvent: FellowshipEvent = { ...eventData, id, actualAttendanceCount: 0 };
    setEvents((prev) => [newEvent, ...prev]);
    addAuditLog({
      module: 'Events',
      action: 'Event Created',
      targetEntityId: id,
      details: `Created event "${newEvent.name}" scheduled for ${newEvent.date}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });
    showToast(`Created event: ${newEvent.name}`, 'success');
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<FellowshipEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast(`Updated event details`, 'info');
  };

  // Record Single Attendance (Rapid check-in)
  const recordAttendance = (
    recordData: Omit<AttendanceRecord, 'id' | 'date' | 'time'>
  ): AttendanceRecord => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Check if already checked in for this event today
    const existing = attendance.find(
      (a) => a.memberId === recordData.memberId && a.eventId === recordData.eventId && a.date === date
    );

    if (existing) {
      showToast(`${recordData.memberName} is already checked in for this gathering.`, 'warning');
      return existing;
    }

    const id = makeUniqueId('att');
    const newRecord: AttendanceRecord = {
      ...recordData,
      id,
      date,
      time,
    };

    setAttendance((prev) => [newRecord, ...prev]);

    // Increment event counter
    setEvents((prev) =>
      prev.map((e) =>
        e.id === recordData.eventId
          ? { ...e, actualAttendanceCount: (e.actualAttendanceCount || 0) + 1 }
          : e
      )
    );

    addAuditLog({
      module: 'Attendance',
      action: 'Attendance Checked In',
      targetEntityId: id,
      details: `Checked in ${newRecord.memberName} (${newRecord.memberId}) via ${newRecord.checkInMethod}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`✓ Checked in: ${newRecord.memberName} (${newRecord.status})`, 'success');
    return newRecord;
  };

  const batchCheckIn = (
    eventId: string,
    memberIds: string[],
    status: AttendanceStatus,
    recordedBy: string,
    checkInMethod: AttendanceRecord['checkInMethod']
  ) => {
    const event = events.find((e) => e.id === eventId);
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    let addedCount = 0;
    const newRecords: AttendanceRecord[] = [];

    memberIds.forEach((mId) => {
      const member = members.find((m) => m.id === mId);
      if (!member) return;

      const already = attendance.some(
        (a) => a.memberId === mId && a.eventId === eventId && a.date === date
      );

      if (!already) {
        newRecords.push({
          id: makeUniqueId('att'),
          memberId: member.id,
          memberName: member.fullName,
          memberPhone: member.phone,
          eventId,
          eventName: event ? event.name : 'Fellowship Gathering',
          date,
          time,
          status,
          recordedBy,
          checkInMethod,
        });
        addedCount++;
      }
    });

    if (newRecords.length > 0) {
      setAttendance((prev) => [...newRecords, ...prev]);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, actualAttendanceCount: (e.actualAttendanceCount || 0) + addedCount }
            : e
        )
      );

      addAuditLog({
        module: 'Attendance',
        action: 'Batch Attendance Recorded',
        targetEntityId: eventId,
        details: `Batch recorded attendance for ${addedCount} members (${status})`,
        result: 'Success',
        userName: currentUserName,
        userRole: currentUserRole,
      });

      showToast(`Marked ${addedCount} members as ${status}`, 'success');
    } else {
      showToast(`Selected members were already checked in for today.`, 'info');
    }
  };

  // Financial Actions
  const addIncome = (incomeData: Omit<IncomeRecord, 'id'>): IncomeRecord => {
    let maxNum = 0;
    income.forEach((i) => {
      const match = i.id.match(/^TXN-INC-\d{4}-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    const count = Math.max(income.length + 1, maxNum + 1);
    const id = `TXN-INC-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newIncome: IncomeRecord = { ...incomeData, id };

    setIncome((prev) => [newIncome, ...prev]);

    // If attached to project, update project total income
    if (newIncome.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === newIncome.projectId
            ? { ...p, totalIncome: (p.totalIncome || 0) + newIncome.amount }
            : p
        )
      );
    }

    addAuditLog({
      module: 'Finance',
      action: 'Income Recorded',
      targetEntityId: id,
      details: `Recorded ${formatUGX(newIncome.amount)} for ${newIncome.category} (${newIncome.description})`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Recorded Income: ${formatUGX(newIncome.amount)} (${newIncome.category})`, 'success');
    return newIncome;
  };

  const addExpense = (
    expenseData: Omit<ExpenseRecord, 'id' | 'status'>,
    submitForApproval = true
  ): ExpenseRecord => {
    let maxNum = 0;
    expenses.forEach((e) => {
      const match = e.id.match(/^TXN-EXP-\d{4}-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    const count = Math.max(expenses.length + 1, maxNum + 1);
    const id = `TXN-EXP-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id,
      status: submitForApproval ? 'Pending Approval' : 'Draft',
    };

    setExpenses((prev) => [newExpense, ...prev]);

    addAuditLog({
      module: 'Finance',
      action: 'Expense Request Submitted',
      targetEntityId: id,
      details: `Requested ${formatUGX(newExpense.amount)} for ${newExpense.category} by ${newExpense.requestedBy}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Submitted expense request for ${formatUGX(newExpense.amount)}`, 'info');
    return newExpense;
  };

  const approveExpense = (id: string, approvedBy: string) => {
    const today = new Date().toISOString().split('T')[0];
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: 'Approved',
            approvedBy,
            approvalDate: today,
          };
        }
        return e;
      })
    );

    addAuditLog({
      module: 'Finance',
      action: 'Expense Approved',
      targetEntityId: id,
      details: `Expense ${id} approved by ${approvedBy}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Expense ${id} approved successfully!`, 'success');
  };

  const rejectExpense = (id: string, reason: string) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: 'Rejected',
            rejectionReason: reason,
          };
        }
        return e;
      })
    );

    addAuditLog({
      module: 'Finance',
      action: 'Expense Rejected',
      targetEntityId: id,
      details: `Expense ${id} rejected: ${reason}`,
      result: 'Warning',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Expense ${id} rejected.`, 'warning');
  };

  const disburseExpense = (
    id: string,
    paidBy: string,
    paymentMethod: PaymentMethod,
    receiptAttachment?: string
  ) => {
    const exp = expenses.find((e) => e.id === id);
    if (!exp) return;

    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: 'Completed',
            paidBy,
            paymentMethod,
            receiptAttachment: receiptAttachment || e.receiptAttachment,
          };
        }
        return e;
      })
    );

    // Update project or budget actual spend
    if (exp.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === exp.projectId
            ? { ...p, totalExpenses: (p.totalExpenses || 0) + exp.amount }
            : p
        )
      );
    }

    // Update related budget item if matched
    setBudgets((prev) =>
      prev.map((b) => {
        if (
          (exp.projectId && b.targetId === exp.projectId) ||
          (exp.departmentId && b.targetId === exp.departmentId) ||
          (exp.eventId && b.targetId === exp.eventId)
        ) {
          const updatedItems = b.items.map((item) => {
            if (item.category === exp.category) {
              return { ...item, spentAmount: item.spentAmount + exp.amount };
            }
            return item;
          });
          const totalSpent = updatedItems.reduce((acc, curr) => acc + curr.spentAmount, 0);
          return { ...b, items: updatedItems, totalSpent };
        }
        return b;
      })
    );

    addAuditLog({
      module: 'Finance',
      action: 'Expense Disbursed & Completed',
      targetEntityId: id,
      details: `Disbursed ${formatUGX(exp.amount)} via ${paymentMethod} by ${paidBy}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Disbursed & marked completed: ${formatUGX(exp.amount)}`, 'success');
  };

  const addBudget = (budgetData: Omit<Budget, 'id' | 'totalSpent'>): Budget => {
    const id = `bdg-${new Date().getFullYear()}-${String(budgets.length + 1).padStart(2, '0')}`;
    const totalSpent = budgetData.items.reduce((acc, i) => acc + i.spentAmount, 0);
    const newBudget: Budget = {
      ...budgetData,
      id,
      totalSpent,
    };
    setBudgets((prev) => [newBudget, ...prev]);

    addAuditLog({
      module: 'Finance',
      action: 'Budget Created',
      targetEntityId: id,
      details: `Created budget "${newBudget.title}" with allocation ${formatUGX(newBudget.totalAllocated)}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Created budget: ${newBudget.title}`, 'success');
    return newBudget;
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    showToast(`Budget updated`, 'info');
  };

  const addProject = (
    projectData: Omit<FinancialProject, 'id' | 'totalIncome' | 'totalExpenses'>
  ): FinancialProject => {
    const id = `proj-${new Date().getFullYear()}-${String(projects.length + 1).padStart(2, '0')}`;
    const newProject: FinancialProject = {
      ...projectData,
      id,
      totalIncome: 0,
      totalExpenses: 0,
    };
    setProjects((prev) => [newProject, ...prev]);

    addAuditLog({
      module: 'Finance',
      action: 'Financial Project Created',
      targetEntityId: id,
      details: `Created financial project "${newProject.title}" (Target: ${formatUGX(newProject.budgetTarget)})`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Created project: ${newProject.title}`, 'success');
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<FinancialProject>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast(`Project updated`, 'info');
  };

  const sendMessage = (msg: Omit<CommunicationMessage, 'id' | 'timestamp'>): CommunicationMessage => {
    const id = `msg-${Date.now().toString().slice(-4)}`;
    const newMsg: CommunicationMessage = {
      ...msg,
      id,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [newMsg, ...prev]);

    addAuditLog({
      module: 'System',
      action: 'Communication Broadcast Sent',
      targetEntityId: id,
      details: `Broadcast "${newMsg.title}" via ${newMsg.channel} dispatched to ${newMsg.recipientGroup} (${newMsg.recipientCount} recipients)`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Broadcast "${newMsg.title}" sent to ${newMsg.recipientCount} recipients!`, 'success');
    return newMsg;
  };

  const resetToDefaults = () => {
    localStorage.clear();
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
    setCurrentUserRoleState('Model Admin');
    showToast('Reset system to default seed data.', 'info');
  };

  const exportBackupJson = () => {
    const data = {
      manifestVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
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
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifest_fellowship_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported successfully!', 'success');
  };

  const importBackupJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.members) setMembers(data.members);
      if (data.homes) setHomes(data.homes);
      if (data.departments) setDepartments(data.departments);
      if (data.events) setEvents(data.events);
      if (data.attendance) setAttendance(data.attendance);
      if (data.income) setIncome(data.income);
      if (data.expenses) setExpenses(data.expenses);
      if (data.budgets) setBudgets(data.budgets);
      if (data.projects) setProjects(data.projects);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.messages) setMessages(data.messages);
      showToast('Database imported successfully!', 'success');
      return true;
    } catch (err) {
      showToast('Invalid backup file format.', 'error');
      return false;
    }
  };

  // Permission Checker: Model Admin has unrestricted system-wide access
  const hasPermission = (_module: string, _action: string): boolean => {
    return true;
  };

  return (
    <FellowshipContext.Provider
      value={{
        currentUserRole,
        setCurrentUserRole,
        currentUserName,
        setCurrentUserName,
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
      }}
    >
      {children}
    </FellowshipContext.Provider>
  );
};

export const useFellowship = () => {
  const context = useContext(FellowshipContext);
  if (!context) {
    throw new Error('useFellowship must be used within a FellowshipProvider');
  }
  return context;
};
