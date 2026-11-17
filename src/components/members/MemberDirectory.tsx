import React, { useState, useEffect } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Member, MemberPortfolio } from '../../types';
import { exportMembersToCsv } from '../../utils/exportUtils';
import { matchesPinSearch } from '../../utils/pinUtils';
import {
  Users,
  Search,
  Plus,
  Download,
  QrCode,
  Eye,
  MapPin,
  Trash2,
  AlertTriangle,
  Clock,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MemberDirectoryProps {
  onOpenRegister: () => void;
  onSelectMember: (member: Member) => void;
  onViewIdCard: (member: Member) => void;
}

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  onOpenRegister,
  onSelectMember,
  onViewIdCard,
}) => {
  const {
    members,
    homes = [],
    searchQuery,
    setSearchQuery,
    currentUserName,
    deleteMember,
    deleteMembers,
    run7DayAutoUpdate,
    updateMember,
    emptyModelForUse,
    loadDemoData,
    isAdminAuthenticated,
  } = useFellowship();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [portfolioFilter, setPortfolioFilter] = useState<string>('All');
  const [residenceFilter, setResidenceFilter] = useState<string>('All');

  // Pagination for 10,000+ mobile performance
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 40;

  // Deletion states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);

  const getMemberPortfolio = (member: Member): MemberPortfolio => {
    if (member.portfolio) return member.portfolio;
    if (member.status === 'Graduated') return 'Alumni';
    if (member.studentInfo?.isStudent) return 'Schools';
    return 'Community';
  };

  // Counts
  const schoolsCount = members.filter((m) => getMemberPortfolio(m) === 'Schools').length;
  const alumniCount = members.filter((m) => getMemberPortfolio(m) === 'Alumni').length;
  const communityCount = members.filter((m) => getMemberPortfolio(m) === 'Community').length;

  // Filter logic
  const filteredMembers = members.filter((member) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      member.fullName.toLowerCase().includes(q) ||
      matchesPinSearch(member.id, q) ||
      member.phone.toLowerCase().includes(q) ||
      (member.residence && member.residence.toLowerCase().includes(q)) ||
      (member.hostelOrResidence && member.hostelOrResidence.toLowerCase().includes(q)) ||
      (member.studentInfo?.campus && member.studentInfo.campus.toLowerCase().includes(q)) ||
      (member.studentInfo?.course && member.studentInfo.course.toLowerCase().includes(q)) ||
      (member.createdBy && member.createdBy.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    const mPortfolio = getMemberPortfolio(member);
    const matchesPortfolio = portfolioFilter === 'All' || mPortfolio === portfolioFilter;
    const matchesResidence =
      residenceFilter === 'All' ||
      member.residence === residenceFilter ||
      member.hostelOrResidence === residenceFilter;

    return matchesSearch && matchesStatus && matchesPortfolio && matchesResidence;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, portfolioFilter, residenceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const today = new Date().toISOString().split('T')[0];

  const exportMembersCsv = () => {
    exportMembersToCsv(filteredMembers, homes, [], `manifest_kiu_members_${today}.csv`);
  };

  const residences = Array.from(
    new Set(
      members
        .map((m) => m.hostelOrResidence || m.residence)
        .filter((r): r is string => Boolean(r && r.trim()))
    )
  ).slice(0, 30);

  // Selection toggle
  const toggleSelectMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedMembers.length && paginatedMembers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedMembers.map((m) => m.id)));
    }
  };

  const handleConfirmSingleDelete = () => {
    if (!memberToDelete) return;
    deleteMember(memberToDelete.id, `Deleted by ${currentUserName} from directory`);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(memberToDelete.id);
      return next;
    });
    setMemberToDelete(null);
  };

  const handleConfirmBatchDelete = () => {
    if (selectedIds.size === 0) return;
    const idsArray = Array.from(selectedIds);
    deleteMembers(idsArray, `Batch deleted by ${currentUserName}`);
    setSelectedIds(new Set());
    setIsBatchDeleteModalOpen(false);
  };

  const handleTriggerAutoUpdate = async () => {
    setIsAutoUpdating(true);
    try {
      await run7DayAutoUpdate(false);
    } finally {
      setIsAutoUpdating(false);
    }
  };

  const handleSimulate7DaysPassing = async () => {
    setIsAutoUpdating(true);
    try {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      members.forEach((m) => {
        if (m.status === 'First Timer' || m.isFirstTimer) {
          updateMember(m.id, {
            registrationDate: eightDaysAgo,
            dateOfFirstAttendance: eightDaysAgo,
          });
        }
      });
      setTimeout(async () => {
        await run7DayAutoUpdate(true);
        setIsAutoUpdating(false);
      }, 500);
    } catch {
      setIsAutoUpdating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            <span>Members Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
            {members.length.toLocaleString()} registered · Schools, Alumni &amp; Community
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdminAuthenticated && (
            <>
              {members.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowEmptyConfirm(true)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Empty</span>
                </button>
              )}

              <button
                type="button"
                onClick={exportMembersCsv}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>CSV</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onOpenRegister}
            className="hidden sm:flex min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register Member</span>
          </button>
        </div>
      </div>

      {/* 7-Day Auto-Update Engine (Admin Only) */}
      {isAdminAuthenticated && (
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">7-Day Lifecycle Auto-Update</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Transitions First Timers to Returning Visitors after 7 days and groups hostel members.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerAutoUpdate}
              disabled={isAutoUpdating}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isAutoUpdating ? 'Processing...' : 'Run 7-Day Update'}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulate7DaysPassing}
              disabled={isAutoUpdating}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate +7 Days</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Horizontal Mobile Portfolio Tabs */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search box */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, Saint 1, phone..."
              className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm sm:text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="First Timer">First Timer</option>
            <option value="Returning Visitor">Returning Visitor</option>
            <option value="Graduated">Graduated</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={residenceFilter}
            onChange={(e) => setResidenceFilter(e.target.value)}
            className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm sm:text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="All">All Hostels &amp; Residences</option>
            {residences.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Interactive Segmented Portfolio Filter Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {[
            { key: 'All', label: `All (${members.length})` },
            { key: 'Schools', label: `Schools (${schoolsCount})` },
            { key: 'Alumni', label: `Alumni (${alumniCount})` },
            { key: 'Community', label: `Community (${communityCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPortfolioFilter(tab.key)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                portfolioFilter === tab.key
                  ? 'bg-orange-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Selection Action Bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 bg-slate-900 border border-rose-500/50 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-200 font-semibold tabular-nums">
            {selectedIds.size} selected of {filteredMembers.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsBatchDeleteModalOpen(true)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.size})</span>
            </button>
          </div>
        </div>
      )}

      {/* Members List (Mobile Cards + Desktop Table) */}
      <div className="rounded-2xl bg-slate-900/95 border border-slate-800 overflow-hidden shadow-xl">
        {paginatedMembers.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-400">
                {members.length === 0 ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Users className="w-6 h-6 text-orange-400" />
                )}
              </div>
              <span className="text-white font-bold text-sm sm:text-base">
                {members.length === 0 ? 'Ready for Member Intake' : 'No Matching Member Records'}
              </span>
              <span className="text-xs text-slate-400 leading-relaxed">
                {members.length === 0
                  ? 'Register your first fellowship member to assign Saint 1 and generate their mobile QR pass.'
                  : 'No members matched your search or filter criteria.'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Register Member</span>
                </button>
                {members.length === 0 && (
                  <button
                    type="button"
                    onClick={loadDemoData}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Load Sample</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Interactive Tap Cards (md:hidden) */}
            <div className="md:hidden divide-y divide-slate-800/80">
              {paginatedMembers.map((member) => {
                const p = getMemberPortfolio(member);
                const isSelected = selectedIds.has(member.id);

                return (
                  <div
                    key={member.id}
                    className={`p-3.5 flex items-center gap-3 ${
                      isSelected ? 'bg-orange-500/10' : ''
                    }`}
                  >
                    <label className="min-h-[44px] min-w-[36px] flex items-center justify-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectMember(member.id)}
                        className="w-5 h-5 rounded text-orange-500 bg-slate-800 border-slate-600 focus:ring-0 cursor-pointer"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => onSelectMember(member)}
                      className="flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <div className="font-bold text-white text-sm truncate">
                        {member.fullName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                        <span className="font-mono font-bold text-amber-400">{member.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{member.hostelOrResidence || member.residence || member.phone}</span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onViewIdCard(member)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 cursor-pointer"
                        aria-label={`QR pass for ${member.fullName}`}
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setMemberToDelete(member)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                        aria-label={`Delete ${member.fullName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.size > 0 && selectedIds.size === paginatedMembers.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded text-orange-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Member Name &amp; Contact</th>
                    <th className="py-3 px-4">PIN</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Portfolio / Course</th>
                    <th className="py-3 px-4">Hostel / Residence</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {paginatedMembers.map((member) => {
                    const p = getMemberPortfolio(member);
                    const isSelected = selectedIds.has(member.id);

                    return (
                      <tr
                        key={member.id}
                        className={`hover:bg-slate-850/80 transition-colors ${
                          isSelected ? 'bg-orange-500/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectMember(member.id)}
                            className="w-4 h-4 rounded text-orange-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-orange-400 shrink-0">
                              {member.fullName.charAt(0)}
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => onSelectMember(member)}
                                className="font-bold text-white hover:text-orange-400 cursor-pointer text-left"
                              >
                                {member.fullName}
                              </button>
                              <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                                {member.phone} · {member.gender}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {member.id}
                        </td>

                        <td className="py-3 px-4 text-slate-200">{member.status}</td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{p}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {member.studentInfo?.course || member.studentInfo?.campus || 'Member'}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate max-w-[150px]">
                              {member.hostelOrResidence || member.residence || 'Kansanga'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onViewIdCard(member)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 transition-colors cursor-pointer"
                              title="View QR Pass"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onSelectMember(member)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setMemberToDelete(member)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="tabular-nums">
            Showing {paginatedMembers.length} of {filteredMembers.length.toLocaleString()}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-white tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Single Member Delete Bottom Sheet */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border-t sm:border border-rose-500/40 rounded-t-3xl sm:rounded-2xl p-5 pb-safe max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Member Record?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to delete <strong className="text-white">{memberToDelete.fullName}</strong> ({memberToDelete.id})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Delete Bottom Sheet */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border-t sm:border border-rose-500/50 rounded-t-3xl sm:rounded-2xl p-5 pb-safe max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete {selectedIds.size} Members?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  This permanently removes the selected {selectedIds.size} member records.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Model Confirmation Bottom Sheet */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border-t sm:border border-rose-500/50 rounded-t-3xl sm:rounded-2xl p-5 pb-safe max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Empty All Member Records?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  This clears all existing member records so operators can start fresh.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEmptyConfirm(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  emptyModelForUse();
                  setSelectedIds(new Set());
                  setShowEmptyConfirm(false);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Empty Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
