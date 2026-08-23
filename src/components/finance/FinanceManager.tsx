import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  IncomeRecord,
  ExpenseRecord,
  IncomeCategory,
  ExpenseCategory,
  PaymentMethod,
  TransactionStatus,
} from '../../types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  Calendar,
  Clock,
  Search,
  PieChart as PieIcon,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const FinanceManager: React.FC = () => {
  const {
    income,
    expenses,
    addIncome,
    addExpense,
    approveExpense,
    rejectExpense,
    disburseExpense,
    departments,
    events,
    currentUserName,
    currentUserRole,
    formatUGX,
  } = useFellowship();

  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense' | 'pending'>('all');
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Income State
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>('Offerings');
  const [incomeAmount, setIncomeAmount] = useState<string>('');
  const [incomeDate, setIncomeDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incomePaymentMethod, setIncomePaymentMethod] = useState<PaymentMethod>('MTN Mobile Money');
  const [incomeReference, setIncomeReference] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeEventId, setIncomeEventId] = useState('');

  // Add Expense State
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('Equipment & Sound');
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDeptId, setExpenseDeptId] = useState('');
  const [expenseEventId, setExpenseEventId] = useState('');

  // Calculated totals
  const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses
    .filter((e) => e.status === 'Approved' || e.status === 'Disbursed' || e.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const pendingApprovals = expenses.filter((e) => e.status === 'Pending Approval');

  const incomeCategories: IncomeCategory[] = [
    'Offerings',
    'Tithe',
    'Donations',
    'Contributions',
    'Fundraising',
    'Event Income',
    'Project Funding',
    'Partnership',
    'Other Income',
  ];

  const expenseCategories: ExpenseCategory[] = [
    'Equipment & Sound',
    'Media & Tech',
    'Venue & Logistics',
    'Welfare & Hospitality',
    'Refreshments',
    'Transport',
    'Honorarium',
    'Printing & Publicity',
    'Outreach & Missions',
    'Administration',
    'Other',
  ];

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeAmount || Number(incomeAmount) <= 0) return;

    addIncome({
      date: incomeDate,
      amount: Number(incomeAmount),
      category: incomeCategory,
      description: incomeDescription.trim() || `${incomeCategory} received`,
      receivedBy: currentUserName,
      paymentMethod: incomePaymentMethod,
      referenceNumber: incomeReference.trim() || undefined,
      eventId: incomeEventId || undefined,
      status: 'Received',
    });

    setIsAddIncomeOpen(false);
    setIncomeAmount('');
    setIncomeDescription('');
    setIncomeReference('');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || Number(expenseAmount) <= 0) return;

    addExpense({
      date: expenseDate,
      amount: Number(expenseAmount),
      category: expenseCategory,
      description: expenseDescription.trim() || `Expense for ${expenseCategory}`,
      requestedBy: currentUserName,
      departmentId: expenseDeptId || undefined,
      eventId: expenseEventId || undefined,
    });

    setIsAddExpenseOpen(false);
    setExpenseAmount('');
    setExpenseDescription('');
  };

  const exportFinanceCsv = () => {
    const incomeHeaders = ['Transaction ID', 'Date', 'Type', 'Category', 'Amount (UGX)', 'Method', 'Ref', 'Description', 'Received By'];
    const incomeRows = income.map((i) => [
      i.id,
      i.date,
      'Income',
      `"${i.category}"`,
      i.amount,
      i.paymentMethod,
      `"${i.referenceNumber || ''}"`,
      `"${i.description}"`,
      `"${i.receivedBy}"`,
    ]);

    const expenseHeaders = ['Transaction ID', 'Date', 'Type', 'Category', 'Amount (UGX)', 'Status', 'Requested By', 'Description', 'Approved By'];
    const expenseRows = expenses.map((e) => [
      e.id,
      e.date,
      'Expense',
      `"${e.category}"`,
      e.amount,
      e.status,
      `"${e.requestedBy}"`,
      `"${e.description}"`,
      `"${e.approvedBy || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['=== INCOMES ===', incomeHeaders.join(','), ...incomeRows.map((r) => r.join(',')), '', '=== EXPENSES ===', expenseHeaders.join(','), ...expenseRows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `manifest_finances_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Section 15 Financial Accountability Ledger
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Financial Management & Stewardship
          </h1>
          <p className="text-xs text-slate-400">
            Transparent tracking of tithes, offerings, ministry budgets, and verified expenses
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportFinanceCsv}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger</span>
          </button>

          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record Inflow (Income)</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Request Expense</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Total Recorded Income
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatUGX(totalIncome)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{income.length} verified income inflow(s)</div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Approved Expenditures
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatUGX(totalExpenses)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sound, venue, hospitality & missions</div>
        </div>

        {/* Net Reserves */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Net Fellowship Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono mt-2">
            {formatUGX(netBalance)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {pendingApprovals.length} transaction(s) pending sign-off
          </div>
        </div>

      </div>

      {/* Filter and Tab bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Ledgers ({income.length + expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Incomes ({income.length})
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Approvals ({pendingApprovals.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, category, reference..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">TXN Code & Date</th>
                <th className="py-3 px-4">Category & Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount (UGX)</th>
                <th className="py-3 px-4">Method / Party</th>
                <th className="py-3 px-4">Status & Sign-Off</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {/* RENDER INCOMES */}
              {(activeTab === 'all' || activeTab === 'income') &&
                income
                  .filter((i) => {
                    if (searchQuery) {
                      const q = searchQuery.toLowerCase();
                      return (
                        i.description.toLowerCase().includes(q) ||
                        i.category.toLowerCase().includes(q) ||
                        i.id.toLowerCase().includes(q) ||
                        (i.referenceNumber && i.referenceNumber.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  })
                  .map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-850/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-amber-400 text-[11px]">{rec.id}</div>
                        <div className="text-[10px] text-slate-400">{rec.date}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{rec.category}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                          {rec.description}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Income
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sm text-emerald-400">
                        + {rec.amount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-200">{rec.paymentMethod}</span>
                        {rec.referenceNumber && (
                          <div className="font-mono text-[10px] text-slate-500 truncate max-w-[130px]">
                            Ref: {rec.referenceNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          {rec.status}
                        </span>
                        <div className="text-[9px] text-slate-500 mt-0.5">By {rec.receivedBy}</div>
                      </td>

                      <td className="py-3 px-4 text-right text-slate-500 text-[10px]">
                        Verified
                      </td>
                    </tr>
                  ))}

              {/* RENDER EXPENSES */}
              {(activeTab === 'all' || activeTab === 'expense' || activeTab === 'pending') &&
                expenses
                  .filter((e) => {
                    if (activeTab === 'pending' && e.status !== 'Pending Approval') return false;
                    if (searchQuery) {
                      const q = searchQuery.toLowerCase();
                      return (
                        e.description.toLowerCase().includes(q) ||
                        e.category.toLowerCase().includes(q) ||
                        e.id.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-850/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-amber-400 text-[11px]">{rec.id}</div>
                        <div className="text-[10px] text-slate-400">{rec.date}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{rec.category}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                          {rec.description}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Expense
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sm text-rose-400">
                        - {rec.amount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-200">Req: {rec.requestedBy}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.status === 'Approved' || rec.status === 'Disbursed' || rec.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : rec.status === 'Pending Approval'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {rec.status}
                        </span>
                        {rec.approvedBy && (
                          <div className="text-[9px] text-slate-500 mt-0.5">By {rec.approvedBy}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {rec.status === 'Pending Approval' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveExpense(rec.id, currentUserName)}
                              className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                              title="Approve Expense"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => rejectExpense(rec.id, 'Insufficient budget line')}
                              className="p-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                              title="Reject Expense"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : rec.status === 'Approved' ? (
                          <button
                            onClick={() => disburseExpense(rec.id, currentUserName, 'MTN Mobile Money')}
                            className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                          >
                            Disburse
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500">{rec.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD INFLOW MODAL */}
      {isAddIncomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Record Income / Fellowship Inflow</h3>
              <button onClick={() => setIsAddIncomeOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIncome} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Income Category</label>
                  <select
                    value={incomeCategory}
                    onChange={(e) => setIncomeCategory(e.target.value as IncomeCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-semibold"
                  >
                    {incomeCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount (UGX) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    placeholder="e.g. 250000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={incomePaymentMethod}
                    onChange={(e) => setIncomePaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Receipt / Txn Reference (Optional)</label>
                <input
                  type="text"
                  value={incomeReference}
                  onChange={(e) => setIncomeReference(e.target.value)}
                  placeholder="MTN Ref ID or Receipt #"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  placeholder="Offering at Friday Gathering..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddIncomeOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow"
                >
                  Save Inflow Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST EXPENSE MODAL */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Submit Ministry Expense Request</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-semibold"
                  >
                    {expenseCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount (UGX) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <select
                  value={expenseDeptId}
                  onChange={(e) => setExpenseDeptId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                >
                  <option value="">-- General Operations --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Purpose</label>
                <textarea
                  required
                  rows={2}
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="e.g. Replacement microphone cables and stage DI box..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold shadow"
                >
                  Submit for Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
