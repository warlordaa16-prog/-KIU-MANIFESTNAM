import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { FellowshipEvent, EventType, Member } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  DollarSign,
  Sparkles,
  CheckCircle,
  FileText,
  Radio,
  ArrowRight,
} from 'lucide-react';

interface EventsManagerProps {
  onSelectMember: (member: Member) => void;
  onOpenCheckInForEvent: (eventId: string) => void;
}

export const EventsManager: React.FC<EventsManagerProps> = ({
  onSelectMember,
  onOpenCheckInForEvent,
}) => {
  const { events, addEvent, attendance, setActiveEventId, activeEventId, members } = useFellowship();

  const [selectedEvent, setSelectedEvent] = useState<FellowshipEvent | null>(events[0] || null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState<EventType>('Weekly Fellowship');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('5:00 PM');
  const [endTime, setEndTime] = useState('8:00 PM');
  const [location, setLocation] = useState('Main Sanctuary / Lumumba Hall');
  const [expectedAttendance, setExpectedAttendance] = useState(150);
  const [budgetAllocated, setBudgetAllocated] = useState(500000);
  const [description, setDescription] = useState('');

  const eventTypes: EventType[] = [
    'Weekly Fellowship',
    'Outreach',
    'Conference',
    'Prayer Meeting',
    'Home Meeting',
    'Training',
    'Special Event',
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEvt = addEvent({
      name: name.trim(),
      description: description.trim() || 'Manifest Fellowship Gathering',
      eventType,
      date,
      startTime,
      endTime,
      location: location.trim(),
      requiresAttendance: true,
      status: 'Upcoming',
      budgetAllocated: Number(budgetAllocated),
      expectedAttendance: Number(expectedAttendance),
    });

    setIsAddEventOpen(false);
    setSelectedEvent(newEvt);
    setName('');
  };

  const activeEventAttendance = attendance.filter((a) => a.eventId === selectedEvent?.id);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Section 14 Gatherings & Assemblies
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Calendar className="w-5 h-5 text-amber-400" />
            Events, Gatherings & Outreaches
          </h1>
          <p className="text-xs text-slate-400">
            Schedule fellowship services, conferences, overnight prayers, and campus missions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Gathering</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => {
          const isSelected = selectedEvent?.id === evt.id;
          const isLiveNow = activeEventId === evt.id;
          const count = attendance.filter((a) => a.eventId === evt.id).length;

          return (
            <div
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-850 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isLiveNow && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1 animate-pulse">
                  <Radio className="w-2.5 h-2.5" /> Live Check-In Active
                </span>
              )}

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                {evt.eventType}
              </span>

              <h3 className="font-extrabold text-white text-base leading-tight mt-2">
                {evt.name}
              </h3>

              <div className="mt-3.5 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{evt.date} • {evt.startTime} - {evt.endTime}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{evt.location}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">
                  Attendance: <strong className="text-emerald-400 font-bold">{count}</strong> / {evt.expectedAttendance || 150}
                </span>
                <span className="text-amber-400 font-bold">Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Detailed View */}
      {selectedEvent && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedEvent.eventType}
                </span>
                <h2 className="text-xl font-extrabold text-white">{selectedEvent.name}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedEvent.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveEventId(selectedEvent.id);
                  onOpenCheckInForEvent(selectedEvent.id);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Launch High-Speed Check-In Station</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Logistics & Financials */}
            <div className="lg:col-span-4 space-y-3 p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                Logistics & Schedule
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date & Time</span>
                  <span className="font-semibold text-slate-200">
                    {selectedEvent.date} ({selectedEvent.startTime} to {selectedEvent.endTime})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Sanctuary / Location</span>
                  <span className="font-semibold text-slate-200">{selectedEvent.location}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Budget Allocation</span>
                  <span className="font-mono font-bold text-emerald-400">
                    UGX {selectedEvent.budgetAllocated?.toLocaleString() || 0}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Description</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                    {selectedEvent.description || 'Special fellowship gathering.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Attendees recorded for this gathering */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  Recorded Attendees ({activeEventAttendance.length})
                </span>
                <span className="text-slate-500">Live Gathering Registry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto">
                {activeEventAttendance.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{a.memberName}</div>
                      <div className="text-[10px] text-slate-400">
                        {a.time} • via {a.checkInMethod}
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'Present'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}

                {activeEventAttendance.length === 0 && (
                  <div className="col-span-2 p-8 text-center text-slate-500 text-xs bg-slate-850/50 rounded-xl">
                    No attendance records for this gathering yet. Click "Launch High-Speed Check-In Station" to begin recording members.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CREATE GATHERING MODAL */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Create New Fellowship Gathering</h3>
              <button onClick={() => setIsAddEventOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Manifest Friday Gathering / Campus Ignition Night"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  >
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="5:00 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="8:00 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Venue</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Main Sanctuary / Hall / Open Grounds"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Souls Attendance</label>
                  <input
                    type="number"
                    value={expectedAttendance}
                    onChange={(e) => setExpectedAttendance(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Budget (UGX)</label>
                  <input
                    type="number"
                    value={budgetAllocated}
                    onChange={(e) => setBudgetAllocated(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
