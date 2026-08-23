import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { THEME_PRESETS } from '../../themeConstants';
import {
  LayoutDashboard,
  Users,
  QrCode,
  HeartHandshake,
  Home,
  Layers,
  Calendar,
  Wallet,
  MessageSquare,
  BarChart3,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Palette,
} from 'lucide-react';

interface SidebarProps {
  onOpenThemeDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenThemeDrawer }) => {
  const {
    activeTab,
    setActiveTab,
    members,
    followUps,
    expenses,
    events,
    currentUserRole,
    currentTheme,
    watermarkOpacity,
  } = useFellowship();

  const themeConfig = THEME_PRESETS[currentTheme] || THEME_PRESETS['obsidian-kiu'];

  const firstTimerCount = members.filter((m) => m.isFirstTimer || m.status === 'First Timer').length;
  const pendingFollowUps = followUps.filter((f) => f.status === 'Pending' || f.status === 'Assigned').length;
  const pendingApprovals = expenses.filter((e) => e.status === 'Pending Approval').length;
  const upcomingEvents = events.filter((e) => e.status === 'Upcoming' || e.status === 'Ongoing').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'members',
      label: 'Members & Students',
      icon: Users,
      badge: members.length,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'attendance',
      label: 'Fast Attendance',
      icon: QrCode,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'follow-up',
      label: 'First-Timers & Care',
      icon: HeartHandshake,
      badge: pendingFollowUps > 0 ? pendingFollowUps : null,
      badgeColor: 'bg-orange-500 text-slate-950 font-bold',
    },
    {
      id: 'homes',
      label: 'Homes Fellowship',
      icon: Home,
      badge: null,
    },
    {
      id: 'departments',
      label: 'Ministries & Depts',
      icon: Layers,
      badge: null,
    },
    {
      id: 'events',
      label: 'Events & Gatherings',
      icon: Calendar,
      badge: upcomingEvents > 0 ? upcomingEvents : null,
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      id: 'finances',
      label: 'Financial Accountability',
      icon: Wallet,
      badge: pendingApprovals > 0 ? `${pendingApprovals} req` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'communication',
      label: 'Communication Hub',
      icon: MessageSquare,
      badge: null,
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'admin',
      label: 'Admin & Audit Logs',
      icon: ShieldAlert,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#090b14]/95 border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] z-10">
      {/* Philosophy motto snippet */}
      <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-inner">
        <div className="text-[10px] uppercase font-bold tracking-wider text-orange-400 flex items-center gap-1 mb-1">
          <Sparkles className="w-3 h-3 text-orange-400" />
          Fellowship Lifecycle
        </div>
        <p className="text-[11px] text-slate-300 font-medium leading-snug">
          Register → Connect → Engage → Follow Up → Serve → Account
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-orange-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-slate-950 text-orange-400 border border-orange-500/40'
                      : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Themes & Watermark quick launcher */}
      {onOpenThemeDrawer && (
        <div className="px-3 py-1">
          <button
            onClick={onOpenThemeDrawer}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/30 text-xs text-slate-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] font-semibold">Theme & Watermark</span>
            </div>
            <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
              {Math.round(watermarkOpacity * 100)}%
            </span>
          </button>
        </div>
      )}

      {/* Active Role Info card */}
      <div className="p-3 m-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400">Current Role</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Active
          </span>
        </div>
        <div className="text-xs font-bold text-slate-100 truncate">{currentUserRole}</div>
        <div className="text-[10px] text-slate-400 mt-1">
          Manifest Fellowship Management System
        </div>
      </div>
    </aside>
  );
};

