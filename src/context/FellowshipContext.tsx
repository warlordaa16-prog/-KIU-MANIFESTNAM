import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  HomeGroup,
  Department,
  FellowshipEvent,
  AttendanceRecord,
  FollowUpRecord,
  FollowUpInteraction,
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
  INITIAL_FOLLOW_UPS,
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
  followUps: FollowUpRecord[];
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
  
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  
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

  updateFollowUp: (id: string, updates: Partial<FollowUpRecord>) => void;
  addFollowUpInteraction: (
    followUpId: string,
    interaction: Omit<FollowUpInteraction, 'id' | 'date'>
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

export const FellowshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(`${STORAGE_PREFIX}role`) as UserRole) || 'Super Admin';
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
    const saved = localStorage.getItem(`${STORAGE_PREFIX}members`);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [homes, setHomes] = useState<HomeGroup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}homes`);
    return saved ? JSON.parse(saved) : INITIAL_HOMES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}departments`);
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [events, setEvents] = useState<FellowshipEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}followUps`);
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [income, setIncome] = useState<IncomeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}income`);
    return saved ? JSON.parse(saved) : INITIAL_INCOME;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}budgets`);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [projects, setProjects] = useState<FinancialProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Sync to local storage
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
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}attendance`, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}followUps`, JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}income`, JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}budgets`, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}projects`, JSON.stringify(projects));
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
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
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
      id: `aud-${Date.now().toString().slice(-6)}`,
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
    const count = members.length + 1;
    const padded = String(count).padStart(6, '0');
    return `MAN-${currentYear}-${padded}`;
  };

  // Add Member with Automated First-Timer Pipeline
  const addMember = (
    memberData: Omit<Member, 'id' | 'registrationDate'>,
    autoOnboardFirstTimer = true
  ): Member => {
    const id = generateMemberId();
    const today = new Date().toISOString().split('T')[0];
    const newMember: Member = {
      ...memberData,
      id,
      registrationDate: today,
    };

    setMembers((prev) => [newMember, ...prev]);

    addAuditLog({
      module: 'Members',
      action: 'Member Registered',
      targetEntityId: id,
      details: `Registered ${newMember.fullName} (${id}) - Status: ${newMember.status}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    // Automated First-Timer Workflow Integration
    if (newMember.isFirstTimer || newMember.status === 'First Timer') {
      const followUpId = `fol-2026-${String(followUps.length + 1).padStart(3, '0')}`;
      
      // Auto-assign default coordinator or lead
      const defaultCoordinator = members.find((m) => m.departmentIds?.includes('dept-coordination')) || members[0];
      
      const newFollowUp: FollowUpRecord = {
        id: followUpId,
        memberId: id,
        memberName: newMember.fullName,
        phone: newMember.phone,
        dateOfVisit: newMember.dateOfFirstAttendance || today,
        invitedBy: newMember.invitedBy || 'Campus Outreach / Walk-in',
        coordinatorId: defaultCoordinator ? defaultCoordinator.id : undefined,
        coordinatorName: defaultCoordinator ? defaultCoordinator.fullName : 'Coordination Ministry',
        status: 'Assigned',
        notes: `Automated follow-up initialized on registration. First visit on ${newMember.dateOfFirstAttendance || today}. Interested in ${newMember.homeId ? 'Home fellowship' : 'community'}.`,
        nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days later
        assignedHomeId: newMember.homeId,
        interactions: [
          {
            id: `int-${Date.now().toString().slice(-4)}`,
            date: today,
            coordinatorId: defaultCoordinator ? defaultCoordinator.id : 'SYS',
            coordinatorName: defaultCoordinator ? defaultCoordinator.fullName : 'System Automation',
            action: 'WhatsApp / SMS',
            result: `Automated welcome dispatched: Assigned follow-up officer ${defaultCoordinator ? defaultCoordinator.fullName : 'Coordination'}.`,
            nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
        ],
      };

      setFollowUps((prev) => [newFollowUp, ...prev]);

      addAuditLog({
        module: 'Follow-Up',
        action: 'First Timer Follow-Up Auto-Created',
        targetEntityId: followUpId,
        details: `Auto-created follow-up file ${followUpId} and assigned to ${defaultCoordinator?.fullName || 'Coordination'} for ${newMember.fullName}.`,
        result: 'Success',
        userName: currentUserName,
        userRole: currentUserRole,
      });

      showToast(`✨ Member registered! Unique ID: ${id}. First-Timer Follow-Up automated.`, 'success');
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
    const id = `home-${homeData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
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

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast(`Updated department settings`, 'info');
  };

  const addEvent = (eventData: Omit<FellowshipEvent, 'id'>): FellowshipEvent => {
    const id = `evt-${new Date().getFullYear()}-${String(events.length + 1).padStart(2, '0')}`;
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

    const id = `att-${Date.now().toString().slice(-6)}`;
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
          id: `att-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 5)}`,
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

  const updateFollowUp = (id: string, updates: Partial<FollowUpRecord>) => {
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    showToast(`Updated follow-up status`, 'info');
  };

  const addFollowUpInteraction = (
    followUpId: string,
    interaction: Omit<FollowUpInteraction, 'id' | 'date'>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newInteraction: FollowUpInteraction = {
      ...interaction,
      id: `int-${Date.now().toString().slice(-4)}`,
      date: today,
    };

    setFollowUps((prev) =>
      prev.map((f) => {
        if (f.id === followUpId) {
          return {
            ...f,
            interactions: [newInteraction, ...f.interactions],
            nextFollowUpDate: interaction.nextFollowUpDate || f.nextFollowUpDate,
            status: f.status === 'Assigned' || f.status === 'Pending' ? 'Contacted' : f.status,
          };
        }
        return f;
      })
    );

    addAuditLog({
      module: 'Follow-Up',
      action: 'Interaction Logged',
      targetEntityId: followUpId,
      details: `${interaction.action} logged by ${interaction.coordinatorName}. Next follow-up: ${interaction.nextFollowUpDate || 'None'}`,
      result: 'Success',
      userName: currentUserName,
      userRole: currentUserRole,
    });

    showToast(`Interaction logged for follow-up case ${followUpId}`, 'success');
  };

  // Financial Actions
  const addIncome = (incomeData: Omit<IncomeRecord, 'id'>): IncomeRecord => {
    const count = income.length + 1;
    const id = `TXN-INC-2026-${String(count).padStart(3, '0')}`;
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
    const count = expenses.length + 1;
    const id = `TXN-EXP-2026-${String(count).padStart(3, '0')}`;
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
    setFollowUps(INITIAL_FOLLOW_UPS);
    setIncome(INITIAL_INCOME);
    setExpenses(INITIAL_EXPENSES);
    setBudgets(INITIAL_BUDGETS);
    setProjects(INITIAL_PROJECTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMessages(INITIAL_MESSAGES);
    setCurrentUserRoleState('Super Admin');
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
      followUps,
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
      if (data.followUps) setFollowUps(data.followUps);
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

  // Permission Checker
  const hasPermission = (module: string, action: string): boolean => {
    if (currentUserRole === 'Super Admin' || currentUserRole === 'Fellowship Admin') return true;

    if (module === 'Finance') {
      if (currentUserRole === 'Finance Admin') return true;
      if (currentUserRole === 'Finance Officer' && (action === 'view' || action === 'record')) return true;
      if (currentUserRole === 'Auditor' && action === 'view') return true;
      if (currentUserRole === 'Department Leader' && (action === 'request' || action === 'view_department')) return true;
      return false;
    }

    if (module === 'Attendance') {
      if (currentUserRole === 'Attendance Officer' || currentUserRole === 'Coordinator') return true;
      return true;
    }

    if (module === 'Follow-Up') {
      if (currentUserRole === 'Coordinator' || currentUserRole === 'Homes Leader') return true;
      return true;
    }

    if (module === 'Homes') {
      return true;
    }

    if (module === 'Admin') {
      return currentUserRole === 'Super Admin' || currentUserRole === 'Fellowship Admin';
    }

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
        followUps,
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
        updateDepartment,
        addEvent,
        updateEvent,
        recordAttendance,
        batchCheckIn,
        updateFollowUp,
        addFollowUpInteraction,
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
