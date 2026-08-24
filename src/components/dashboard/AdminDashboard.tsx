import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Users,
  HeartHandshake,
  TrendingUp,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenRegister?: () => void;
  onSelectMember?: (member: any) => void;
  onOpenFollowUp?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenRegister,
  onSelectMember,
  onOpenFollowUp,
}) => {
  const {
    members = [],
    followUps = [],
    auditLogs = [],
    setActiveTab,
  } = useFellowship();

  // Metrics Calculations
  const totalRegistered = members.length;
  const activeMembers = (members || []).filter((m) => m.status === 'Active').length;
  const firstTimers = (members || []).filter((m) => m.isFirstTimer || m.status === 'First Timer').length;
  const studentsCount = (members || []).filter((m) => m.studentInfo?.isStudent).length;

  const pendingFollowUps = (followUps || []).filter((f) => f.status === 'Pending' || f.status === 'Assigned');

  // Conversion rate
  const convertedFollowUps = (followUps || []).filter((f) => f.status === 'Joined' || f.status === 'Completed').length;
  const conversionRate = followUps.length > 0 ? Math.round((convertedFollowUps / followUps.length) * 100) : 0;

  // Recent members
  const recentMembers = [...members].reverse().slice(0, 5);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner / Welcome with Fast Registration Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                KIU Kansanga & Makindye Division Hub
              </span>
              <span className="text-xs text-slate-400">Kampala International University</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manifest Fellowship Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Serving KIU Scholars and Makindye Communities (Kansanga, Kabalagala, Ggaba, Bunga, Nsambya & Luwafu)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/25 transition-all active:scale-95 border border-orange-400/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register Member (&lt; 2 min)</span>
            </button>
            
            <button
              onClick={() => setActiveTab('members')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold text-xs transition-all active:scale-95"
            >
              <Users className="w-4 h-4 text-orange-400" />
              <span>Member Roster</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main People Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-400" />
            Fellowship Community & Soul Care Analytics
          </h2>
          <button
            onClick={() => setActiveTab('members')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
          >
            View Directory <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Total Registered */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Total Registered</span>
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-white">{totalRegistered}</div>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeMembers} active covenant members</span>
            </div>
          </div>

          {/* First Timers & Conversion */}
          <div
            onClick={() => setActiveTab('follow-up')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-orange-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">First-Timers</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-amber-300">{firstTimers}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="text-amber-400 font-semibold">{pendingFollowUps.length} need follow-up</span>
              <span className="text-slate-300 font-bold">{conversionRate}% integrated</span>
            </div>
          </div>

          {/* Students Distribution */}
          <div
            onClick={() => setActiveTab('reports')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">University Scholars</span>
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <BookOpen className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-white">{studentsCount}</div>
            <div className="mt-2 text-xs text-slate-400">
              {Math.round((studentsCount / (totalRegistered || 1)) * 100)}% campus student demographic
            </div>
          </div>

        </div>
      </div>

      {/* Operational Sections: First-Timer Pipeline & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* First-Timer Follow-Up Priority Queue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-slate-200">First-Timer Soul Care Pipeline</h3>
              </div>
              <button
                onClick={() => setActiveTab('follow-up')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
              >
                View Pipeline →
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {pendingFollowUps.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  onClick={() => setActiveTab('follow-up')}
                  className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{f.memberName}</div>
                    <div className="text-[11px] text-slate-400">{f.memberPhone} • Officer: {f.coordinatorName || 'Assigned'}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {f.status}
                  </span>
                </div>
              ))}

              {pendingFollowUps.length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs">
                  All first-timers have been followed up and connected!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('follow-up')}
            className="w-full mt-4 py-2.5 text-center text-xs text-slate-400 hover:text-orange-300 font-semibold border-t border-slate-800"
          >
            Open First-Timers & Pastoral Care Center →
          </button>
        </div>

        {/* Recent Member Enrollments */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-slate-200">Recent Member & Student Registrations</h3>
              </div>
              <button
                onClick={() => setActiveTab('members')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                All Members →
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {recentMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => onSelectMember && onSelectMember(member)}
                  className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{member.fullName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {member.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {member.studentInfo?.isStudent
                        ? `${member.studentInfo.course || 'KIU Scholar'} • Year ${member.studentInfo.yearOfStudy || 1}`
                        : 'Fellowship Member'}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    member.status === 'First Timer'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('members')}
            className="w-full mt-4 py-2.5 text-center text-xs text-slate-400 hover:text-sky-300 font-semibold border-t border-slate-800"
          >
            Manage Complete Fellowship Student Directory →
          </button>
        </div>

      </div>

      {/* Traceable Operational Activity Stream */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-sm text-white">Live Administrative Activity Trail</h3>
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
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
                <div className="p-1 rounded bg-slate-800 text-orange-400 mt-0.5">
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
