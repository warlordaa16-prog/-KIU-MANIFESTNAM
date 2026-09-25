import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { ManifestLogo } from './ManifestLogo';
import { exportMembersToCsv } from '../../utils/exportUtils';
import {
  Search,
  Shield,
  Download,
  FileSpreadsheet,
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
    searchQuery,
    setSearchQuery,
    setActiveTab,
    exportBackupJson,
    currentUserName,
    activeOperator,
    members = [],
    homes = [],
    departments = [],
  } = useFellowship();

  const handleDownloadCsv = () => {
    exportMembersToCsv(members, homes, departments);
  };

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

          {/* Action Center: Model Admin & CSV Download */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Active Data Entry Operator Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-xs font-bold text-slate-200 shadow-sm hidden sm:flex">
              <div className={`w-2.5 h-2.5 rounded-full ${activeOperator?.avatarColor || 'bg-emerald-500'} ring-1 ring-white/20`} />
              <span className="text-emerald-300 font-extrabold">{currentUserName}</span>
            </div>

            {/* Model Admin Single Role Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-300 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span>{currentUserRole || 'Model Admin'}</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5" title="Model Admin Active" />
            </div>

            {/* Model Admin Download CSV Button */}
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Download Fellowship CSV Roster"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Download CSV</span>
            </button>

            {/* Quick backup button */}
            <button
              onClick={exportBackupJson}
              title="Backup Manifest Database"
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors hidden sm:block"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Register Member CTA */}
            <button
              id="header-btn-register-member"
              onClick={onOpenRegister}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              + Register
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
