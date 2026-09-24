import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Member, MemberPortfolio } from '../../types';
import { exportMembersToCsv } from '../../utils/exportUtils';
import {
  Users,
  Search,
  Plus,
  Download,
  QrCode,
  Eye,
  MapPin,
  GraduationCap,
  Building,
  Briefcase,
} from 'lucide-react';

interface MemberDirectoryProps {
  onOpenRegister: () => void;
  onSelectMember: (member: Member) => void;
  onViewIdCard: (member: Member) => void;
}

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  onOpenRegister,
  onSelectMember,
  onViewIdCard,
}) => {
  const {
    members,
    homes = [],
    departments = [],
    searchQuery,
    setSearchQuery,
  } = useFellowship();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [portfolioFilter, setPortfolioFilter] = useState<string>('All');
  const [residenceFilter, setResidenceFilter] = useState<string>('All');

  const getMemberPortfolio = (member: Member): MemberPortfolio => {
    if (member.portfolio) return member.portfolio;
    if (member.status === 'Graduated') return 'Alumni';
    if (member.studentInfo?.isStudent) return 'Schools';
    return 'Community';
  };

  // Portfolio counts
  const schoolsCount = members.filter((m) => getMemberPortfolio(m) === 'Schools').length;
  const alumniCount = members.filter((m) => getMemberPortfolio(m) === 'Alumni').length;
  const communityCount = members.filter((m) => getMemberPortfolio(m) === 'Community').length;
  const firstTimersCount = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;

  // Filter logic
  const filteredMembers = members.filter((member) => {
    // Search query
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      member.fullName.toLowerCase().includes(q) ||
      member.id.toLowerCase().includes(q) ||
      member.phone.toLowerCase().includes(q) ||
      (member.email && member.email.toLowerCase().includes(q)) ||
      (member.residence && member.residence.toLowerCase().includes(q)) ||
      (member.hostelOrResidence && member.hostelOrResidence.toLowerCase().includes(q)) ||
      (member.studentInfo?.campus && member.studentInfo.campus.toLowerCase().includes(q)) ||
      (member.studentInfo?.course && member.studentInfo.course.toLowerCase().includes(q));

    // Status filter
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;

    // Portfolio filter
    const mPortfolio = getMemberPortfolio(member);
    const matchesPortfolio = portfolioFilter === 'All' || mPortfolio === portfolioFilter;

    // Residence filter
    const matchesResidence =
      residenceFilter === 'All' ||
      member.residence === residenceFilter ||
      member.hostelOrResidence === residenceFilter;

    return matchesSearch && matchesStatus && matchesPortfolio && matchesResidence;
  });

  const today = new Date().toISOString().split('T')[0];

  const exportMembersCsv = () => {
    exportMembersToCsv(filteredMembers, homes, departments, `manifest_kiu_members_${today}.csv`);
  };

  const residences = ['Kansanga', 'Kabalagala', 'Ggaba', 'Bunga', 'Nsambya', 'Luwafu', 'Makindye Division'];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Members & Portfolios Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete database of {members.length} members across Schools, Alumni, and Community portfolios
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportMembersCsv}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95 border border-orange-400/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Register New Member</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, MAN-ID..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Member Statuses</option>
              <option value="Active">Active</option>
              <option value="First Timer">First Timer</option>
              <option value="Returning Visitor">Returning Visitor</option>
              <option value="Graduated">Graduated</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Portfolio Filter: Schools, Alumni, Community */}
          <div>
            <select
              value={portfolioFilter}
              onChange={(e) => setPortfolioFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500 font-semibold"
            >
              <option value="All">All Portfolios ({members.length})</option>
              <option value="Schools">🎓 Schools ({schoolsCount})</option>
              <option value="Alumni">🏛️ Alumni ({alumniCount})</option>
              <option value="Community">🤝 Community ({communityCount})</option>
            </select>
          </div>

          {/* Residence Filter */}
          <div>
            <select
              value={residenceFilter}
              onChange={(e) => setResidenceFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Makindye Areas</option>
              {residences.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Filter Tags with real counts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[11px]">
          <span className="text-slate-500 font-medium mr-1">Portfolios & Views:</span>
          
          <button
            onClick={() => {
              setStatusFilter('All');
              setPortfolioFilter('All');
              setResidenceFilter('All');
              setSearchQuery('');
            }}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              statusFilter === 'All' && portfolioFilter === 'All' && residenceFilter === 'All'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Members ({members.length})
          </button>

          <button
            onClick={() => setPortfolioFilter('Schools')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              portfolioFilter === 'Schools'
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-slate-800 text-blue-300 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>Schools ({schoolsCount})</span>
          </button>

          <button
            onClick={() => setPortfolioFilter('Alumni')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              portfolioFilter === 'Alumni'
                ? 'bg-purple-500 text-white font-bold'
                : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
            }`}
          >
            <Building className="w-3 h-3" />
            <span>Alumni ({alumniCount})</span>
          </button>

          <button
            onClick={() => setPortfolioFilter('Community')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              portfolioFilter === 'Community'
                ? 'bg-emerald-500 text-white font-bold'
                : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            <span>Community ({communityCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('First Timer')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              statusFilter === 'First Timer'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            🌟 First Timers ({firstTimersCount})
          </button>
        </div>
      </div>

      {/* Members Table / List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member / Name</th>
                <th className="py-3 px-4">Identification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Portfolio & Affiliation</th>
                <th className="py-3 px-4">Hostel / Residence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredMembers.map((member) => {
                const p = getMemberPortfolio(member);

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-850/80 transition-colors group"
                  >
                    {/* Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-orange-400 shrink-0">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <div
                            onClick={() => onSelectMember(member)}
                            className="font-bold text-white hover:text-orange-400 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{member.fullName}</span>
                            {member.preferredName && (
                              <span className="text-[11px] text-slate-400 font-normal">
                                ({member.preferredName})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{member.phone}</span>
                            <span>•</span>
                            <span>{member.gender}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* MAN ID */}
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-400 font-bold text-[10px] border border-slate-700">
                        {member.id}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : member.status === 'First Timer'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : member.status === 'Returning Visitor'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* Portfolio & Details */}
                    <td className="py-3 px-4">
                      {p === 'Schools' ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Schools
                            </span>
                            <span className="font-medium text-slate-200 truncate max-w-[160px]">
                              {member.studentInfo?.course || 'University Student'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                            {member.studentInfo?.yearOfStudy ? `Yr ${member.studentInfo.yearOfStudy} • ` : ''}
                            {member.studentInfo?.campus?.split('(')[0]?.trim() || member.studentInfo?.campus || 'Campus'}
                          </div>
                        </div>
                      ) : p === 'Alumni' ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Alumni
                            </span>
                            <span className="font-medium text-purple-200 truncate max-w-[160px]">
                              {member.studentInfo?.course || 'Fellowship Graduate'}
                            </span>
                          </div>
                          <div className="text-[10px] text-purple-300/70 truncate max-w-[180px] mt-0.5">
                            {member.studentInfo?.campus || 'Graduate Network'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Community
                            </span>
                            <span className="font-medium text-emerald-200 truncate max-w-[160px]">
                              {member.studentInfo?.course || member.notes || 'Community Partner'}
                            </span>
                          </div>
                          <div className="text-[10px] text-emerald-400/70 truncate max-w-[180px] mt-0.5">
                            {member.studentInfo?.campus || 'Area Resident'}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Area / Residence */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[150px] font-medium" title={member.hostelOrResidence || member.residence}>
                          {member.hostelOrResidence || member.residence || 'Kansanga'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* QR Badge Card button */}
                        <button
                          onClick={() => onViewIdCard(member)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 transition-colors cursor-pointer"
                          title="View Digital Member Pass & QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {/* View Full Profile */}
                        <button
                          onClick={() => onSelectMember(member)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No members match the current search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="p-3.5 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredMembers.length}</strong> of {members.length} registered members
          </span>
          <span className="text-[11px] text-slate-500">
            Manifest Fellowship Operational System • Model Admin View
          </span>
        </div>
      </div>

    </div>
  );
};
