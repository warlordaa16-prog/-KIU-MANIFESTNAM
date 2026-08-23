import React from 'react';

export interface ManifestLogoProps {
  variant?: 'full' | 'compact' | 'badge' | 'watermark' | 'horizontal' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | 'watermark';
  className?: string;
  glow?: boolean;
  watermarkOpacity?: number;
  textColor?: string;
  primaryColor?: string;
  subtextColor?: string;
}

export const ManifestLogo: React.FC<ManifestLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  glow = false,
  watermarkOpacity = 0.25,
  primaryColor = '#FF8400', // Signature Manifest Orange
  subtextColor = '#FFFFFF',
}) => {
  // Size mappings
  const dimensions = {
    xs: { width: 100, height: 40, iconSize: 24, fontSize: '14px' },
    sm: { width: 140, height: 56, iconSize: 32, fontSize: '18px' },
    md: { width: 200, height: 80, iconSize: 42, fontSize: '24px' },
    lg: { width: 280, height: 112, iconSize: 56, fontSize: '32px' },
    xl: { width: 380, height: 152, iconSize: 72, fontSize: '44px' },
    '2xl': { width: 500, height: 200, iconSize: 96, fontSize: '58px' },
    hero: { width: 680, height: 270, iconSize: 120, fontSize: '78px' },
    watermark: { width: 850, height: 340, iconSize: 180, fontSize: '96px' },
  }[size];

  // If icon only (for avatars, app icon badges)
  if (variant === 'icon' || variant === 'badge') {
    return (
      <div
        className={`relative flex items-center justify-center rounded-xl overflow-hidden select-none ${
          glow ? 'shadow-lg shadow-orange-500/30' : ''
        } ${className}`}
        style={{
          width: dimensions.iconSize,
          height: dimensions.iconSize,
          background: 'linear-gradient(135deg, #0f0f11 0%, #000000 100%)',
          border: '1px solid rgba(255, 132, 0, 0.4)',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle radial glow inside icon */}
          <circle cx="50" cy="50" r="45" fill="#FF8400" fillOpacity="0.12" />
          
          {/* Stylized M with serif flare and white dot on top right */}
          <path
            d="M 22 76 L 22 28 C 22 26 24 24 27 24 C 30 24 33 26 36 30 L 50 56 L 64 30 C 67 26 70 24 73 24 C 76 24 78 26 78 28 L 78 76 C 78 78 76 80 73 80 C 70 80 68 78 68 76 L 68 38 L 54 65 C 52 68 48 68 46 65 L 32 38 L 32 76 C 32 78 30 80 27 80 C 24 80 22 78 22 76 Z"
            fill={primaryColor}
          />
          {/* Distinctive White Dot from Manifest Logo 'i' accent */}
          <circle cx="78" cy="22" r="5.5" fill="#FFFFFF" />
          
          {/* Base underline in orange */}
          <rect x="20" y="85" width="60" height="4" rx="2" fill={primaryColor} />
        </svg>
      </div>
    );
  }

  // Watermark Variant with strong silhouette & fill
  if (variant === 'watermark') {
    return (
      <div
        className={`pointer-events-none select-none relative flex items-center justify-center ${className}`}
        style={{ opacity: watermarkOpacity }}
      >
        <svg
          viewBox="0 0 800 320"
          className="w-full h-auto max-w-5xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient Glow Fill */}
          <filter id="watermark-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <g filter={glow ? 'url(#watermark-glow)' : undefined}>
            {/* MANIFEST Serif Lettering */}
            <g id="manifest-word">
              {/* M */}
              <path
                d="M 40 160 L 40 50 C 40 45 44 40 50 40 C 56 40 62 44 68 52 L 102 110 L 136 52 C 142 44 148 40 154 40 C 160 40 164 45 164 50 L 164 160 C 164 165 159 168 153 168 C 147 168 143 164 143 160 L 143 72 L 111 128 C 107 134 97 134 93 128 L 61 72 L 61 160 C 61 165 57 168 51 168 C 45 168 40 164 40 160 Z"
                fill={primaryColor}
              />
              
              {/* a */}
              <path
                d="M 180 125 C 180 100 198 84 224 84 C 248 84 262 98 262 118 L 262 160 C 262 165 258 168 252 168 C 246 168 242 165 242 160 L 242 152 C 236 163 223 169 209 169 C 190 169 176 155 176 136 C 176 117 192 105 218 103 L 242 101 L 242 98 C 242 89 234 83 222 83 C 211 83 203 88 200 96 C 198 100 194 102 189 101 C 184 100 180 96 180 91 C 180 88 180 125 180 125 Z M 242 117 L 222 119 C 205 120 196 127 196 137 C 196 146 204 153 216 153 C 231 153 242 142 242 127 L 242 117 Z"
                fill={primaryColor}
              />

              {/* n */}
              <path
                d="M 285 160 L 285 92 C 285 86 289 83 295 83 C 301 83 305 86 305 92 L 305 101 C 313 89 328 83 343 83 C 367 83 379 97 379 122 L 379 160 C 379 165 375 168 369 168 C 363 168 359 165 359 160 L 359 123 C 359 107 350 99 334 99 C 320 99 305 110 305 128 L 305 160 C 305 165 301 168 295 168 C 289 168 285 165 285 160 Z"
                fill={primaryColor}
              />

              {/* i (Stylized Distinctive White Dot & Stem) */}
              <g id="watermark-i-accent">
                {/* White Dot */}
                <ellipse cx="432" cy="52" rx="19" ry="21" fill="#FFFFFF" />
                {/* White Stem */}
                <path
                  d="M 419 86 C 419 82 422 79 428 79 L 436 79 C 442 79 445 82 445 86 L 445 161 C 445 165 442 168 436 168 L 428 168 C 422 168 419 165 419 161 Z"
                  fill="#FFFFFF"
                />
              </g>

              {/* f */}
              <path
                d="M 470 160 L 470 98 L 458 98 C 453 98 450 95 450 90 C 450 85 453 82 458 82 L 470 82 L 470 65 C 470 47 483 36 504 36 C 512 36 520 38 524 41 C 528 44 529 48 527 52 C 525 56 520 58 516 56 C 513 54 509 53 504 53 C 494 53 489 59 489 70 L 489 82 L 512 82 C 517 82 520 85 520 90 C 520 95 517 98 512 98 L 489 98 L 489 160 C 489 165 485 168 479 168 C 474 168 470 165 470 160 Z"
                fill={primaryColor}
              />

              {/* e */}
              <path
                d="M 535 125 C 535 101 552 84 577 84 C 602 84 618 101 618 126 C 618 129 617 131 614 131 L 555 131 C 557 145 567 154 580 154 C 590 154 597 149 601 142 C 603 138 607 136 611 138 C 616 140 618 145 616 149 C 609 161 596 169 580 169 C 554 169 535 151 535 125 Z M 577 99 C 565 99 557 107 555 119 L 598 119 C 596 107 588 99 577 99 Z"
                fill={primaryColor}
              />

              {/* s */}
              <path
                d="M 632 150 C 632 144 636 140 642 140 C 646 140 650 143 652 146 C 657 152 666 156 676 156 C 687 156 694 151 694 144 C 694 137 687 133 671 129 C 648 123 636 114 636 99 C 636 85 649 74 668 74 C 682 74 694 79 702 87 C 705 90 705 95 702 98 C 699 101 694 101 691 97 C 685 91 677 88 668 88 C 659 88 653 92 653 98 C 653 104 660 108 676 112 C 699 118 711 127 711 142 C 711 158 697 170 676 170 C 659 170 644 162 635 152 C 633 151 632 150 632 150 Z"
                fill={primaryColor}
              />

              {/* t with horizontal continuation flourish */}
              <path
                d="M 724 148 C 724 159 731 167 745 167 C 753 167 761 164 766 161 C 770 159 775 161 776 166 C 778 170 776 175 771 178 C 763 182 752 185 741 185 C 720 185 706 172 706 151 L 706 98 L 696 98 C 691 98 688 95 688 90 C 688 85 691 82 696 82 L 706 82 L 706 58 C 706 53 710 50 715 50 C 720 50 724 53 724 58 L 724 82 L 760 82 C 765 82 768 85 768 90 C 768 95 765 98 760 98 L 724 98 Z"
                fill={primaryColor}
              />
              <rect x="745" y="80" width="30" height="4" rx="2" fill={primaryColor} />
            </g>

            {/* FELLOWSHIP Bar & Text */}
            <g id="fellowship-group">
              <rect x="290" y="185" width="460" height="4" fill={primaryColor} />
              
              <text
                x="520"
                y="225"
                textAnchor="middle"
                fill={subtextColor}
                fontSize="40"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="7"
              >
                FELLOWSHIP
              </text>

              <rect x="290" y="242" width="460" height="4" fill={primaryColor} />
            </g>

            {/* K.I.U Spaced Text & Underline */}
            <g id="kiu-group">
              <text
                x="520"
                y="295"
                textAnchor="middle"
                fill={subtextColor}
                fontSize="48"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="18"
              >
                K . I . U
              </text>

              <rect x="290" y="312" width="460" height="5" fill={primaryColor} />
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // Full Branded Vector Logo (Hero, Header, Splash, ID Passes, Cards)
  return (
    <div
      className={`inline-flex items-center select-none ${
        glow ? 'drop-shadow-[0_0_20px_rgba(255,132,0,0.35)]' : ''
      } ${className}`}
      style={{
        width: dimensions.width,
        height: 'auto',
      }}
    >
      <svg
        viewBox="0 0 760 310"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="manifest-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA133" />
            <stop offset="60%" stopColor="#FF8000" />
            <stop offset="100%" stopColor="#E66500" />
          </linearGradient>

          <filter id="soft-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FF8400" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Word: Manifest */}
        <g id="full-manifest-title">
          {/* M - Bold Serif Display */}
          <path
            d="M 18 160 L 18 36 C 18 30 23 25 30 25 C 37 25 44 30 50 39 L 90 102 L 130 39 C 136 30 143 25 150 25 C 157 25 162 30 162 36 L 162 160 C 162 166 156 170 150 170 C 144 170 139 166 139 160 L 139 65 L 100 126 C 96 132 84 132 80 126 L 41 65 L 41 160 C 41 166 36 170 30 170 C 24 170 18 166 18 160 Z"
            fill="url(#manifest-orange-grad)"
          />

          {/* a */}
          <path
            d="M 180 125 C 180 100 198 84 224 84 C 248 84 262 98 262 118 L 262 160 C 262 165 258 168 252 168 C 246 168 242 165 242 160 L 242 152 C 236 163 223 169 209 169 C 190 169 176 155 176 136 C 176 117 192 105 218 103 L 242 101 L 242 98 C 242 89 234 83 222 83 C 211 83 203 88 200 96 C 198 100 194 102 189 101 C 184 100 180 96 180 91 C 180 88 180 125 180 125 Z M 242 117 L 222 119 C 205 120 196 127 196 137 C 196 146 204 153 216 153 C 231 153 242 142 242 127 L 242 117 Z"
            fill="url(#manifest-orange-grad)"
          />

          {/* n */}
          <path
            d="M 285 160 L 285 92 C 285 86 289 83 295 83 C 301 83 305 86 305 92 L 305 101 C 313 89 328 83 343 83 C 367 83 379 97 379 122 L 379 160 C 379 165 375 168 369 168 C 363 168 359 165 359 160 L 359 123 C 359 107 350 99 334 99 C 320 99 305 110 305 128 L 305 160 C 305 165 301 168 295 168 C 289 168 285 165 285 160 Z"
            fill="url(#manifest-orange-grad)"
          />

          {/* Distinctive White 'i' with Bold Circular Dot */}
          <g id="manifest-i-white">
            <ellipse cx="412" cy="46" rx="18" ry="20" fill="#FFFFFF" />
            <path
              d="M 400 82 C 400 78 403 75 408 75 L 416 75 C 421 75 424 78 424 82 L 424 161 C 424 165 421 168 416 168 L 408 168 C 403 168 400 165 400 161 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* f */}
          <path
            d="M 445 160 L 445 98 L 434 98 C 429 98 426 95 426 90 C 426 85 429 82 434 82 L 445 82 L 445 65 C 445 47 458 36 479 36 C 487 36 495 38 499 41 C 503 44 504 48 502 52 C 500 56 495 58 491 56 C 488 54 484 53 479 53 C 469 53 464 59 464 70 L 464 82 L 487 82 C 492 82 495 85 495 90 C 495 95 492 98 487 98 L 464 98 L 464 160 C 464 165 460 168 454 168 C 449 168 445 165 445 160 Z"
            fill="url(#manifest-orange-grad)"
          />

          {/* e */}
          <path
            d="M 510 125 C 510 101 527 84 552 84 C 577 84 593 101 593 126 C 593 129 592 131 589 131 L 530 131 C 532 145 542 154 555 154 C 565 154 572 149 576 142 C 578 138 582 136 586 138 C 591 140 593 145 591 149 C 584 161 571 169 555 169 C 529 169 510 151 510 125 Z M 552 99 C 540 99 532 107 530 119 L 573 119 C 571 107 563 99 552 99 Z"
            fill="url(#manifest-orange-grad)"
          />

          {/* s */}
          <path
            d="M 607 150 C 607 144 611 140 617 140 C 621 140 625 143 627 146 C 632 152 641 156 651 156 C 662 156 669 151 669 144 C 669 137 662 133 646 129 C 623 123 611 114 611 99 C 611 85 624 74 643 74 C 657 74 669 79 677 87 C 680 90 680 95 677 98 C 674 101 669 101 666 97 C 660 91 652 88 643 88 C 634 88 628 92 628 98 C 628 104 635 108 651 112 C 674 118 686 127 686 142 C 686 158 672 170 651 170 C 634 170 619 162 610 152 C 608 151 607 150 607 150 Z"
            fill="url(#manifest-orange-grad)"
          />

          {/* t */}
          <path
            d="M 698 148 C 698 159 705 167 719 167 C 727 167 735 164 740 161 C 744 159 749 161 750 166 C 752 170 750 175 745 178 C 737 182 726 185 715 185 C 694 185 680 172 680 151 L 680 98 L 670 98 C 665 98 662 95 662 90 C 662 85 665 82 670 82 L 680 82 L 680 58 C 680 53 684 50 689 50 C 694 50 698 53 698 58 L 698 82 L 728 82 C 733 82 736 85 736 90 C 736 95 733 98 728 98 L 698 98 Z"
            fill="url(#manifest-orange-grad)"
          />
          {/* t-top right extension bar matching the original */}
          <rect x="715" y="80" width="32" height="4" rx="2" fill="url(#manifest-orange-grad)" />
        </g>

        {/* FELLOWSHIP Underline Banner & Text */}
        <g id="fellowship-banner">
          <rect x="270" y="180" width="475" height="4.5" rx="2" fill="url(#manifest-orange-grad)" />
          
          <text
            x="508"
            y="218"
            textAnchor="middle"
            fill={subtextColor}
            fontSize="36"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="5"
          >
            FELLOWSHIP
          </text>

          <rect x="270" y="234" width="475" height="4.5" rx="2" fill="url(#manifest-orange-grad)" />
        </g>

        {/* K.I.U Spaced Text & Underline */}
        <g id="kiu-banner">
          <text
            x="508"
            y="282"
            textAnchor="middle"
            fill={subtextColor}
            fontSize="42"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="14"
          >
            K . I . U
          </text>

          <rect x="270" y="298" width="475" height="5" rx="2.5" fill="url(#manifest-orange-grad)" />
        </g>
      </svg>
    </div>
  );
};
