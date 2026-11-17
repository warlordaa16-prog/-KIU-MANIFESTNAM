import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { ManifestLogo } from './ManifestLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { Search, Plus, X } from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenThemeDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRegister }) => {
  const { searchQuery, setSearchQuery, setActiveTab, activeTab } = useFellowship();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && activeTab !== 'members' && activeTab !== 'dashboard' && activeTab !== 'admin') {
      setActiveTab('members');
    }
  };

  return (
    <header className="sticky top-0 z-30 pt-safe bg-[#090b14]/95 backdrop-blur-xl border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-8 h-14">
          {/* Mobile Search Expanded Bar */}
          {mobileSearchOpen ? (
            <div className="flex items-center gap-2 w-full md:hidden">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search member, phone, Saint 1..."
                  className="w-full min-h-[44px] bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setMobileSearchOpen(false);
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              {/* Zone 1: Clean Brand Wordmark */}
              <button
                type="button"
                className="flex items-center gap-2.5 cursor-pointer py-1 min-h-[44px] whitespace-nowrap shrink-0 text-left"
                onClick={() => setActiveTab('dashboard')}
                title="Manifest Fellowship"
              >
                <ManifestLogo variant="icon" size="sm" glow={true} />
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                  Manifest
                </span>
              </button>

              {/* Zone 2: Search Bar (Desktop) */}
              <div className="flex-1 max-w-md relative hidden md:block">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="header-global-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search member, phone, Saint 1..."
                    className="w-full bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-14 py-2 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Zone 3: Mobile Search Trigger + Install App + Primary CTA */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(true)}
                  className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  aria-label="Search members"
                  title="Search members"
                >
                  <Search className="w-5 h-5" />
                </button>

                <PWAInstallButton />

                <button
                  id="header-btn-register-member"
                  type="button"
                  onClick={onOpenRegister}
                  className="hidden sm:flex min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Register</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
