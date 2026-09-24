import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Users,
  Layers,
  TrendingUp,
  Plus,
  ChevronRight,
  GraduationCap,
  Building,
  Briefcase,
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
    setActiveTab,
  } = useFellowship();

  // Metrics Calculations
  const totalRegistered = members.length;
  const activeMembers = (members || []).filter((m) => m.status === 'Active').length;

  const schoolsCount = (members || []).filter(
    (m) => m.portfolio === 'Schools' || (!m.portfolio && m.studentInfo?.isStudent)
  ).length;
  const alumniCount = (members || []).filter(
    (m) => m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated')
  ).length;
  const communityCount = (members || []).filter(
    (m) => m.portfolio === 'Community' || (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated')
  ).length;

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
                Model Admin Operations Hub
              </span>
              <span className="text-xs text-slate-400">KIU & Makindye Division</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manifest Fellowship Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Unified administration across <strong>Schools</strong>, <strong>Alumni</strong>, and <strong>Community</strong> portfolios.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/25 transition-all active:scale-95 border border-orange-400/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register Member</span>
            </button>
            
            <button
              onClick={() => setActiveTab('members')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-orange-400" />
              <span>Member Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Metric Cards: Total + 3 Portfolios */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-400" />
            Fellowship Portfolios & Community Analytics
          </h2>
          <button
            onClick={() => setActiveTab('members')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            View Directory <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
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
              <span>{activeMembers} active members</span>
            </div>
          </div>

          {/* Schools Portfolio */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Schools Portfolio</span>
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <GraduationCap className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-blue-300">{schoolsCount}</div>
            <div className="mt-2 text-xs text-slate-400">
              University students & scholars
            </div>
          </div>

          {/* Alumni Portfolio */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-purple-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Alumni Portfolio</span>
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Building className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-purple-300">{alumniCount}</div>
            <div className="mt-2 text-xs text-slate-400">
              Fellowship graduates & alumni
            </div>
          </div>

          {/* Community Portfolio */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Community Portfolio</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Briefcase className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-300">{communityCount}</div>
            <div className="mt-2 text-xs text-slate-400">
              Working professionals & residents
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
                <h3 className="font-bold text-sm text-slate-200">Fellowship Groups & Hostel Families</h3>
              </div>
              <button
                onClick={() => setActiveTab('groups')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                View Groups →
              </button>
            </div>

            {homes.length === 0 && departments.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No fellowship groups registered yet. Create hostel families or ministries in Fellowship Groups.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {homes.map((home) => (
                  <div
                    key={home.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{home.name}</span>
                        {home.meetingLocation && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({home.meetingLocation})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Leader: <strong className="text-slate-200">{home.leaderName || 'To be assigned'}</strong>
                        {home.leaderPhone ? ` • ${home.leaderPhone}` : ''}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-300 text-[10px] font-bold">
                      {home.memberIds?.length || 0} members
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('groups')}
            className="w-full mt-4 py-2.5 text-center text-xs text-slate-400 hover:text-orange-300 font-semibold border-t border-slate-800 cursor-pointer"
          >
            Manage Hostel Families & Fellowship Groups →
          </button>
        </div>

        {/* Recent Member Enrollments */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-slate-200">Recent Registrations Across Portfolios</h3>
              </div>
              <button
                onClick={() => setActiveTab('members')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                All Members →
              </button>
            </div>

            {recentMembers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No members registered yet. Click &quot;Register Member&quot; to begin.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {recentMembers.map((member, idx) => {
                  const p = member.portfolio || (member.status === 'Graduated' ? 'Alumni' : member.studentInfo?.isStudent ? 'Schools' : 'Community');
                  return (
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
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            p === 'Schools'
                              ? 'bg-blue-500/20 text-blue-300'
                              : p === 'Alumni'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {p}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {member.hostelOrResidence || member.residence || 'Kansanga'}
                          {member.studentInfo?.course ? ` • ${member.studentInfo.course}` : ''}
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
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('members')}
            className="w-full mt-4 py-2.5 text-center text-xs text-slate-400 hover:text-sky-300 font-semibold border-t border-slate-800 cursor-pointer"
          >
            Manage Member Directory & Download CSV →
          </button>
        </div>

      </div>

    </div>
  );
};
