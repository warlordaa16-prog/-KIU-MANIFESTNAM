import React, { useState, useEffect } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { THEME_PRESETS } from '../../themeConstants';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  BarChart3,
  ShieldAlert,
  Sparkles,
  Palette,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  onOpenThemeDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenThemeDrawer }) => {
  const {
    activeTab,
    setActiveTab,
    members = [],
    followUps = [],
    currentUserRole,
    currentTheme,
    watermarkOpacity,
  } = useFellowship();

  // Collapsible state (saved in localStorage so it remembers user preference)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('manifest_sidebar_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('manifest_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const pendingFollowUps = (followUps || []).filter(
    (f) => f.status === 'Pending' || f.status === 'Assigned'
  ).length;

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
      id: 'follow-up',
      label: 'First-Timers & Care',
      icon: HeartHandshake,
      badge: pendingFollowUps > 0 ? pendingFollowUps : null,
      badgeColor: 'bg-orange-500 text-slate-950 font-bold',
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
    <aside
      className={`relative bg-[#090b14]/95 border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Floating Push-In / Pull-Out Arrow Tab Button on the edge */}
      <button
        onClick={toggleCollapse}
        id="sidebar-collapse-toggle-arrow"
        aria-label={isCollapsed ? 'Pull out sidebar' : 'Push in sidebar'}
        title={isCollapsed ? 'Pull out menu (Expand)' : 'Push in menu (Collapse to left)'}
        className="absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-950 flex items-center justify-center shadow-lg shadow-orange-500/30 border-2 border-slate-900 transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        ) : (
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
        )}
      </button>

      {/* Header bar inside sidebar */}
      <div className={`p-3 border-b border-slate-800/80 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </span>
            <button
              onClick={toggleCollapse}
              className="text-[10px] text-slate-400 hover:text-orange-400 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Push sidebar into left"
            >
              <span>Push in</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={toggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-slate-800 transition-colors"
            title="Pull out sidebar"
          >
            <ChevronRight className="w-4 h-4 text-orange-400" />
          </button>
        )}
      </div>

      {/* Philosophy motto snippet (expanded only) */}
      {!isCollapsed && (
        <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-inner">
          <div className="text-[10px] uppercase font-bold tracking-wider text-orange-400 flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-orange-400" />
            Fellowship Lifecycle
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-snug">
            Register → Connect → Engage → Follow Up → Disciple
          </p>
        </div>
      )}

      {/* Nav links */}
      <nav className={`flex-1 space-y-1.5 overflow-y-auto py-2 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
              className={`relative w-full flex items-center rounded-xl text-xs font-semibold transition-all group ${
                isCollapsed
                  ? 'justify-center p-2.5'
                  : 'justify-between px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-orange-400'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge !== null && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-slate-950 text-orange-400 border border-orange-500/40'
                      : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed dot badge */}
              {isCollapsed && item.badge !== null && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-slate-900" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Themes & Watermark quick launcher */}
      {onOpenThemeDrawer && (
        <div className={`py-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          <button
            onClick={onOpenThemeDrawer}
            title={isCollapsed ? `Theme & Watermark (${Math.round(watermarkOpacity * 100)}%)` : undefined}
            className={`w-full flex items-center rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/30 text-xs text-slate-300 hover:text-white transition-all group ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-12 transition-transform shrink-0" />
              {!isCollapsed && <span className="text-[11px] font-semibold">Theme & Watermark</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                {Math.round(watermarkOpacity * 100)}%
              </span>
            )}
          </button>
        </div>
      )}

      {/* Active Role Info card */}
      {!isCollapsed ? (
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
            Manifest Fellowship System
          </div>
        </div>
      ) : (
        <div className="p-2 mb-3 mx-2 flex justify-center" title={`Active Role: ${currentUserRole}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      )}
    </aside>
  );
};
