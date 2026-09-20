import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { HomeGroup, Department } from '../../types';
import {
  Layers,
  Home,
  Users,
  MapPin,
  Calendar,
  Phone,
  Search,
  Plus,
  Edit2,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const FellowshipGroupsManager: React.FC = () => {
  const {
    homes,
    departments,
    members,
    addHome,
    updateHome,
    updateDepartment,
    currentUserRole,
  } = useFellowship();

  const [activeTab, setActiveTab] = useState<'homes' | 'departments'>('homes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // New Home Modal
  const [isAddHomeOpen, setIsAddHomeOpen] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [newHomeZone, setNewHomeZone] = useState('Kansanga - KIU Campus');
  const [newHomeLeaderName, setNewHomeLeaderName] = useState('');
  const [newHomeLeaderPhone, setNewHomeLeaderPhone] = useState('');
  const [newHomeMeetingDay, setNewHomeMeetingDay] = useState('Every Wednesday 6:00 PM');
  const [newHomeLocation, setNewHomeLocation] = useState('');
  const [newHomeTargetCount, setNewHomeTargetCount] = useState(25);

  const handleCreateHome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomeName.trim() || !newHomeLeaderName.trim()) return;

    addHome({
      name: newHomeName.trim(),
      zone: newHomeZone.trim(),
      leaderId: 'MAN-LEADER-' + Date.now(),
      leaderName: newHomeLeaderName.trim(),
      leaderPhone: newHomeLeaderPhone.trim() || '+256 700 000000',
      meetingDay: newHomeMeetingDay,
      location: newHomeLocation.trim() || 'KIU Campus Zone',
      targetCount: Number(newHomeTargetCount) || 20,
    });

    setIsAddHomeOpen(false);
    setNewHomeName('');
    setNewHomeLeaderName('');
    setNewHomeLeaderPhone('');
    setNewHomeLocation('');
  };

  const filteredHomes = homes.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.leaderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.leaderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedHome = homes.find((h) => h.id === selectedHomeId);
  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  const homeMembers = selectedHome
    ? members.filter((m) => m.homeId === selectedHome.id)
    : [];

  const deptMembers = selectedDept
    ? members.filter((m) => m.departmentIds?.includes(selectedDept.id))
    : [];

  return (
    <div className="space-y-6" id="fellowship-groups-manager">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Community & Governance Structures
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Fellowship Groups & Ministries
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage Home Fellowship Cell units across Makindye/Kansanga and specialized service ministries.
            </p>
          </div>

          {activeTab === 'homes' && (
            <button
              onClick={() => setIsAddHomeOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Create Home Cell
            </button>
          )}
        </div>

        {/* Tab Selection & Search */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab('homes');
                setSelectedDeptId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'homes'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Home Cell Groups ({homes.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('departments');
                setSelectedHomeId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              Service Ministries ({departments.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'homes' ? 'cells or zones' : 'ministries'}...`}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'homes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Home Groups Grid */}
          <div className={`${selectedHome ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
            {filteredHomes.map((home) => {
              const assignedMembersCount = members.filter((m) => m.homeId === home.id).length;
              const isSelected = selectedHomeId === home.id;

              return (
                <div
                  key={home.id}
                  onClick={() => setSelectedHomeId(isSelected ? null : home.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                    isSelected
                      ? 'bg-orange-950/20 border-orange-500/80 shadow-lg shadow-orange-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{home.name}</h3>
                        <span className="text-xs text-orange-400/90 font-medium">{home.zone}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {assignedMembersCount} / {home.targetCount} members
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{home.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{home.meetingDay}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Leader: <strong className="text-slate-200">{home.leaderName}</strong> ({home.leaderPhone})</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-orange-400">
                    <span>{isSelected ? 'Viewing roster' : 'Click to view member roster'}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Member Roster for Selected Home */}
          {selectedHome && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 h-fit space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-base">{selectedHome.name} Roster</h4>
                  <p className="text-xs text-slate-400">{homeMembers.length} active registered members</p>
                </div>
                <button
                  onClick={() => setSelectedHomeId(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {homeMembers.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-6 text-center">
                  No members assigned to this cell group yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {homeMembers.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-xs truncate">{m.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.id} • {m.phone}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {m.academicYear || m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Ministries / Departments Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedDept ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
            {filteredDepts.map((dept) => {
              const assignedMembersCount = members.filter((m) => m.departmentIds?.includes(dept.id)).length;
              const isSelected = selectedDeptId === dept.id;

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(isSelected ? null : dept.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{dept.name}</h3>
                        <span className="text-xs text-amber-400/90 font-mono font-medium">{dept.code}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {assignedMembersCount} volunteers
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-2">{dept.description}</p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{dept.meetingSchedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Leader: <strong className="text-slate-200">{dept.leaderName}</strong> ({dept.leaderPhone})</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>{isSelected ? 'Viewing roster' : 'Click to view volunteer roster'}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Volunteer Roster for Selected Ministry */}
          {selectedDept && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 h-fit space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-base">{selectedDept.name} Roster</h4>
                  <p className="text-xs text-slate-400">{deptMembers.length} active members</p>
                </div>
                <button
                  onClick={() => setSelectedDeptId(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {deptMembers.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-6 text-center">
                  No volunteers currently assigned to this department.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {deptMembers.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-xs truncate">{m.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.id} • {m.phone}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Home Modal */}
      {isAddHomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Home className="w-5 h-5 text-orange-400" />
                Add New Home Cell Group
              </h3>
              <button
                onClick={() => setIsAddHomeOpen(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHome} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cell Group Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home Bethel, Home Carmel"
                  value={newHomeName}
                  onChange={(e) => setNewHomeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Zone / Territory *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kansanga - Kalungi / KIU Hostels"
                  value={newHomeZone}
                  onChange={(e) => setNewHomeZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Leader Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brian Ochieng"
                    value={newHomeLeaderName}
                    onChange={(e) => setNewHomeLeaderName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Leader Phone</label>
                  <input
                    type="text"
                    placeholder="+256 700 000000"
                    value={newHomeLeaderPhone}
                    onChange={(e) => setNewHomeLeaderPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Location</label>
                <input
                  type="text"
                  placeholder="e.g. Dream World Hostel Lawn, Kansanga"
                  value={newHomeLocation}
                  onChange={(e) => setNewHomeLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    value={newHomeMeetingDay}
                    onChange={(e) => setNewHomeMeetingDay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Members</label>
                  <input
                    type="number"
                    value={newHomeTargetCount}
                    onChange={(e) => setNewHomeTargetCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddHomeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Save Cell Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
