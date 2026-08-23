import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { THEME_PRESETS } from '../../themeConstants';
import { UserRole } from '../../types';
import { ManifestLogo } from './ManifestLogo';
import {
  Search,
  Plus,
  Shield,
  UserCheck,
  Calendar,
  DollarSign,
  Send,
  Bell,
  Sparkles,
  RefreshCw,
  Download,
  Users,
  Award,
  Palette,
} from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenQuickCheckIn: () => void;
  onOpenRecordIncome: () => void;
  onOpenExpenseRequest: () => void;
  onOpenBroadcast: () => void;
  onOpenThemeDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegister,
  onOpenQuickCheckIn,
  onOpenRecordIncome,
  onOpenExpenseRequest,
  onOpenBroadcast,
  onOpenThemeDrawer,
}) => {
  const {
    currentUserRole,
    setCurrentUserRole,
    currentUserName,
    setCurrentUserName,
    searchQuery,
    setSearchQuery,
    followUps,
    expenses,
    setActiveTab,
    exportBackupJson,
    currentTheme,
    watermarkOpacity,
  } = useFellowship();

  const themeConfig = THEME_PRESETS[currentTheme] || THEME_PRESETS['obsidian-kiu'];

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingFollowUps = followUps.filter((f) => f.status === 'Pending' || f.status === 'Assigned').length;
  const pendingApprovals = expenses.filter((e) => e.status === 'Pending Approval').length;
  const totalNotifications = pendingFollowUps + pendingApprovals;

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'Super Admin', label: 'Super Admin', desc: 'Full unrestricted system & financial access' },
    { role: 'Fellowship Admin', label: 'Fellowship Admin', desc: 'General fellowship operations & members' },
    { role: 'Finance Admin', label: 'Finance Admin', desc: 'Full treasury, budgets & approval control' },
    { role: 'Finance Officer', label: 'Finance Officer', desc: 'Record daily income & expense transactions' },
    { role: 'Coordinator', label: 'Follow-Up Coordinator', desc: 'First-timer care & integration pipeline' },
    { role: 'Homes Leader', label: 'Homes Shepherd', desc: 'Assigned Home fellowship cell group' },
    { role: 'Department Leader', label: 'Department Head', desc: 'Ministry roster & budget requests' },
    { role: 'Attendance Officer', label: 'Attendance Officer', desc: 'Fast check-in & meeting records' },
    { role: 'Auditor', label: 'Auditor', desc: 'Read-only financial & operational audit logs' },
    { role: 'Member', label: 'Fellowship Member', desc: 'Personal ID pass & announcements' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#090b14]/90 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Official Manifest Fellowship K.I.U Logo Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group py-1"
            onClick={() => setActiveTab('dashboard')}
            title="Manifest Fellowship K.I.U"
          >
            <div className="relative flex items-center p-1.5 rounded-xl bg-black/80 border border-orange-500/30 group-hover:border-orange-500/60 shadow-lg shadow-orange-500/10 transition-all">
              <ManifestLogo variant="full" size="sm" glow={true} />
            </div>

            <div className="hidden xl:block">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                MFMS K.I.U
              </span>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="header-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member, phone, MAN-ID, student reg #..."
                className="w-full bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Center & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Themes & Watermark Customization Button */}
            {onOpenThemeDrawer && (
              <button
                id="header-btn-theme-watermark"
                onClick={onOpenThemeDrawer}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-xs font-semibold text-slate-200 transition-all active:scale-95 shadow-sm group"
                title="Change Background Theme & Watermark"
              >
                <div className="relative flex items-center justify-center">
                  <Palette className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full ring-1 ring-slate-900"
                    style={{ backgroundColor: themeConfig.accentColor }}
                  />
                </div>
                <span className="hidden sm:inline">Theme</span>
              </button>
            )}
            
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                id="header-btn-quick-actions"
                onClick={() => {
                  setShowQuickActions(!showQuickActions);
                  setShowRoleMenu(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition-all active:scale-95 border border-orange-400/30"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Quick Action</span>
              </button>

              {showQuickActions && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Operational Actions
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenRegister();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-slate-200 hover:text-indigo-300 text-xs flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium">Register Member</div>
                      <div className="text-[10px] text-slate-400">&lt; 2 min fast-track enrollment</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenQuickCheckIn();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-slate-200 hover:text-indigo-300 text-xs flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium">Fast Check-In</div>
                      <div className="text-[10px] text-slate-400">QR Code / Phone # scanner</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenRecordIncome();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-slate-200 hover:text-indigo-300 text-xs flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium">Record Giving / Income</div>
                      <div className="text-[10px] text-slate-400">Offerings, tithes, project funds</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenExpenseRequest();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-slate-200 hover:text-indigo-300 text-xs flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-rose-500/10 text-rose-400">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium">Submit Expense Request</div>
                      <div className="text-[10px] text-slate-400">Department / Event requisition</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenBroadcast();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-slate-200 hover:text-indigo-300 text-xs flex items-center gap-2.5 transition-colors"
                  >
                    <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium">Send Broadcast</div>
                      <div className="text-[10px] text-slate-400">SMS / Fellowship announcement</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="header-btn-notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowQuickActions(false);
                  setShowRoleMenu(false);
                }}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-300 border-b border-slate-800 flex items-center justify-between">
                    <span>Operational Alerts</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {totalNotifications} pending
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {pendingFollowUps > 0 && (
                      <div
                        onClick={() => {
                          setActiveTab('follow-up');
                          setShowNotifications(false);
                        }}
                        className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors text-xs"
                      >
                        <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {pendingFollowUps} First-Timers Awaiting Follow-Up
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Assigned coordinators should log introductory contact calls.
                        </p>
                      </div>
                    )}

                    {pendingApprovals > 0 && (
                      <div
                        onClick={() => {
                          setActiveTab('finances');
                          setShowNotifications(false);
                        }}
                        className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors text-xs"
                      >
                        <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          {pendingApprovals} Pending Expense Requisitions
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Treasury approval required for disbursement.
                        </p>
                      </div>
                    )}

                    {totalNotifications === 0 && (
                      <div className="p-4 text-center text-slate-500 text-xs">
                        All workflows current! No pending bottlenecks.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                id="header-btn-role-switcher"
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowQuickActions(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <div className="text-left hidden md:block">
                  <div className="font-semibold leading-tight text-slate-100">{currentUserRole}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Switch Role View</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="RBAC Active" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                    <span>Role-Based Access (RBAC)</span>
                    <span className="text-[9px] text-indigo-400">Simulation</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto py-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          setCurrentUserRole(r.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start gap-2 ${
                          currentUserRole === r.role
                            ? 'bg-indigo-500/15 text-indigo-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Shield className={`w-3.5 h-3.5 mt-0.5 ${currentUserRole === r.role ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <div>
                          <div>{r.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 px-3 pt-2 pb-1 text-[10px] text-slate-500">
                    Switching roles adjusts permission guards and views across the system.
                  </div>
                </div>
              )}
            </div>

            {/* Quick backup button */}
            <button
              onClick={exportBackupJson}
              title="Backup Manifest Database"
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors hidden sm:block"
            >
              <Download className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
