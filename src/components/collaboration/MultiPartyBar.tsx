import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Activity,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  PlusCircle,
  HelpCircle,
  Trash2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export const MultiPartyBar: React.FC = () => {
  const {
    currentUserName,
    activeOperator,
    operators,
    setActiveOperatorName,
    addCustomOperator,
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    wsConnected,
    offlineQueue,
    syncOfflineQueue,
    simulateConcurrentEntryDemo,
    recentLiveEvents,
    members,
    emptyModelForUse,
    loadDemoData,
    run7DayAutoUpdate,
  } = useFellowship();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesk, setCustomDesk] = useState('');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);

  const handleTriggerAutoUpdate = async () => {
    setIsAutoUpdating(true);
    try {
      await run7DayAutoUpdate(false);
    } finally {
      setIsAutoUpdating(false);
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await simulateConcurrentEntryDemo();
    } finally {
      setIsSimulating(false);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    addCustomOperator(customName.trim(), 'Desk Officer', customDesk.trim() || 'Fellowship Intake');
    setCustomName('');
    setCustomDesk('');
    setShowAddCustom(false);
    setIsDropdownOpen(false);
  };

  const getOperatorColor = (name: string) => {
    const op = operators.find((o) => o.name.toLowerCase() === name.toLowerCase());
    return op?.avatarColor || 'bg-slate-700';
  };

  const openNewTabAs = (operatorName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('operator', operatorName);
    window.open(url.toString(), '_blank');
  };

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/90 text-white z-20 py-2.5 px-4 sm:px-6 lg:px-8 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        {/* Left Side: Active Operator & Multi-Party Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold tracking-wide uppercase text-[10px]">
            <Users className="w-3.5 h-3.5 text-orange-400" />
            <span>Active Party:</span>
          </div>

          {/* Current Operator Dropdown Badge */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-white font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <div className={`w-3.5 h-3.5 rounded-full ${activeOperator.avatarColor} ring-2 ring-white/20`} />
              <span className="text-emerald-300 font-bold">{currentUserName}</span>
              <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                ({activeOperator.deskName})
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1 border-b border-slate-800 flex items-center justify-between">
                  <span>Switch Entering Party</span>
                  <span className="text-orange-400 font-normal">Multi-Party Ready</span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                  {operators.map((op) => {
                    const isCurrent = op.name.toLowerCase() === currentUserName.toLowerCase();
                    return (
                      <div
                        key={op.id}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-orange-500/20 border border-orange-500/40 text-orange-200'
                            : 'hover:bg-slate-800 text-slate-200'
                        }`}
                        onClick={() => {
                          setActiveOperatorName(op.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3.5 h-3.5 rounded-full ${op.avatarColor} shrink-0 ring-1 ring-white/20`} />
                          <div className="text-left">
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{op.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-orange-500/30 text-orange-300">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{op.deskName}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            title={`Open separate tab as ${op.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openNewTabAs(op.name);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Operator Button */}
                <div className="pt-2 border-t border-slate-800 mt-1">
                  {!showAddCustom ? (
                    <button
                      onClick={() => setShowAddCustom(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
                      <span>+ Custom Operator Name</span>
                    </button>
                  ) : (
                    <form onSubmit={handleAddCustom} className="space-y-1.5 p-1">
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Operator Name (e.g. Joshua)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={customDesk}
                        onChange={(e) => setCustomDesk(e.target.value)}
                        placeholder="Desk/Role (e.g. Annex Entry)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="submit"
                          className="flex-1 py-1 rounded bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-[11px]"
                        >
                          Add & Switch
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddCustom(false)}
                          className="py-1 px-2 rounded bg-slate-800 text-slate-400 hover:text-white text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Tab Switcher: open secondary browser tab */}
          <button
            onClick={() => {
              const other = currentUserName === 'Anibal' ? 'Marcus' : currentUserName === 'Marcus' ? 'Ahebwa' : 'Anibal';
              openNewTabAs(other);
            }}
            title="Open a parallel tab as another operator to test simultaneous multi-party entry side-by-side"
            className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 hover:text-orange-300 px-2 py-1 rounded-lg hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3 h-3 text-orange-400" />
            <span>Open Side-by-Side Tab</span>
          </button>
        </div>

        {/* Center: Online/Offline Network Status & Sync Queue */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Live Online or Offline Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all shadow-sm ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Collaborative Sync</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Field Offline Mode</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5" />
              </>
            )}
          </div>

          {/* Manual Offline Simulator Toggle */}
          <button
            onClick={toggleSimulatedOffline}
            title={isSimulatedOffline ? "Switch back to Live Online Mode" : "Switch to Field Offline Mode to test entering data without network"}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
              isSimulatedOffline
                ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700/80'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border-slate-700/80'
            }`}
          >
            {isSimulatedOffline ? '⚡ Go Online' : '✈️ Work Offline'}
          </button>

          {/* Offline Pending Queue Sync Button */}
          {offlineQueue.length > 0 && (
            <button
              onClick={syncOfflineQueue}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-bold text-[11px] shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer animate-pulse"
              title="Push offline queued entries to all connected parties"
            >
              <RefreshCw className="w-3 h-3 stroke-[2.5]" />
              <span>Sync {offlineQueue.length} Queued Entries</span>
            </button>
          )}

          {/* Live Activity Feed Button */}
          <button
            onClick={() => setShowActivityModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700/80 font-semibold text-[11px] transition-colors cursor-pointer"
            title="View multi-party real-time feed"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Live Activity</span>
            {recentLiveEvents.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                {recentLiveEvents.length}
              </span>
            )}
          </button>

          {/* 7-Day Auto-Update Trigger Button */}
          <button
            onClick={handleTriggerAutoUpdate}
            disabled={isAutoUpdating}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-300 font-semibold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
            title="Run 7-Day lifecycle auto-update (advances first timers, links families, care check-ins)"
          >
            <Clock className={`w-3.5 h-3.5 text-indigo-400 ${isAutoUpdating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">7-Day Auto Engine</span>
          </button>

          {/* Empty Model / Ready for Use Button */}
          <button
            onClick={() => setShowEmptyConfirm(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-700/60 text-slate-300 hover:text-rose-300 font-semibold text-[11px] transition-colors cursor-pointer"
            title="Empty all records to make model clean and ready for real data entry"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Empty Model</span>
          </button>

          {/* If empty, show Load Demo button */}
          {members.length === 0 && (
            <button
              onClick={loadDemoData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 font-semibold text-[11px] transition-colors cursor-pointer"
              title="Load 18 sample members for operational review"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Demo</span>
            </button>
          )}

          {/* Test 6-Party Concurrent Entry Demo Button */}
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-extrabold text-[11px] shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Simulate 6 people (Anibal, Marcus, Ahebwa, Grace, David, Sarah) entering data simultaneously in real-time"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulating...' : '🚀 Test 6-Party Entry'}</span>
          </button>
        </div>

      </div>

      {/* Live Activity Feed Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="font-extrabold text-white text-base">Multi-Party Real-Time Stream</h3>
                  <p className="text-xs text-slate-400">Live collaborative entries across all connected operators</p>
                </div>
              </div>
              <button
                onClick={() => setShowActivityModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {recentLiveEvents.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No live events yet. Enter a member or click "Test 6-Party Entry" to see real-time updates!
                </div>
              ) : (
                recentLiveEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-start justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-3.5 h-3.5 rounded-full ${getOperatorColor(ev.operator)} mt-0.5 shrink-0 ring-1 ring-white/20`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{ev.operator}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono">
                            {ev.type}
                          </span>
                        </div>
                        <div className="text-slate-300 font-medium mt-0.5">{ev.entityName}</div>
                        <div className="text-slate-400 text-[11px]">{ev.details}</div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <div className="text-slate-400">
                Connected Operators: <span className="text-emerald-400 font-bold">{operators.length}</span>
              </div>
              <button
                onClick={() => setShowActivityModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close Stream
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Empty Database Confirmation Modal */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Empty Model & Make Ready for Live Use?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to empty all member records? This resets the platform to a pristine state so your operators (<strong>Anibal</strong>, <strong>Marcus</strong>, <strong>Ahebwa</strong>, etc.) can enter actual live records.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowEmptyConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  emptyModelForUse();
                  setShowEmptyConfirm(false);
                }}
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
