import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { HomeGroup, Member } from '../../types';
import {
  HeartHandshake,
  MapPin,
  Calendar,
  Phone,
  Mail,
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

  // Add Family Modal State
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

  // Edit Family Modal State
  const [editingHome, setEditingHome] = useState<HomeGroup | null>(null);

  // Designate Head of Family Modal State
  const [designatingLeaderHome, setDesignatingLeaderHome] = useState<HomeGroup | null>(null);
  const [leaderNameInput, setLeaderNameInput] = useState('');
  const [leaderPhoneInput, setLeaderPhoneInput] = useState('');
  const [leaderEmailInput, setLeaderEmailInput] = useState('');

  // Assign Member to Family Modal State
  const [assigningToHome, setAssigningToHome] = useState<HomeGroup | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Confirm delete modal
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Toggle family member roster visibility
  const toggleExpandFamily = (homeId: string) => {
    setExpandedFamilyIds((prev) => ({
      ...prev,
      [homeId]: !prev[homeId],
    }));
  };

  // Get members belonging to a family
  const getFamilyMembers = (home: HomeGroup): Member[] => {
    return members.filter((m) => {
      if (m.homeId === home.id) return true;
      if (home.hostelOrResidence && m.hostelOrResidence) {
        return m.hostelOrResidence.trim().toLowerCase() === home.hostelOrResidence.trim().toLowerCase();
      }
      return false;
    });
  };

  // Create Family Handler
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

  // Update Family Handler
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

  // Open Designate Leader Modal
  const openDesignateLeaderModal = (home: HomeGroup) => {
    setDesignatingLeaderHome(home);
    setLeaderNameInput(home.leaderName === 'To be designated (Click to assign)' ? '' : home.leaderName);
    setLeaderPhoneInput(home.leaderPhone === '+256 700 000000' ? '' : home.leaderPhone);
    setLeaderEmailInput(home.leaderEmail || '');
  };

  // Save Designated Leader
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

  // Assign Member to Family
  const handleAssignMember = (memberId: string, homeId: string) => {
    assignMemberToHome(memberId, homeId);
  };

  // Remove Member from Family
  const handleRemoveMemberFromFamily = (memberId: string) => {
    assignMemberToHome(memberId, '');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteHome(itemToDelete.id);
    setItemToDelete(null);
  };

  // Filtered families
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
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Hostel & Cell Network
              </span>
              <span className="text-xs text-slate-400">KIU Kansanga Division</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <HeartHandshake className="w-7 h-7 text-orange-400" />
              <span>Fellowship Families Network</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Organize registered fellowship members into hostel and cell families for pastoral follow-up, fellowship meetings, and discipleship.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => autoGroupByHostel()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
              title="Automatically scan member hostels and generate fellowship families"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Auto-Organize from Hostels</span>
            </button>

            {homes.length > 0 ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/60 border border-slate-700/80 text-slate-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
                title="Clear all existing families to start empty"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Empty All Families</span>
              </button>
            ) : null}

            <button
              onClick={() => setIsAddHomeOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Family</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search families, hostels, or leaders..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-medium">
            {filteredHomes.length} {filteredHomes.length === 1 ? 'Family' : 'Families'} Active
          </span>
        </div>
      </div>

      {/* Main Families Grid */}
      <div>
        {homes.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Fellowship Families Created Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click &quot;Auto-Organize from Hostels&quot; to automatically group registered members by their hostel or residence, or add your custom fellowship families manually.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => autoGroupByHostel()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auto-Organize from Hostels</span>
              </button>
              <button
                onClick={() => setIsAddHomeOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHomes.map((home) => {
              const familyMembers = getFamilyMembers(home);
              const isExpanded = !!expandedFamilyIds[home.id];

              return (
                <div
                  key={home.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left relative flex flex-col justify-between shadow-md group"
                >
                  <div className="space-y-4">
                    {/* Family Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold shrink-0">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-snug">{home.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {home.hostelOrResidence ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-300 border border-orange-500/25">
                                {home.hostelOrResidence}
                              </span>
                            ) : null}
                            <span className="text-xs text-slate-400 font-medium">{home.zone}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                        Cap: {home.targetCount || 25}
                      </span>
                    </div>

                    {/* Head of Family (Leader) Card */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          <Crown className="w-3.5 h-3.5" />
                          <span>Head of Family</span>
                        </div>
                        <button
                          onClick={() => openDesignateLeaderModal(home)}
                          className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold px-2 py-0.5 rounded bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 transition-all cursor-pointer"
                        >
                          Change Leader
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-white text-xs truncate">{home.leaderName}</div>
                        {home.leaderPhone && (
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-orange-400" />
                            <span>{home.leaderPhone}</span>
                          </div>
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
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => toggleExpandFamily(home.id)}
                        className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{familyMembers.length} Members</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setAssigningToHome(home)}
                        className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/30 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>+ Assign Member</span>
                      </button>
                    </div>

                    {/* Expanded Members Roster */}
                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                        {familyMembers.length === 0 ? (
                          <div className="text-center py-2 text-[11px] text-slate-500">
                            No members assigned to this family yet.
                          </div>
                        ) : (
                          familyMembers.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800/60 text-xs"
                            >
                              <div className="truncate pr-2">
                                <span className="font-semibold text-white">{m.fullName}</span>
                                <span className="font-mono text-[10px] text-orange-400 ml-1.5">({m.id})</span>
                              </div>
                              <button
                                onClick={() => handleRemoveMemberFromFamily(m.id)}
                                className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                                title="Remove from family"
                              >
                                <UserMinus className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setEditingHome(home)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setItemToDelete({ id: home.id, name: home.name })}
                      className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD FAMILY MODAL */}
      {isAddHomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-orange-400" />
                <span>Add Fellowship Family</span>
              </h3>
              <button onClick={() => setIsAddHomeOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateHome} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Family / Cell Name *</label>
                <input
                  type="text"
                  required
                  value={newHomeName}
                  onChange={(e) => setNewHomeName(e.target.value)}
                  placeholder="e.g. Olympia Hostel Fellowship Family"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hostel or Residence</label>
                  <input
                    type="text"
                    value={newHomeHostel}
                    onChange={(e) => setNewHomeHostel(e.target.value)}
                    placeholder="e.g. Olympia Hostel"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Zone / Area</label>
                  <input
                    type="text"
                    value={newHomeZone}
                    onChange={(e) => setNewHomeZone(e.target.value)}
                    placeholder="e.g. Kansanga"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Head of Family Name *</label>
                  <input
                    type="text"
                    required
                    value={newHomeLeaderName}
                    onChange={(e) => setNewHomeLeaderName(e.target.value)}
                    placeholder="e.g. Samuel Kigozi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Leader Phone Contact</label>
                  <input
                    type="tel"
                    value={newHomeLeaderPhone}
                    onChange={(e) => setNewHomeLeaderPhone(e.target.value)}
                    placeholder="+256 700 000000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Meeting Time / Schedule</label>
                  <input
                    type="text"
                    value={newHomeMeetingDay}
                    onChange={(e) => setNewHomeMeetingDay(e.target.value)}
                    placeholder="e.g. Wednesdays 6:00 PM"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Capacity</label>
                  <input
                    type="number"
                    value={newHomeTargetCount}
                    onChange={(e) => setNewHomeTargetCount(Number(e.target.value))}
                    min={5}
                    max={100}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newHomeDescription}
                  onChange={(e) => setNewHomeDescription(e.target.value)}
                  placeholder="Notes about meeting location or floor room..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddHomeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Save Family
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FAMILY MODAL */}
      {editingHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Edit Fellowship Family</h3>
              <button onClick={() => setEditingHome(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateHome} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Family Name *</label>
                <input
                  type="text"
                  required
                  value={editingHome.name}
                  onChange={(e) => setEditingHome({ ...editingHome, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hostel or Residence</label>
                  <input
                    type="text"
                    value={editingHome.hostelOrResidence || ''}
                    onChange={(e) => setEditingHome({ ...editingHome, hostelOrResidence: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Zone / Area</label>
                  <input
                    type="text"
                    value={editingHome.zone}
                    onChange={(e) => setEditingHome({ ...editingHome, zone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Leader Name *</label>
                  <input
                    type="text"
                    required
                    value={editingHome.leaderName}
                    onChange={(e) => setEditingHome({ ...editingHome, leaderName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Leader Phone</label>
                  <input
                    type="tel"
                    value={editingHome.leaderPhone}
                    onChange={(e) => setEditingHome({ ...editingHome, leaderPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingHome(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DESIGNATE HEAD OF FAMILY MODAL */}
      {designatingLeaderHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Designate Head of Family</span>
              </h3>
              <button onClick={() => setDesignatingLeaderHome(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Leader Full Name *</label>
                <input
                  type="text"
                  required
                  value={leaderNameInput}
                  onChange={(e) => setLeaderNameInput(e.target.value)}
                  placeholder="e.g. Esther Namubiru"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Leader Phone</label>
                <input
                  type="tel"
                  value={leaderPhoneInput}
                  onChange={(e) => setLeaderPhoneInput(e.target.value)}
                  placeholder="+256 700 000000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDesignatingLeaderHome(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Assign Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN MEMBER TO FAMILY MODAL */}
      {assigningToHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-sm">Assign Member to {assigningToHome.name}</h3>
                <p className="text-[11px] text-slate-400">Search registered members to assign to this fellowship family.</p>
              </div>
              <button onClick={() => setAssigningToHome(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder="Search member name, PIN, hostel..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 max-h-60 p-1">
              {members
                .filter((m) => {
                  const q = memberSearchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    m.fullName.toLowerCase().includes(q) ||
                    m.id.toLowerCase().includes(q) ||
                    (m.hostelOrResidence && m.hostelOrResidence.toLowerCase().includes(q))
                  );
                })
                .slice(0, 50)
                .map((m) => {
                  const isAssigned = m.homeId === assigningToHome.id;

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-white">{m.fullName}</div>
                        <div className="text-[10px] text-slate-400">
                          {m.id} • {m.hostelOrResidence || 'No hostel'}
                        </div>
                      </div>

                      {isAssigned ? (
                        <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Assigned</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAssignMember(m.id, assigningToHome.id)}
                          className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setAssigningToHome(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Delete Fellowship Family?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove <strong className="text-white">&quot;{itemToDelete.name}&quot;</strong>? This action will remove it from the fellowship structure.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL FAMILIES CONFIRMATION */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Empty All Families?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This will clear all current fellowship families, giving you a completely empty slate to enter your custom data.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllGroups();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Yes, Empty Families
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export const FellowshipFamiliesManager = FellowshipGroupsManager;
