import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../utils/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideSheet, setShowGuideSheet] = useState(false);

  // Automatically hide when running as an installed standalone mobile app
  if (isInstalled) {
    return null;
  }

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuideSheet(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleTriggerInstall}
        className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        title="Install Mobile App"
        aria-label="Install Mobile App"
      >
        <Download className="w-4 h-4 text-orange-400 shrink-0" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {/* Bottom Sheet Installation Guide (iOS Safari & Browsers without beforeinstallprompt) */}
      {showGuideSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowGuideSheet(false)}
        >
          <div
            className="w-full sm:max-w-md bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-2xl p-5 pb-safe text-white shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Install Manifest App</h3>
                  <p className="text-xs text-slate-400">Run full-screen with offline storage</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideSheet(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <span>
                    Tap the <Share2 className="w-4 h-4 text-blue-400 inline mx-0.5" /> <strong>Share</strong> button in the Safari toolbar.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <span>
                    Scroll down and tap <PlusSquare className="w-4 h-4 text-emerald-400 inline mx-0.5" /> <strong>Add to Home Screen</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top-right corner to launch Manifest as a mobile app.
                  </span>
                </li>
              </ol>
            ) : (
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    Open your browser menu (<strong>⋮</strong> on Chrome/Android or install icon in the address bar) and select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  Once installed, Manifest opens full-screen without browser bars and works offline using local device storage.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuideSheet(false)}
              className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
