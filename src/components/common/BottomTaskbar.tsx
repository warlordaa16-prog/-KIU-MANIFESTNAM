import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  BarChart3,
  Globe,
  Palette,
  Sparkles,
  Shield,
} from 'lucide-react';

interface BottomTaskbarProps {
  onOpenThemeDrawer?: () => void;
}

export const BottomTaskbar: React.FC<BottomTaskbarProps> = ({ onOpenThemeDrawer }) => {
  const {
    activeTab,
    setActiveTab,
    members = [],
    departments = [],
    homes = [],
    currentUserRole,
    watermarkOpacity,
  } = useFellowship();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'members',
      label: 'Members & Students',
      shortLabel: 'Members',
      icon: Users,
      badge: members.length,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'groups',
      label: 'Fellowship Groups',
      shortLabel: 'Groups',
      icon: Layers,
      badge: departments.length + homes.length,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'reports',
      label: 'Reports & Exports',
      shortLabel: 'Reports',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <nav
      id="bottom-taskbar"
      aria-label="Bottom Taskbar Navigation"
      className="sticky bottom-0 z-30 w-full bg-[#090b14]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Left: Role / Status Info (hidden on mobile, visible on lg+) */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-200 truncate max-w-[120px]">{currentUserRole}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-[10px] text-orange-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>K.I.U Fellowship</span>
          </div>
        </div>

        {/* Center: Main Navigation Taskbar Items */}
        <div className="flex-1 flex items-center justify-center sm:justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-md shadow-orange-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title={item.label}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'
                  }`}
                />
                <span className="hidden md:inline whitespace-nowrap">{item.label}</span>
                <span className="inline md:hidden whitespace-nowrap">{item.shortLabel}</span>

                {item.badge !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
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
        </div>

        {/* Right: Theme & Watermark Quick Launcher */}
        {onOpenThemeDrawer && (
          <div className="shrink-0">
            <button
              id="bottom-taskbar-theme-btn"
              onClick={onOpenThemeDrawer}
              title={`Theme & Watermark (${Math.round(watermarkOpacity * 100)}%)`}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer group"
            >
              <Palette className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="hidden sm:inline text-[11px] font-semibold">Theme</span>
              <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                {Math.round(watermarkOpacity * 100)}%
              </span>
            </button>
          </div>
        )}

      </div>
    </nav>
  );
};
