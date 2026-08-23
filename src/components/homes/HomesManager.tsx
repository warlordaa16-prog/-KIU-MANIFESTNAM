import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { HomeGroup, Member } from '../../types';
import {
  Home,
  Users,
  Plus,
  MapPin,
  Clock,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Phone,
  Search,
} from 'lucide-react';

interface HomesManagerProps {
  onSelectMember: (member: Member) => void;
  onOpenRegister: () => void;
}

export const HomesManager: React.FC<HomesManagerProps> = ({
  onSelectMember,
  onOpenRegister,
}) => {
  const { homes, addHome, updateHome, members, updateMember } = useFellowship();

  const [selectedHome, setSelectedHome] = useState<HomeGroup | null>(homes[0] || null);
  const [isAddHomeOpen, setIsAddHomeOpen] = useState(false);
  const [isAssignMemberOpen, setIsAssignMemberOpen] = useState(false);

  // New Home Form
  const [newHomeName, setNewHomeName] = useState('');
  const [zone, setZone] = useState('Makerere / Kikoni');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingDay, setMeetingDay] = useState('Wednesday');
  const [meetingTime, setMeetingTime] = useState('6:00 PM - 7:30 PM');
  const [leaderId, setLeaderId] = useState('');
  const [description, setDescription] = useState('');

  // Unassigned or Member search for assignment
  const [memberAssignSearch, setMemberAssignSearch] = useState('');

  const activeHomeMembers = members.filter((m) => m.homeId === selectedHome?.id);

  const handleCreateHome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomeName.trim()) return;

    const leaderMember = members.find((m) => m.id === leaderId);

    const created = addHome({
      name: newHomeName.trim(),
      zone,
      meetingLocation: meetingLocation.trim() || 'Fellowship Center / Host Home',
      meetingDay,
      meetingTime,
      leaderId: leaderMember ? leaderMember.id : 'M-LEAD',
      leaderName: leaderMember ? leaderMember.fullName : 'Designated Leader',
      leaderPhone: leaderMember ? leaderMember.phone : '+256 700 000000',
      description: description.trim() || undefined,
      memberCount: 0,
    });

    setIsAddHomeOpen(false);
    setSelectedHome(created);
    setNewHomeName('');
    setMeetingLocation('');
  };

  const handleAssignMemberToHome = (member: Member, homeId: string) => {
    updateMember(member.id, { homeId });
  };

  const handleRemoveMemberFromHome = (member: Member) => {
    updateMember(member.id, { homeId: undefined });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Section 12 Small Group Network
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Home className="w-5 h-5 text-amber-400" />
            Homes & Cell Group Fellowship Care
          </h1>
          <p className="text-xs text-slate-400">
            Intimate community units for spiritual discipleship, mutual care, and multiplication
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddHomeOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Plant New Home Cell</span>
          </button>
        </div>
      </div>

      {/* Grid of Homes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {homes.map((home) => {
          const homeMembers = members.filter((m) => m.homeId === home.id);
          const isSelected = selectedHome?.id === home.id;

          return (
            <div
              key={home.id}
              onClick={() => setSelectedHome(home)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-850 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight">
                    {home.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-medium mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{home.zone}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold text-xs border border-slate-700">
                  {homeMembers.length} Souls
                </span>
              </div>

              <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Leader:</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[130px]">
                    {home.leaderName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Gathering:</span>
                  <span className="font-medium text-slate-300">
                    {home.meetingDay}, {home.meetingTime?.split('-')?.[0] || home.meetingTime || 'TBD'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Leader: {home.leaderPhone}</span>
                <span className="text-amber-400 font-bold">View Roster →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Home Detailed View */}
      {selectedHome && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{selectedHome.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  {activeHomeMembers.length} Registered Members
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedHome.description || 'Weekly cell discipleship and prayer gathering.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAssignMemberOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member to {selectedHome.name}</span>
              </button>
            </div>
          </div>

          {/* Roster & Info grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Info Card */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                Cell Logistics & Leadership
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Zone & Jurisdiction</span>
                  <span className="font-semibold text-slate-200">{selectedHome.zone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Primary Cell Leader</span>
                  <span className="font-semibold text-slate-200">{selectedHome.leaderName}</span>
                  <div className="text-[11px] text-amber-400">{selectedHome.leaderPhone}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Physical Meeting Point</span>
                  <span className="font-semibold text-slate-200">{selectedHome.meetingLocation}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Fellowship Schedule</span>
                  <span className="font-semibold text-slate-200">
                    {selectedHome.meetingDay} @ {selectedHome.meetingTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Members in Home */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  Assigned Brothers & Sisters ({activeHomeMembers.length})
                </span>
                <span className="text-slate-500">Live Discipleship Roster</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeHomeMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div
                        onClick={() => onSelectMember(m)}
                        className="font-bold text-white hover:text-amber-300 cursor-pointer"
                      >
                        {m.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {m.phone} • {m.studentInfo?.campus?.split('-')?.[0] || m.studentInfo?.campus || 'Member'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-amber-400">
                        {m.status}
                      </span>
                      <button
                        onClick={() => handleRemoveMemberFromHome(m)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                        title="Remove from this home"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {activeHomeMembers.length === 0 && (
                  <div className="col-span-2 p-8 text-center text-slate-500 text-xs bg-slate-850/50 rounded-xl">
                    No members currently placed in this Home cell. Click "+ Add Member" to place attendees.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL: PLANT NEW HOME */}
      {isAddHomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Plant New Home Cell</h3>
              <button onClick={() => setIsAddHomeOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHome} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Home Name (e.g. Home Bethel, Home Shiloh) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newHomeName}
                  onChange={(e) => setNewHomeName(e.target.value)}
                  placeholder="e.g. Home Bethel"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Zone / Campus Region</label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="e.g. Kikoni / Sir Apollo / Banda"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Location</label>
                <input
                  type="text"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  placeholder="Host House / Hostel Room / Hall Common Room"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Day</label>
                  <select
                    value={meetingDay}
                    onChange={(e) => setMeetingDay(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Time</label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="6:00 PM - 7:30 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Home Leader</label>
                <select
                  value={leaderId}
                  onChange={(e) => setLeaderId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">-- Choose Leader from Members --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddHomeOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Plant Home
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN MEMBER TO HOME */}
      {isAssignMemberOpen && selectedHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Place Member into {selectedHome.name}</h3>
              <button onClick={() => setIsAssignMemberOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memberAssignSearch}
                  onChange={(e) => setMemberAssignSearch(e.target.value)}
                  placeholder="Search member by name, phone or MAN-ID..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {members
                  .filter((m) => {
                    if (m.homeId === selectedHome.id) return false;
                    if (memberAssignSearch) {
                      const q = memberAssignSearch.toLowerCase();
                      return (
                        m.fullName.toLowerCase().includes(q) ||
                        m.phone.includes(q) ||
                        m.id.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">{m.fullName}</div>
                        <div className="text-[10px] text-slate-400">
                          {m.phone} • Status: {m.status}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleAssignMemberToHome(m, selectedHome.id);
                          setIsAssignMemberOpen(false);
                        }}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px]"
                      >
                        Assign Here
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
