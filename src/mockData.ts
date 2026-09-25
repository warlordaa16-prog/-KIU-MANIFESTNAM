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
  CollaborativeOperator,
} from './types';

export const INITIAL_OPERATORS: CollaborativeOperator[] = [
  {
    id: 'op-anibal',
    name: 'Anibal',
    roleTitle: 'Registration Desk Lead',
    avatarColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-400',
    deskName: 'Main Entrance & PIN Desk',
    isOnline: true,
    entriesCount: 0,
  },
  {
    id: 'op-marcus',
    name: 'Marcus',
    roleTitle: 'Academic & Records Officer',
    avatarColor: 'bg-cyan-500',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/40',
    badgeText: 'text-cyan-400',
    deskName: 'Schools & Student Portfolio',
    isOnline: true,
    entriesCount: 0,
  },
  {
    id: 'op-ahebwa',
    name: 'Ahebwa',
    roleTitle: 'Hostels & Families Lead',
    avatarColor: 'bg-amber-500',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-400',
    deskName: 'Hostel Families Allocation',
    isOnline: true,
    entriesCount: 0,
  },
  {
    id: 'op-grace',
    name: 'Grace',
    roleTitle: 'Welfare & Pastoral Intake',
    avatarColor: 'bg-rose-500',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-400',
    deskName: 'Pastoral & Follow-up Desk',
    isOnline: true,
    entriesCount: 0,
  },
  {
    id: 'op-david',
    name: 'David',
    roleTitle: 'Finance & Contributions',
    avatarColor: 'bg-violet-500',
    badgeBg: 'bg-violet-500/10',
    badgeBorder: 'border-violet-500/40',
    badgeText: 'text-violet-400',
    deskName: 'Treasury & Logistics Desk',
    isOnline: true,
    entriesCount: 0,
  },
  {
    id: 'op-sarah',
    name: 'Sarah',
    roleTitle: 'Secretariat & Community',
    avatarColor: 'bg-blue-500',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/40',
    badgeText: 'text-blue-400',
    deskName: 'Secretariat & Alumni Registry',
    isOnline: true,
    entriesCount: 0,
  },
  {
    id: 'op-emmanuel',
    name: 'Emmanuel',
    roleTitle: 'Outreach & Campus Missions',
    avatarColor: 'bg-orange-500',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/40',
    badgeText: 'text-orange-400',
    deskName: 'Campus Outreach Desk',
    isOnline: true,
    entriesCount: 0,
  },
];

// Clean state: Ready for real data entry
export const INITIAL_HOMES: HomeGroup[] = [];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-choir',
    name: 'Choir & Worship Ministry',
    code: 'WRSHP',
    leaderId: 'PENDING',
    leaderName: 'To be designated',
    leaderPhone: '',
    description: 'Leading vocal and instrumental worship for all Manifest corporate gatherings.',
    meetingSchedule: 'Wednesdays 5:00 PM & Saturdays 3:00 PM',
  },
  {
    id: 'dept-media',
    name: 'Media & Production Tech',
    code: 'MEDIA',
    leaderId: 'PENDING',
    leaderName: 'To be designated',
    leaderPhone: '',
    description: 'Livestream broadcasting, audio engineering, visual projection, photography, and social media.',
    meetingSchedule: 'Thursdays 4:30 PM & Sundays 8:00 AM',
  },
  {
    id: 'dept-protocol',
    name: 'Protocol & Ushers',
    code: 'PROT',
    leaderId: 'PENDING',
    leaderName: 'To be designated',
    leaderPhone: '',
    description: 'Welcoming fellowship guests, orderliness, seating management, and registration assistance.',
    meetingSchedule: 'Thursdays 5:00 PM',
  },
  {
    id: 'dept-intercession',
    name: 'Intercession & Prayer Altar',
    code: 'PRAY',
    leaderId: 'PENDING',
    leaderName: 'To be designated',
    leaderPhone: '',
    description: 'Continuous prayer coverage, morning prayer watches, and campus intercession vigils.',
    meetingSchedule: 'Tuesdays & Fridays 6:00 AM',
  },
  {
    id: 'dept-welfare',
    name: 'Welfare & Pastoral Care',
    code: 'WLFR',
    leaderId: 'PENDING',
    leaderName: 'To be designated',
    leaderPhone: '',
    description: 'Student support, hospital visitations, hostel outreach follow-up, and fresher orientation.',
    meetingSchedule: 'Mondays 5:00 PM',
  },
];

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_EVENTS: FellowshipEvent[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_INCOME: IncomeRecord[] = [];

export const INITIAL_EXPENSES: ExpenseRecord[] = [];

export const INITIAL_BUDGETS: Budget[] = [];

export const INITIAL_PROJECTS: FinancialProject[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-init-001',
    timestamp: new Date().toISOString(),
    userName: 'Model Admin',
    userRole: 'Model Admin',
    module: 'System',
    action: 'Workspace Initialized',
    targetEntityId: 'sys-init',
    details: 'System cleared and primed for live multi-party data entry.',
    result: 'Success',
  },
];

export const INITIAL_MESSAGES: CommunicationMessage[] = [];
