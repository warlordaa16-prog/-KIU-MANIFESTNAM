import React, { useEffect, useState, useRef } from 'react';
import { Member } from '../../types';
import { useFellowship } from '../../context/FellowshipContext';
import {
  X,
  Download,
  Printer,
  QrCode,
  Shield,
  ShieldCheck,
  Copy,
  Check,
  MapPin,
  Phone,
  GraduationCap,
  User,
  KeyRound,
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
  const { departments } = useFellowship();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedPin, setCopiedPin] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Parse first and last names if not explicitly set
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
      // Generate QR Code with the registration PIN credentials
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
        width: 180,
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

  const assignedDepts = departments.filter((d) => member.departmentIds?.includes(d.id));

  const handleCopyPin = () => {
    navigator.clipboard.writeText(member.id);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    const element = cardRef.current;
    if (!element) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Manifest Registration PIN Pass - ${firstName} ${lastName} (${member.id})</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #090d16; }
              .card { width: 350px; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); background: #0f172a; color: white; border: 2px solid #f59e0b; padding: 20px; }
            </style>
          </head>
          <body>
            ${element.outerHTML}
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Manifest Registration PIN & Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Card Container */}
        <div className="p-6 flex justify-center bg-slate-950/60">
          <div
            ref={cardRef}
            className="w-84 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl p-5 relative overflow-hidden text-white"
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                  M
                </div>
                <div>
                  <div className="text-[11px] font-black tracking-wider text-amber-300">MANIFEST FELLOWSHIP</div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">
                    KIU MAIN CAMPUS • KANSANGA
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {member.status}
              </span>
            </div>

            {/* Registration PIN Header Bar */}
            <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Registration PIN:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-xs text-amber-400 tracking-wider">
                  {member.id}
                </span>
                <button
                  onClick={handleCopyPin}
                  className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                  title="Copy Registration PIN"
                >
                  {copiedPin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Key Information Fields */}
            <div className="space-y-2 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3.5">
              
              {/* Field 1: Name / Surname */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 shrink-0">
                  <User className="w-3 h-3 text-amber-400" /> Name (Surname):
                </span>
                <span className="font-bold text-white text-right truncate">
                  {lastName || member.fullName}
                </span>
              </div>

              {/* Field 2: First Name */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 shrink-0">
                  <User className="w-3 h-3 text-amber-400" /> First Name:
                </span>
                <span className="font-bold text-amber-300 text-right truncate">
                  {firstName || member.preferredName || member.fullName}
                </span>
              </div>

              {/* Field 3: Academic Portfolio (Schools, Alumni, Community) */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 shrink-0">
                  <GraduationCap className="w-3 h-3 text-cyan-400" /> Academic Portfolio:
                </span>
                <span className="font-bold text-cyan-300 text-right">
                  {member.portfolio || (member.status === 'Graduated' ? 'Alumni' : member.studentInfo?.isStudent ? 'Schools' : 'Community')}
                </span>
              </div>

              {/* Field 4: Year of Study */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 shrink-0">
                  <GraduationCap className="w-3 h-3 text-cyan-400" /> Year of Study:
                </span>
                <span className="font-bold text-cyan-300 text-right">
                  {yearOfStudyDisplay}
                  {member.studentInfo?.course && ` (${member.studentInfo.course.split(' ')[0]})`}
                </span>
              </div>

              {/* Field 4: Hostel or Residence */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Hostel / Residence:
                </span>
                <span className="font-bold text-emerald-300 text-right truncate max-w-[170px]">
                  {hostelOrResidence}
                </span>
              </div>

              {/* Field 5: Fellowship Status */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Fellowship Status:
                </span>
                <span className="font-bold text-amber-300 text-right">
                  {member.status}
                </span>
              </div>

              {/* Field 6: Phone Contact */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 shrink-0">
                  <Phone className="w-3 h-3 text-yellow-400" /> Phone Contact:
                </span>
                <span className="font-mono font-bold text-yellow-300 text-right">
                  {member.phone}
                </span>
              </div>

            </div>

            {/* QR Code Section for Rapid Check-in */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white text-slate-950 shadow-inner">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Registration PIN QR Code" className="w-28 h-28 object-contain" />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-400 animate-spin" />
                </div>
              )}
              <span className="text-[9px] font-mono font-extrabold tracking-wider text-slate-800 mt-1">
                SCAN FOR RAPID ENTRY & VERIFICATION
              </span>
            </div>

            {/* Card Footer */}
            <div className="text-center text-[8px] text-slate-500 mt-3 uppercase tracking-wider font-semibold">
              Official Identity • Manifest Fellowship Management
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyPin}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPin ? 'PIN Copied' : 'Copy PIN'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Pass
            </button>
            <button
              onClick={handleDownloadImage}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Export Pass
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

