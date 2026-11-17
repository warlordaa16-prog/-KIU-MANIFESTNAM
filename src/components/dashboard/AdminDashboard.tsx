import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Users,
  Plus,
  GraduationCap,
  Building,
  Briefcase,
  Search,
  TrendingUp,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { Member } from '../../types';
import { matchesPinSearch } from '../../utils/pinUtils';

interface AdminDashboardProps {
  onOpenRegister?: () => void;
  onSelectMember?: (member: Member) => void;
  onViewAllMembers?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenRegister,
  onSelectMember,
  onViewAllMembers,
}) => {
  const { members = [] } = useFellowship();
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
  const filteredRecent = members
    .filter((m) => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        m.fullName.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        matchesPinSearch(m.id, q) ||
        (m.residence && m.residence.toLowerCase().includes(q)) ||
        (m.hostelOrResidence && m.hostelOrResidence.toLowerCase().includes(q))
      );
    })
    .slice(0, 10);

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      {/* Mobile-First Hero Intake Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-slate-900/95 border border-slate-800 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-orange-400">Membership Intake</span>
              <span aria-hidden="true">·</span>
              <span>KIU &amp; Makindye Division</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manifest Fellowship Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Register new members in seconds with sequential Saint PINs and offline-ready mobile storage.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenRegister}
              className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Register Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Mobile / 4-Column Desktop KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Registered */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold truncate">Total Registered</span>
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {totalRegistered.toLocaleString()}
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate tabular-nums">{activeMembers} active</span>
          </div>
        </div>

        {/* Schools Portfolio */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold truncate">Schools</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-300 tabular-nums">
            {schoolsCount.toLocaleString()}
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 truncate">
            Campus students
          </div>
        </div>

        {/* Alumni Portfolio */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold truncate">Alumni</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 tabular-nums">
            {alumniCount.toLocaleString()}
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 truncate">
            Graduates &amp; alumni
          </div>
        </div>

        {/* Community Portfolio */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold truncate">Community</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 tabular-nums">
            {communityCount.toLocaleString()}
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 truncate">
            Residents &amp; working
          </div>
        </div>
      </div>

      {/* Recent Registrations Section */}
      <div className="rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-orange-400" />
              <span>Recent Registrations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap any member to inspect profile or open their QR pass.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Find name or Saint PIN..."
                className="w-full sm:w-60 min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={onOpenRegister}
              className="hidden sm:flex min-h-[44px] px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Entry</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredRecent.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-slate-400 text-xs sm:text-sm">
              {members.length === 0
                ? 'No members registered yet. Tap Register to add your first member.'
                : 'No records matching your search.'}
            </p>
            {members.length === 0 && (
              <button
                type="button"
                onClick={onOpenRegister}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Register First Member</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Tap-List Rows (md:hidden) */}
            <div className="md:hidden divide-y divide-slate-800/80">
              {filteredRecent.map((m) => {
                const portfolio =
                  m.portfolio ||
                  (m.studentInfo?.isStudent ? 'Schools' : m.status === 'Graduated' ? 'Alumni' : 'Community');

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectMember && onSelectMember(m)}
                    className="w-full min-h-[64px] px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-850/70 active:bg-slate-800/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-orange-400 text-sm shrink-0">
                        {m.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate">
                          {m.fullName}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                          <span className="font-mono font-bold text-amber-400">{m.id}</span>
                          <span aria-hidden="true">·</span>
                          <span>{portfolio}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{m.hostelOrResidence || m.residence || m.phone}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Desktop Table (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Member Name &amp; PIN</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Portfolio</th>
                    <th className="p-3.5">Hostel / Residence</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRecent.map((m) => {
                    const portfolio =
                      m.portfolio ||
                      (m.studentInfo?.isStudent ? 'Schools' : m.status === 'Graduated' ? 'Alumni' : 'Community');

                    return (
                      <tr
                        key={m.id}
                        onClick={() => onSelectMember && onSelectMember(m)}
                        className="hover:bg-slate-850/80 cursor-pointer transition-colors"
                      >
                        <td className="p-3.5">
                          <div className="font-extrabold text-white">{m.fullName}</div>
                          <div className="text-[11px] text-amber-400 font-mono font-semibold">{m.id}</div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300 tabular-nums">{m.phone}</td>
                        <td className="p-3.5 text-slate-200 font-medium">{portfolio}</td>
                        <td className="p-3.5 text-slate-300">
                          {m.residence || m.hostelOrResidence || '—'}
                        </td>
                        <td className="p-3.5 text-slate-300">{m.status || 'Active'}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px] tabular-nums">
                          {m.registrationDate ? m.registrationDate.split('T')[0] : 'Today'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer CTA */}
        <div className="px-4 py-3 sm:px-5 border-t border-slate-800 flex items-center justify-between text-xs bg-slate-950/40">
          <span className="text-slate-400 tabular-nums">
            Showing {filteredRecent.length} of {members.length.toLocaleString()}
          </span>
          {onViewAllMembers && members.length > 0 && (
            <button
              type="button"
              onClick={onViewAllMembers}
              className="min-h-[40px] px-2 text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Browse All Members</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
