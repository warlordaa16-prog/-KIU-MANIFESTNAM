import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { HomeGroup, Department, Member } from '../../types';
import {
  HeartHandshake,
  Home,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Search,
  Plus,
  Edit2,
  Trash2,
  Building,
  UserCheck,
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
  Layers,
} from 'lucide-react';

export const FellowshipGroupsManager: React.FC = () => {
  const {
    homes = [],
    departments = [],
    members = [],
    addHome,
    updateHome,
    deleteHome,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    clearAllGroups,
    assignMemberToHome,
    setHomeLeader,
    autoGroupByHostel,
  } = useFellowship();

  const [activeTab, setActiveTab] = useState<'homes' | 'departments'>('homes');
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

  // Add Department Modal State
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptLeaderName, setNewDeptLeaderName] = useState('');
  const [newDeptLeaderPhone, setNewDeptLeaderPhone] = useState('');
  const [newDeptMeetingSchedule, setNewDeptMeetingSchedule] = useState('Fridays 5:00 PM');
  const [newDeptDescription, setNewDeptDescription] = useState('');

  // Edit Department Modal State
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Confirm delete modal
  const [itemToDelete, setItemToDelete] = useState<{ type: 'home' | 'department'; id: string; name: string } | null>(null);
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
      targetCount: Number(newHomeTargetCount) || 20,
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
      targetCount: Number(editingHome.targetCount) || 20,
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

  // Create Department Handler
  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptLeaderName.trim()) return;

    const generatedCode = newDeptCode.trim()
      ? newDeptCode.trim().toUpperCase()
      : newDeptName.trim().slice(0, 4).toUpperCase();

    addDepartment({
      name: newDeptName.trim(),
      code: generatedCode,
      leaderId: 'MAN-LEADER-' + Date.now(),
      leaderName: newDeptLeaderName.trim(),
      leaderPhone: newDeptLeaderPhone.trim() || '+256 700 000000',
      meetingSchedule: newDeptMeetingSchedule.trim() || 'Weekly Meeting',
      description: newDeptDescription.trim() || 'Fellowship ministry department.',
    });

    setIsAddDeptOpen(false);
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptLeaderName('');
    setNewDeptLeaderPhone('');
    setNewDeptDescription('');
  };

  // Update Department Handler
  const handleUpdateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !editingDept.name.trim() || !editingDept.leaderName.trim()) return;

    updateDepartment(editingDept.id, {
      name: editingDept.name.trim(),
      code: editingDept.code.trim().toUpperCase(),
      leaderName: editingDept.leaderName.trim(),
      leaderPhone: editingDept.leaderPhone.trim(),
      meetingSchedule: editingDept.meetingSchedule.trim(),
      description: editingDept.description.trim(),
    });

    setEditingDept(null);
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'home') {
      deleteHome(itemToDelete.id);
    } else {
      deleteDepartment(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  // Filtered lists
  const filteredHomes = homes.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.hostelOrResidence && h.hostelOrResidence.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (h.location && h.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.leaderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Available members to assign to selected family
  const availableMembersForAssignment = members.filter((m) => {
    if (!assigningToHome) return false;
    const matchesSearch =
      m.fullName.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.phone.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(memberSearchQuery.toLowerCase())) ||
      (m.hostelOrResidence && m.hostelOrResidence.toLowerCase().includes(memberSearchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6" id="fellowship-families-manager">
      
      {/* Top Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <HeartHandshake className="w-4 h-4" />
              Fellowship Structure & Families
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Fellowship Families & Ministries
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Organize members into hostel & residence families, designate family heads, and manage service ministry departments.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto-Organize Families by Hostel Button */}
            <button
              onClick={() => autoGroupByHostel()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Automatically group registered members in the same hostel/residence into fellowship families"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Auto-Organize Hostel Families</span>
            </button>

            {homes.length > 0 || departments.length > 0 ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/60 border border-slate-700/80 text-slate-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
                title="Clear all existing families to start empty"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Empty All Families</span>
              </button>
            ) : null}

            {activeTab === 'homes' ? (
              <button
                onClick={() => setIsAddHomeOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Family</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAddDeptOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Department</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection & Search */}
        <div className="mt-6 pt-6 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-slate-950/90 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('homes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'homes'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Hostel & Cell Families ({homes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Ministries & Depts ({departments.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'homes' ? 'families, hostels, or leaders' : 'departments or codes'}...`}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'homes' ? (
        <div>
          {homes.length === 0 ? (
            /* Empty State for Families */
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Fellowship Families Created Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click &quot;Auto-Organize Hostel Families&quot; to automatically group registered members by their hostel or residence, or add your custom fellowship families manually.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => autoGroupByHostel()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 font-bold text-xs transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Auto-Organize from Member Hostels</span>
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
                          Cap: {home.targetCount || 20}
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
                            title="Designate or edit the head of this family"
                          >
                            Designate Head
                          </button>
                        </div>

                        <div className="text-xs">
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>{home.leaderName || 'To be designated'}</span>
                          </div>
                          {home.leaderPhone && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span className="font-mono">{home.leaderPhone}</span>
                            </div>
                          )}
                          {home.leaderEmail && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span className="truncate">{home.leaderEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meeting & Location Details */}
                      <div className="space-y-1.5 text-xs text-slate-400">
                        {home.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate">{home.location}</span>
                          </div>
                        )}
                        {home.meetingDay && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{home.meetingDay}</span>
                          </div>
                        )}
                        {home.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 border-t border-slate-800/60 mt-1">
                            {home.description}
                          </p>
                        )}
                      </div>

                      {/* Family Members Roster Section */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleExpandFamily(home.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-orange-400" />
                            <span>Family Members ({familyMembers.length})</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setAssigningToHome(home);
                              setMemberSearchQuery('');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all cursor-pointer"
                            title="Assign a member with their details to this family"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Assign Member</span>
                          </button>
                        </div>

                        {/* Expanded Member List */}
                        {isExpanded && (
                          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                            {familyMembers.length === 0 ? (
                              <div className="p-3 text-center text-slate-500 text-[11px] rounded-lg bg-slate-950/40 border border-slate-800/50">
                                No members assigned to this family yet. Click &quot;Assign Member&quot; or auto-organize by hostel.
                              </div>
                            ) : (
                              familyMembers.map((m) => (
                                <div
                                  key={m.id}
                                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                                >
                                  <div className="min-w-0 pr-2">
                                    <div className="font-semibold text-white truncate flex items-center gap-1.5">
                                      <span>{m.fullName}</span>
                                      {m.portfolio && (
                                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                          {m.portfolio}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                                      <span>{m.phone}</span>
                                      {m.email && <span>• {m.email}</span>}
                                    </div>
                                    {m.hostelOrResidence && (
                                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                                        Hostel: {m.hostelOrResidence}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => assignMemberToHome(m.id, undefined)}
                                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                                    title="Remove member from this family"
                                  >
                                    <UserMinus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingHome(home)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setItemToDelete({ type: 'home', id: home.id, name: home.name })}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
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
      ) : (
        /* Service Ministries Tab */
        <div>
          {departments.length === 0 ? (
            /* Empty State for Departments */
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <Building className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Ministries or Departments Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The departments list is empty. Add your fellowship&apos;s ministries (e.g. Media, Choir, Protocol, Intercession) to organize teams and coordinators.
                </p>
              </div>
              <button
                onClick={() => setIsAddDeptOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Your First Department</span>
              </button>
            </div>
          ) : filteredDepts.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              No departments match &quot;{searchQuery}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDepts.map((dept) => (
                <div
                  key={dept.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-left relative flex flex-col justify-between shadow-md"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-snug">{dept.name}</h3>
                          <span className="text-xs text-amber-400 font-mono font-bold">{dept.code}</span>
                        </div>
                      </div>
                    </div>

                    {dept.description && (
                      <p className="mt-3 text-xs text-slate-400 line-clamp-2">{dept.description}</p>
                    )}

                    {/* Details */}
                    <div className="mt-3 space-y-2 text-xs text-slate-400">
                      {dept.meetingSchedule && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{dept.meetingSchedule}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Leader: <strong className="text-slate-200">{dept.leaderName}</strong></span>
                      </div>
                      {dept.leaderPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="font-mono">{dept.leaderPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingDept(dept)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setItemToDelete({ type: 'department', id: dept.id, name: dept.name })}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE FAMILY MODAL */}
      {isAddHomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-orange-400" />
                Create New Fellowship Family
              </h3>
              <button
                onClick={() => setIsAddHomeOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHome} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Family Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olympia Hostel Family, Kansanga Alpha Family"
                  value={newHomeName}
                  onChange={(e) => setNewHomeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hostel / Residence</label>
                  <input
                    type="text"
                    placeholder="e.g. Olympia Hostel, Nana, Prestige"
                    value={newHomeHostel}
                    onChange={(e) => setNewHomeHostel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Zone / Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kansanga - KIU Campus"
                    value={newHomeZone}
                    onChange={(e) => setNewHomeZone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
                  Head of Family Details
                </span>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Head Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emmanuel Kato"
                    value={newHomeLeaderName}
                    onChange={(e) => setNewHomeLeaderName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Head Phone Contact</label>
                    <input
                      type="text"
                      placeholder="+256 700 000000"
                      value={newHomeLeaderPhone}
                      onChange={(e) => setNewHomeLeaderPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Head Email Address</label>
                    <input
                      type="email"
                      placeholder="leader@manifest.org"
                      value={newHomeLeaderEmail}
                      onChange={(e) => setNewHomeLeaderEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Meeting Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Olympia Hostel Lounge / Quad"
                  value={newHomeLocation}
                  onChange={(e) => setNewHomeLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    value={newHomeMeetingDay}
                    onChange={(e) => setNewHomeMeetingDay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Capacity</label>
                  <input
                    type="number"
                    value={newHomeTargetCount}
                    onChange={(e) => setNewHomeTargetCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the family's target focus or hostel residence..."
                  value={newHomeDescription}
                  onChange={(e) => setNewHomeDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold shadow-md shadow-orange-500/20 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-orange-400" />
                Edit Family ({editingHome.name})
              </h3>
              <button
                onClick={() => setEditingHome(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateHome} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Family Name *</label>
                <input
                  type="text"
                  required
                  value={editingHome.name}
                  onChange={(e) => setEditingHome({ ...editingHome, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hostel / Residence</label>
                  <input
                    type="text"
                    value={editingHome.hostelOrResidence || ''}
                    onChange={(e) => setEditingHome({ ...editingHome, hostelOrResidence: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Zone / Area *</label>
                  <input
                    type="text"
                    required
                    value={editingHome.zone}
                    onChange={(e) => setEditingHome({ ...editingHome, zone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
                  Head of Family Details
                </span>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Head Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingHome.leaderName}
                    onChange={(e) => setEditingHome({ ...editingHome, leaderName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Head Phone Contact</label>
                    <input
                      type="text"
                      value={editingHome.leaderPhone}
                      onChange={(e) => setEditingHome({ ...editingHome, leaderPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Head Email Address</label>
                    <input
                      type="email"
                      value={editingHome.leaderEmail || ''}
                      onChange={(e) => setEditingHome({ ...editingHome, leaderEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Meeting Location</label>
                <input
                  type="text"
                  value={editingHome.location}
                  onChange={(e) => setEditingHome({ ...editingHome, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    value={editingHome.meetingDay}
                    onChange={(e) => setEditingHome({ ...editingHome, meetingDay: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Capacity</label>
                  <input
                    type="number"
                    value={editingHome.targetCount || 20}
                    onChange={(e) => setEditingHome({ ...editingHome, targetCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingHome.description || ''}
                  onChange={(e) => setEditingHome({ ...editingHome, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Designate Head of Family</h3>
                  <p className="text-[11px] text-orange-400">{designatingLeaderHome.name}</p>
                </div>
              </div>
              <button
                onClick={() => setDesignatingLeaderHome(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter the specific details of the person who will head and shepherd this fellowship family.
            </p>

            <form onSubmit={handleSaveLeader} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Head Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emmanuel Kato"
                  value={leaderNameInput}
                  onChange={(e) => setLeaderNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Telephone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+256 700 000000"
                  value={leaderPhoneInput}
                  onChange={(e) => setLeaderPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="leader@manifest.org"
                  value={leaderEmailInput}
                  onChange={(e) => setLeaderEmailInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick Select from existing registered members */}
              {members.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="block text-[10px] text-slate-400 mb-1.5 font-semibold">Or select from registered members:</span>
                  <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                    {members.slice(0, 10).map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          setLeaderNameInput(m.fullName);
                          setLeaderPhoneInput(m.phone);
                          setLeaderEmailInput(m.email || '');
                        }}
                        className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300 transition-colors"
                      >
                        <span className="font-semibold text-white">{m.fullName}</span>
                        <span className="text-slate-500 font-mono text-[10px]">{m.phone}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDesignatingLeaderHome(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Save Head of Family
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN MEMBER TO FAMILY MODAL */}
      {assigningToHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Assign Member to Family</h3>
                  <p className="text-[11px] text-emerald-400">{assigningToHome.name}</p>
                </div>
              </div>
              <button
                onClick={() => setAssigningToHome(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select any registered member to assign them to this family. Their contact email, telephone, and hostel details are shown below.
            </p>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member by name, phone, email, hostel..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
              {availableMembersForAssignment.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No members match &quot;{memberSearchQuery}&quot;.
                </div>
              ) : (
                availableMembersForAssignment.map((m) => {
                  const isAlreadyInFamily = m.homeId === assigningToHome.id;

                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-white flex items-center gap-1.5 truncate">
                          <span>{m.fullName}</span>
                          {m.portfolio && (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {m.portfolio}
                            </span>
                          )}
                          {isAlreadyInFamily && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                              Assigned
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-mono text-slate-300">{m.phone}</span>
                          {m.email && <span>• {m.email}</span>}
                        </div>
                        {m.hostelOrResidence && (
                          <div className="text-[10px] text-orange-400/90 mt-0.5 truncate">
                            Hostel: {m.hostelOrResidence}
                          </div>
                        )}
                      </div>

                      {isAlreadyInFamily ? (
                        <button
                          onClick={() => assignMemberToHome(m.id, undefined)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-800/50 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => assignMemberToHome(m.id, assigningToHome.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs cursor-pointer shrink-0 transition-colors shadow-sm"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setAssigningToHome(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE DEPARTMENT MODAL */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                Add Ministry / Department
              </h3>
              <button
                onClick={() => setIsAddDeptOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Ministry Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Worship & Creative Arts"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="e.g. WRSH"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Head / Coordinator *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Namubiru"
                    value={newDeptLeaderName}
                    onChange={(e) => setNewDeptLeaderName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+256 700 000000"
                    value={newDeptLeaderPhone}
                    onChange={(e) => setNewDeptLeaderPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Fridays 5:00 PM - Campus Lounge"
                  value={newDeptMeetingSchedule}
                  onChange={(e) => setNewDeptMeetingSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Ministry Mandate / Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe this department's service scope and responsibilities..."
                  value={newDeptDescription}
                  onChange={(e) => setNewDeptDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DEPARTMENT MODAL */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-400" />
                Edit Department ({editingDept.name})
              </h3>
              <button
                onClick={() => setEditingDept(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDept} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Ministry Name *</label>
                  <input
                    type="text"
                    required
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    value={editingDept.code}
                    onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Head / Coordinator *</label>
                  <input
                    type="text"
                    required
                    value={editingDept.leaderName}
                    onChange={(e) => setEditingDept({ ...editingDept, leaderName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editingDept.leaderPhone}
                    onChange={(e) => setEditingDept({ ...editingDept, leaderPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                <input
                  type="text"
                  value={editingDept.meetingSchedule}
                  onChange={(e) => setEditingDept({ ...editingDept, meetingSchedule: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mandate / Description</label>
                <textarea
                  rows={2}
                  value={editingDept.description}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
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
              <h3 className="font-bold text-white text-base">Delete {itemToDelete.type === 'home' ? 'Fellowship Family' : 'Department'}?</h3>
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
                This will clear all current fellowship families and ministry departments, giving you a completely empty slate to enter your custom data.
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
