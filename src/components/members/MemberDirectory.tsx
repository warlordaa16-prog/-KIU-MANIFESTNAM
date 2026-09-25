import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Member, MemberPortfolio } from '../../types';
import { exportMembersToCsv } from '../../utils/exportUtils';
import {
  Users,
  Search,
  Plus,
  Download,
  QrCode,
  Eye,
  MapPin,
  GraduationCap,
  Building,
  Briefcase,
  UserCheck,
  Sparkles,
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  Clock,
  RotateCcw,
  CheckCircle2,
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
    departments = [],
    operators = [],
    searchQuery,
    setSearchQuery,
    currentUserName,
    deleteMember,
    deleteMembers,
    run7DayAutoUpdate,
    autoUpdateConfig,
    updateMember,
    emptyModelForUse,
    loadDemoData,
    simulateConcurrentEntryDemo,
  } = useFellowship();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [portfolioFilter, setPortfolioFilter] = useState<string>('All');
  const [residenceFilter, setResidenceFilter] = useState<string>('All');
  const [operatorFilter, setOperatorFilter] = useState<string>('All');

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

  const getOperatorColor = (operatorName?: string) => {
    if (!operatorName) return 'bg-slate-600';
    const clean = operatorName.toLowerCase();
    if (clean.includes('anibal')) return 'bg-emerald-500';
    if (clean.includes('marcus')) return 'bg-cyan-500';
    if (clean.includes('ahebwa')) return 'bg-amber-500';
    if (clean.includes('grace')) return 'bg-rose-500';
    if (clean.includes('david')) return 'bg-violet-500';
    if (clean.includes('sarah')) return 'bg-blue-500';
    if (clean.includes('emmanuel')) return 'bg-orange-500';
    return 'bg-purple-500';
  };

  // Counts
  const schoolsCount = members.filter((m) => getMemberPortfolio(m) === 'Schools').length;
  const alumniCount = members.filter((m) => getMemberPortfolio(m) === 'Alumni').length;
  const communityCount = members.filter((m) => getMemberPortfolio(m) === 'Community').length;
  const firstTimersCount = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;

  // Filter logic
  const filteredMembers = members.filter((member) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      member.fullName.toLowerCase().includes(q) ||
      member.id.toLowerCase().includes(q) ||
      member.phone.toLowerCase().includes(q) ||
      (member.email && member.email.toLowerCase().includes(q)) ||
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

    const matchesOperator =
      operatorFilter === 'All' ||
      (member.createdBy && member.createdBy.toLowerCase() === operatorFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPortfolio && matchesResidence && matchesOperator;
  });

  const today = new Date().toISOString().split('T')[0];

  const exportMembersCsv = () => {
    exportMembersToCsv(filteredMembers, homes, departments, `manifest_kiu_members_${today}.csv`);
  };

  const residences = ['Nana Hostel', 'Olympia Hostel', 'Akamwesi Hostel', 'Ideal Hostel', 'Douglas Villa', 'Prestige Hostel', 'Kansanga Central', 'Bunga Residence'];
  const knownOperators = ['Anibal', 'Marcus', 'Ahebwa', 'Grace', 'David', 'Sarah', 'Emmanuel'];

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
    if (selectedIds.size === filteredMembers.length && filteredMembers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map((m) => m.id)));
    }
  };

  // Execute single delete
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

  // Execute batch delete
  const handleConfirmBatchDelete = () => {
    if (selectedIds.size === 0) return;
    const idsArray = Array.from(selectedIds);
    deleteMembers(idsArray, `Batch deleted by ${currentUserName}`);
    setSelectedIds(new Set());
    setIsBatchDeleteModalOpen(false);
  };

  // Manual Trigger 7-Day Auto Update
  const handleTriggerAutoUpdate = async () => {
    setIsAutoUpdating(true);
    try {
      await run7DayAutoUpdate(false);
    } finally {
      setIsAutoUpdating(false);
    }
  };

  // Simulation: Test 7 Days Passing by advancing dates
  const handleSimulate7DaysPassing = async () => {
    setIsAutoUpdating(true);
    try {
      // For any first timers or recent members, set registration date to 8 days ago
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      members.forEach((m) => {
        if (m.status === 'First Timer' || m.isFirstTimer) {
          updateMember(m.id, {
            registrationDate: eightDaysAgo,
            dateOfFirstAttendance: eightDaysAgo,
          });
        }
      });
      // Now run 7-day auto update to transition them
      setTimeout(async () => {
        await run7DayAutoUpdate(true);
        setIsAutoUpdating(false);
      }, 500);
    } catch {
      setIsAutoUpdating(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Members & Portfolios Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete database of {members.length} members across Schools, Alumni, and Community portfolios with multi-party entry & deletion access
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {members.length > 0 && (
            <button
              onClick={() => setShowEmptyConfirm(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Empty model to make ready for live data entry"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Empty Model</span>
            </button>
          )}

          {members.length === 0 && (
            <button
              onClick={loadDemoData}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Load 18 sample members"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Demo Data</span>
            </button>
          )}

          <button
            onClick={exportMembersCsv}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95 border border-orange-400/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Register New Member</span>
          </button>
        </div>
      </div>

      {/* 7-DAY AUTO-UPDATE ENGINE CONTROL CARD */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">7-Day Lifecycle Auto-Update Engine</span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Automatically transitions First Timers to <strong>Returning Visitors</strong> after 7 days and links unassigned hostel members to families.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTriggerAutoUpdate}
            disabled={isAutoUpdating}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Scan all members and run 7-day update"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isAutoUpdating ? 'Processing...' : '⚡ Run 7-Day Auto Update'}</span>
          </button>

          <button
            onClick={handleSimulate7DaysPassing}
            disabled={isAutoUpdating}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Fast-forward records by 7 days to simulate and observe the automatic transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>⏩ Simulate 7 Days (+7 Days Test)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, PIN, party..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Member Statuses</option>
              <option value="Active">Active</option>
              <option value="First Timer">First Timer</option>
              <option value="Returning Visitor">Returning Visitor</option>
              <option value="Graduated">Graduated</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Portfolio Filter */}
          <div>
            <select
              value={portfolioFilter}
              onChange={(e) => setPortfolioFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500 font-semibold"
            >
              <option value="All">All Portfolios ({members.length})</option>
              <option value="Schools">🎓 Schools ({schoolsCount})</option>
              <option value="Alumni">🏛️ Alumni ({alumniCount})</option>
              <option value="Community">🤝 Community ({communityCount})</option>
            </select>
          </div>

          {/* Residence / Hostel Filter */}
          <div>
            <select
              value={residenceFilter}
              onChange={(e) => setResidenceFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Hostels & Residences</option>
              {residences.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Operator Attribution Filter */}
          <div>
            <select
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              className="w-full bg-slate-800 border border-orange-500/40 rounded-lg px-2.5 py-2 text-orange-300 font-semibold focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Entry Parties (Collaborative)</option>
              {knownOperators.map((op) => {
                const count = members.filter((m) => m.createdBy?.toLowerCase() === op.toLowerCase()).length;
                return (
                  <option key={op} value={op}>
                    Entered by {op} ({count})
                  </option>
                );
              })}
            </select>
          </div>

        </div>

        {/* Quick Filter Tags with real counts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[11px]">
          <span className="text-slate-500 font-medium mr-1">Collaborative Parties:</span>
          
          <button
            onClick={() => {
              setOperatorFilter('All');
              setStatusFilter('All');
              setPortfolioFilter('All');
              setResidenceFilter('All');
              setSearchQuery('');
            }}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              operatorFilter === 'All' && statusFilter === 'All' && portfolioFilter === 'All'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Parties ({members.length})
          </button>

          {knownOperators.map((op) => {
            const count = members.filter((m) => m.createdBy?.toLowerCase() === op.toLowerCase()).length;
            const isSelected = operatorFilter.toLowerCase() === op.toLowerCase();
            return (
              <button
                key={op}
                onClick={() => setOperatorFilter(isSelected ? 'All' : op)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${getOperatorColor(op)}`} />
                <span>{op} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STICKY BATCH SELECTION & ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="p-3 bg-slate-900 border-2 border-rose-500/50 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              {selectedIds.size} Selected
            </span>
            <span className="text-slate-300">
              of {filteredMembers.length} member records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Deselect All
            </button>
            <button
              onClick={() => setIsBatchDeleteModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.size})</span>
            </button>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-850/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                {/* Checkbox column */}
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size > 0 && selectedIds.size === filteredMembers.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-orange-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                    title="Select/Deselect All"
                  />
                </th>
                <th className="py-3 px-4">Member Name & Contact</th>
                <th className="py-3 px-4">MAN ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Portfolio / Course</th>
                <th className="py-3 px-4">Hostel / Residence</th>
                <th className="py-3 px-4">Entered By</th>
                <th className="py-3 px-4 text-right">Delete & Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredMembers.map((member) => {
                const p = getMemberPortfolio(member);
                const op = member.createdBy || 'Anibal';
                const isSelected = selectedIds.has(member.id);

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-850/80 transition-colors group ${
                      isSelected ? 'bg-orange-500/10' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectMember(member.id)}
                        className="w-4 h-4 rounded text-orange-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-orange-400 shrink-0">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <div
                            onClick={() => onSelectMember(member)}
                            className="font-bold text-white hover:text-orange-400 cursor-pointer flex items-center gap-1.5"
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
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-400 font-bold text-[10px] border border-slate-700">
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
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* Portfolio & Details */}
                    <td className="py-3 px-4">
                      {p === 'Schools' ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Schools
                            </span>
                            <span className="font-medium text-slate-200 truncate max-w-[160px]">
                              {member.studentInfo?.course || 'University Student'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                            {member.studentInfo?.yearOfStudy ? `Yr ${member.studentInfo.yearOfStudy} • ` : ''}
                            {member.studentInfo?.campus?.split('(')[0]?.trim() || member.studentInfo?.campus || 'Campus'}
                          </div>
                        </div>
                      ) : p === 'Alumni' ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Alumni
                            </span>
                            <span className="font-medium text-purple-200 truncate max-w-[160px]">
                              {member.studentInfo?.course || 'Fellowship Graduate'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                            {member.notes || 'KIU Alumni Network'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Community
                            </span>
                            <span className="font-medium text-emerald-200 truncate max-w-[160px]">
                              {member.studentInfo?.course || 'Community Member'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                            {member.notes || 'Community Partner'}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Area / Residence */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[150px] font-medium" title={member.hostelOrResidence || member.residence}>
                          {member.hostelOrResidence || member.residence || 'Kansanga'}
                        </span>
                      </div>
                    </td>

                    {/* Party Attribution Column */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80">
                        <div className={`w-2 h-2 rounded-full ${getOperatorColor(op)} ring-1 ring-white/20`} />
                        <span className="font-bold text-white text-[11px]">{op}</span>
                      </div>
                      {member.updatedBy && member.updatedBy !== member.createdBy && (
                        <div className="text-[9px] text-slate-400 mt-0.5 pl-0.5 truncate max-w-[120px]">
                          Edited by {member.updatedBy}
                        </div>
                      )}
                    </td>

                    {/* Actions: View QR, Profile, and Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* QR Badge Card button */}
                        <button
                          onClick={() => onViewIdCard(member)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 transition-colors cursor-pointer"
                          title="View Digital Member Pass & QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* View Full Profile */}
                        <button
                          onClick={() => onSelectMember(member)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="View & Edit Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Direct Delete Access Button */}
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-md mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-orange-400">
                        {members.length === 0 ? <CheckCircle2 className="w-7 h-7 text-emerald-400" /> : <Users className="w-7 h-7 text-orange-400" />}
                      </div>
                      <span className="text-white font-extrabold text-base">
                        {members.length === 0 ? 'Model Emptied & Ready for Live Use' : 'No Matching Member Records'}
                      </span>
                      <span className="text-xs text-slate-300 leading-relaxed text-center">
                        {members.length === 0
                          ? 'The database is completely clear and ready for real member intake. Operators (Anibal, Marcus, Ahebwa, etc.) can enter data concurrently.'
                          : 'No members matched your search and filter criteria. Adjust your filters or register a new member.'}
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                        <button
                          onClick={onOpenRegister}
                          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Register New Member</span>
                        </button>

                        {members.length === 0 && (
                          <>
                            <button
                              onClick={simulateConcurrentEntryDemo}
                              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-orange-300 font-bold text-xs border border-orange-500/40 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Simulate 6-Party Entry</span>
                            </button>

                            <button
                              onClick={loadDemoData}
                              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Load Demo Dataset</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
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
            Full User Deletion Access Granted • 7-Day Auto-Update Active
          </span>
        </div>
      </div>

      {/* SINGLE MEMBER DELETE CONFIRMATION MODAL */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Member Record?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to delete <strong className="text-white">{memberToDelete.fullName}</strong> ({memberToDelete.id})? This will immediately remove this member from the database for all operators.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH DELETE CONFIRMATION MODAL */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Batch Delete {selectedIds.size} Member(s)?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  You are about to permanently delete <strong className="text-white">{selectedIds.size} selected member record(s)</strong>. This action will reflect in real time across all logged-in parties and offline queues.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY ALL MEMBERS CONFIRMATION MODAL */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Empty All Member Records?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to empty the member database? This clears all existing members so your operators (<strong>Anibal</strong>, <strong>Marcus</strong>, <strong>Ahebwa</strong>, etc.) can start entering actual live records.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowEmptyConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
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
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Empty All Records
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
