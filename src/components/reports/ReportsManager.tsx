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
} from 'lucide-react';

export const ReportsManager: React.FC = () => {
  const {
    members = [],
    followUps = [],
  } = useFellowship();

  // Stats
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const firstTimersCount = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;
  const studentsCount = members.filter((m) => m.studentInfo?.isStudent).length;

  const followUpRetained = followUps.filter((f) => f.status === 'Joined' || f.status === 'Completed').length;
  const retentionRate = followUps.length > 0 ? Math.round((followUpRetained / followUps.length) * 100) : 0;

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

  const exportExecutiveReport = () => {
    const reportText = `
MANIFEST FELLOWSHIP K.I.U EXECUTIVE REPORT
Generated: ${new Date().toLocaleDateString()}

=============================================
1. MEMBERSHIP & STUDENT BODY
---------------------------------------------
Total Registered Souls: ${totalMembers}
Active Regular Members: ${activeMembers}
First-Timers Logged: ${firstTimersCount}
University Students: ${studentsCount} (${Math.round((studentsCount / (totalMembers || 1)) * 100)}%)

=============================================
2. FIRST-TIMER & RETENTION PIPELINE
---------------------------------------------
Total First-Timers Processed: ${followUps.length}
Integrated & Retained: ${followUpRetained}
Fellowship Retention Rate: ${retentionRate}%

=============================================
3. RESIDENTIAL & ZONAL REACH (MAKINDYE DIVISION)
---------------------------------------------
${Object.entries(residenceGroups).map(([zone, count]) => `- ${zone}: ${count} members`).join('\n')}

=============================================
4. CAMPUS & ACADEMIC SECTORS
---------------------------------------------
${Object.entries(campusGroups).map(([camp, count]) => `- ${camp}: ${count} members`).join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `manifest_kiu_report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Executive Soul Insights & Analytics
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            Fellowship Reports & Demographics
          </h1>
          <p className="text-xs text-slate-400">
            Real-time analytics on spiritual retention, KIU student scholars, and Makindye residential reach
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportExecutiveReport}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95 border border-orange-400/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Executive Brief</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Retention Success Rate</span>
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">{retentionRate}%</div>
          <div className="text-xs text-slate-400 mt-1">First-timers successfully integrated</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>KIU Student Scholars</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            {Math.round((studentsCount / (totalMembers || 1)) * 100)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{studentsCount} university scholars</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 mt-2">{totalMembers} Souls</div>
          <div className="text-xs text-slate-400 mt-1">{activeMembers} active covenant members</div>
        </div>
      </div>

      {/* Grid of Analytical Breakdown Cards */}
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

        {/* Card 2: Campus Demographics */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Campus Demographic Distribution
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

    </div>
  );
};
