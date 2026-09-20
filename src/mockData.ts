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
} from './types';

export const INITIAL_HOMES: HomeGroup[] = [];

export const INITIAL_DEPARTMENTS: Department[] = [];

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_EVENTS: FellowshipEvent[] = [
  {
    id: 'evt-2026-01',
    name: 'Thursday Weekly Fellowship — "Walking in Light"',
    description: 'Our regular weekly worship, word, and corporate prayer gathering at KIU Kansanga.',
    eventType: 'Weekly Fellowship',
    date: '2026-08-20',
    startTime: '17:30',
    endTime: '20:00',
    location: 'KIU Main Campus Auditorium / Live Stream',
    requiresAttendance: true,
    status: 'Upcoming',
    budgetAllocated: 350000,
    expectedAttendance: 120,
    actualAttendanceCount: 0,
  },
  {
    id: 'evt-2026-02',
    name: 'Thursday Weekly Fellowship — "Rooted and Grounded"',
    description: 'Upcoming weekly gathering for KIU scholars and Makindye community.',
    eventType: 'Weekly Fellowship',
    date: '2026-08-27',
    startTime: '17:30',
    endTime: '20:00',
    location: 'KIU Main Campus Auditorium',
    requiresAttendance: true,
    status: 'Upcoming',
    budgetAllocated: 400000,
    expectedAttendance: 140,
  },
  {
    id: 'evt-2026-03',
    name: 'Manifest KIU Kansanga Freshers Campus Outreach',
    description: 'Welcoming first-year students across KIU faculties, hostels, and Kansanga residences.',
    eventType: 'Outreach',
    date: '2026-09-05',
    startTime: '09:00',
    endTime: '16:00',
    location: 'KIU Kansanga Campus & Hostels Quadrant',
    requiresAttendance: true,
    status: 'Upcoming',
    budgetAllocated: 800000,
    expectedAttendance: 250,
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_INCOME: IncomeRecord[] = [];

export const INITIAL_EXPENSES: ExpenseRecord[] = [];

export const INITIAL_BUDGETS: Budget[] = [];

export const INITIAL_PROJECTS: FinancialProject[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-08-20T10:00:00Z',
    userName: 'Admin',
    userRole: 'Super Admin',
    module: 'System',
    action: 'Workspace Initialized',
    targetEntityId: 'sys-init',
    details: 'Manifest Fellowship platform initialized with custom data entry mode.',
    result: 'Success',
  },
];

export const INITIAL_MESSAGES: CommunicationMessage[] = [
  {
    id: 'msg-001',
    timestamp: '2026-08-20T10:00:00Z',
    senderName: 'Fellowship Secretariat',
    channel: 'SMS',
    title: 'Welcome to Manifest Fellowship',
    body: 'Grace and peace! Welcome to Manifest Fellowship K.I.U.',
    recipientGroup: 'All Members',
    recipientCount: 0,
    status: 'Sent',
  },
];
