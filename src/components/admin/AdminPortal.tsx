import React, { useState, useEffect } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Users,
  GraduationCap,
  Building,
  Briefcase,
  FileSpreadsheet,
  Download,
  Search,
  Trash2,
  AlertCircle,
  AlertTriangle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
} from 'lucide-react';
import { exportMembersToCsv } from '../../utils/exportUtils';
import { matchesPinSearch } from '../../utils/pinUtils';
import { Member } from '../../types';

export const AdminPortal: React.FC = () => {
  const {
    members = [],
    homes = [],
    deleteMember,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
  } = useFellowship();

  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Table selection, pagination and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState<'All' | 'Schools' | 'Alumni' | 'Community' | 'First Timers'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Pagination for high capacity (10,000+ members)
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Metrics Calculations
  const totalRegistered = members.length;
  const schoolsCount = members.filter(
    (m) => m.portfolio === 'Schools' || (!m.portfolio && m.studentInfo?.isStudent)
  ).length;
  const alumniCount = members.filter(
    (m) => m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated')
  ).length;
  const communityCount = members.filter(
    (m) => m.portfolio === 'Community' || (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated')
  ).length;
  const firstTimersCount = members.filter(
    (m) => m.status === 'First Timer' || m.isFirstTimer
  ).length;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMsg('Please enter the admin password');
      return;
    }
    const success = adminLogin(passwordInput);
    if (!success) {
      setErrorMsg('Access denied. Password is incorrect.');
      setPasswordInput('');
    } else {
      setErrorMsg('');
      setPasswordInput('');
    }
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.fullName.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      matchesPinSearch(m.id, q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.residence && m.residence.toLowerCase().includes(q)) ||
      (m.hostelOrResidence && m.hostelOrResidence.toLowerCase().includes(q)) ||
      (m.createdBy && m.createdBy.toLowerCase().includes(q));

    let matchesPortfolio = true;
    if (portfolioFilter === 'Schools') {
      matchesPortfolio = m.portfolio === 'Schools' || (!m.portfolio && !!m.studentInfo?.isStudent);
    } else if (portfolioFilter === 'Alumni') {
      matchesPortfolio = m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated');
    } else if (portfolioFilter === 'Community') {
      matchesPortfolio =
        m.portfolio === 'Community' ||
        (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated');
    } else if (portfolioFilter === 'First Timers') {
      matchesPortfolio = m.status === 'First Timer' || !!m.isFirstTimer;
    }

    return matchesSearch && matchesPortfolio;
  });

  useEffect(() => {
    setCurrentPage(1);
    setJumpPageInput('1');
  }, [searchQuery, portfolioFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredMembers.length);
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllCurrentPage = () => {
    const pageIds = paginatedMembers.map((m) => m.id);
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    if (selectedIds.size === filteredMembers.length && filteredMembers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map((m) => m.id)));
    }
  };

  const isPageAllSelected =
    paginatedMembers.length > 0 && paginatedMembers.every((m) => selectedIds.has(m.id));

  const todayStr = new Date().toISOString().split('T')[0];

  const handleDownloadFullCsv = () => {
    exportMembersToCsv(
      members,
      homes,
      [],
      `manifest_fellowship_full_${todayStr}_(${members.length}_records).csv`
    );
  };

  const handleDownloadSelectedCsv = () => {
    if (selectedIds.size === 0) return;
    const selectedMembers = members.filter((m) => selectedIds.has(m.id));
    exportMembersToCsv(
      selectedMembers,
      homes,
      [],
      `manifest_selected_${selectedMembers.length}_members_${todayStr}.csv`
    );
  };

  const handleDownloadPortfolioCsv = (portfolio: 'Schools' | 'Alumni' | 'Community') => {
    const list = members.filter((m) => {
      if (portfolio === 'Schools') return m.portfolio === 'Schools' || (!m.portfolio && m.studentInfo?.isStudent);
      if (portfolio === 'Alumni') return m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated');
      if (portfolio === 'Community') return m.portfolio === 'Community' || (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated');
      return false;
    });
    exportMembersToCsv(
      list,
      homes,
      [],
      `manifest_${portfolio.toLowerCase()}_${todayStr}_(${list.length}_records).csv`
    );
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      setJumpPageInput(String(currentPage));
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-6 sm:my-12 p-5 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xl shadow-orange-500/20">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <p className="text-xs font-semibold text-orange-400">Restricted Access</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              Admin Portal Security
            </h2>
            <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1">
              Enter the administrator password to access consolidated records and export CSV data.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Enter password..."
              className="w-full min-h-[48px] bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 stroke-[2.5]" />
            <span>Unlock Admin Portal</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Volunteers can register members on the Intake tab without admin login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      {/* Admin Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-emerald-400">Admin Authenticated</span>
            <span aria-hidden="true">·</span>
            <span>Capacity: 10,000+ Records</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-orange-400 shrink-0" />
            <span>Admin Consolidation &amp; Export</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consolidated fellowship registry with chunked CSV export for all registered members.
          </p>
        </div>

        <button
          type="button"
          onClick={adminLogout}
          className="min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Lock Portal</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">
            {totalRegistered.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Schools</span>
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-300 mt-1 tabular-nums">
            {schoolsCount.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Alumni</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300 mt-1 tabular-nums">
            {alumniCount.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Community</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1 tabular-nums">
            {communityCount.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>First Timers</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1 tabular-nums">
            {firstTimersCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* CSV Export Center */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-orange-400" />
              <span>CSV Export Center</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Download selected members, portfolios, or the entire dataset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadSelectedCsv}
              disabled={selectedIds.size === 0}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedIds.size > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export Selected ({selectedIds.size})</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadFullCsv}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Full CSV ({members.length.toLocaleString()})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => handleDownloadPortfolioCsv('Schools')}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-blue-300 font-bold border border-blue-500/30 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Schools CSV ({schoolsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadPortfolioCsv('Alumni')}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Building className="w-4 h-4" />
            <span>Alumni CSV ({alumniCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadPortfolioCsv('Community')}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Community CSV ({communityCount})</span>
          </button>
        </div>
      </div>

      {/* Consolidated Members List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-white text-sm tabular-nums">
            Registered Members ({filteredMembers.length.toLocaleString()})
          </h3>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Saint 1, name, hostel..."
                className="w-full sm:w-60 min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <select
                value={portfolioFilter}
                onChange={(e) => setPortfolioFilter(e.target.value as any)}
                className="min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm sm:text-xs text-orange-300 font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="All">All ({members.length})</option>
                <option value="Schools">Schools ({schoolsCount})</option>
                <option value="Alumni">Alumni ({alumniCount})</option>
                <option value="Community">Community ({communityCount})</option>
                <option value="First Timers">First Timers ({firstTimersCount})</option>
              </select>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm sm:text-xs text-slate-300 font-semibold focus:outline-none focus:border-orange-500"
              >
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
                <option value={250}>250 / page</option>
                <option value={500}>500 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selection Helpers */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAllCurrentPage}
              className="min-h-[36px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer underline"
            >
              {isPageAllSelected ? 'Deselect Page' : `Select Page (${paginatedMembers.length})`}
            </button>
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="min-h-[36px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer underline"
            >
              {selectedIds.size === filteredMembers.length && filteredMembers.length > 0
                ? 'Deselect All'
                : `Select All (${filteredMembers.length.toLocaleString()})`}
            </button>
          </div>

          <div className="text-xs text-slate-400 tabular-nums">
            {filteredMembers.length > 0 ? startIndex + 1 : 0}–{endIndex} of {filteredMembers.length.toLocaleString()}
          </div>
        </div>

        {/* Mobile Touch List (md:hidden) */}
        <div className="md:hidden rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          {paginatedMembers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {members.length === 0
                ? 'No members registered yet.'
                : 'No records matching search or filter.'}
            </div>
          ) : (
            paginatedMembers.map((m) => {
              const isChecked = selectedIds.has(m.id);
              const portfolio =
                m.portfolio || (m.studentInfo?.isStudent ? 'Schools' : m.status === 'Graduated' ? 'Alumni' : 'Community');

              return (
                <div
                  key={m.id}
                  className={`p-3 flex items-center justify-between gap-2.5 ${
                    isChecked ? 'bg-orange-500/10' : 'bg-slate-950/30'
                  }`}
                >
                  <label className="min-h-[44px] min-w-[40px] flex items-center justify-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelect(m.id)}
                      className="w-5 h-5 rounded bg-slate-900 border-slate-600 text-orange-500 focus:ring-0 cursor-pointer"
                    />
                  </label>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{m.fullName}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                      <span className="font-mono font-bold text-amber-400">{m.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{portfolio}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{m.hostelOrResidence || m.residence || m.phone}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMemberToDelete(m)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                    aria-label={`Delete ${m.fullName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isPageAllSelected}
                    onChange={handleSelectAllCurrentPage}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3">PIN</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Portfolio</th>
                <th className="p-3">Hostel / Residence</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 text-xs">
                    {members.length === 0
                      ? 'No members registered in system database yet.'
                      : 'No records matching search or portfolio filter.'}
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((m) => {
                  const isChecked = selectedIds.has(m.id);
                  const portfolio =
                    m.portfolio || (m.studentInfo?.isStudent ? 'Schools' : m.status === 'Graduated' ? 'Alumni' : 'Community');

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-850/80 transition-colors ${
                        isChecked ? 'bg-orange-500/10' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(m.id)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {m.id}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">{m.fullName}</div>
                        {m.gender && <div className="text-[11px] text-slate-400">{m.gender}</div>}
                      </td>
                      <td className="p-3 font-mono text-slate-300 tabular-nums">{m.phone}</td>
                      <td className="p-3 font-medium text-slate-200">{portfolio}</td>
                      <td className="p-3 text-slate-300">
                        {m.hostelOrResidence || m.residence || '—'}
                      </td>
                      <td className="p-3 text-slate-300">{m.status || 'Active'}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px] tabular-nums">
                        {m.registrationDate ? m.registrationDate.split('T')[0] : 'Today'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setMemberToDelete(m)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
          <div className="text-slate-400 tabular-nums">
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong> ({filteredMembers.length.toLocaleString()} total)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="min-h-[44px] px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <span className="px-3 py-2 font-bold text-white bg-slate-800 rounded-xl tabular-nums">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="min-h-[44px] px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>

            {totalPages > 3 && (
              <form onSubmit={handleJumpPage} className="hidden sm:flex items-center gap-1 ml-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  className="w-14 min-h-[44px] px-2 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Bottom Sheet */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border-t sm:border border-rose-500/40 rounded-t-3xl sm:rounded-2xl p-5 pb-safe max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remove Member?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Remove <strong className="text-white">{memberToDelete.fullName}</strong> ({memberToDelete.id}) from the database?
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
                onClick={() => {
                  deleteMember(memberToDelete.id, 'Admin deletion from portal');
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(memberToDelete.id);
                    return next;
                  });
                  setMemberToDelete(null);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
