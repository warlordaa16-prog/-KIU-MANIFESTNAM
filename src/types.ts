export type MemberStatus =
  | 'Active'
  | 'Inactive'
  | 'First Timer'
  | 'Returning Visitor'
  | 'Transferred'
  | 'Graduated'
  | 'Archived';

export type UserRole =
  | 'Super Admin'
  | 'Fellowship Admin'
  | 'Finance Admin'
  | 'Finance Officer'
  | 'Coordinator'
  | 'Homes Leader'
  | 'Department Leader'
  | 'Attendance Officer'
  | 'Auditor'
  | 'Member';

export type Gender = 'Male' | 'Female';

export interface StudentProfile {
  isStudent: boolean;
  registrationNumber?: string;
  course?: string;
  faculty?: string;
  yearOfStudy?: number;
  campus?: string;
  expectedGraduationYear?: number;
}

export interface Member {
  id: string; // MAN-2026-000001
  fullName: string;
  preferredName?: string;
  gender: Gender;
  phone: string;
  altPhone?: string;
  email: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  residence?: string; // e.g. 'Kansanga', 'Kabalagala', 'Ggaba', 'Bunga'
  
  // Student Profile
  studentInfo: StudentProfile;

  // Fellowship Info
  status: MemberStatus;
  isFirstTimer: boolean;
  dateOfFirstAttendance: string;
  registrationDate: string;
  howFoundManifest: string; // e.g. "Friend/Member", "Social Media", "Campus Outreach", "Flyer/Poster", "Event"
  invitedBy?: string;
  
  homeId?: string; // Legacy / optional
  departmentIds: string[]; // e.g. ['dept-choir', 'dept-media']
  
  notes?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Excused' | 'Late';

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  status: AttendanceStatus;
  recordedBy: string;
  notes?: string;
  checkInMethod: 'QR Code' | 'Phone Lookup' | 'Member ID' | 'Manual Roster';
}

export type FollowUpStatus =
  | 'Pending'
  | 'Assigned'
  | 'Contacted'
  | 'Responded'
  | 'Joined'
  | 'No Response'
  | 'Not Interested'
  | 'Needs Further Follow-Up'
  | 'Completed';

export interface FollowUpInteraction {
  id: string;
  date: string;
  coordinatorId: string;
  coordinatorName: string;
  action: 'Phone Call' | 'WhatsApp / SMS' | 'Physical Visit' | 'In-Person Conversation' | 'Email';
  result: string;
  nextFollowUpDate?: string;
}

export interface FollowUpRecord {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  dateOfVisit: string;
  invitedBy?: string;
  coordinatorId?: string;
  coordinatorName?: string;
  status: FollowUpStatus;
  notes: string;
  nextFollowUpDate?: string;
  interactions: FollowUpInteraction[];
  assignedHomeId?: string;
}

export interface HomeGroup {
  id: string;
  name: string; // e.g. "Home Sinai", "Home Zion"
  zone: string; // e.g. "Kansanga - KIU Main Campus Zone", "Kabalagala", "Nsambya", "Makindye"
  leaderId: string;
  leaderName: string;
  leaderPhone: string;
  assistantLeaderId?: string;
  assistantLeaderName?: string;
  meetingDay: string; // e.g. "Every Wednesday 6:00 PM"
  location: string; // e.g. "KIU Main Gate Lounge", "Prestige Hostel Quad"
  description?: string;
  targetCount: number;
}

export interface Department {
  id: string;
  name: string; // e.g. "Choir & Worship", "Media & Production", "Protocol & Ushers"
  code: string;
  leaderId: string;
  leaderName: string;
  leaderPhone: string;
  description: string;
  meetingSchedule: string;
}

export type EventType =
  | 'Weekly Fellowship'
  | 'Outreach'
  | 'Conference'
  | 'Prayer Meeting'
  | 'Home Meeting'
  | 'Training'
  | 'Special Event';

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface FellowshipEvent {
  id: string;
  name: string;
  description: string;
  eventType: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  requiresAttendance: boolean;
  status: EventStatus;
  budgetAllocated?: number;
  expectedAttendance?: number;
  actualAttendanceCount?: number;
}

