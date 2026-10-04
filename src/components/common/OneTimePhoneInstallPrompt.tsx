import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../utils/usePWAInstall';

const DISMISSED_KEY = 'manifest_phone_install_prompt_seen_v2';

export const OneTimePhoneInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user already dismissed or installed
    const alreadySeen = localStorage.getItem(DISMISSED_KEY) === 'true';
    if (alreadySeen || isInstalled) {
      setShowPrompt(false);
      return;
    }

    // Delay slightly for smooth entrance after page load
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        handleDismiss();
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      // Direct instruction fallback
      handleDismiss();
    }
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-orange-500/50 rounded-2xl p-4 shadow-2xl text-white relative">
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3 pr-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-orange-500/20 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Install on Phone Desktop</h4>
                <span className="px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 font-bold text-[9px]">
                  App
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Add Manifest Fellowship directly to your phone's home screen for fast mobile member entry and offline support.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-800 text-xs">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white font-medium text-[11px] cursor-pointer"
            >
              Later
            </button>
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install on Phone</span>
            </button>
          </div>

        </div>
      </div>

      {/* iOS Safari Instruction Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-orange-400" />
                <span>Install on iPhone / iPad</span>
              </h3>
              <button onClick={handleDismiss} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>Tap the <Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> <strong>Share</strong> button at the bottom of Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span>Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span>Tap <strong>Add</strong> at top-right to install the app on your phone.</span>
              </li>
            </ol>

            <button
              onClick={handleDismiss}
              className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
