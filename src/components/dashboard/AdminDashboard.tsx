import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Users,
  Layers,
  TrendingUp,
  Plus,
  ChevronRight,
  GraduationCap,
  Building,
  Briefcase,
  Wifi,
  WifiOff,
  Sparkles,
  ExternalLink,
  Activity,
  HeartHandshake,
  Clock,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Edit3,
  UserPlus,
  Smartphone,
  Check,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenRegister?: () => void;
  onSelectMember?: (member: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenRegister,
  onSelectMember,
}) => {
  const {
    members = [],
    departments = [],
    homes = [],
    operators = [],
    currentUserName,
    setActiveOperatorName,
    setCustomOperatorName,
    addCustomOperator,
    deleteOperator,
    isOnline,
    offlineQueue = [],
    auditLogs = [],
    setActiveTab,
    run7DayAutoUpdate,
    updateMember,
    emptyModelForUse,
    loadDemoData,
  } = useFellowship();

  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [showEmptyConfirmModal, setShowEmptyConfirmModal] = useState(false);
  const [isEditingOperatorName, setIsEditingOperatorName] = useState(false);
  const [operatorNameInput, setOperatorNameInput] = useState('');
  const [showAddOperatorModal, setShowAddOperatorModal] = useState(false);
  const [newOpName, setNewOpName] = useState('');
  const [newOpDesk, setNewOpDesk] = useState('');

  // Metrics Calculations
  const totalRegistered = members.length;
  const activeMembers = (members || []).filter((m) => m.status === 'Active').length;
  const firstTimersCount = (members || []).filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;
  const returningVisitorsCount = (members || []).filter((m) => m.status === 'Returning Visitor').length;

  const schoolsCount = (members || []).filter(
    (m) => m.portfolio === 'Schools' || (!m.portfolio && m.studentInfo?.isStudent)
  ).length;
  const alumniCount = (members || []).filter(
    (m) => m.portfolio === 'Alumni' || (!m.portfolio && m.status === 'Graduated')
  ).length;
  const communityCount = (members || []).filter(
    (m) => m.portfolio === 'Community' || (!m.portfolio && !m.studentInfo?.isStudent && m.status !== 'Graduated')
  ).length;

  // Recent members
  const recentMembers = [...members].slice(0, 6);

  const getOperatorColor = (operatorName?: string) => {
    if (!operatorName) return 'bg-slate-600';
    const clean = operatorName.toLowerCase();
    if (clean.includes('anibal')) return 'bg-emerald-500';
    if (clean.includes('marcus')) return 'bg-cyan-500';
    if (clean.includes('ahebwa')) return 'bg-amber-500';
    if (clean.includes('grace')) return 'bg-rose-500';
    if (clean.includes('david')) return 'bg-violet-500';
    if (clean.includes('sarah')) return 'bg-blue-500';
    if (clean.includes('emmanuel')) return 'bg-orange-500';
    return 'bg-purple-500';
  };

  // Trigger 7-Day Auto-Update
  const handleTriggerAutoUpdate = async () => {
    setIsAutoUpdating(true);
    try {
      await run7DayAutoUpdate(false);
    } finally {
      setIsAutoUpdating(false);
    }
  };

  // Simulate 7-Days Passing
  const handleSimulate7Days = async () => {
    setIsAutoUpdating(true);
    try {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      members.forEach((m) => {
        if (m.status === 'First Timer' || m.isFirstTimer) {
          updateMember(m.id, {
            registrationDate: eightDaysAgo,
            dateOfFirstAttendance: eightDaysAgo,
          });
        }
      });
      setTimeout(async () => {
        await run7DayAutoUpdate(true);
        setIsAutoUpdating(false);
      }, 450);
    } catch {
      setIsAutoUpdating(false);
    }
  };

  const handleConfirmEmpty = () => {
    emptyModelForUse();
    setShowEmptyConfirmModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner / Welcome with Fast Registration Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Multi-Party Collaborative Operations Hub
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                User Deletion Access Granted
              </span>
              <span className="text-xs text-slate-400">KIU & Makindye Division</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manifest Fellowship Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Real-time collaborative data entry with custom operators, supporting online live sync, offline queues, 7-day auto-updates, and full deletion rights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/25 transition-all active:scale-95 border border-orange-400/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register Member</span>
            </button>
            
            {/* Install on Phone App CTA */}
            <PWAInstallButton />

            <button
              onClick={() => setActiveTab('members')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-orange-400" />
              <span>Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED PHONE DESKTOP APP INSTALL BANNER */}
      <PWAInstallButton variant="banner" />

      {/* EMPTY & READY FOR PRODUCTION USE HERO CARD (Displayed when 0 members) */}
      {totalRegistered === 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base">Model Emptied & Ready for Live Production Use</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                    Clean Slate
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  The model has been emptied of test records. Your team and custom operators can now enter real fellowship data simultaneously online or in the field offline.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Register First Member</span>
              </button>

              <PWAInstallButton variant="pill" />

              <button
                onClick={loadDemoData}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Load Sample Dataset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7-DAY AUTO-UPDATE ENGINE & USER DELETION ACCESS DUAL CONTROL BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 7-Day Auto-Update Deck */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs sm:text-sm">7-Day Lifecycle Auto-Update Engine</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Auto-Run
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automated weekly cycle for first-timers, fellowship families, & care check-ins.
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-1 rounded-lg border border-indigo-800/60">
                Runs every 7 days
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold">1.</span>
              <span>First Timers ({firstTimersCount}) auto-advance to <strong>Returning Visitor</strong> after 7 days.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold">2.</span>
              <span>Unallocated hostel residents auto-linked to matching Fellowship Family.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold">3.</span>
              <span>Inactive participants auto-flagged for pastoral care check-in.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleTriggerAutoUpdate}
              disabled={isAutoUpdating}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAutoUpdating ? 'animate-spin' : ''}`} />
              <span>Run 7-Day Update Now</span>
            </button>

            <button
              onClick={handleSimulate7Days}
              disabled={isAutoUpdating}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-colors cursor-pointer"
              title="Test the 7-day auto-update by advancing timestamps by 8 days"
            >
              <span>Simulate 7 Days Passing</span>
            </button>
          </div>
        </div>

        {/* User Deletion Access & Model Purge Deck */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs sm:text-sm">User Data Deletion & Model Controls</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                    Access Granted
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  All operators have full permission to delete single records, batch delete, or empty the database.
                </p>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Single Deletion:</strong> Click trash icon on any member row or inside profile modal.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Batch Deletion:</strong> Use checkboxes in Directory to delete multiple members at once.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Real-Time Sync:</strong> Deletions broadcast instantly to all logged-in parties with toasts.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setShowEmptyConfirmModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Empty Model & Make Ready for Live Use</span>
            </button>

            {totalRegistered === 0 && (
              <button
                onClick={loadDemoData}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700 cursor-pointer"
              >
                <span>Load Demo Dataset</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* OPERATOR & DATA ENTRY SETUP (BARE & CUSTOM ONLY) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                Operator Setup & Data Entry Identity
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                Bare Setup
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Clean and bare model with your custom operator name. Extra parties removed. You can add more operators whenever you choose.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-850 border border-slate-750 text-xs">
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Live Sync</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-bold">Offline Queue ({offlineQueue.length})</span>
                </>
              )}
            </div>

            <button
              onClick={() => setShowAddOperatorModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-orange-300 font-bold text-xs border border-orange-500/40 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-orange-400" />
              <span>+ Add Operator Myself</span>
            </button>
          </div>
        </div>

        {/* Active Custom Operator Card & Operators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Main Active Custom Operator Card */}
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/40 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-400">
                Active Custom Operator
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold">
                {members.filter((m) => m.createdBy?.toLowerCase() === currentUserName.toLowerCase()).length} records entered
              </span>
            </div>

            {isEditingOperatorName ? (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={operatorNameInput}
                  onChange={(e) => setOperatorNameInput(e.target.value)}
                  placeholder="Custom operator name"
                  className="flex-1 bg-slate-950 border border-orange-500 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && operatorNameInput.trim()) {
                      setCustomOperatorName(operatorNameInput.trim());
                      setIsEditingOperatorName(false);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (operatorNameInput.trim()) {
                      setCustomOperatorName(operatorNameInput.trim());
                    }
                    setIsEditingOperatorName(false);
                  }}
                  className="p-1 rounded bg-orange-600 hover:bg-orange-500 text-slate-950"
                  title="Save Name"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <button
                  onClick={() => setIsEditingOperatorName(false)}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                    {currentUserName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                      <span>{currentUserName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                        Current
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Desk Officer / Intake</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOperatorNameInput(currentUserName);
                    setIsEditingOperatorName(true);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-300 px-2 py-1 rounded-lg hover:bg-slate-800/80 transition-colors"
                  title="Change custom operator name"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Rename</span>
                </button>
              </div>
            )}
          </div>

          {/* User Added Operators (if any) */}
          {operators
            .filter((op) => op.name.toLowerCase() !== currentUserName.toLowerCase())
            .map((op) => {
              const count = members.filter((m) => m.createdBy?.toLowerCase() === op.name.toLowerCase()).length;
              return (
                <div
                  key={op.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${op.avatarColor} text-slate-950 font-black flex items-center justify-center text-sm`}>
                      {op.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{op.name}</div>
                      <div className="text-[10px] text-slate-400">{op.deskName} • {count} records</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveOperatorName(op.name)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-orange-300 font-semibold"
                    >
                      Switch
                    </button>
                    <button
                      onClick={() => deleteOperator(op.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="Remove Operator"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Bare Notice Card */}
          {operators.length <= 1 && (
            <div className="p-4 rounded-xl bg-slate-850/60 border border-dashed border-slate-800 flex flex-col justify-center items-start text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bare Operator Model</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Active parties have been emptied. New operators can be added manually whenever you need them.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Operator Modal */}
      {showAddOperatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-orange-400" />
                <span>Add Custom Operator</span>
              </h3>
              <button
                onClick={() => setShowAddOperatorModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newOpName.trim()) return;
                addCustomOperator(newOpName.trim(), 'Desk Officer', newOpDesk.trim() || 'Registration Desk');
                setNewOpName('');
                setNewOpDesk('');
                setShowAddOperatorModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">Operator Name</label>
                <input
                  type="text"
                  value={newOpName}
                  onChange={(e) => setNewOpName(e.target.value)}
                  placeholder="e.g. Samuel"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Role or Desk</label>
                <input
                  type="text"
                  value={newOpDesk}
                  onChange={(e) => setNewOpDesk(e.target.value)}
                  placeholder="e.g. North Hall Intake"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOperatorModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20"
                >
                  Add Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Metric Cards: Total + 3 Portfolios */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-400" />
            Fellowship Portfolios & Community Analytics
          </h2>
          <button
            onClick={() => setActiveTab('members')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            View Directory <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Registered */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-orange-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Total Registered</span>
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-white">{totalRegistered}</div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeMembers} active fellowship participants</span>
            </div>
          </div>

          {/* Schools Portfolio */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Schools Portfolio</span>
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <GraduationCap className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-blue-300">{schoolsCount}</div>
            <div className="mt-2 text-xs text-slate-400">
              University students & scholars
            </div>
          </div>

          {/* Alumni Portfolio */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-purple-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Alumni Portfolio</span>
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Building className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-purple-300">{alumniCount}</div>
            <div className="mt-2 text-xs text-slate-400">
              Fellowship graduates & alumni
            </div>
          </div>

          {/* Community Portfolio */}
          <div
            onClick={() => setActiveTab('members')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-emerald-500/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">Community Portfolio</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Briefcase className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-300">{communityCount}</div>
            <div className="mt-2 text-xs text-slate-400">
              Working professionals & residents
            </div>
          </div>

        </div>
      </div>

      {/* Operational Sections: Fellowship Families & Recent Enrollments with Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Fellowship Families & Hostel Residences */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-slate-200">Fellowship Families & Hostel Residences</h3>
              </div>
              <button
                onClick={() => setActiveTab('groups')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                View Families ({homes.length}) →
              </button>
            </div>

            {homes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No fellowship families registered yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {homes.map((home) => (
                  <div
                    key={home.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{home.name}</span>
                        {home.location && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({home.location})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Leader: <strong className="text-slate-200">{home.leaderName || 'To be assigned'}</strong>
                        {home.leaderPhone ? ` • ${home.leaderPhone}` : ''}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-300 text-[10px] font-bold">
                      {members.filter((m) => m.homeId === home.id).length} members
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('groups')}
            className="w-full mt-4 py-2.5 text-center text-xs text-slate-400 hover:text-orange-300 font-semibold border-t border-slate-800 cursor-pointer"
          >
            Manage Hostel Families & Ministries →
          </button>
        </div>

        {/* Recent Member Enrollments with Operator Attribution */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-slate-200">Recent Registrations with Party Attribution</h3>
              </div>
              <button
                onClick={() => setActiveTab('members')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                All Members →
              </button>
            </div>

            {recentMembers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No members registered yet. Click &quot;Register Member&quot; or &quot;Test 6-Party Entry&quot; to begin.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {recentMembers.map((member, idx) => {
                  const p = member.portfolio || (member.status === 'Graduated' ? 'Alumni' : member.studentInfo?.isStudent ? 'Schools' : 'Community');
                  const op = member.createdBy || 'Anibal';

                  return (
                    <div
                      key={`${member.id}-${idx}`}
                      onClick={() => onSelectMember && onSelectMember(member)}
                      className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span>{member.fullName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {member.id}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            p === 'Schools'
                              ? 'bg-blue-500/20 text-blue-300'
                              : p === 'Alumni'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {p}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {member.hostelOrResidence || member.residence || 'Kansanga'}
                          {member.studentInfo?.course ? ` • ${member.studentInfo.course}` : ''}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                          <div className={`w-2 h-2 rounded-full ${getOperatorColor(op)}`} />
                          <span className="text-[10px] font-bold text-slate-200">{op}</span>
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {member.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('members')}
            className="w-full mt-4 py-2.5 text-center text-xs text-slate-400 hover:text-sky-300 font-semibold border-t border-slate-800 cursor-pointer"
          >
            Manage Member Directory & Download CSV →
          </button>
        </div>

      </div>

      {/* CONFIRMATION MODAL FOR EMPTYING MODEL */}
      {showEmptyConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Empty Database for Live Use?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  This will remove all member records and reset the model to a completely clean, pristine state ready for live data entry by your operators. You can reload demo records anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowEmptyConfirmModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEmpty}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Empty Database
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
