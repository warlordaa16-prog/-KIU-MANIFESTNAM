import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  Users,
  DollarSign,
  HeartHandshake,
  CheckCircle2,
  Filter,
  Calendar,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Member, IncomeRecord, ExpenseRecord, HomeGroup, Department } from '../../types';
import {
  exportMembersToCsv,
  exportFinancialSummaryToCsv,
  exportIncomeLedgerToCsv,
  exportExpenseLedgerToCsv,
  printReportAsPdf,
  formatUGX,
  PrintableReportConfig,
} from '../../utils/exportUtils';

interface ReportPdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'members' | 'financial' | 'executive';
  members: Member[];
  income: IncomeRecord[];
  expenses: ExpenseRecord[];
  homes: HomeGroup[];
  departments: Department[];
  currentUserName: string;
}

export const ReportPdfPreviewModal: React.FC<ReportPdfPreviewModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'members',
  members,
  income,
  expenses,
  homes,
  departments,
  currentUserName,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'members' | 'financial' | 'executive'>(initialTab);

  // Member Filter states
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('All');
  const [memberCampusFilter, setMemberCampusFilter] = useState<string>('All');
  const [memberStudentOnly, setMemberStudentOnly] = useState<boolean>(false);

  // Financial Filter states
  const [financialCategoryFilter, setFinancialCategoryFilter] = useState<string>('All');

  if (!isOpen) return null;

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (memberStatusFilter !== 'All' && m.status !== memberStatusFilter) return false;
    if (memberCampusFilter !== 'All' && (m.studentInfo?.campus || 'Non-Student / Working') !== memberCampusFilter) return false;
    if (memberStudentOnly && !m.studentInfo?.isStudent) return false;
    return true;
  });

  // Available campuses from members
  const availableCampuses = Array.from(
    new Set(
      members
        .map((m) => m.studentInfo?.campus)
        .filter((c): c is string => Boolean(c))
    )
  );

  // Filtered financial data
  const filteredIncome = income.filter((i) => {
    if (financialCategoryFilter !== 'All' && i.category !== financialCategoryFilter) return false;
    return true;
  });
  const filteredExpenses = expenses.filter((e) => {
    if (financialCategoryFilter !== 'All' && e.category !== financialCategoryFilter) return false;
    return true;
  });

  // Totals for financials
  const totalIncome = filteredIncome.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Homes and departments mappings
  const homeMap = new Map(homes.map((h) => [h.id, h.name]));
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  // Campus and Residence groups for executive calculations
  const campusDistribution: Record<string, number> = {};
  members.forEach((m) => {
    const c = m.studentInfo?.campus || 'Non-Student / Working';
    campusDistribution[c] = (campusDistribution[c] || 0) + 1;
  });

  const residenceDistribution: Record<string, number> = {};
  members.forEach((m) => {
    const r = m.residence || 'Kansanga';
    residenceDistribution[r] = (residenceDistribution[r] || 0) + 1;
  });

  // Build report config for PDF printing
  const getPrintableConfig = (): PrintableReportConfig => {
    if (activeReportTab === 'members') {
      return {
        title: 'OFFICIAL FELLOWSHIP MEMBERSHIP DIRECTORY & ROSTER',
        subtitle: `Filtered report showing ${filteredMembers.length} registered souls (Status: ${memberStatusFilter}, Campus: ${memberCampusFilter})`,
        category: 'members',
        generatedBy: currentUserName,
        metrics: [
          { label: 'Total In Roster', value: `${filteredMembers.length} Souls`, hint: 'Matched by criteria' },
          { label: 'Active Covenant', value: `${filteredMembers.filter((m) => m.status === 'Active').length}`, hint: 'Regular attendees' },
          { label: 'KIU Scholars', value: `${filteredMembers.filter((m) => m.studentInfo?.isStudent).length}`, hint: 'University students' },
          { label: 'First-Timers', value: `${filteredMembers.filter((m) => m.isFirstTimer || m.status === 'First Timer').length}`, hint: 'Recently welcomed' },
        ],
        tables: [
          {
            heading: 'Membership Registry',
            columns: ['ID Number', 'Full Name', 'Phone', 'Gender', 'Campus / Residence', 'Course / Faculty', 'Status'],
            rows: filteredMembers.map((m) => [
              m.id,
              m.fullName,
              m.phone,
              m.gender,
              m.studentInfo?.campus || m.residence || 'Kansanga',
              m.studentInfo?.course ? `${m.studentInfo.course} (${m.studentInfo.yearOfStudy ? 'Yr ' + m.studentInfo.yearOfStudy : ''})` : 'Professional / Member',
              m.status,
            ]),
          },
        ],
      };
    }

    if (activeReportTab === 'financial') {
      return {
        title: 'OFFICIAL TREASURY & FINANCIAL DISBURSEMENT STATEMENT',
        subtitle: `Executive summary statement of fellowship income collections and approved disbursements`,
        category: 'financial',
        generatedBy: currentUserName,
        metrics: [
          { label: 'Total Inflow (Income)', value: formatUGX(totalIncome), hint: `${filteredIncome.length} recorded receipts` },
          { label: 'Total Outflow (Expenses)', value: formatUGX(totalExpenses), hint: `${filteredExpenses.length} approved vouchers` },
          { label: 'Net Treasury Reserve', value: formatUGX(netBalance), hint: netBalance >= 0 ? 'Surplus Balance' : 'Deficit Position' },
        ],
        tables: [
          {
            heading: 'Income Inflows Ledger',
            columns: ['Voucher ID', 'Date', 'Category', 'Description', 'Method', 'Amount (UGX)', 'Status'],
            rows: filteredIncome.map((i) => [
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
            heading: 'Expense Disbursements Ledger',
            columns: ['Voucher ID', 'Date', 'Category', 'Description', 'Requested By', 'Amount (UGX)', 'Status'],
            rows: filteredExpenses.map((e) => [
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
      };
    }

    // Executive Summary
    return {
      title: 'EXECUTIVE FELLOWSHIP ANALYTICS & SOUL AUDIT DOSSIER',
      subtitle: `Holistic executive digest of spiritual membership, student academic reach, and financial health`,
      category: 'executive',
      generatedBy: currentUserName,
      metrics: [
        { label: 'Total Souls Registered', value: `${members.length}`, hint: 'Total database count' },
        { label: 'KIU Student Scholars', value: `${members.filter((m) => m.studentInfo?.isStudent).length}`, hint: `${Math.round((members.filter((m) => m.studentInfo?.isStudent).length / (members.length || 1)) * 100)}% of fellowship` },
        { label: 'Fellowship Groups & Cells', value: `${departments.length + homes.length}`, hint: `${departments.length} depts • ${homes.length} cells` },
        { label: 'Net Treasury Reserve', value: formatUGX(income.reduce((s, i) => s + i.amount, 0) - expenses.reduce((s, e) => s + e.amount, 0)), hint: 'Current liquid balance' },
      ],
      tables: [
        {
          heading: 'Academic & Campus Distribution',
          columns: ['Sector / Campus', 'Soul Count', 'Percentage'],
          rows: Object.entries(campusDistribution).map(([camp, cnt]): (string | number)[] => [
            camp,
            cnt,
            `${Math.round((cnt / (members.length || 1)) * 100)}%`,
          ]),
        },
        {
          heading: 'Residential Zonal Reach (Makindye Division)',
          columns: ['Residential Area', 'Members', 'Percentage'],
          rows: Object.entries(residenceDistribution).map(([res, cnt]): (string | number)[] => [
            res,
            cnt,
            `${Math.round((cnt / (members.length || 1)) * 100)}%`,
          ]),
        },
      ],
    };
  };

  const handlePrintPdf = () => {
    const config = getPrintableConfig();
    printReportAsPdf(config);
  };

  const handleCsvExport = () => {
    if (activeReportTab === 'members') {
      exportMembersToCsv(filteredMembers, homes, departments);
    } else if (activeReportTab === 'financial') {
      exportFinancialSummaryToCsv(filteredIncome, filteredExpenses);
    } else {
      exportMembersToCsv(members, homes, departments, `manifest_executive_members_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Executive Report & Export Center</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PDF & CSV Offline Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Manifest Fellowship documentation with printable letterhead and verified audit records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveReportTab('members')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeReportTab === 'members'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Member Lists</span>
            </button>

            <button
              onClick={() => setActiveReportTab('financial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeReportTab === 'financial'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Financial Summaries</span>
            </button>

            <button
              onClick={() => setActiveReportTab('executive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeReportTab === 'executive'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Brief</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCsvExport}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Download Excel / CSV format"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-orange-500/20"
              title="Save as PDF / Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar for the active tab */}
        {activeReportTab === 'members' && (
          <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-orange-400" /> Filter Roster:
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Status:</span>
              <select
                value={memberStatusFilter}
                onChange={(e) => setMemberStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
              >
                <option value="All">All Statuses ({members.length})</option>
                <option value="Active">Active Covenant ({members.filter((m) => m.status === 'Active').length})</option>
                <option value="First Timer">First Timer ({members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length})</option>
                <option value="Returning Visitor">Returning Visitor</option>
                <option value="Graduated">Graduated Alumni</option>
                <option value="Inactive">Inactive / Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Campus:</span>
              <select
                value={memberCampusFilter}
                onChange={(e) => setMemberCampusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none max-w-[200px]"
              >
                <option value="All">All Campuses / Universities</option>
                {availableCampuses.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp}
                  </option>
                ))}
                <option value="Non-Student / Working">Non-Student / Working</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 ml-auto">
              <input
                type="checkbox"
                checked={memberStudentOnly}
                onChange={(e) => setMemberStudentOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500"
              />
              <span>Students Only</span>
            </label>
          </div>
        )}

        {activeReportTab === 'financial' && (
          <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-orange-400" /> Filter Ledger:
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Category:</span>
              <select
                value={financialCategoryFilter}
                onChange={(e) => setFinancialCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Offerings">Offerings</option>
                <option value="Tithe">Tithes</option>
                <option value="Donations">Donations</option>
                <option value="Project Funding">Project Funding</option>
                <option value="Venue & Logistics">Venue & Logistics</option>
                <option value="Outreach & Missions">Outreach & Missions</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => exportIncomeLedgerToCsv(filteredIncome)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-400 font-semibold border border-slate-700"
              >
                Income CSV Only
              </button>
              <button
                onClick={() => exportExpenseLedgerToCsv(filteredExpenses)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-rose-400 font-semibold border border-slate-700"
              >
                Expense CSV Only
              </button>
            </div>
          </div>
        )}

        {/* Live A4 Print Sheet Document Preview Frame */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex justify-center">
          <div className="w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 font-sans text-xs select-text">
            
            {/* Document Letterhead */}
            <div className="border-b-2 border-orange-500 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-md">
                  M
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Manifest Fellowship</h1>
                  <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                    Kampala International University (K.I.U) • Kansanga Campus
                  </p>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-500 leading-snug">
                <div className="font-bold text-slate-700">Official Executive Report</div>
                <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                <div className="font-mono text-slate-400">REF: MAN-DOC-{new Date().getFullYear()}</div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-orange-500 p-3 rounded-lg mb-4">
              <h2 className="text-sm font-extrabold text-slate-900">
                {activeReportTab === 'members' && 'OFFICIAL FELLOWSHIP MEMBERSHIP DIRECTORY & ROSTER'}
                {activeReportTab === 'financial' && 'OFFICIAL TREASURY & FINANCIAL DISBURSEMENT STATEMENT'}
                {activeReportTab === 'executive' && 'EXECUTIVE FELLOWSHIP ANALYTICS & SOUL AUDIT DOSSIER'}
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {activeReportTab === 'members' && `Certified active and student membership roster (${filteredMembers.length} records matching current criteria)`}
                {activeReportTab === 'financial' && `Reconciled treasury ledger of tithes, offerings, donations, and ministry expenditures`}
                {activeReportTab === 'executive' && `High-level executive briefing for board, pastoral leadership, and fellowship coordinators`}
              </p>
            </div>

            {/* Document KPI Summary Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              {activeReportTab === 'members' && (
                <>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Total Listed</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">{filteredMembers.length} Souls</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-[9px] font-bold text-emerald-700 uppercase">Active Covenant</div>
                    <div className="text-base font-black text-emerald-800 mt-0.5">
                      {filteredMembers.filter((m) => m.status === 'Active').length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                    <div className="text-[9px] font-bold text-indigo-700 uppercase">KIU Students</div>
                    <div className="text-base font-black text-indigo-800 mt-0.5">
                      {filteredMembers.filter((m) => m.studentInfo?.isStudent).length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="text-[9px] font-bold text-amber-700 uppercase">First-Timers</div>
                    <div className="text-base font-black text-amber-800 mt-0.5">
                      {filteredMembers.filter((m) => m.isFirstTimer || m.status === 'First Timer').length}
                    </div>
                  </div>
                </>
              )}

              {activeReportTab === 'financial' && (
                <>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-[9px] font-bold text-emerald-700 uppercase">Total Inflows</div>
                    <div className="text-sm font-black text-emerald-800 mt-0.5">{formatUGX(totalIncome)}</div>
                    <div className="text-[9px] text-emerald-600">{filteredIncome.length} receipts</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <div className="text-[9px] font-bold text-rose-700 uppercase">Total Outflows</div>
                    <div className="text-sm font-black text-rose-800 mt-0.5">{formatUGX(totalExpenses)}</div>
                    <div className="text-[9px] text-rose-600">{filteredExpenses.length} vouchers</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
                    <div className="text-[9px] font-bold text-slate-600 uppercase">Net Treasury Reserve</div>
                    <div className={`text-sm font-black mt-0.5 ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatUGX(netBalance)}
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {netBalance >= 0 ? 'Surplus Operating Balance' : 'Operating Deficit'}
                    </div>
                  </div>
                </>
              )}

              {activeReportTab === 'executive' && (
                <>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Total Membership</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">{members.length} Souls</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                    <div className="text-[9px] font-bold text-indigo-700 uppercase">Student Majority</div>
                    <div className="text-base font-black text-indigo-800 mt-0.5">
                      {Math.round((members.filter((m) => m.studentInfo?.isStudent).length / (members.length || 1)) * 100)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-[9px] font-bold text-emerald-700 uppercase">Fellowship Groups</div>
                    <div className="text-base font-black text-emerald-800 mt-0.5">
                      {departments.length + homes.length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="text-[9px] font-bold text-amber-700 uppercase">Net Reserve</div>
                    <div className="text-xs font-black text-amber-800 mt-1">
                      {formatUGX(income.reduce((s, i) => s + i.amount, 0) - expenses.reduce((s, e) => s + e.amount, 0))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Document Tables Display */}
            {activeReportTab === 'members' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 border border-slate-300 text-slate-700 font-bold uppercase text-[9px]">
                        <th className="p-2 text-left border border-slate-300">Member ID</th>
                        <th className="p-2 text-left border border-slate-300">Full Name</th>
                        <th className="p-2 text-left border border-slate-300">Phone Contact</th>
                        <th className="p-2 text-left border border-slate-300">Course / Academic Info</th>
                        <th className="p-2 text-left border border-slate-300">Residence / Hostel</th>
                        <th className="p-2 text-left border border-slate-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.slice(0, 15).map((m, idx) => (
                        <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 border border-slate-200 font-mono font-bold text-slate-700">{m.id}</td>
                          <td className="p-2 border border-slate-200 font-bold text-slate-900">{m.fullName}</td>
                          <td className="p-2 border border-slate-200 font-mono text-slate-700">{m.phone}</td>
                          <td className="p-2 border border-slate-200 text-slate-700">
                            {m.studentInfo?.course || 'Non-Student Member'}
                            {m.studentInfo?.yearOfStudy ? ` (Yr ${m.studentInfo.yearOfStudy})` : ''}
                          </td>
                          <td className="p-2 border border-slate-200 text-slate-700">
                            {m.hostelOrResidence || m.residence || 'Kansanga'}
                          </td>
                          <td className="p-2 border border-slate-200">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                              m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredMembers.length > 15 && (
                  <div className="text-[10px] text-slate-500 text-center italic bg-slate-50 p-2 rounded border border-slate-200">
                    Showing first 15 of {filteredMembers.length} members in preview. All records will be included in the exported PDF and CSV.
                  </div>
                )}
              </div>
            )}

            {activeReportTab === 'financial' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 mb-1.5 uppercase tracking-wide border-b border-slate-200 pb-1">
                    Income Collections Ledger ({filteredIncome.length} records)
                  </h3>
                  <table className="w-full border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 border border-slate-300 text-slate-700 font-bold uppercase text-[9px]">
                        <th className="p-2 text-left border border-slate-300">Voucher</th>
                        <th className="p-2 text-left border border-slate-300">Date</th>
                        <th className="p-2 text-left border border-slate-300">Category</th>
                        <th className="p-2 text-left border border-slate-300">Description</th>
                        <th className="p-2 text-left border border-slate-300">Method</th>
                        <th className="p-2 text-right border border-slate-300">Amount (UGX)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncome.map((i, idx) => (
                        <tr key={i.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 border border-slate-200 font-mono text-slate-600">{i.id}</td>
                          <td className="p-2 border border-slate-200">{i.date}</td>
                          <td className="p-2 border border-slate-200 font-bold text-emerald-700">{i.category}</td>
                          <td className="p-2 border border-slate-200 text-slate-800">{i.description}</td>
                          <td className="p-2 border border-slate-200">{i.paymentMethod}</td>
                          <td className="p-2 border border-slate-200 text-right font-bold text-slate-900">{formatUGX(i.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-slate-900 mb-1.5 uppercase tracking-wide border-b border-slate-200 pb-1">
                    Expense Disbursements Ledger ({filteredExpenses.length} records)
                  </h3>
                  <table className="w-full border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 border border-slate-300 text-slate-700 font-bold uppercase text-[9px]">
                        <th className="p-2 text-left border border-slate-300">Voucher</th>
                        <th className="p-2 text-left border border-slate-300">Date</th>
                        <th className="p-2 text-left border border-slate-300">Category</th>
                        <th className="p-2 text-left border border-slate-300">Description</th>
                        <th className="p-2 text-left border border-slate-300">Requested By</th>
                        <th className="p-2 text-right border border-slate-300">Amount (UGX)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((e, idx) => (
                        <tr key={e.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 border border-slate-200 font-mono text-slate-600">{e.id}</td>
                          <td className="p-2 border border-slate-200">{e.date}</td>
                          <td className="p-2 border border-slate-200 font-bold text-rose-700">{e.category}</td>
                          <td className="p-2 border border-slate-200 text-slate-800">{e.description}</td>
                          <td className="p-2 border border-slate-200">{e.requestedBy}</td>
                          <td className="p-2 border border-slate-200 text-right font-bold text-slate-900">{formatUGX(e.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeReportTab === 'executive' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Makindye Zonal Distribution</h4>
                  <div className="space-y-1.5 text-[10px]">
                    {Object.entries(residenceDistribution).map(([res, count]) => (
                      <div key={res} className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="font-semibold text-slate-700">{res}</span>
                        <span className="font-bold text-slate-900">{count} members ({Math.round(((count as number) / (members.length || 1)) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Academic & Faculty Distribution</h4>
                  <div className="space-y-1.5 text-[10px]">
                    {Object.entries(campusDistribution).map(([camp, count]) => (
                      <div key={camp} className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="font-semibold text-slate-700">{camp}</span>
                        <span className="font-bold text-slate-900">{count} members ({Math.round(((count as number) / (members.length || 1)) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Official Signatures Box */}
            <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 text-[9px] text-slate-600">
              <div>
                <div className="border-b border-slate-400 h-6 mb-1"></div>
                <div className="font-bold text-slate-800">Prepared By: {currentUserName || 'HOD Registration'}</div>
                <div>Manifest Fellowship Coordinator</div>
              </div>
              <div>
                <div className="border-b border-slate-400 h-6 mb-1"></div>
                <div className="font-bold text-slate-800">Verified By: Finance Secretariat</div>
                <div>Treasury & Audit Officer</div>
              </div>
              <div>
                <div className="border-b border-slate-400 h-6 mb-1"></div>
                <div className="font-bold text-slate-800">Pastoral Oversight</div>
                <div>General Overseer / Patron</div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex justify-between text-[8px] text-slate-400">
              <div>Manifest Fellowship K.I.U Secretariat • Kansanga, Ggaba Road, Kampala</div>
              <div>Certified Offline System Export</div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Export ready: <span className="text-white font-bold">{filteredMembers.length} members</span> • <span className="text-white font-bold">{filteredIncome.length + filteredExpenses.length} financial transactions</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleCsvExport}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-orange-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
