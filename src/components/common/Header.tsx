import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { UserRole } from '../../types';
import { ManifestLogo } from './ManifestLogo';
import {
  Search,
  Shield,
  Download,
} from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenThemeDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegister,
}) => {
  const {
    currentUserRole,
    setCurrentUserRole,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    exportBackupJson,
  } = useFellowship();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'Super Admin', label: 'Super Admin', desc: 'Full unrestricted system access' },
    { role: 'Fellowship Admin', label: 'Fellowship Admin', desc: 'General fellowship operations & members' },
    { role: 'Coordinator', label: 'Fellowship Coordinator', desc: 'Fellowship activities & community coordination' },
    { role: 'Auditor', label: 'Auditor', desc: 'Read-only audit logs' },
    { role: 'Member', label: 'Fellowship Member', desc: 'Personal ID pass & fellowship activities' },
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
                KIU & Makindye Hub
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
                placeholder="Search member, phone, MAN-ID..."
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
            {/* Role Switcher */}
            <div className="relative">
              <button
                id="header-btn-role-switcher"
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
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
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <span>Role-Based Access (RBAC)</span>
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
