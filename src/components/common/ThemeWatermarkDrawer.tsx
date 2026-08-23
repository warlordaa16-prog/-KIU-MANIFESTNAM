import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { THEME_PRESETS } from '../../themeConstants';
import { ThemeKey } from '../../types';
import { ManifestLogo } from './ManifestLogo';
import { Palette, Sparkles, Sliders, Check, Sun, Moon, Eye, X } from 'lucide-react';

interface ThemeWatermarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeWatermarkDrawer: React.FC<ThemeWatermarkDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentTheme,
    setCurrentTheme,
    watermarkOpacity,
    setWatermarkOpacity,
    isWatermarkGlow,
    setIsWatermarkGlow,
    showToast,
  } = useFellowship();

  if (!isOpen) return null;

  const opacityPresets = [
    { label: 'Subtle', value: 0.15, desc: 'Gentle backdrop' },
    { label: 'Medium', value: 0.28, desc: 'Balanced presence' },
    { label: 'Strong Fill', value: 0.42, desc: 'Vibrant watermark' },
    { label: 'Ultra Bold', value: 0.65, desc: 'High-impact crest' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Brand & Theme Engine
              </h2>
              <p className="text-xs text-slate-400">
                Manifest Fellowship K.I.U Appearance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 space-y-6 flex-1">
          
          {/* Logo Spotlight */}
          <div className="p-4 rounded-2xl bg-black/60 border border-orange-500/30 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <Sparkles className="w-16 h-16 text-orange-400" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-2">
                Official System Logo & Identity
              </div>
              <div className="bg-black/90 p-4 rounded-xl border border-slate-800 w-full flex items-center justify-center mb-2">
                <ManifestLogo variant="full" size="md" glow={true} />
              </div>
              <div className="text-xs text-slate-300 font-medium">
                Manifest Fellowship K.I.U
              </div>
              <div className="text-[10px] text-slate-400">
                Orange Serif Wordmark • White &lsquo;i&rsquo; Accent • Sans-Serif Subtitles
              </div>
            </div>
          </div>

          {/* Section 1: Background Color Themes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-orange-400" />
                Background Color Themes
              </label>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                {Object.keys(THEME_PRESETS).length} Presets
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(THEME_PRESETS) as ThemeKey[]).map((themeKey) => {
                const theme = THEME_PRESETS[themeKey];
                const isSelected = currentTheme === themeKey;

                return (
                  <button
                    key={themeKey}
                    onClick={() => {
                      setCurrentTheme(themeKey);
                      showToast(`Switched theme to ${theme.name}`, 'info');
                    }}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/30 bg-slate-850 shadow-md shadow-orange-500/10'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/90'
                    }`}
                  >
                    {/* Theme color preview swatch */}
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-slate-700 shadow-inner flex items-center justify-center"
                          style={{ backgroundColor: theme.previewBg }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.previewAccent }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-100">
                          {theme.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="p-0.5 rounded-full bg-orange-500 text-slate-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {theme.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Watermark Fill Intensity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-orange-400" />
                Watermark Fill & Presence
              </label>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                {Math.round(watermarkOpacity * 100)}% Opacity
              </span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {opacityPresets.map((preset) => {
                const isActive = Math.abs(watermarkOpacity - preset.value) < 0.05;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setWatermarkOpacity(preset.value);
                      showToast(`Watermark set to ${preset.label}`, 'info');
                    }}
                    className={`py-2 px-1 rounded-lg text-center border transition-all ${
                      isActive
                        ? 'bg-orange-500 text-slate-950 font-bold border-orange-400 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 text-xs'
                    }`}
                  >
                    <div className="text-[11px] leading-tight font-semibold">
                      {preset.label}
                    </div>
                    <div className="text-[9px] opacity-75">
                      {Math.round(preset.value * 100)}%
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continuous Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Subtle (0%)</span>
                <span>Strong Fill (100%)</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.02"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Ambient Aura Glow Toggle */}
            <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Ambient Watermark Aura
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Soft radiant backlight behind the fellowship logo
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWatermarkGlow}
                  onChange={(e) => setIsWatermarkGlow(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          {/* Watermark Mini Preview Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Live Stage Appearance
            </div>
            <div className="relative h-28 rounded-lg bg-[#050507] border border-slate-800/80 overflow-hidden flex items-center justify-center p-3">
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: watermarkOpacity }}
              >
                <ManifestLogo variant="watermark" size="md" glow={isWatermarkGlow} />
              </div>
              <div className="relative z-10 text-center">
                <div className="text-xs font-bold text-white drop-shadow-md">
                  Fellowship Active Workspace
                </div>
                <div className="text-[10px] text-slate-400">
                  Cards & metrics render smoothly above the watermark
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentTheme('obsidian-kiu');
              setWatermarkOpacity(0.35);
              setIsWatermarkGlow(true);
              showToast('Restored default Manifest branding & watermark', 'success');
            }}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            Apply Changes
          </button>
        </div>

      </div>
    </div>
  );
};
