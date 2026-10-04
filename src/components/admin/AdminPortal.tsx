import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Shield,
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
  CheckCircle2,
  Trash2,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { exportMembersToCsv } from '../../utils/exportUtils';
import { Member, MemberPortfolio } from '../../types';
import { matchesPinSearch } from '../../utils/pinUtils';

export const AdminPortal: React.FC = () => {
  const {
    members = [],
    homes = [],
    departments = [],
    deleteMember,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
  } = useFellowship();

  // Password Input State for Lock Screen
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Table selection and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState<'All' | 'Schools' | 'Alumni' | 'Community' | 'First Timers'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Filtered members for admin table
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

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length && filteredMembers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map((m) => m.id)));
    }
  };

  const isAllSelected =
    filteredMembers.length > 0 && selectedIds.size === filteredMembers.length;

  // Export Handlers
  const todayStr = new Date().toISOString().split('T')[0];

  const handleDownloadFullCsv = () => {
    exportMembersToCsv(
      members,
      homes,
      departments,
      `manifest_fellowship_full_${todayStr}.csv`
    );
  };

  const handleDownloadSelectedCsv = () => {
    if (selectedIds.size === 0) return;
    const selectedMembers = members.filter((m) => selectedIds.has(m.id));
    exportMembersToCsv(
      selectedMembers,
      homes,
      departments,
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
      departments,
      `manifest_${portfolio.toLowerCase()}_${todayStr}.csv`
    );
  };

  // If NOT authenticated, show the secure password gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xl shadow-orange-500/20">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Restricted Area
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Admin Portal Security
            </h2>
            <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1">
              Enter the administrator password to access consolidated records and export all collective member CSV data.
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              autoFocus
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 stroke-[2.5]" />
            <span>Unlock Admin Portal</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Intake volunteers and registrars can enter members on the main dashboard without admin login.
          </p>
        </div>
      </div>
    );
  }

  // Once authenticated: Render the full Admin Portal
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Admin Header with Lock/Logout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Admin Portal Authenticated
            </span>
            <span className="text-xs text-slate-400">KIU & Makindye Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-orange-400" />
            <span>Admin Data Consolidation & Export Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consolidated registry of all members entered across all intake volunteers and desks. Admin exclusive rights to download collective and selected CSV datasets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={adminLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            title="Lock Admin Portal"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS: Specific 4 Portfolios + Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Total Number Registered */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">{totalRegistered}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">All active intake entries</div>
        </div>

        {/* School Portfolio */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>School Portfolio</span>
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-300 mt-1.5">{schoolsCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">University students</div>
        </div>

        {/* Alumni Portfolio */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Alumni Portfolio</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-1.5">{alumniCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Graduates & working alumni</div>
        </div>

        {/* Community Portfolio */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Community Portfolio</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1.5">{communityCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Community members</div>
        </div>

        {/* First Timers */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>First Timers</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1.5">{firstTimersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">New visitors registered</div>
        </div>

      </div>

      {/* CSV EXPORT ACTION CENTER (Download Selected & Download Full) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Admin CSV Export Center</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select individuals from the consolidated table below or download complete portfolios.
            </p>
          </div>

          {/* Core CSV Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download Selected CSV */}
            <button
              onClick={handleDownloadSelectedCsv}
              disabled={selectedIds.size === 0}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                selectedIds.size > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-orange-500/25 active:scale-95'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-50'
              }`}
              title="Download CSV file containing only the checked members"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Selected ({selectedIds.size}) CSV</span>
            </button>

            {/* Download Full CSV */}
            <button
              onClick={handleDownloadFullCsv}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              title="Download entire dataset of all registered members"
            >
              <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
              <span>Download Full Fellowship CSV ({members.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Portfolio Specific Download Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] mr-1">Direct Portfolio Downloads:</span>
          
          <button
            onClick={() => handleDownloadPortfolioCsv('Schools')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-blue-300 font-bold border border-blue-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Schools CSV ({schoolsCount})</span>
          </button>

          <button
            onClick={() => handleDownloadPortfolioCsv('Alumni')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Alumni CSV ({alumniCount})</span>
          </button>

          <button
            onClick={() => handleDownloadPortfolioCsv('Community')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Community CSV ({communityCount})</span>
          </button>
        </div>
      </div>

      {/* CONSOLIDATED MEMBERS TABLE (With Select Individual / Select All) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        
        {/* Table Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-white text-sm">
              Collective Registered Members Table ({filteredMembers.length})
            </h3>
            {selectedIds.size > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-bold">
                {selectedIds.size} selected for export
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member, phone, desk..."
                className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 w-48 sm:w-60"
              />
            </div>

            {/* Portfolio Filter */}
            <select
              value={portfolioFilter}
              onChange={(e) => setPortfolioFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-orange-300 font-bold focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Portfolios</option>
              <option value="Schools">Schools ({schoolsCount})</option>
              <option value="Alumni">Alumni ({alumniCount})</option>
              <option value="Community">Community ({communityCount})</option>
              <option value="First Timers">First Timers ({firstTimersCount})</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="cursor-pointer text-slate-400 hover:text-white"
                    title={isAllSelected ? "Deselect All" : "Select All"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3">Member Name & ID</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Portfolio</th>
                <th className="p-3">Hostel / Residence</th>
                <th className="p-3">Registered By</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                    No records found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const isChecked = selectedIds.has(m.id);
                  const portfolio = m.portfolio || (m.studentInfo?.isStudent ? 'Schools' : m.status === 'Graduated' ? 'Alumni' : 'Community');

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-850/60 transition-colors ${
                        isChecked ? 'bg-orange-500/10' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleSelect(m.id)}
                          className="cursor-pointer text-slate-400 hover:text-white"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-orange-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
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
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                          {m.createdBy || 'Registration Desk'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {m.registrationDate ? m.registrationDate.split('T')[0] : todayStr}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteMember(m.id, 'Admin deletion')}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Member (Admin Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Selection Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
          <div>
            Showing <strong>{filteredMembers.length}</strong> of <strong>{members.length}</strong> total records
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-bold">{selectedIds.size} members selected</span>
              <button
                onClick={handleDownloadSelectedCsv}
                className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3 stroke-[2.5]" />
                <span>Download Selected CSV</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
