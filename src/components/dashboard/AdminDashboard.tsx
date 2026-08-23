import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Users,
  UserCheck,
  HeartHandshake,
  Calendar,
  Wallet,
  Home,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Plus,
  QrCode,
  DollarSign,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Award,
  BookOpen,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenRegister?: () => void;
  onOpenQuickCheckIn?: () => void;
  onOpenRecordIncome?: () => void;
  onOpenExpenseRequest?: () => void;
  onOpenCreateEvent?: () => void;
  onOpenCreateHome?: () => void;
  onOpenBroadcast?: () => void;
  onSelectMember?: (memberId: string) => void;
  onOpenAttendance?: () => void;
  onOpenFollowUp?: () => void;
  onOpenFinances?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenRegister,
  onOpenQuickCheckIn,
  onOpenRecordIncome,
  onOpenExpenseRequest,
  onOpenCreateEvent,
  onOpenCreateHome,
  onOpenBroadcast,
  onSelectMember,
  onOpenAttendance,
  onOpenFollowUp,
  onOpenFinances,
}) => {
  const {
    members,
    attendance,
    followUps,
    income,
    expenses,
    budgets,
    homes,
    departments,
    events,
    auditLogs,
    formatUGX,
    setActiveTab,
    activeEventId,
  } = useFellowship();

  // Metrics Calculations
  const totalRegistered = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const firstTimers = members.filter((m) => m.isFirstTimer || m.status === 'First Timer').length;
  const returningVisitors = members.filter((m) => m.status === 'Returning Visitor').length;
  const studentsCount = members.filter((m) => m.studentInfo?.isStudent).length;

  // Financial calculations
  const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses
    .filter((e) => e.status === 'Completed' || e.status === 'Disbursed')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIncome - totalExpenses;
  const pendingApprovals = expenses.filter((e) => e.status === 'Pending Approval');
  const pendingFollowUps = followUps.filter((f) => f.status === 'Pending' || f.status === 'Assigned');

  // Attendance metrics
  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];
  const activeEventAttendance = attendance.filter((a) => a.eventId === activeEvent?.id);

  // Conversion rate
  const convertedFollowUps = followUps.filter((f) => f.status === 'Joined' || f.status === 'Completed').length;
  const conversionRate = followUps.length > 0 ? Math.round((convertedFollowUps / followUps.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner / Welcome with Fast Registration Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Operational Backbone
              </span>
              <span className="text-xs text-slate-400">Uganda Campuses & Beyond</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manifest Fellowship Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              «Register → Identify → Connect → Engage → Follow Up → Serve → Account → Grow»
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 border border-indigo-400/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register Member (&lt; 2 min)</span>
            </button>
            
            <button
              onClick={onOpenQuickCheckIn}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold text-xs transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>Fast Check-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main People & Attendance Metric Cards (Section 8, 9, 27) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-400" />
            Fellowship Community & Demographics
          </h2>
          <button
            onClick={() => setActiveTab('members')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            View Directory <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Total Registered */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Total Registered</span>
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-white">{totalRegistered}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>{activeMembers} active members</span>
            </div>
          </div>

          {/* First Timers & Conversion */}
          <div
            onClick={() => setActiveTab('follow-up')}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm hover:border-indigo-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">First-Timers</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-300">{firstTimers}</div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>{pendingFollowUps.length} need follow-up</span>
              <span className="text-amber-400 font-bold">{conversionRate}% conversion</span>
            </div>
          </div>

          {/* Students Distribution */}
          <div
            onClick={() => setActiveTab('reports')}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Student Scholars</span>
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <BookOpen className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-white">{studentsCount}</div>
            <div className="mt-1 text-[11px] text-slate-400">
              {Math.round((studentsCount / (totalRegistered || 1)) * 100)}% of total fellowship
            </div>
          </div>

          {/* Active Gathering Attendance */}
          <div
            onClick={() => setActiveTab('attendance')}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Last Fellowship Attd.</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {activeEvent?.actualAttendanceCount || activeEventAttendance.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 truncate">
              {activeEvent?.name?.split('—')?.[0] || activeEvent?.name || 'Weekly Fellowship'}
            </div>
          </div>

        </div>
      </div>

      {/* Financial Health & Treasury Overview (Section 16, 20, 27) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Financial Accountability & Treasury Overview
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Traceable records, segregated approvals, budgets, and project accounts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenRecordIncome) onOpenRecordIncome();
                else setActiveTab('finances');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Record Income
            </button>
            <button
              onClick={() => {
                if (onOpenExpenseRequest) onOpenExpenseRequest();
                else setActiveTab('finances');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Expense Request
            </button>
            <button
              onClick={() => setActiveTab('finances')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Current Balance */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">Current Treasury Balance</div>
            <div className={`text-xl font-extrabold ${currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatUGX(currentBalance)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Reconciled Cash & Bank balances</div>
          </div>

          {/* Total Income */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">Total Income Recorded</div>
            <div className="text-xl font-extrabold text-cyan-400 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              {formatUGX(totalIncome)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{income.length} verified transactions</div>
          </div>

          {/* Total Expenses */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">Disbursed Expenditure</div>
            <div className="text-xl font-extrabold text-rose-400 flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" />
              {formatUGX(totalExpenses)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {expenses.filter((e) => e.status === 'Completed').length} receipts attached
            </div>
          </div>

          {/* Pending Approvals */}
          <div
            onClick={() => setActiveTab('finances')}
            className={`p-4 rounded-xl border cursor-pointer transition-colors ${
              pendingApprovals.length > 0
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-200 hover:bg-rose-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="text-xs font-medium mb-1">Pending Approvals</div>
            <div className="text-xl font-extrabold text-white">{pendingApprovals.length} Requests</div>
            <div className="text-[10px] text-slate-400 mt-1">
              {pendingApprovals.length > 0 ? 'Requires Finance Sign-off' : 'All requests processed'}
            </div>
          </div>

        </div>
      </div>

      {/* Operations Quick Grid: Homes, Departments, Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Homes Summary */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-200">Homes Fellowship ({homes.length})</h3>
              </div>
              <button
                onClick={onOpenCreateHome}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                + New Home
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {homes.slice(0, 4).map((home) => {
                const memberCount = members.filter((m) => m.homeId === home.id).length;
                return (
                  <div
                    key={home.id}
                    onClick={() => setActiveTab('homes')}
                    className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{home.name}</div>
                      <div className="text-[10px] text-slate-400">{home.zone} • {home.leaderName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {memberCount} members
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('homes')}
            className="w-full mt-3 py-2 text-center text-xs text-slate-400 hover:text-amber-300 font-semibold border-t border-slate-800"
          >
            Manage All {homes.length} Homes →
          </button>
        </div>

        {/* Ministries & Departments */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-200">Ministries & Departments ({departments.length})</h3>
              </div>
              <button
                onClick={() => setActiveTab('departments')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {departments.slice(0, 4).map((dept) => {
                const memberCount = members.filter((m) => m.departmentIds?.includes(dept.id)).length;
                return (
                  <div
                    key={dept.id}
                    onClick={() => setActiveTab('departments')}
                    className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{dept.name}</div>
                      <div className="text-[10px] text-slate-400">Head: {dept.leaderName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {memberCount} active
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('departments')}
            className="w-full mt-3 py-2 text-center text-xs text-slate-400 hover:text-cyan-300 font-semibold border-t border-slate-800"
          >
            Explore Department Operations →
          </button>
        </div>

        {/* Upcoming Events & Gatherings */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-200">Upcoming Gatherings</h3>
              </div>
              <button
                onClick={onOpenCreateEvent}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                + Create
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setActiveTab('events')}
                  className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {evt.date}
                    </span>
                    <span className="text-[10px] text-slate-400">{evt.startTime} - {evt.endTime}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-100 truncate">{evt.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{evt.location}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('events')}
            className="w-full mt-3 py-2 text-center text-xs text-slate-400 hover:text-emerald-300 font-semibold border-t border-slate-800"
          >
            Open Fellowship Calendar →
          </button>
        </div>

      </div>

      {/* Traceable Operational Activity Stream */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Live Administrative & Financial Activity Trail</h3>
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            Audit Log Center →
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto">
          {auditLogs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-slate-800 text-amber-400 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{log.action}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {log.module}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{log.details}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-medium">{log.userName}</div>
                <div className="text-[9px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
