import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Department, Member } from '../../types';
import {
  Layers,
  Users,
  Plus,
  Clock,
  UserCheck,
  Sparkles,
  Phone,
  Search,
  CheckCircle,
  FileText,
  DollarSign,
} from 'lucide-react';

interface DepartmentsManagerProps {
  onSelectMember: (member: Member) => void;
}

export const DepartmentsManager: React.FC<DepartmentsManagerProps> = ({
  onSelectMember,
}) => {
  const { departments, members, updateMember, finances } = useFellowship();

  const [selectedDept, setSelectedDept] = useState<Department | null>(departments[0] || null);
  const [isAssignMemberOpen, setIsAssignMemberOpen] = useState(false);
  const [memberAssignSearch, setMemberAssignSearch] = useState('');

  const activeDeptMembers = members.filter((m) =>
    m.departmentIds?.includes(selectedDept?.id || '')
  );

  const deptExpenses = finances.filter((f) => f.departmentId === selectedDept?.id);
  const deptTotalSpent = deptExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddMemberToDept = (member: Member, deptId: string) => {
    const existing = member.departmentIds || [];
    if (!existing.includes(deptId)) {
      updateMember(member.id, {
        departmentIds: [...existing, deptId],
      });
    }
  };

  const handleRemoveMemberFromDept = (member: Member, deptId: string) => {
    const existing = member.departmentIds || [];
    updateMember(member.id, {
      departmentIds: existing.filter((id) => id !== deptId),
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Section 13 Ministry & Service Wings
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            Departments & Ministry Wings
          </h1>
          <p className="text-xs text-slate-400">
            Functional serving units equipping members for practical spiritual service
          </p>
        </div>
      </div>

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const deptMembers = members.filter((m) => m.departmentIds?.includes(dept.id));
          const isSelected = selectedDept?.id === dept.id;

          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDept(dept)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-850 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {dept.code}
                  </span>
                  <h3 className="font-extrabold text-white text-base leading-tight mt-1.5">
                    {dept.name}
                  </h3>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-bold text-xs border border-slate-700">
                  {deptMembers.length} Servants
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Lead: <strong className="text-slate-300">{dept.headName}</strong></span>
                <span className="text-cyan-400 font-bold">Manage Wing →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Department Detailed View */}
      {selectedDept && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedDept.code}
                </span>
                <h2 className="text-xl font-extrabold text-white">{selectedDept.name}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedDept.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAssignMemberOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enlist Volunteer Member</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Department Details & Financials */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">
                  Ministry Leadership & Schedule
                </h4>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Head of Department</span>
                    <span className="font-semibold text-slate-200">{selectedDept.headName}</span>
                    <div className="text-[11px] text-cyan-400">{selectedDept.headPhone}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Regular Ministry Practice / Meeting</span>
                    <span className="font-semibold text-slate-200">{selectedDept.meetingSchedule}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Annual Budget Limit</span>
                    <span className="text-sm font-black text-amber-400 font-mono">
                      UGX {selectedDept.budget?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Department Volunteer Roster */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  Active Ministry Team ({activeDeptMembers.length} Volunteers)
                </span>
                <span className="text-slate-500">Service Roster</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeDeptMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div
                        onClick={() => onSelectMember(m)}
                        className="font-bold text-white hover:text-cyan-300 cursor-pointer"
                      >
                        {m.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {m.phone} • {m.studentInfo?.campus?.split('-')?.[0] || m.studentInfo?.campus || 'Member'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRemoveMemberFromDept(m, selectedDept.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                        title="Remove from this department"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {activeDeptMembers.length === 0 && (
                  <div className="col-span-2 p-8 text-center text-slate-500 text-xs bg-slate-850/50 rounded-xl">
                    No members currently assigned to this department. Click "+ Enlist Volunteer Member" to add souls.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL: ENLIST MEMBER TO DEPT */}
      {isAssignMemberOpen && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Enlist Member to {selectedDept.name}</h3>
              <button onClick={() => setIsAssignMemberOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memberAssignSearch}
                  onChange={(e) => setMemberAssignSearch(e.target.value)}
                  placeholder="Search member by name, phone or MAN-ID..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {members
                  .filter((m) => {
                    if (m.departmentIds?.includes(selectedDept.id)) return false;
                    if (memberAssignSearch) {
                      const q = memberAssignSearch.toLowerCase();
                      return (
                        m.fullName.toLowerCase().includes(q) ||
                        m.phone.includes(q) ||
                        m.id.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">{m.fullName}</div>
                        <div className="text-[10px] text-slate-400">
                          {m.phone} • Status: {m.status}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleAddMemberToDept(m, selectedDept.id);
                          setIsAssignMemberOpen(false);
                        }}
                        className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px]"
                      >
                        Add to Ministry
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
