import React from 'react';
import { ManifestLogo } from './ManifestLogo';

export interface WatermarkBackgroundProps {
  opacity?: number; // 0.05 to 0.70
  theme?: string;
  glow?: boolean;
  position?: 'center' | 'top-right' | 'diagonal' | 'layered';
}

export const WatermarkBackground: React.FC<WatermarkBackgroundProps> = ({
  opacity = 0.32, // Strong default fill as requested
  theme = 'obsidian-kiu',
  glow = true,
  position = 'center',
}) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none flex items-center justify-center transition-all duration-700"
    >
      {/* Dynamic Ambient Color Aura based on active theme */}
      <div
        className={`absolute w-[700px] h-[500px] rounded-full blur-[140px] transition-all duration-700 opacity-30 ${
          theme === 'obsidian-kiu'
            ? 'bg-gradient-to-r from-orange-600/40 via-amber-500/30 to-orange-700/20'
            : theme === 'midnight-navy'
            ? 'bg-gradient-to-r from-blue-600/40 via-indigo-500/30 to-sky-500/20'
            : theme === 'emerald-sanctuary'
            ? 'bg-gradient-to-r from-emerald-600/40 via-teal-500/30 to-amber-500/20'
            : theme === 'royal-amethyst'
            ? 'bg-gradient-to-r from-purple-600/40 via-fuchsia-500/30 to-amber-500/20'
            : theme === 'velvet-charcoal'
            ? 'bg-gradient-to-r from-orange-500/25 via-slate-600/30 to-amber-600/20'
            : 'bg-gradient-to-r from-orange-300/30 via-slate-200/40 to-amber-200/30'
        }`}
      />

      {/* Primary Central Strong Watermark */}
      <div
        className={`relative max-w-4xl w-full px-6 transition-all duration-500 transform ${
          position === 'center'
            ? 'scale-100 md:scale-110 lg:scale-125'
            : position === 'diagonal'
            ? 'rotate-[-12deg] scale-110'
            : 'translate-x-1/4 -translate-y-1/4 scale-90'
        }`}
      >
        <ManifestLogo
          variant="watermark"
          size="watermark"
          watermarkOpacity={opacity}
          glow={glow}
          primaryColor={theme === 'clean-ivory' ? '#d95a00' : '#FF8400'}
          subtextColor={theme === 'clean-ivory' ? '#1e293b' : '#FFFFFF'}
          className="w-full drop-shadow-[0_0_35px_rgba(255,132,0,0.2)]"
        />
      </div>

      {/* Subtle secondary corner watermark stamp */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 opacity-15 rotate-[-15deg] hidden xl:block">
        <ManifestLogo
          variant="watermark"
          size="xl"
          watermarkOpacity={opacity * 0.6}
          primaryColor="#FF8400"
        />
      </div>

      {/* Corner Top-Left watermark stamp */}
      <div className="absolute -top-16 -left-16 w-80 h-80 opacity-10 rotate-[10deg] hidden xl:block">
        <ManifestLogo
          variant="watermark"
          size="xl"
          watermarkOpacity={opacity * 0.4}
          primaryColor="#FF8400"
        />
      </div>
    </div>
  );
};
