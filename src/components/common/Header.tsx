import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { ManifestLogo } from './ManifestLogo';
import {
  Search,
  Shield,
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
} from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenThemeDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegister,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    setActiveTab,
    activeTab,
    isAdminAuthenticated,
    adminLogout,
  } = useFellowship();

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
                placeholder="Search member, phone, PIN..."
                className="w-full bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Center: Admin Portal & Register */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Secure Admin Portal Button */}
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-850 border-emerald-500/30 text-emerald-400'
                  }`}
                  title="Open Admin Portal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Portal</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5 animate-pulse" />
                </button>

                <button
                  onClick={adminLogout}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Lock Admin Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-750 text-slate-300 hover:text-white'
                }`}
                title="Access Secure Admin Portal (Password Required)"
              >
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* Register Member CTA */}
            <button
              id="header-btn-register-member"
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Register</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
