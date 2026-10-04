import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  HeartHandshake,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface BottomTaskbarProps {
  onOpenThemeDrawer?: () => void;
}

export const BottomTaskbar: React.FC<BottomTaskbarProps> = () => {
  const {
    activeTab,
    setActiveTab,
    members = [],
    departments = [],
    homes = [],
    isAdminAuthenticated,
  } = useFellowship();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Registration Dashboard',
      shortLabel: 'Intake',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'groups',
      label: 'Fellowship Families',
      shortLabel: 'Families',
      icon: HeartHandshake,
      badge: departments.length + homes.length,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'admin',
      label: isAdminAuthenticated ? 'Admin Portal' : 'Admin Portal (Locked)',
      shortLabel: 'Admin',
      icon: isAdminAuthenticated ? ShieldCheck : Lock,
      badge: null,
      adminOnly: true,
    },
  ];

  return (
    <nav
      id="bottom-taskbar"
      aria-label="Bottom Taskbar Navigation"
      className="sticky bottom-0 z-30 w-full bg-[#090b14]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 flex items-center justify-center gap-1.5 sm:gap-4">
        
        {/* Main Navigation Taskbar Items */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-none py-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-md shadow-orange-500/25 scale-[1.02]'
                    : item.id === 'admin' && isAdminAuthenticated
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title={item.label}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : item.id === 'admin' && isAdminAuthenticated ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span className="hidden sm:inline whitespace-nowrap">{item.label}</span>
                <span className="inline sm:hidden whitespace-nowrap">{item.shortLabel}</span>

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

      </div>
    </nav>
  );
};
