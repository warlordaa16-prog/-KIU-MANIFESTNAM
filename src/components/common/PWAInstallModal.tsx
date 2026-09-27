import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  Copy,
  Check,
  X,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { usePWAInstall } from '../../utils/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'phone' | 'ios' | 'android'>(
    isIOS ? 'ios' : 'android'
  );

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (isOpen && currentUrl) {
      QRCode.toDataURL(currentUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-white space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-orange-500/20 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white">Install App on Phone</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                PWA Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Use this very application as an installed app on your phone’s desktop/home screen with offline access and full features.
            </p>
          </div>
        </div>

        {/* Already Installed Notification */}
        {isInstalled && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>The application is already running in installed standalone mode!</span>
          </div>
        )}

        {/* Direct One-Click Install (if Android / Chrome / Edge prompt is ready) */}
        {isInstallable && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-xs">Direct 1-Click Installation Available</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Install directly onto this device's desktop/home screen.</div>
            </div>
            <button
              onClick={handleDirectInstall}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Install Now</span>
            </button>
          </div>
        )}

        {/* Platform Tabs */}
        <div className="flex border-b border-slate-800 text-xs">
          <button
            onClick={() => setActivePlatform('android')}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition-colors cursor-pointer ${
              activePlatform === 'android'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Android Phone
          </button>
          <button
            onClick={() => setActivePlatform('ios')}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition-colors cursor-pointer ${
              activePlatform === 'ios'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            iPhone / iPad (iOS)
          </button>
          <button
            onClick={() => setActivePlatform('phone')}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition-colors cursor-pointer ${
              activePlatform === 'phone'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Scan QR Code
          </button>
        </div>

        {/* Tab 1: Android Instructions */}
        {activePlatform === 'android' && (
          <div className="space-y-3 text-xs">
            <div className="font-semibold text-slate-200">How to install on Android (Chrome / Samsung Internet):</div>
            <ol className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>Open this link in <strong>Chrome</strong> on your Android phone.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span>Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                <span>The app will appear on your phone desktop with its native icon!</span>
              </li>
            </ol>
          </div>
        )}

        {/* Tab 2: iOS Safari Instructions */}
        {activePlatform === 'ios' && (
          <div className="space-y-3 text-xs">
            <div className="font-semibold text-slate-200">How to install on iPhone or iPad (Safari):</div>
            <ol className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>Open this link in <strong>Safari</strong> on your iPhone or iPad.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Tap the <Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> <strong>Share</strong> button at the bottom of the screen.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> <strong>"Add to Home Screen"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                <span>Tap <strong>"Add"</strong> in the top-right corner. It will be installed directly on your home screen!</span>
              </li>
            </ol>
          </div>
        )}

        {/* Tab 3: QR Code to scan with phone */}
        {activePlatform === 'phone' && (
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-850 border border-slate-800">
            {qrCodeUrl ? (
              <div className="p-2 bg-white rounded-2xl shadow-lg shrink-0">
                <img src={qrCodeUrl} alt="Scan QR Code to open on phone" className="w-36 h-36 rounded-lg" />
              </div>
            ) : (
              <div className="w-36 h-36 bg-slate-800 rounded-2xl animate-pulse shrink-0" />
            )}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white text-sm">Scan with Phone Camera</div>
              <p className="text-slate-300 leading-relaxed">
                Open your phone's camera app and point it at this QR code to instantly open and install the application directly on your phone.
              </p>
              <div className="text-[11px] text-amber-300/90 font-medium">
                Works on all Android phones, iPhones, and iPads.
              </div>
            </div>
          </div>
        )}

        {/* Shareable Link Box */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Application Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono select-all focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Copy application link to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="text-slate-400 text-[11px]">
            Full offline support & fast desktop launcher
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
