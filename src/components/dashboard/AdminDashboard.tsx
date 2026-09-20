import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Users,
  Layers,
  TrendingUp,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Home,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenRegister?: () => void;
  onSelectMember?: (member: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenRegister,
  onSelectMember,
}) => {
  const {
    members = [],
    departments = [],
    homes = [],
    auditLogs = [],
    setActiveTab,
  } = useFellowship();

  // Metrics Calculations
  const totalRegistered = members.length;
  const activeMembers = (members || []).filter((m) => m.status === 'Active').length;
  const studentsCount = (members || []).filter((m) => m.studentInfo?.isStudent).length;
  const totalGroups = departments.length + homes.length;

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
              <span>Member Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main People Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-400" />
            Fellowship Community Analytics
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

          {/* Fellowship Groups & Ministry Units */}
          <div
            onClick={() => setActiveTab('groups')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-orange-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Fellowship Groups</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Layers className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-amber-300">{totalGroups}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="text-amber-400 font-semibold">{departments.length} departments</span>
              <span className="text-slate-300 font-bold">{homes.length} home cells</span>
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
              {Math.round((studentsCount / (totalRegistered || 1)) * 100)}% KIU student scholars
            </div>
          </div>

        </div>
      </div>

      {/* Operational Sections: Fellowship Groups & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Fellowship Groups Overview */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-slate-200">Fellowship Groups & Ministry Units</h3>
              </div>
              <button
                onClick={() => setActiveTab('groups')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
              >
                View Groups →
              </button>
            </div>

            {departments.length === 0 && homes.length === 0 ? (
              <div className="py-7 px-4 text-center rounded-xl bg-slate-950/60 border border-slate-800/80 my-2">
                <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">No fellowship groups yet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Define your custom Home Cells and Ministry Departments</p>
                <button
                  onClick={() => setActiveTab('groups')}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold hover:bg-orange-500/30 transition-colors"
                >
                  + Add First Group
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {departments.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setActiveTab('groups')}
                    className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{d.name}</div>
                      <div className="text-[11px] text-slate-400">Leader: {d.leaderName} • {d.meetingSchedule}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Department
                    </span>
                  </div>
                ))}

                {homes.slice(0, 2).map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setActiveTab('groups')}
                    className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{h.name}</div>
                      <div className="text-[11px] text-slate-400">{h.location} • {h.meetingDay}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Home Cell
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('groups')}
            className="w-full mt-4 py-2.5 text-center text-xs text-slate-400 hover:text-orange-300 font-semibold border-t border-slate-800"
          >
            Manage Departments & Home Fellowships →
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
              {recentMembers.map((member, idx) => (
                <div
                  key={`${member.id}-${idx}`}
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
          {auditLogs.slice(0, 6).map((log, idx) => (
            <div
              key={`${log.id}-${idx}`}
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
