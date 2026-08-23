import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Member, AttendanceStatus, FellowshipEvent } from '../../types';
import {
  QrCode,
  Search,
  Phone,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Zap,
  Filter,
  Download,
  Check,
  X,
  AlertCircle,
  Camera,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AttendanceManagerProps {
  onOpenRegister: () => void;
  onSelectMember: (member: Member) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  onOpenRegister,
  onSelectMember,
}) => {
  const {
    members,
    events,
    attendance,
    activeEventId,
    setActiveEventId,
    recordAttendance,
    batchCheckIn,
    currentUserName,
  } = useFellowship();

  const [activeTab, setActiveTab] = useState<'fast' | 'roster' | 'history'>('fast');
  
  // Fast Check-In Inputs
  const [phoneSearch, setPhoneSearch] = useState('');
  const [manIdSearch, setManIdSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('Present');
  const [checkInNotes, setCheckInNotes] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [simulatedScanPayload, setSimulatedScanPayload] = useState('');

  // Roster Multi-select
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [rosterFilter, setRosterFilter] = useState<'All' | 'Unchecked' | 'CheckedIn'>('All');
  const [rosterSearch, setRosterSearch] = useState('');

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];
  const today = new Date().toISOString().split('T')[0];

  const todayAttendance = attendance.filter(
    (a) => a.eventId === activeEvent?.id && a.date === today
  );

  // Instant Check-In by Member
  const handleCheckInMember = (
    member: Member,
    method: 'Phone Lookup' | 'Member ID' | 'QR Code' | 'Manual Roster'
  ) => {
    if (!activeEvent) return;

    recordAttendance({
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      eventId: activeEvent.id,
      eventName: activeEvent.name,
      status: selectedStatus,
      recordedBy: currentUserName,
      notes: checkInNotes || undefined,
      checkInMethod: method,
    });

    setPhoneSearch('');
    setManIdSearch('');
    setCheckInNotes('');

    // Confetti effect for exciting vibe
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  // Search Results for Phone Lookup
  const matchedByPhone = phoneSearch.trim().length >= 3
    ? members.filter(
        (m) =>
          m.phone.includes(phoneSearch.trim()) ||
          (m.altPhone && m.altPhone.includes(phoneSearch.trim())) ||
          m.fullName.toLowerCase().includes(phoneSearch.toLowerCase())
      )
    : [];

  // Search Results for MAN ID Lookup
  const matchedByManId = manIdSearch.trim().length >= 3
    ? members.filter((m) =>
        m.id.toLowerCase().includes(manIdSearch.trim().toLowerCase())
      )
    : [];

  // Simulate QR Code Reader Scanning
  const handleSimulateScan = (member: Member) => {
    handleCheckInMember(member, 'QR Code');
    setScannerActive(false);
  };

  // Batch Check-in
  const handleBatchCheckIn = (status: AttendanceStatus) => {
    if (!activeEvent || selectedMemberIds.length === 0) return;
    batchCheckIn(activeEvent.id, selectedMemberIds, status, currentUserName, 'Manual Roster');
    setSelectedMemberIds([]);
  };

  const toggleSelectAllRoster = (memberList: Member[]) => {
    if (selectedMemberIds.length === memberList.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(memberList.map((m) => m.id));
    }
  };

  const exportAttendanceCsv = () => {
    const headers = ['Attendance ID', 'Date', 'Time', 'Member ID', 'Member Name', 'Phone', 'Event', 'Status', 'Method', 'Recorded By', 'Notes'];
    const rows = todayAttendance.map((a) => [
      a.id,
      a.date,
      a.time,
      a.memberId,
      `"${a.memberName}"`,
      a.memberPhone,
      `"${a.eventName}"`,
      a.status,
      a.checkInMethod,
      `"${a.recordedBy}"`,
      `"${a.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `manifest_attendance_${activeEvent?.name?.slice(0, 20) || 'gathering'}_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Banner & Gathering Selector */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              High-Speed Check-In Engine
            </span>
            <span className="text-xs text-slate-400">Section 9 Protocol</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Fellowship Attendance Manager
          </h1>
          <p className="text-xs text-slate-400">
            QR scanning, rapid phone & MAN-ID lookup, and full batch roster recording
          </p>
        </div>

        {/* Active Event Picker */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Active Gathering Event:
            </label>
            <select
              value={activeEventId || ''}
              onChange={(e) => setActiveEventId(e.target.value)}
              className="bg-slate-900 text-amber-300 font-bold text-xs border border-slate-700 rounded-lg px-2.5 py-1.5 mt-0.5 focus:outline-none focus:border-amber-500"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.date})
                </option>
              ))}
            </select>
          </div>

          <div className="border-l border-slate-800 pl-3 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's Check-Ins</div>
            <div className="text-xl font-black text-emerald-400">{todayAttendance.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('fast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'fast'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fast Check-In Modes</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roster'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rapid Roster Check-In</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance Log ({attendance.length})</span>
          </button>
        </div>

        <button
          onClick={exportAttendanceCsv}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Sheet</span>
        </button>
      </div>

      {/* TAB 1: FAST CHECK-IN (QR, PHONE, MAN ID) */}
      {activeTab === 'fast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left: Input station */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Status Selection & Notes */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Check-In Status:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(['Present', 'Late', 'Excused'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`px-2.5 py-1 rounded font-bold text-[11px] transition-colors ${
                        selectedStatus === st
                          ? st === 'Present'
                            ? 'bg-emerald-500 text-slate-950'
                            : st === 'Late'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-blue-500 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                placeholder="Optional check-in notes (e.g. Sound setup, Choir)..."
                className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Method 1: Optical QR Scanner */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Method 1: QR Code Scanner</h3>
                    <p className="text-[11px] text-slate-400">
                      Scan digital member pass from phone or printed badge
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setScannerActive(!scannerActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    scannerActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{scannerActive ? 'Close Scanner' : 'Activate Camera'}</span>
                </button>
              </div>

              {scannerActive ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <div className="relative w-48 h-48 rounded-xl border-2 border-dashed border-amber-400 flex items-center justify-center bg-slate-900/80 overflow-hidden">
                    <div className="absolute inset-x-0 h-0.5 bg-amber-400 animate-bounce" />
                    <QrCode className="w-16 h-16 text-slate-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-200">
                      Position member QR pass in front of camera
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Or click a member below for simulated instant optical scan
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-center max-w-md pt-2">
                    {members.slice(0, 5).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSimulateScan(m)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[10px] font-medium transition-colors"
                      >
                        ⚡ Scan {m.fullName?.split(' ')?.[0] || m.fullName || 'Member'}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Fast hardware optical barcode / QR scanner ready on port</span>
                  <span className="text-emerald-400 font-mono font-bold">READY</span>
                </div>
              )}
            </div>

            {/* Method 2: Rapid Phone Search */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Method 2: Rapid Phone Search</h3>
                  <p className="text-[11px] text-slate-400">
                    Type phone number digits (e.g. 703 or 774) or member name
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  placeholder="Enter phone digits or name (e.g. 703 118844 or Brian)..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                />
                {phoneSearch && (
                  <button
                    onClick={() => setPhoneSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-0.5 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              {matchedByPhone.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                  {matchedByPhone.map((m) => {
                    const isCheckedIn = todayAttendance.some((a) => a.memberId === m.id);
                    return (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{m.fullName}</span>
                            <span className="font-mono text-[10px] text-amber-400">({m.id})</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {m.phone} • {m.studentInfo?.campus?.split('-')?.[0] || m.studentInfo?.campus || 'Member'}
                          </div>
                        </div>

                        {!isCheckedIn ? (
                          <button
                            onClick={() => handleCheckInMember(m, 'Phone Lookup')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Check In</span>
                          </button>
                        ) : (
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Checked In
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {phoneSearch.length >= 3 && matchedByPhone.length === 0 && (
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>No member found with phone / name "{phoneSearch}"</span>
                  <button
                    onClick={onOpenRegister}
                    className="text-amber-400 hover:text-amber-300 font-bold"
                  >
                    + Register New Person
                  </button>
                </div>
              )}
            </div>

            {/* Method 3: MAN ID Direct Lookup */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Method 3: Member ID Lookup</h3>
                  <p className="text-[11px] text-slate-400">
                    Input Manifest Member ID (e.g. MAN-2026-000002)
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={manIdSearch}
                  onChange={(e) => setManIdSearch(e.target.value)}
                  placeholder="Enter MAN-ID (e.g. 000001 or MAN-2026-000004)..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {matchedByManId.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {matchedByManId.map((m) => {
                    const isCheckedIn = todayAttendance.some((a) => a.memberId === m.id);
                    return (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{m.fullName}</div>
                          <div className="font-mono text-[10px] text-amber-400">{m.id}</div>
                        </div>

                        {!isCheckedIn ? (
                          <button
                            onClick={() => handleCheckInMember(m, 'Member ID')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Check In
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold">Checked In</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right: Live Attendee Stream */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="font-bold text-sm text-white">Live Gathering Feed</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {todayAttendance.length} Attendees
                </span>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {todayAttendance.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800/90 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{record.memberName}</div>
                      <div className="text-[10px] text-slate-400">
                        {record.memberPhone} • Method: <span className="text-amber-400 font-medium">{record.checkInMethod}</span>
                      </div>
                      {record.notes && (
                        <div className="text-[10px] text-slate-500 italic mt-0.5">
                          "{record.notes}"
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold block ${
                          record.status === 'Present'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : record.status === 'Late'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {record.status}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                        {record.time}
                      </span>
                    </div>
                  </div>
                ))}

                {todayAttendance.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No attendees checked in yet for this gathering session.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Station: Protocol Desk 1</span>
              <span>Officer: {currentUserName}</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RAPID ROSTER CHECK-IN */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Filter roster by name, campus, home..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRosterFilter('All')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  rosterFilter === 'All' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({members.length})
              </button>
              <button
                onClick={() => setRosterFilter('Unchecked')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  rosterFilter === 'Unchecked' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Not Checked In ({members.length - todayAttendance.length})
              </button>
              <button
                onClick={() => setRosterFilter('CheckedIn')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  rosterFilter === 'CheckedIn' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Checked In ({todayAttendance.length})
              </button>
            </div>

            {/* Batch actions */}
            {selectedMemberIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">{selectedMemberIds.length} selected:</span>
                <button
                  onClick={() => handleBatchCheckIn('Present')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Mark Present
                </button>
                <button
                  onClick={() => handleBatchCheckIn('Late')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Mark Late
                </button>
                <button
                  onClick={() => handleBatchCheckIn('Excused')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Mark Excused
                </button>
              </div>
            )}
          </div>

          {/* Roster list */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.length > 0 && selectedMemberIds.length === members.length}
                        onChange={() => toggleSelectAllRoster(members)}
                        className="rounded border-slate-700 text-amber-500"
                      />
                    </th>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">MAN ID</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Status Today</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {members
                    .filter((m) => {
                      const isChecked = todayAttendance.some((a) => a.memberId === m.id);
                      if (rosterFilter === 'CheckedIn' && !isChecked) return false;
                      if (rosterFilter === 'Unchecked' && isChecked) return false;
                      if (rosterSearch) {
                        const q = rosterSearch.toLowerCase();
                        return (
                          m.fullName.toLowerCase().includes(q) ||
                          m.phone.includes(q) ||
                          m.id.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((m) => {
                      const checkedRecord = todayAttendance.find((a) => a.memberId === m.id);
                      const isSelected = selectedMemberIds.includes(m.id);

                      return (
                        <tr key={m.id} className="hover:bg-slate-850/80 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  setSelectedMemberIds(selectedMemberIds.filter((id) => id !== m.id));
                                } else {
                                  setSelectedMemberIds([...selectedMemberIds, m.id]);
                                }
                              }}
                              className="rounded border-slate-700 text-amber-500"
                            />
                          </td>

                          <td className="py-3 px-4 font-bold text-white">{m.fullName}</td>
                          <td className="py-3 px-4 font-mono text-amber-400">{m.id}</td>
                          <td className="py-3 px-4">{m.phone}</td>

                          <td className="py-3 px-4">
                            {checkedRecord ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  checkedRecord.status === 'Present'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {checkedRecord.status} ({checkedRecord.time})
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Unrecorded</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {!checkedRecord ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleCheckInMember(m, 'Manual Roster')}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                                >
                                  Present
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedStatus('Late');
                                    handleCheckInMember(m, 'Manual Roster');
                                  }}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px]"
                                >
                                  Late
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-emerald-400 font-semibold">Done ✓</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FULL ATTENDANCE HISTORY LOG */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Member ID</th>
                  <th className="py-3 px-4">Event Gathering</th>
                  <th className="py-3 px-4">Check-In Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Recorded By</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-850/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {rec.date} <span className="text-white font-bold">{rec.time}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{rec.memberName}</td>
                    <td className="py-3 px-4 font-mono text-amber-400">{rec.memberId}</td>
                    <td className="py-3 px-4 font-medium text-slate-300">{rec.eventName}</td>
                    <td className="py-3 px-4 text-slate-400">{rec.checkInMethod}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : rec.status === 'Late'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{rec.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
