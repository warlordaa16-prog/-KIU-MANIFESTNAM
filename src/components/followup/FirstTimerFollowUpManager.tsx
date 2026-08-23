import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { FollowUpRecord, FollowUpStatus, FollowUpInteraction } from '../../types';
import {
  HeartHandshake,
  Users,
  Plus,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Send,
  Home,
} from 'lucide-react';

interface FirstTimerFollowUpManagerProps {
  onOpenRegister: () => void;
  onSelectMemberById: (memberId: string) => void;
}

export const FirstTimerFollowUpManager: React.FC<FirstTimerFollowUpManagerProps> = ({
  onOpenRegister,
  onSelectMemberById,
}) => {
  const {
    followUps,
    updateFollowUp,
    addFollowUpInteraction,
    members,
    homes,
    currentUserName,
    currentUserRole,
  } = useFellowship();

  const [activeView, setActiveView] = useState<'pipeline' | 'table'>('pipeline');
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpRecord | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Interaction form state
  const [actionType, setActionType] = useState<FollowUpInteraction['action']>('Phone Call');
  const [interactionResult, setInteractionResult] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState<FollowUpStatus>('Contacted');

  const coordinators = members.filter(
    (m) =>
      m.departmentIds?.includes('dept-coordination') ||
      m.departmentIds?.includes('dept-admin') ||
      m.status === 'Active'
  );

  // Pipeline stages
  const pipelineColumns: { status: FollowUpStatus; label: string; color: string }[] = [
    { status: 'Assigned', label: 'Assigned / New', color: 'border-blue-500/40 bg-blue-500/5' },
    { status: 'Contacted', label: 'Contacted', color: 'border-amber-500/40 bg-amber-500/5' },
    { status: 'Responded', label: 'Responded / In-Touch', color: 'border-cyan-500/40 bg-cyan-500/5' },
    { status: 'Joined', label: 'Joined Home / Active', color: 'border-emerald-500/40 bg-emerald-500/5' },
    { status: 'Needs Further Follow-Up', label: 'Needs Care', color: 'border-purple-500/40 bg-purple-500/5' },
  ];

  const handleOpenLogModal = (f: FollowUpRecord) => {
    setSelectedFollowUp(f);
    setActionType('Phone Call');
    setInteractionResult('');
    setNextDate('');
    setUpdatedStatus(f.status);
    setIsLogModalOpen(true);
  };

  const handleSaveInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFollowUp || !interactionResult.trim()) return;

    addFollowUpInteraction(selectedFollowUp.id, {
      coordinatorId: 'COORD-ACTIVE',
      coordinatorName: currentUserName,
      action: actionType,
      result: interactionResult.trim(),
      nextFollowUpDate: nextDate || undefined,
    });

    if (updatedStatus !== selectedFollowUp.status) {
      updateFollowUp(selectedFollowUp.id, { status: updatedStatus });
    }

    setIsLogModalOpen(false);
  };

  const handleReassignCoordinator = (followUpId: string, coordId: string) => {
    const coordinator = members.find((m) => m.id === coordId);
    if (!coordinator) return;

    updateFollowUp(followUpId, {
      coordinatorId: coordinator.id,
      coordinatorName: coordinator.fullName,
      status: 'Assigned',
    });
  };

  const handleAssignHome = (followUpId: string, homeId: string) => {
    updateFollowUp(followUpId, { assignedHomeId: homeId, status: 'Joined' });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Section 10 & 11 Automated Workflow
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            First-Timer Care & Follow-Up Pipeline
          </h1>
          <p className="text-xs text-slate-400">
            Automated welcome → Coordinator assigned → Interaction logs → Home placement
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeView === 'pipeline'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeView === 'table'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add First-Timer</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total First-Timers</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{followUps.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Automated on enrollment</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Currently Contacted</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {followUps.filter((f) => f.status === 'Contacted' || f.status === 'Responded').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active conversation logged</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Successfully Joined Home</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {followUps.filter((f) => f.status === 'Joined' || f.status === 'Completed').length}
          </div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Retained into fellowship cells</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Pending Assignment</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {followUps.filter((f) => f.status === 'Pending').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Awaiting coordinator</div>
        </div>
      </div>

      {/* VIEW 1: KANBAN PIPELINE */}
      {activeView === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {pipelineColumns.map((col) => {
            const columnItems = followUps.filter((f) => f.status === col.status);

            return (
              <div
                key={col.status}
                className={`rounded-2xl p-3.5 border ${col.color} flex flex-col justify-between min-h-[480px]`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <span className="font-bold text-xs text-slate-200">{col.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                      {columnItems.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnItems.map((item) => {
                      const assignedHome = homes.find((h) => h.id === item.assignedHomeId);

                      return (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md hover:border-amber-500/50 transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div
                                onClick={() => onSelectMemberById(item.memberId)}
                                className="font-bold text-white text-xs hover:text-amber-300 cursor-pointer"
                              >
                                {item.memberName}
                              </div>
                              <div className="text-[10px] text-slate-400">{item.phone}</div>
                            </div>
                            <span className="font-mono text-[9px] text-amber-400 bg-amber-950/80 px-1 py-0.5 rounded">
                              {item.memberId.slice(-6)}
                            </span>
                          </div>

                          {/* Coordinator Assignment */}
                          <div className="text-[10px] text-slate-300 bg-slate-950/80 p-1.5 rounded border border-slate-800">
                            <span className="text-slate-500 block">Officer:</span>
                            <span className="font-semibold text-slate-200 truncate block">
                              {item.coordinatorName || 'Coordination Team'}
                            </span>
                          </div>

                          {/* Interactions count */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{item.interactions?.length || 0} interaction(s)</span>
                            {item.nextFollowUpDate && (
                              <span className="text-amber-300 font-medium">Next: {item.nextFollowUpDate}</span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => handleOpenLogModal(item)}
                              className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1 shadow transition-colors"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                              <span>Log Interaction</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {columnItems.length === 0 && (
                      <div className="p-4 text-center text-slate-500 text-[11px]">
                        No records in this stage.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {activeView === 'table' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Visitor / Member</th>
                  <th className="py-3 px-4">Date of Visit</th>
                  <th className="py-3 px-4">Follow-Up Officer</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Interactions</th>
                  <th className="py-3 px-4">Next Follow-Up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {followUps.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-850/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{f.memberName}</div>
                      <div className="text-[10px] text-slate-400">{f.phone}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-400">{f.dateOfVisit}</td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-200">{f.coordinatorName || 'Coordination'}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === 'Joined'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : f.status === 'Contacted'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-amber-400">
                      {f.interactions.length} call/visit
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {f.nextFollowUpDate || 'Completed'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenLogModal(f)}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                      >
                        Log Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOG INTERACTION MODAL */}
      {isLogModalOpen && selectedFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Log Follow-Up Interaction</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedFollowUp.memberName} ({selectedFollowUp.phone})
                </p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInteraction} className="p-5 space-y-3.5 text-xs">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Interaction Channel
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as FollowUpInteraction['action'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold text-amber-300"
                >
                  <option value="Phone Call">📞 Phone Call</option>
                  <option value="WhatsApp / SMS">💬 WhatsApp / SMS Message</option>
                  <option value="Physical Visit">🏠 Physical Campus Visit</option>
                  <option value="In-Person Conversation">🤝 In-Person Conversation</option>
                  <option value="Email">✉️ Email</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Conversation Outcome / Result Notes <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={interactionResult}
                  onChange={(e) => setInteractionResult(e.target.value)}
                  placeholder="e.g. Visitor expressed appreciation for worship and confirmed attendance at Home Sinai this Wednesday..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Update Pipeline Status
                  </label>
                  <select
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value as FollowUpStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="Contacted">Contacted</option>
                    <option value="Responded">Responded</option>
                    <option value="Joined">Joined Home / Fellowship</option>
                    <option value="Needs Further Follow-Up">Needs Further Care</option>
                    <option value="Completed">Completed / Integrated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Next Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* Home placement quick button */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign to Home Fellowship Cell
                </label>
                <select
                  value={selectedFollowUp.assignedHomeId || ''}
                  onChange={(e) => handleAssignHome(selectedFollowUp.id, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="">-- No Home Assigned --</option>
                  {homes.map((h) => (
                    <option key={h.id} value={h.id}>{h.name} ({h.zone})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Save Interaction Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
