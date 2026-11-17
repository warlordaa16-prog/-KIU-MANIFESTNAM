import React, { useEffect, useState, useRef } from 'react';
import { Member } from '../../types';
import {
  X,
  Download,
  Share2,
  QrCode,
  Copy,
  Check,
  MapPin,
  Phone,
  GraduationCap,
  User,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import QRCodeLib from 'qrcode';

interface MemberIdCardModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberIdCardModal: React.FC<MemberIdCardModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedPin, setCopiedPin] = useState(false);
  const [sharedOk, setSharedOk] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getDerivedNames = () => {
    if (!member) return { firstName: '', lastName: '' };
    if (member.firstName && member.lastName) {
      return { firstName: member.firstName, lastName: member.lastName };
    }
    const parts = (member.fullName || '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return {
        lastName: parts[0],
        firstName: parts.slice(1).join(' '),
      };
    }
    return {
      lastName: member.fullName || '',
      firstName: member.preferredName || member.fullName || '',
    };
  };

  const { firstName, lastName } = getDerivedNames();
  const hostelOrResidence = member?.hostelOrResidence || member?.residence || 'Not specified';
  const yearOfStudyDisplay = member?.studentInfo?.isStudent
    ? `Year ${member.studentInfo.yearOfStudy || 1}`
    : 'Scholar / Working';

  useEffect(() => {
    if (member) {
      const qrPayload = JSON.stringify({
        org: 'MANIFEST_FELLOWSHIP_KIU',
        registrationPin: member.id,
        lastName,
        firstName,
        yearOfStudy: member.studentInfo?.yearOfStudy || (member.studentInfo?.isStudent ? 1 : 'Scholar'),
        hostelOrResidence,
        phone: member.phone,
        status: member.status,
      });

      QRCodeLib.toDataURL(qrPayload, {
        width: 240,
        margin: 1,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR Gen error', err));
    }
  }, [member, firstName, lastName, hostelOrResidence]);

  if (!isOpen || !member) return null;

  const handleCopyPin = async () => {
    try {
      await navigator.clipboard.writeText(member.id);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } catch {
      // Ignore clipboard failures in restricted frames
    }
  };

  const handleSharePass = async () => {
    const shareText = `Manifest Fellowship Pass\nName: ${member.fullName}\nPIN: ${member.id}\nPortfolio: ${member.portfolio || 'Schools'}\nResidence: ${hostelOrResidence}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Manifest Pass — ${member.id}`,
          text: shareText,
        });
        setSharedOk(true);
        setTimeout(() => setSharedOk(false), 2000);
        return;
      } catch {
        // User cancelled or share unsupported
      }
    }
    await handleCopyPin();
  };

  const handleDownloadQrPass = () => {
    if (!qrDataUrl) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 860;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background card
    ctx.fillStyle = '#090b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border frame
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    // Header
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('MANIFEST FELLOWSHIP', 48, 78);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('KIU MAIN CAMPUS · KANSANGA', 48, 106);

    // PIN highlight bar
    ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
    ctx.fillRect(48, 134, canvas.width - 96, 62);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`PIN: ${member.id}`, 68, 175);

    // Member Info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(member.fullName, 48, 245);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Portfolio: ${member.portfolio || (member.studentInfo?.isStudent ? 'Schools' : 'Community')}`, 48, 285);
    ctx.fillText(`Residence: ${hostelOrResidence}`, 48, 320);
    ctx.fillText(`Phone: ${member.phone}`, 48, 355);
    ctx.fillText(`Status: ${member.status}`, 48, 390);

    // Draw QR image
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(150, 430, 340, 340);
      ctx.drawImage(img, 170, 450, 300, 300);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('SCAN FOR RAPID ENTRY & VERIFICATION', 135, 805);

      const link = document.createElement('a');
      link.download = `manifest-pass-${member.id.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = qrDataUrl;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Handle */}
        <div className="pt-2.5 pb-1 sm:hidden flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Registration Pass &amp; PIN</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close pass"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex justify-center bg-slate-950/60">
          <div
            ref={cardRef}
            className="w-full max-w-[336px] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl p-4 sm:p-5 relative overflow-hidden text-white"
          >
            {/* Top Brand Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                  M
                </div>
                <div>
                  <div className="text-[11px] font-extrabold tracking-wider text-amber-300">
                    MANIFEST FELLOWSHIP
                  </div>
                  <div className="text-[9px] text-slate-400 font-semibold">
                    KIU Main Campus · Kansanga
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold text-amber-300">{member.status}</span>
            </div>

            {/* Registration PIN Header Bar */}
            <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] text-amber-300 font-bold">PIN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm text-amber-400 tracking-wider">
                  {member.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer"
                  title="Copy Registration PIN"
                >
                  {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Key Information Fields */}
            <div className="space-y-2 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Surname
                </span>
                <span className="font-bold text-white text-right truncate">
                  {lastName || member.fullName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <User className="w-3.5 h-3.5 text-amber-400" /> First Name
                </span>
                <span className="font-bold text-amber-300 text-right truncate">
                  {firstName || member.preferredName || member.fullName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Portfolio
                </span>
                <span className="font-bold text-cyan-300 text-right">
                  {member.portfolio || (member.status === 'Graduated' ? 'Alumni' : member.studentInfo?.isStudent ? 'Schools' : 'Community')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Year / Role
                </span>
                <span className="font-bold text-cyan-300 text-right truncate">
                  {yearOfStudyDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Residence
                </span>
                <span className="font-bold text-emerald-300 text-right truncate max-w-[170px]">
                  {hostelOrResidence}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <Phone className="w-3.5 h-3.5 text-yellow-400" /> Phone
                </span>
                <span className="font-mono font-bold text-yellow-300 text-right tabular-nums">
                  {member.phone}
                </span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white text-slate-950 shadow-inner">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Registration PIN QR Code" className="w-28 h-28 object-contain" />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-400 animate-spin" />
                </div>
              )}
              <span className="text-[9px] font-mono font-extrabold tracking-wider text-slate-800 mt-1">
                SCAN FOR CHECK-IN
              </span>
            </div>
          </div>
        </div>

        {/* Thumb-Zone Action Controls */}
        <div className="px-4 py-3.5 pb-safe bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyPin}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
          >
            {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPin ? 'Copied' : 'Copy PIN'}</span>
          </button>

          <button
            type="button"
            onClick={handleSharePass}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{sharedOk ? 'Shared' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQrPass}
            className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save Pass PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
