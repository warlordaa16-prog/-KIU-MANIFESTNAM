import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  HeartHandshake,
  Home,
  Layers,
  Download,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  CheckCircle2,
} from 'lucide-react';

export const ReportsManager: React.FC = () => {
  const { members, attendance, followUps, finances, homes, departments } = useFellowship();

  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Stats
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const firstTimersCount = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;
  const studentsCount = members.filter((m) => m.studentInfo?.isStudent).length;

  const totalIncome = finances
    .filter((f) => f.type === 'Income' && f.approvalStatus === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = finances
    .filter((f) => f.type === 'Expense' && f.approvalStatus === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const followUpRetained = followUps.filter((f) => f.status === 'Joined' || f.status === 'Completed').length;
  const retentionRate = followUps.length > 0 ? Math.round((followUpRetained / followUps.length) * 100) : 0;

  // Home cells breakdown
  const homeStats = homes.map((h) => {
    const count = members.filter((m) => m.homeId === h.id).length;
    return { ...h, currentSouls: count };
  });

  // Department breakdown
  const deptStats = departments.map((d) => {
    const count = members.filter((m) => m.departmentIds?.includes(d.id)).length;
    const spent = finances
      .filter((f) => f.departmentId === d.id && f.type === 'Expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { ...d, volunteers: count, spent };
  });

  const exportExecutiveReport = () => {
    const reportText = `
MANIFEST FELLOWSHIP EXECUTIVE STATE REPORT
Generated: ${new Date().toLocaleDateString()}

=============================================
1. MEMBERSHIP & STUDENT BODY
---------------------------------------------
Total Registered Souls: ${totalMembers}
Active Regular Members: ${activeMembers}
First-Timers Logged: ${firstTimersCount}
University Students: ${studentsCount} (${Math.round((studentsCount / totalMembers) * 100)}%)

=============================================
2. FIRST-TIMER & RETENTION PIPELINE
---------------------------------------------
Total First-Timers Processed: ${followUps.length}
Integrated / Joined Home: ${followUpRetained}
Fellowship Retention Rate: ${retentionRate}%

=============================================
3. FINANCIAL STEWARDSHIP SUMMARY
---------------------------------------------
Total Approved Inflows: UGX ${totalIncome.toLocaleString()}
Total Approved Outflows: UGX ${totalExpenses.toLocaleString()}
Net Operating Reserve: UGX ${(totalIncome - totalExpenses).toLocaleString()}

=============================================
4. HOMES (CELL GROUPS) STRENGTH
---------------------------------------------
${homeStats.map((h) => `- ${h.name} (${h.zone}): ${h.currentSouls} members [Leader: ${h.leaderName}]`).join('\n')}

=============================================
5. SERVING WINGS (DEPARTMENTS)
---------------------------------------------
${deptStats.map((d) => `- ${d.name} (${d.code}): ${d.volunteers} active volunteers | Spent: UGX ${d.spent.toLocaleString()}`).join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `manifest_executive_report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Section 17 Analytics & Executive Insights
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Executive Reports & Fellowship Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Real-time visual reports on spiritual growth, discipleship retention, finances, and ministries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportExecutiveReport}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Executive Brief</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold">Retention Success Rate</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{retentionRate}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">First-timers retained into homes</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold">Student Representation</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            {Math.round((studentsCount / (totalMembers || 1)) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{studentsCount} campus student souls</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold">Active Cell Cells</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{homes.length} Homes</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Weekly neighborhood gatherings</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold">Ministry Servants</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {members.filter((m) => m.departmentIds && m.departmentIds.length > 0).length} Volunteers
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active serving ministers</div>
        </div>
      </div>

      {/* Grid of Analytical Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Card 1: Home Groups Cell Strength */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-400" />
              Home Fellowship (Cell) Membership Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">{homes.length} Cells</span>
          </div>

          <div className="space-y-3">
            {homeStats.map((h) => {
              const percentage = Math.round((h.currentSouls / (totalMembers || 1)) * 100);

              return (
                <div key={h.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{h.name} ({h.zone})</span>
                    <span className="font-semibold text-amber-300">{h.currentSouls} Souls ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500">Leader: {h.leaderName}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Ministries / Departments Volunteers */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Department Volunteers & Financial Spend
            </h3>
            <span className="text-xs text-slate-400 font-mono">{departments.length} Wings</span>
          </div>

          <div className="space-y-3">
            {deptStats.map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-1 rounded">
                      {d.code}
                    </span>
                    <span>{d.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Head: {d.headName} • Budget: UGX {d.budget?.toLocaleString() || 0}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-cyan-300">{d.volunteers} Volunteers</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Spend: UGX {d.spent.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