// Financial Entities
export type IncomeCategory =
  | 'Offerings'
  | 'Tithe'
  | 'Donations'
  | 'Contributions'
  | 'Fundraising'
  | 'Event Income'
  | 'Project Funding'
  | 'Partnership'
  | 'Other Income';

export type ExpenseCategory =
  | 'Transport'
  | 'Venue & Logistics'
  | 'Equipment & Sound'
  | 'Printing & Publicity'
  | 'Media & Tech'
  | 'Outreach & Missions'
  | 'Welfare & Hospitality'
  | 'Refreshments'
  | 'Administration'
  | 'Honorarium'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'MTN Mobile Money'
  | 'Airtel Money'
  | 'Bank Transfer'
  | 'Cheque';

export type TransactionStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Disbursed'
  | 'Completed'
  | 'Cancelled';

export interface IncomeRecord {
  id: string; // TXN-INC-2026-XXXX
  date: string;
  amount: number; // UGX
  category: IncomeCategory;
  description: string;
  receivedBy: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  eventId?: string;
  projectId?: string;
  attachmentName?: string;
  status: 'Received' | 'Reconciled';
}

export interface ExpenseRecord {
  id: string; // TXN-EXP-2026-XXXX
  date: string;
  amount: number; // UGX
  category: ExpenseCategory;
  description: string;
  requestedBy: string;
  departmentId?: string;
  eventId?: string;
  projectId?: string;
  approvedBy?: string;
  approvalDate?: string;
  paidBy?: string;
  paymentMethod?: PaymentMethod;
  receiptAttachment?: string;
  status: TransactionStatus;
  rejectionReason?: string;
}

export interface BudgetItem {
  id: string;
  category: ExpenseCategory | string;
  name: string;
  allocatedAmount: number; // UGX
  spentAmount: number; // UGX
  notes?: string;
}

export interface Budget {
  id: string;
  title: string;
  type: 'Event' | 'Department' | 'Project' | 'Annual Fellowship';
  targetId?: string; // eventId, departmentId, or projectId
  totalAllocated: number;
  totalSpent: number;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Closed';
  items: BudgetItem[];
  createdBy: string;
}

export interface FinancialProject {
  id: string;
  title: string; // e.g. "Manifest Annual Conference 2026"
  description: string;
  coordinatorName: string;
  budgetTarget: number;
  totalIncome: number;
  totalExpenses: number;
  status: 'Planning' | 'Active' | 'Completed';
  startDate: string;
  endDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  module: 'Members' | 'Attendance' | 'Follow-Up' | 'Finance' | 'Events' | 'Homes' | 'Departments' | 'System';
  action: string;
  targetEntityId?: string;
  details: string;
  result: 'Success' | 'Warning' | 'Error';
}

export interface CommunicationMessage {
  id: string;
  timestamp: string;
  senderName: string;
  channel: 'SMS' | 'Email' | 'Announcement' | 'In-App';
  title: string;
  body: string;
  recipientGroup: 'All Members' | 'First Timers' | 'Home Group' | 'Department' | 'Leaders' | 'Absent Last Week';
  recipientCount: number;
  status: 'Sent' | 'Scheduled' | 'Draft';
  targetGroupId?: string;
}

export type ThemeKey = 
  | 'obsidian-kiu' 
  | 'midnight-navy' 
  | 'velvet-charcoal' 
  | 'emerald-sanctuary' 
  | 'royal-amethyst' 
  | 'clean-ivory';

export interface ThemeConfig {
  id: ThemeKey;
  name: string;
  subtitle: string;
  bgClass: string;
  cardBgClass: string;
  navBgClass: string;
  borderClass: string;
  accentColor: string;
  badgeClass: string;
  previewBg: string;
  previewAccent: string;
}
