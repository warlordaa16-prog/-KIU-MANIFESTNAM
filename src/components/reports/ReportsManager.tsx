import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  BarChart3,
  Users,
  Printer,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Building,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import {
  exportMembersToCsv,
  formatUGX,
} from '../../utils/exportUtils';
import { ReportPdfPreviewModal } from './ReportPdfPreviewModal';

export const ReportsManager: React.FC = () => {
  const {
    members = [],
    income = [],
    expenses = [],
    homes = [],
    departments = [],
    currentUserName,
  } = useFellowship();

  // Preview & Export Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'members' | 'financial' | 'executive'>('members');

  // Quick filter states for on-page quick export
  const [selectedMemberCategory, setSelectedMemberCategory] = useState<
    'all' | 'schools' | 'alumni' | 'community' | 'first-timers' | 'active'
  >('all');

  // Stats calculation
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const firstTimersCount = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;

  // Portfolio counts
  const schoolsCount = members.filter(
    (m) => m.portfolio === 'Schools' || (!m.portfolio && m.studentInfo?.isStudent)
  ).length;
  const alumniCount = members.filter(
    (m) => m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated')
  ).length;
  const communityCount = members.filter(
    (m) => m.portfolio === 'Community' || (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated')
  ).length;

  // Campus distribution breakdown
  const campusGroups = members.reduce<Record<string, number>>((acc, m) => {
    const campus = m.studentInfo?.campus || 'Non-Student / Working';
    acc[campus] = (acc[campus] || 0) + 1;
    return acc;
  }, {});

  // Quick Export Handlers
  const handleQuickExportMembersCsv = () => {
    let listToExport = members;
    if (selectedMemberCategory === 'schools') {
      listToExport = members.filter(
        (m) => m.portfolio === 'Schools' || (!m.portfolio && m.studentInfo?.isStudent)
      );
    } else if (selectedMemberCategory === 'alumni') {
      listToExport = members.filter(
        (m) => m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated')
      );
    } else if (selectedMemberCategory === 'community') {
      listToExport = members.filter(
        (m) => m.portfolio === 'Community' || (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated')
      );
    } else if (selectedMemberCategory === 'first-timers') {
      listToExport = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer);
    } else if (selectedMemberCategory === 'active') {
      listToExport = members.filter((m) => m.status === 'Active');
    }
    exportMembersToCsv(
      listToExport,
      homes,
      departments,
      `manifest_${selectedMemberCategory}_members_${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  const openInteractivePreview = (tab: 'members' | 'financial' | 'executive') => {
    setPreviewTab(tab);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Model Admin Operations
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Full System Access
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-1.5">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            Fellowship Reports & CSV Export Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Download member registries and CSV reports across Schools, Alumni, and Community portfolios.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openInteractivePreview('members')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>Interactive PDF Preview</span>
          </button>

          <button
            onClick={handleQuickExportMembersCsv}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Full CSV</span>
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS: Portfolios Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{totalMembers}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            {activeMembers} active covenant members
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Schools Portfolio</span>
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-300 mt-2">{schoolsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            University & campus scholars
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Alumni Portfolio</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-2">{alumniCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Fellowship graduates & alumni
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Community Portfolio</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-2">{communityCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Working professionals & residents
          </div>
        </div>
      </div>

      {/* DEDICATED EXPORT HUB CARD (CSV & PDF) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Membership Registry & Roster CSV Export</h3>
              <p className="text-xs text-slate-400">
                Filter by portfolio (Schools, Alumni, Community) or status, then download the formatted CSV file.
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {members.length} Members
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Select Portfolio / Category Scope:</span>
            <span className="text-[11px] text-orange-400 font-mono">
              {selectedMemberCategory === 'all' && `${members.length} Total`}
              {selectedMemberCategory === 'schools' && `${schoolsCount} Schools`}
              {selectedMemberCategory === 'alumni' && `${alumniCount} Alumni`}
              {selectedMemberCategory === 'community' && `${communityCount} Community`}
              {selectedMemberCategory === 'first-timers' && `${firstTimersCount} First-Timers`}
              {selectedMemberCategory === 'active' && `${activeMembers} Active`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              onClick={() => setSelectedMemberCategory('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                selectedMemberCategory === 'all'
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              All Members
            </button>

            <button
              onClick={() => setSelectedMemberCategory('schools')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                selectedMemberCategory === 'schools'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🎓 Schools
            </button>

            <button
              onClick={() => setSelectedMemberCategory('alumni')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                selectedMemberCategory === 'alumni'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🏛️ Alumni
            </button>

            <button
              onClick={() => setSelectedMemberCategory('community')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                selectedMemberCategory === 'community'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🤝 Community
            </button>

            <button
              onClick={() => setSelectedMemberCategory('first-timers')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                selectedMemberCategory === 'first-timers'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🌟 First-Timers
            </button>

            <button
              onClick={() => setSelectedMemberCategory('active')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                selectedMemberCategory === 'active'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Active Only
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={handleQuickExportMembersCsv}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download Selected CSV</span>
          </button>

          <button
            onClick={() => openInteractivePreview('members')}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Campus & Academic Distribution */}
      {Object.keys(campusGroups).length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Institutions & Faculty Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">{Object.keys(campusGroups).length} Institutions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(campusGroups).map(([campus, count]) => {
              const numCount = count as number;
              const percentage = Math.round((numCount / (totalMembers || 1)) * 100);

              return (
                <div
                  key={campus}
                  className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-200">{campus}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{percentage}% of fellowship body</div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-indigo-300">{numCount} Members</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive PDF / CSV Preview Modal */}
      <ReportPdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        initialTab={previewTab}
        members={members}
        income={income}
        expenses={expenses}
        homes={homes}
        departments={departments}
        currentUserName={currentUserName}
      />

    </div>
  );
};
