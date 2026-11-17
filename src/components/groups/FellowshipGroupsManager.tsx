import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { HomeGroup, Member } from '../../types';
import { matchesPinSearch, formatPinDisplay } from '../../utils/pinUtils';
import {
  HeartHandshake,
  MapPin,
  Calendar,
  Phone,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Users,
  Crown,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserMinus,
} from 'lucide-react';

export const FellowshipGroupsManager: React.FC = () => {
  const {
    homes = [],
    members = [],
    addHome,
    updateHome,
    deleteHome,
    clearAllGroups,
    assignMemberToHome,
    setHomeLeader,
    autoGroupByHostel,
  } = useFellowship();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFamilyIds, setExpandedFamilyIds] = useState<Record<string, boolean>>({});

  // Add Family Sheet State
  const [isAddHomeOpen, setIsAddHomeOpen] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [newHomeZone, setNewHomeZone] = useState('Kansanga - KIU Campus');
  const [newHomeHostel, setNewHomeHostel] = useState('');
  const [newHomeLeaderName, setNewHomeLeaderName] = useState('');
  const [newHomeLeaderPhone, setNewHomeLeaderPhone] = useState('');
  const [newHomeLeaderEmail, setNewHomeLeaderEmail] = useState('');
  const [newHomeMeetingDay, setNewHomeMeetingDay] = useState('Every Wednesday 6:00 PM');
  const [newHomeLocation, setNewHomeLocation] = useState('');
  const [newHomeDescription, setNewHomeDescription] = useState('');
  const [newHomeTargetCount, setNewHomeTargetCount] = useState(25);

  // Edit Family Sheet State
  const [editingHome, setEditingHome] = useState<HomeGroup | null>(null);

  // Designate Head of Family Sheet State
  const [designatingLeaderHome, setDesignatingLeaderHome] = useState<HomeGroup | null>(null);
  const [leaderNameInput, setLeaderNameInput] = useState('');
  const [leaderPhoneInput, setLeaderPhoneInput] = useState('');
  const [leaderEmailInput, setLeaderEmailInput] = useState('');

  // Assign Member to Family Sheet State
  const [assigningToHome, setAssigningToHome] = useState<HomeGroup | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Confirm delete sheets
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const toggleExpandFamily = (homeId: string) => {
    setExpandedFamilyIds((prev) => ({
      ...prev,
      [homeId]: !prev[homeId],
    }));
  };

  const getFamilyMembers = (home: HomeGroup): Member[] => {
    return members.filter((m) => {
      if (m.homeId === home.id) return true;
      if (home.hostelOrResidence && m.hostelOrResidence) {
        return (
          m.hostelOrResidence.trim().toLowerCase() ===
          home.hostelOrResidence.trim().toLowerCase()
        );
      }
      return false;
    });
  };

  const handleCreateHome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomeName.trim() || !newHomeLeaderName.trim()) return;

    addHome({
      name: newHomeName.trim(),
      zone: newHomeZone.trim(),
      leaderId: 'MAN-LEADER-' + Date.now(),
      leaderName: newHomeLeaderName.trim(),
      leaderPhone: newHomeLeaderPhone.trim() || '+256 700 000000',
      leaderEmail: newHomeLeaderEmail.trim() || undefined,
      meetingDay: newHomeMeetingDay.trim(),
      location: newHomeLocation.trim() || newHomeHostel.trim() || 'KIU Campus Zone',
      hostelOrResidence: newHomeHostel.trim() || undefined,
      description: newHomeDescription.trim() || undefined,
      targetCount: Number(newHomeTargetCount) || 25,
    });

    setIsAddHomeOpen(false);
    setNewHomeName('');
    setNewHomeHostel('');
    setNewHomeLeaderName('');
    setNewHomeLeaderPhone('');
    setNewHomeLeaderEmail('');
    setNewHomeLocation('');
    setNewHomeDescription('');
  };

  const handleUpdateHome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHome || !editingHome.name.trim() || !editingHome.leaderName.trim()) return;

    updateHome(editingHome.id, {
      name: editingHome.name.trim(),
      zone: editingHome.zone.trim(),
      hostelOrResidence: editingHome.hostelOrResidence?.trim() || undefined,
      leaderName: editingHome.leaderName.trim(),
      leaderPhone: editingHome.leaderPhone.trim(),
      leaderEmail: editingHome.leaderEmail?.trim() || undefined,
      meetingDay: editingHome.meetingDay.trim(),
      location: editingHome.location.trim(),
      description: editingHome.description?.trim(),
      targetCount: Number(editingHome.targetCount) || 25,
    });

    setEditingHome(null);
  };

  const openDesignateLeaderModal = (home: HomeGroup) => {
    setDesignatingLeaderHome(home);
    setLeaderNameInput(
      home.leaderName === 'To be designated (Click to assign)' ? '' : home.leaderName
    );
    setLeaderPhoneInput(home.leaderPhone === '+256 700 000000' ? '' : home.leaderPhone);
    setLeaderEmailInput(home.leaderEmail || '');
  };

  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designatingLeaderHome || !leaderNameInput.trim()) return;

    setHomeLeader(
      designatingLeaderHome.id,
      leaderNameInput.trim(),
      leaderPhoneInput.trim() || '+256 700 000000',
      leaderEmailInput.trim() || undefined
    );

    setDesignatingLeaderHome(null);
  };

  const handleAssignMember = (memberId: string, homeId: string) => {
    assignMemberToHome(memberId, homeId);
  };

  const handleRemoveMemberFromFamily = (memberId: string) => {
    assignMemberToHome(memberId, '');
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteHome(itemToDelete.id);
    setItemToDelete(null);
  };

  const filteredHomes = homes.filter((h) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      h.name.toLowerCase().includes(q) ||
      h.zone.toLowerCase().includes(q) ||
      (h.hostelOrResidence && h.hostelOrResidence.toLowerCase().includes(q)) ||
      h.leaderName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-1">
              Hostel &amp; Cell Network · KIU Kansanga
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-orange-400 shrink-0" />
              <span>Fellowship Families</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Group registered saints into hostel and cell families for follow-up and pastoral care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => autoGroupByHostel()}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
              title="Automatically scan member hostels and generate fellowship families"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Auto-Organize from Hostels</span>
            </button>

            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              {homes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/60 border border-slate-700/80 text-slate-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Empty All</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsAddHomeOpen(true)}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer active:scale-95 ${
                  homes.length === 0 ? 'col-span-2' : ''
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Family</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search families, hostels, leaders..."
              className="w-full min-h-[44px] pl-10 pr-9 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear family search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-400 font-semibold tabular-nums">
            {filteredHomes.length} {filteredHomes.length === 1 ? 'Family' : 'Families'} Active
          </span>
        </div>
      </div>

      {/* Main Families Grid */}
      <div>
        {homes.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                No Fellowship Families Created Yet
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Tap &quot;Auto-Organize from Hostels&quot; to group registered saints by their hostel or residence, or create a custom family manually.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => autoGroupByHostel()}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auto-Organize from Hostels</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddHomeOpen(true)}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Custom Family</span>
              </button>
            </div>
          </div>
        ) : filteredHomes.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No fellowship families match &quot;{searchQuery}&quot;. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredHomes.map((home) => {
              const familyMembers = getFamilyMembers(home);
              const isExpanded = !!expandedFamilyIds[home.id];

              return (
                <div
                  key={home.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left relative flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-3.5">
                    {/* Family Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold shrink-0">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-base leading-snug break-words">
                            {home.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {home.hostelOrResidence ? (
                              <span className="text-orange-300 font-semibold">
                                {home.hostelOrResidence} ·{' '}
                              </span>
                            ) : null}
                            <span>{home.zone}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400 tabular-nums shrink-0">
                        {familyMembers.length}/{home.targetCount || 25}
                      </span>
                    </div>

                    {/* Head of Family Card */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          <Crown className="w-3.5 h-3.5" />
                          <span>Head of Family</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openDesignateLeaderModal(home)}
                          className="min-h-[36px] text-[11px] text-orange-400 hover:text-orange-300 font-semibold px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 transition-all cursor-pointer"
                        >
                          Change Leader
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="font-semibold text-white text-sm truncate">
                          {home.leaderName}
                        </div>
                        {home.leaderPhone && (
                          <a
                            href={`tel:${home.leaderPhone.replace(/\s+/g, '')}`}
                            className="text-xs font-mono text-orange-300 hover:text-orange-200 flex items-center gap-1.5 py-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-orange-400" />
                            <span>{home.leaderPhone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Family Info */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {home.meetingDay && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span>{home.meetingDay}</span>
                        </div>
                      )}
                      {home.location && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span className="truncate">{home.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Member Count & Expand Roster */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExpandFamily(home.id)}
                        className="min-h-[44px] flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer px-1"
                      >
                        <Users className="w-4 h-4" />
                        <span className="tabular-nums">{familyMembers.length} Members</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMemberSearchQuery('');
                          setAssigningToHome(home);
                        }}
                        className="min-h-[44px] text-xs font-bold text-orange-300 hover:text-orange-200 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 cursor-pointer active:scale-95"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign Member</span>
                      </button>
                    </div>

                    {/* Expanded Members Roster */}
                    {isExpanded && (
                      <div className="mt-1 space-y-1.5 max-h-56 overflow-y-auto p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                        {familyMembers.length === 0 ? (
                          <div className="text-center py-3 text-xs text-slate-500">
                            No members assigned to this family yet.
                          </div>
                        ) : (
                          familyMembers.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-center justify-between gap-2 px-2.5 py-1.5 min-h-[44px] rounded-lg bg-slate-900 border border-slate-800/60 text-xs"
                            >
                              <div className="truncate min-w-0">
                                <span className="font-semibold text-white">{m.fullName}</span>
                                <span className="font-mono text-[11px] text-orange-400 ml-1.5">
                                  {formatPinDisplay(m.id)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveMemberFromFamily(m.id)}
                                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Remove from family"
                                aria-label={`Remove ${m.fullName} from family`}
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-2 mt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingHome(home)}
                      className="min-h-[44px] px-2 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setItemToDelete({ id: home.id, name: home.name })}
                      className="min-h-[44px] px-2 text-xs font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD FAMILY BOTTOM SHEET */}
      {isAddHomeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAddHomeOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92dvh] flex flex-col shadow-2xl pb-safe"
          >
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-orange-400" />
                <span>Add Fellowship Family</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddHomeOpen(false)}
                aria-label="Close Add Family sheet"
                className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHome} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Family / Cell Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHomeName}
                    onChange={(e) => setNewHomeName(e.target.value)}
                    placeholder="e.g. Olympia Hostel Fellowship Family"
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Hostel or Residence
                    </label>
                    <input
                      type="text"
                      value={newHomeHostel}
                      onChange={(e) => setNewHomeHostel(e.target.value)}
                      placeholder="e.g. Olympia Hostel"
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Zone / Area
                    </label>
                    <input
                      type="text"
                      value={newHomeZone}
                      onChange={(e) => setNewHomeZone(e.target.value)}
                      placeholder="e.g. Kansanga"
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Head of Family Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newHomeLeaderName}
                      onChange={(e) => setNewHomeLeaderName(e.target.value)}
                      placeholder="e.g. Samuel Kigozi"
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Leader Phone Contact
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={newHomeLeaderPhone}
                      onChange={(e) => setNewHomeLeaderPhone(e.target.value)}
                      placeholder="+256 700 000000"
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Meeting Time / Schedule
                    </label>
                    <input
                      type="text"
                      value={newHomeMeetingDay}
                      onChange={(e) => setNewHomeMeetingDay(e.target.value)}
                      placeholder="e.g. Wednesdays 6:00 PM"
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Target Capacity
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={newHomeTargetCount}
                      onChange={(e) => setNewHomeTargetCount(Number(e.target.value))}
                      min={5}
                      max={200}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newHomeDescription}
                    onChange={(e) => setNewHomeDescription(e.target.value)}
                    placeholder="Notes about meeting location or floor room..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="px-5 py-3.5 flex items-center justify-end gap-2.5 border-t border-slate-800 bg-slate-900 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddHomeOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-md shadow-orange-500/20 cursor-pointer text-xs"
                >
                  Save Family
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FAMILY BOTTOM SHEET */}
      {editingHome && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setEditingHome(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92dvh] flex flex-col shadow-2xl pb-safe"
          >
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <h3 className="font-extrabold text-white text-base">Edit Fellowship Family</h3>
              <button
                type="button"
                onClick={() => setEditingHome(null)}
                aria-label="Close Edit Family sheet"
                className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateHome} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingHome.name}
                    onChange={(e) => setEditingHome({ ...editingHome, name: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Hostel or Residence
                    </label>
                    <input
                      type="text"
                      value={editingHome.hostelOrResidence || ''}
                      onChange={(e) =>
                        setEditingHome({ ...editingHome, hostelOrResidence: e.target.value })
                      }
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Zone / Area
                    </label>
                    <input
                      type="text"
                      value={editingHome.zone}
                      onChange={(e) => setEditingHome({ ...editingHome, zone: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Leader Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingHome.leaderName}
                      onChange={(e) =>
                        setEditingHome({ ...editingHome, leaderName: e.target.value })
                      }
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Leader Phone
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={editingHome.leaderPhone}
                      onChange={(e) =>
                        setEditingHome({ ...editingHome, leaderPhone: e.target.value })
                      }
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 flex items-center justify-end gap-2.5 border-t border-slate-800 bg-slate-900 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingHome(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 sm:flex-none px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold shadow-md shadow-orange-500/20 cursor-pointer text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DESIGNATE HEAD OF FAMILY BOTTOM SHEET */}
      {designatingLeaderHome && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDesignatingLeaderHome(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-sm shadow-2xl pb-safe"
          >
            <div className="sm:hidden flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Designate Head of Family</span>
              </h3>
              <button
                type="button"
                onClick={() => setDesignatingLeaderHome(null)}
                aria-label="Close Designate Leader sheet"
                className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Leader Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={leaderNameInput}
                  onChange={(e) => setLeaderNameInput(e.target.value)}
                  placeholder="e.g. Esther Namubiru"
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Leader Phone
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={leaderPhoneInput}
                  onChange={(e) => setLeaderPhoneInput(e.target.value)}
                  placeholder="+256 700 000000"
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDesignatingLeaderHome(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Assign Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN MEMBER TO FAMILY BOTTOM SHEET */}
      {assigningToHome && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setAssigningToHome(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-2xl max-h-[88dvh] flex flex-col pb-safe"
          >
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="min-w-0 pr-2">
                <h3 className="font-extrabold text-white text-sm truncate">
                  Assign to {assigningToHome.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Search by name, Saint PIN, or hostel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssigningToHome(null)}
                aria-label="Close Assign Member sheet"
                className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 pb-2 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Search member name, Saint 1, hostel..."
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 px-4 py-2">
              {members
                .filter((m) => {
                  const q = memberSearchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    m.fullName.toLowerCase().includes(q) ||
                    matchesPinSearch(m.id, q) ||
                    (m.hostelOrResidence && m.hostelOrResidence.toLowerCase().includes(q))
                  );
                })
                .slice(0, 60)
                .map((m) => {
                  const isAssigned = m.homeId === assigningToHome.id;

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-2 p-2.5 min-h-[52px] rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                    >
                      <div className="truncate min-w-0">
                        <div className="font-semibold text-white truncate">{m.fullName}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          <span className="font-mono text-orange-400">
                            {formatPinDisplay(m.id)}
                          </span>{' '}
                          · {m.hostelOrResidence || 'No hostel'}
                        </div>
                      </div>

                      {isAssigned ? (
                        <span className="min-h-[36px] text-[11px] font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                          <span>Assigned</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAssignMember(m.id, assigningToHome.id)}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0 active:scale-95"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="px-4 py-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setAssigningToHome(null)}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE BOTTOM SHEET */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setItemToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl pb-safe"
          >
            <div className="sm:hidden flex justify-center -mt-2 mb-1">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Delete Fellowship Family?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to remove{' '}
                <strong className="text-white">&quot;{itemToDelete.name}&quot;</strong>? This removes it from the fellowship structure.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL FAMILIES CONFIRMATION BOTTOM SHEET */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl pb-safe"
          >
            <div className="sm:hidden flex justify-center -mt-2 mb-1">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Empty All Families?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This clears all fellowship families, giving you a clean slate to enter custom groups.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllGroups();
                  setShowClearConfirm(false);
                }}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Empty Families
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FellowshipFamiliesManager = FellowshipGroupsManager;
