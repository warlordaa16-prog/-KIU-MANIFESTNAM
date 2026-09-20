import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  HeartHandshake,
  Download,
  Sparkles,
  BookOpen,
  GraduationCap,
  MapPin,
  DollarSign,
  Printer,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';
import {
  exportMembersToCsv,
  exportFinancialSummaryToCsv,
  exportIncomeLedgerToCsv,
  exportExpenseLedgerToCsv,
  printReportAsPdf,
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
  const [selectedMemberCategory, setSelectedMemberCategory] = useState<'all' | 'students' | 'first-timers' | 'active'>('all');
  const [selectedFinancialPeriod, setSelectedFinancialPeriod] = useState<'all' | 'recent'>('all');

  // Stats calculation
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const firstTimersCount = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;
  const studentsCount = members.filter((m) => m.studentInfo?.isStudent).length;

  // Financial calculations
  const totalIncomeAmount = income.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netReserve = totalIncomeAmount - totalExpenseAmount;

  // Campus distribution breakdown
  const campusGroups = members.reduce<Record<string, number>>((acc, m) => {
    const campus = m.studentInfo?.campus || 'Non-Student / Working';
    acc[campus] = (acc[campus] || 0) + 1;
    return acc;
  }, {});

  // Makindye division zones / residential breakdown
  const residenceGroups = members.reduce<Record<string, number>>((acc, m) => {
    const residence = m.residence || 'Kansanga';
    acc[residence] = (acc[residence] || 0) + 1;
    return acc;
  }, {});

  // Quick Export Handlers
  const handleQuickExportMembersCsv = () => {
    let listToExport = members;
    if (selectedMemberCategory === 'students') {
      listToExport = members.filter((m) => m.studentInfo?.isStudent);
    } else if (selectedMemberCategory === 'first-timers') {
      listToExport = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer);
    } else if (selectedMemberCategory === 'active') {
      listToExport = members.filter((m) => m.status === 'Active');
    }
    exportMembersToCsv(listToExport, homes, departments, `manifest_${selectedMemberCategory}_members_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleQuickPrintMembersPdf = () => {
    let listToExport = members;
    let label = 'Full Fellowship Membership Roster';
    if (selectedMemberCategory === 'students') {
      listToExport = members.filter((m) => m.studentInfo?.isStudent);
      label = 'KIU University Student Scholars Roster';
    } else if (selectedMemberCategory === 'first-timers') {
      listToExport = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer);
      label = 'First-Timer Souls & New Believers Registry';
    } else if (selectedMemberCategory === 'active') {
      listToExport = members.filter((m) => m.status === 'Active');
      label = 'Active Covenant Members Roster';
    }

    printReportAsPdf({
      title: label.toUpperCase(),
      subtitle: `Official Manifest Fellowship registry (${listToExport.length} verified records)`,
      category: 'members',
      generatedBy: currentUserName,
      metrics: [
        { label: 'Listed Members', value: `${listToExport.length} Souls`, hint: 'In this batch' },
        { label: 'Active Status', value: `${listToExport.filter((m) => m.status === 'Active').length}`, hint: 'Regular attendees' },
        { label: 'Campus Scholars', value: `${listToExport.filter((m) => m.studentInfo?.isStudent).length}`, hint: 'University students' },
      ],
      tables: [
        {
          heading: 'Membership Table',
          columns: ['Member ID', 'Full Name', 'Phone', 'Gender', 'Campus / Zone', 'Course / Faculty', 'Status'],
          rows: listToExport.map((m) => [
            m.id,
            m.fullName,
            m.phone,
            m.gender,
            m.studentInfo?.campus || m.residence || 'Kansanga',
            m.studentInfo?.course ? `${m.studentInfo.course} (${m.studentInfo.yearOfStudy ? 'Yr ' + m.studentInfo.yearOfStudy : ''})` : 'General Member',
            m.status,
          ]),
        },
      ],
    });
  };

  const handleQuickExportFinancialSummaryCsv = () => {
    exportFinancialSummaryToCsv(income, expenses);
  };

  const handleQuickPrintFinancialPdf = () => {
    printReportAsPdf({
      title: 'OFFICIAL TREASURY & FINANCIAL DISBURSEMENT STATEMENT',
      subtitle: `Reconciled financial statement for Manifest Fellowship K.I.U`,
      category: 'financial',
      generatedBy: currentUserName,
      metrics: [
        { label: 'Total Inflows', value: formatUGX(totalIncomeAmount), hint: `${income.length} receipts` },
        { label: 'Total Outflows', value: formatUGX(totalExpenseAmount), hint: `${expenses.length} vouchers` },
        { label: 'Net Liquid Reserve', value: formatUGX(netReserve), hint: netReserve >= 0 ? 'Operating Surplus' : 'Deficit' },
      ],
      tables: [
        {
          heading: 'Income Collections Summary',
          columns: ['Voucher ID', 'Date', 'Category', 'Description', 'Method', 'Amount (UGX)', 'Status'],
          rows: income.map((i) => [
            i.id,
            i.date,
            i.category,
            i.description,
            i.paymentMethod,
            formatUGX(i.amount),
            i.status,
          ]),
        },
        {
          heading: 'Disbursements & Expense Vouchers',
          columns: ['Voucher ID', 'Date', 'Category', 'Description', 'Requested By', 'Amount (UGX)', 'Status'],
          rows: expenses.map((e) => [
            e.id,
            e.date,
            e.category,
            e.description,
            e.requestedBy,
            formatUGX(e.amount),
            e.status,
          ]),
        },
      ],
    });
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
              Executive Soul & Treasury Analytics
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Certified Audit Ready
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-1.5">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            Fellowship Reports & Export Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Download member registries and financial balance sheets for offline review, leadership meetings, and pastoral audits.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openInteractivePreview('executive')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all active:scale-95 shadow-sm"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>Interactive PDF Preview</span>
          </button>

          <button
            onClick={handleQuickPrintMembersPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Souls Registered</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">{totalMembers} Souls</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="font-bold text-emerald-400">{activeMembers} Active</span> • {firstTimersCount} First-Timers
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>KIU Student Scholars</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-2">
            {Math.round((studentsCount / (totalMembers || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {studentsCount} university students enrolled
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Fellowship Groups & Cells</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{departments.length + homes.length} Groups</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {departments.length} departments • {homes.length} home cells
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Net Treasury Reserve</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-xl sm:text-2xl font-black mt-2 ${netReserve >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatUGX(netReserve)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {income.length} inflows • {expenses.length} disbursements
          </div>
        </div>
      </div>

      {/* DEDICATED EXPORT HUB CARDS (CSV & PDF) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Export Card 1: Member Roster Hub */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Membership Registry & Roster Export</h3>
                <p className="text-xs text-slate-400">Download complete profiles, phone directories, and student courses</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {members.length} Members
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Select Category Scope:</span>
              <span className="text-[11px] text-orange-400 font-mono">
                {selectedMemberCategory === 'all' && `${members.length} Total`}
                {selectedMemberCategory === 'students' && `${studentsCount} Students`}
                {selectedMemberCategory === 'first-timers' && `${firstTimersCount} First-Timers`}
                {selectedMemberCategory === 'active' && `${activeMembers} Active`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedMemberCategory('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedMemberCategory === 'all'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                All Members
              </button>

              <button
                onClick={() => setSelectedMemberCategory('students')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedMemberCategory === 'students'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Students Only
              </button>

              <button
                onClick={() => setSelectedMemberCategory('first-timers')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedMemberCategory === 'first-timers'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                First-Timers
              </button>

              <button
                onClick={() => setSelectedMemberCategory('active')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedMemberCategory === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
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
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Download CSV File</span>
            </button>

            <button
              onClick={() => openInteractivePreview('members')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-md shadow-orange-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Export Card 2: Financial Summary & Treasury Hub */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Treasury Statement & Ledgers Export</h3>
                <p className="text-xs text-slate-400">Export tithes, offerings, campus mission vouchers, and balances</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              {formatUGX(netReserve)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" /> Total Inflows
              </div>
              <div className="text-sm font-bold text-white mt-0.5">{formatUGX(totalIncomeAmount)}</div>
              <div className="text-[10px] text-slate-400">{income.length} verified collections</div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Total Outflows
              </div>
              <div className="text-sm font-bold text-white mt-0.5">{formatUGX(totalExpenseAmount)}</div>
              <div className="text-[10px] text-slate-400">{expenses.length} approved vouchers</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={handleQuickExportFinancialSummaryCsv}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Download Ledger CSV</span>
            </button>

            <button
              onClick={() => openInteractivePreview('financial')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-md shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print Financial PDF</span>
            </button>
          </div>
        </div>

      </div>

      {/* Zonal & Academic Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Card 1: Makindye Division Residential Geography */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Makindye Division & Kansanga Geographic Reach
            </h3>
            <span className="text-xs text-slate-400 font-mono">{Object.keys(residenceGroups).length} Zones</span>
          </div>

          <div className="space-y-3">
            {Object.entries(residenceGroups).map(([zone, count]) => {
              const numCount = count as number;
              const percentage = Math.round((numCount / (totalMembers || 1)) * 100);

              return (
                <div key={zone} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{zone}</span>
                    <span className="font-semibold text-amber-300">{numCount} Souls ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      style={{ width: `${Math.min(percentage * 2.5, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Campus & Academic Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Campus & Academic Faculty Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">{Object.keys(campusGroups).length} Sectors</span>
          </div>

          <div className="space-y-2.5">
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

      </div>

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
