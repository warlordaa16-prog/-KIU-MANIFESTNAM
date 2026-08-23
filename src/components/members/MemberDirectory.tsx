import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Member, MemberStatus } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  QrCode,
  Eye,
  Phone,
  Mail,
  GraduationCap,
  Home,
  Layers,
  Download,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface MemberDirectoryProps {
  onOpenRegister: () => void;
  onSelectMember: (member: Member) => void;
  onViewIdCard: (member: Member) => void;
  onQuickCheckInMember: (member: Member) => void;
}

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  onOpenRegister,
  onSelectMember,
  onViewIdCard,
  onQuickCheckInMember,
}) => {
  const {
    members,
    homes,
    departments,
    searchQuery,
    setSearchQuery,
    activeEventId,
    events,
    attendance,
  } = useFellowship();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [studentFilter, setStudentFilter] = useState<string>('All');
  const [homeFilter, setHomeFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  // Filter logic
  const filteredMembers = members.filter((member) => {
    // Search query
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      member.fullName.toLowerCase().includes(q) ||
      member.id.toLowerCase().includes(q) ||
      member.phone.toLowerCase().includes(q) ||
      (member.email && member.email.toLowerCase().includes(q)) ||
      (member.studentInfo?.registrationNumber &&
        member.studentInfo.registrationNumber.toLowerCase().includes(q)) ||
      (member.studentInfo?.course && member.studentInfo.course.toLowerCase().includes(q));

    // Status filter
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;

    // Student filter
    const matchesStudent =
      studentFilter === 'All' ||
      (studentFilter === 'Students' && member.studentInfo?.isStudent) ||
      (studentFilter === 'Non-Students' && !member.studentInfo?.isStudent);

    // Home filter
    const matchesHome = homeFilter === 'All' || member.homeId === homeFilter;

    // Department filter
    const matchesDept = deptFilter === 'All' || member.departmentIds?.includes(deptFilter);

    return matchesSearch && matchesStatus && matchesStudent && matchesHome && matchesDept;
  });

  const activeEvent = events.find((e) => e.id === activeEventId);
  const today = new Date().toISOString().split('T')[0];

  const exportMembersCsv = () => {
    const headers = [
      'Member ID',
      'Full Name',
      'Preferred Name',
      'Gender',
      'Phone',
      'Email',
      'Status',
      'Is Student',
      'Campus',
      'Course',
      'Year of Study',
      'Registration Number',
      'Home Group',
      'Registration Date',
    ];

    const rows = filteredMembers.map((m) => {
      const home = homes.find((h) => h.id === m.homeId);
      return [
        m.id,
        `"${m.fullName}"`,
        `"${m.preferredName || ''}"`,
        m.gender,
        m.phone,
        m.email,
        m.status,
        m.studentInfo?.isStudent ? 'Yes' : 'No',
        `"${m.studentInfo?.campus || ''}"`,
        `"${m.studentInfo?.course || ''}"`,
        m.studentInfo?.yearOfStudy || '',
        `"${m.studentInfo?.registrationNumber || ''}"`,
        `"${home ? home.name : ''}"`,
        m.registrationDate,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `manifest_members_export_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Members & Students Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete database of {members.length} fellowship souls • Fast identification & records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportMembersCsv}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Register Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          
          {/* Search box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, MAN-ID, course..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses ({members.length})</option>
              <option value="Active">Active Regulars</option>
              <option value="First Timer">🌟 First Timers</option>
              <option value="Returning Visitor">Returning Visitors</option>
              <option value="Transferred">Transferred</option>
              <option value="Graduated">Graduated Alumni</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Home Group Filter */}
          <div>
            <select
              value={homeFilter}
              onChange={(e) => setHomeFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Homes</option>
              {homes.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Ministries</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name?.split('&')?.[0] || d.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[11px]">
          <span className="text-slate-500 font-medium mr-1">Quick Views:</span>
          
          <button
            onClick={() => {
              setStatusFilter('All');
              setStudentFilter('All');
              setHomeFilter('All');
              setDeptFilter('All');
              setSearchQuery('');
            }}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              statusFilter === 'All' && studentFilter === 'All' && homeFilter === 'All' && deptFilter === 'All'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Members ({members.length})
          </button>

          <button
            onClick={() => setStatusFilter('First Timer')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              statusFilter === 'First Timer'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            🌟 First Timers ({members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length})
          </button>

          <button
            onClick={() => setStudentFilter('Students')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              studentFilter === 'Students'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🎓 University Students ({members.filter((m) => m.studentInfo?.isStudent).length})
          </button>
        </div>
      </div>

      {/* Members Table / List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member / Name</th>
                <th className="py-3 px-4">Identification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Student & Campus</th>
                <th className="py-3 px-4">Home Fellowship</th>
                <th className="py-3 px-4">Ministry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredMembers.map((member) => {
                const assignedHome = homes.find((h) => h.id === member.homeId);
                const assignedDepts = departments.filter((d) =>
                  member.departmentIds?.includes(d.id)
                );
                const isCheckedInToday = attendance.some(
                  (a) => a.memberId === member.id && a.date === today
                );

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-850/80 transition-colors group"
                  >
                    {/* Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-amber-300 shrink-0">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <div
                            onClick={() => onSelectMember(member)}
                            className="font-bold text-white hover:text-amber-400 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{member.fullName}</span>
                            {member.preferredName && (
                              <span className="text-[11px] text-slate-400 font-normal">
                                ({member.preferredName})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{member.phone}</span>
                            <span>•</span>
                            <span>{member.gender}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* MAN ID */}
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold text-[10px] border border-slate-700">
                        {member.id}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : member.status === 'First Timer'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : member.status === 'Returning Visitor'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* Academic Profile */}
                    <td className="py-3 px-4">
                      {member.studentInfo?.isStudent ? (
                        <div>
                          <div className="font-medium text-slate-200 truncate max-w-[170px]">
                            {member.studentInfo.course || 'Student'}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                            Yr {member.studentInfo?.yearOfStudy || 1} • {member.studentInfo?.campus?.split('-')?.[0] || member.studentInfo?.campus || 'Campus'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Professional / Alumni</span>
                      )}
                    </td>

                    {/* Home Fellowship */}
                    <td className="py-3 px-4">
                      {assignedHome ? (
                        <div className="font-semibold text-amber-300 truncate max-w-[130px]">
                          {assignedHome.name}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Unassigned</span>
                      )}
                    </td>

                    {/* Ministries */}
                    <td className="py-3 px-4">
                      {assignedDepts.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {assignedDepts.map((d) => (
                            <span
                              key={d.id}
                              className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 text-[10px]"
                            >
                              {d.code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Check-In quick button */}
                        {!isCheckedInToday ? (
                          <button
                            onClick={() => onQuickCheckInMember(member)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                            title="Check In to Active Gathering"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10">
                            Present
                          </span>
                        )}

                        {/* QR Badge Card button */}
                        <button
                          onClick={() => onViewIdCard(member)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
                          title="View Digital Member Pass & QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* View Full Profile */}
                        <button
                          onClick={() => onSelectMember(member)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No members match the current search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="p-3.5 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredMembers.length}</strong> of {members.length} registered members
          </span>
          <span className="text-[11px] text-slate-500">
            Manifest Fellowship Operational System
          </span>
        </div>
      </div>

    </div>
  );
};
