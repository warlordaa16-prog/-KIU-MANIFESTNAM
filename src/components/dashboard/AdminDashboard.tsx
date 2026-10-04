import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Users,
  Plus,
  GraduationCap,
  Building,
  Briefcase,
  Search,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { Member } from '../../types';
import { matchesPinSearch } from '../../utils/pinUtils';

interface AdminDashboardProps {
  onOpenRegister?: () => void;
  onSelectMember?: (member: Member) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenRegister,
  onSelectMember,
}) => {
  const {
    members = [],
    setActiveTab,
  } = useFellowship();

  const [searchFilter, setSearchFilter] = useState('');

  // Metrics Calculations
  const totalRegistered = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;

  const schoolsCount = members.filter(
    (m) => m.portfolio === 'Schools' || (!m.portfolio && m.studentInfo?.isStudent)
  ).length;
  const alumniCount = members.filter(
    (m) => m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated')
  ).length;
  const communityCount = members.filter(
    (m) => m.portfolio === 'Community' || (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated')
  ).length;

  // Filtered recent members
  const filteredRecent = members.filter((m) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      matchesPinSearch(m.id, q) ||
      (m.residence && m.residence.toLowerCase().includes(q)) ||
      (m.hostelOrResidence && m.hostelOrResidence.toLowerCase().includes(q))
    );
  }).slice(0, 10);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Clean Registration Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Membership Registration System
              </span>
              <span className="text-xs text-slate-400">KIU & Makindye Division</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manifest Fellowship Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Enter member records into the centralized system. Registered records are automatically saved and consolidated for administrative oversight.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all active:scale-95 border border-orange-400/40 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Register Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Metric Cards: Total + 3 Portfolios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Registered */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold">Total Registered</span>
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-white">{totalRegistered}</div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{activeMembers} active fellowship participants</span>
          </div>
        </div>

        {/* Schools Portfolio */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold">Schools Portfolio</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-blue-300">{schoolsCount}</div>
          <div className="mt-2 text-xs text-slate-400">
            University students & campus scholars
          </div>
        </div>

        {/* Alumni Portfolio */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold">Alumni Portfolio</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-purple-300">{alumniCount}</div>
          <div className="mt-2 text-xs text-slate-400">
            Fellowship graduates & alumni
          </div>
        </div>

        {/* Community Portfolio */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold">Community Portfolio</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-300">{communityCount}</div>
          <div className="mt-2 text-xs text-slate-400">
            Working professionals & residents
          </div>
        </div>

      </div>

      {/* Recent Entries Feed */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-orange-400" />
              <span>Recent Registrations in System</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Records entered by intake volunteers. Data is securely retained in the system database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Find recently entered member..."
                className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 w-48 sm:w-64"
              />
            </div>
            
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>New Entry</span>
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Member Name & PIN</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Portfolio</th>
                <th className="p-3">Hostel / Residence</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    {members.length === 0
                      ? 'No members registered yet. Click "Register Member" above to enter your first member.'
                      : 'No records matching search.'}
                  </td>
                </tr>
              ) : (
                filteredRecent.map((m) => {
                  const portfolio =
                    m.portfolio || (m.studentInfo?.isStudent ? 'Schools' : m.status === 'Graduated' ? 'Alumni' : 'Community');

                  return (
                    <tr
                      key={m.id}
                      onClick={() => onSelectMember && onSelectMember(m)}
                      className="hover:bg-slate-850/80 cursor-pointer transition-colors"
                    >
                      <td className="p-3">
                        <div className="font-extrabold text-white">{m.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.id}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{m.phone}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            portfolio === 'Schools'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : portfolio === 'Alumni'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {portfolio}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">
                        {m.residence || m.hostelOrResidence || '—'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {m.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {m.registrationDate ? m.registrationDate.split('T')[0] : 'Today'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-slate-400">
            Showing {filteredRecent.length} of {members.length} total registrations
          </span>
          <button
            onClick={onOpenRegister}
            className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>+ Enter Another Member</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
