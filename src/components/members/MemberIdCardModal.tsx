import React, { useEffect, useState, useRef } from 'react';
import { Member } from '../../types';
import { useFellowship } from '../../context/FellowshipContext';
import { X, Download, Printer, QrCode, CheckCircle2, Shield, Sparkles } from 'lucide-react';
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
  const { homes, departments } = useFellowship();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (member) {
      // Generate QR Code with member identification data
      const qrPayload = JSON.stringify({
        org: 'MANIFEST_FELLOWSHIP',
        id: member.id,
        name: member.fullName,
        phone: member.phone,
        status: member.status,
      });

      QRCodeLib.toDataURL(qrPayload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR Gen error', err));
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const assignedHome = homes.find((h) => h.id === member.homeId);
  const assignedDepts = departments.filter((d) => member.departmentIds?.includes(d.id));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    // Basic download trigger of card
    const element = cardRef.current;
    if (!element) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Manifest Pass - ${member.fullName} (${member.id})</title>
            <style>
              body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; }
              .card { width: 340px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15); background: #0f172a; color: white; border: 2px solid #eab308; }
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
            <Shield className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Digital Member Pass & QR Badge</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Card Container */}
        <div className="p-6 flex justify-center bg-slate-950/50">
          <div
            ref={cardRef}
            className="w-80 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-2xl p-5 relative overflow-hidden text-white"
          >
            {/* Watermark accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                  M
                </div>
                <div>
                  <div className="text-xs font-black tracking-widest text-amber-300">MANIFEST</div>
                  <div className="text-[9px] text-slate-400 font-medium">FELLOWSHIP PASS</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {member.status}
              </span>
            </div>

            {/* Photo / Avatar & Info */}
            <div className="flex items-start gap-3.5 mb-3.5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-xl font-black text-amber-300">
                  {member.fullName.charAt(0)}
                </div>
              </div>

              <div className="overflow-hidden flex-1">
                <h4 className="font-extrabold text-sm text-white truncate leading-tight">
                  {member.fullName}
                </h4>
                {member.preferredName && (
                  <div className="text-[11px] text-amber-300/90 font-medium">
                    "{member.preferredName}"
                  </div>
                )}
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{member.phone}</div>
                <div className="mt-1 font-mono font-bold text-[10px] tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded inline-block">
                  {member.id}
                </div>
              </div>
            </div>

            {/* Details Pills */}
            <div className="space-y-1.5 text-[10px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-3.5">
              {member.studentInfo?.isStudent && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-medium truncate max-w-[170px] text-right">
                    Yr {member.studentInfo.yearOfStudy} • {member.studentInfo.course || 'Student'}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Home Group:</span>
                <span className="font-medium text-amber-300 truncate max-w-[170px]">
                  {assignedHome ? assignedHome.name : 'Unassigned'}
                </span>
              </div>

              {assignedDepts.length > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Ministry:</span>
                  <span className="font-medium text-cyan-300 truncate max-w-[170px]">
                    {assignedDepts.map((d) => d.name?.split('&')?.[0] || d.name || '').join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* QR Code Section for Rapid Check-in */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white text-slate-950">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Member QR Code" className="w-28 h-28 object-contain" />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-400 animate-spin" />
                </div>
              )}
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-700 mt-1">
                SCAN AT FELLOWSHIP ENTRANCE
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
          <div className="text-xs text-slate-400">
            Compatible with high-speed optical scanners
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Badge
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
