import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import {
  LayoutDashboard,
  Users,
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
    isAdminAuthenticated,
  } = useFellowship();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Intake',
      icon: LayoutDashboard,
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
    },
    {
      id: 'groups',
      label: 'Families',
      icon: HeartHandshake,
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: isAdminAuthenticated ? ShieldCheck : Lock,
    },
  ];

  return (
    <nav
      id="bottom-taskbar"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#090b14]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-4 items-center h-[60px] px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'members' && activeTab === 'students') ||
            (item.id === 'admin' && activeTab === 'reports');

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] w-full py-1.5 rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'text-orange-400'
                  : item.id === 'admin' && isAdminAuthenticated
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute top-0.5 w-6 h-0.5 rounded-full bg-orange-400" />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'stroke-[2.4]' : 'stroke-[1.9]'
                }`}
              />
              <span className="text-[11px] font-semibold tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
