import React, { useState } from 'react';
import { Member, MemberStatus, MemberPortfolio, UGANDA_UNIVERSITIES } from '../../types';
import { useFellowship } from '../../context/FellowshipContext';
import {
  X,
  User,
  GraduationCap,
  HeartHandshake,
  Edit2,
  Save,
  Phone,
  Mail,
  QrCode,
  Building,
  Briefcase,
  Users,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface MemberProfileModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onViewIdCard: (member: Member) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  member,
  isOpen,
  onClose,
  onViewIdCard,
}) => {
  const {
    updateMember,
    deleteMember,
  } = useFellowship();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Edit states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hostelOrResidence, setHostelOrResidence] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<MemberStatus>('Active');
  const [portfolio, setPortfolio] = useState<MemberPortfolio>('Schools');
  const [course, setCourse] = useState('');
  const [campus, setCampus] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (member) {
      const derivedFirst = member.firstName || member.fullName.split(' ')[1] || member.fullName.split(' ')[0] || '';
      const derivedLast = member.lastName || (member.fullName.split(' ').length > 1 ? member.fullName.split(' ')[0] : member.fullName);
      const derivedPortfolio: MemberPortfolio =
        member.portfolio ||
        (member.status === 'Graduated' ? 'Alumni' : member.studentInfo?.isStudent ? 'Schools' : 'Community');

      setFirstName(derivedFirst);
      setLastName(derivedLast);
      setHostelOrResidence(member.hostelOrResidence || member.residence || '');
      setPreferredName(member.preferredName || '');
      setPhone(member.phone);
      setEmail(member.email);
      setStatus(member.status);
      setPortfolio(derivedPortfolio);
      setCourse(member.studentInfo?.course || '');
      setCampus(member.studentInfo?.campus || '');
      setYearOfStudy(member.studentInfo?.yearOfStudy || 1);
      setNotes(member.notes || '');
      setIsEditing(false);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSave = () => {
    const combinedFullName = `${lastName.trim()} ${firstName.trim()}`.trim() || member.fullName;
    updateMember(member.id, {
      fullName: combinedFullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      hostelOrResidence: hostelOrResidence.trim(),
      residence: hostelOrResidence.split(',')[0],
      preferredName: preferredName || undefined,
      phone: phone.trim(),
      email: email.trim(),
      status,
      portfolio,
      notes: notes || undefined,
      studentInfo: {
        ...member.studentInfo,
        isStudent: portfolio === 'Schools',
        course,
        campus,
        yearOfStudy: portfolio === 'Schools' ? Number(yearOfStudy) : undefined,
      },
    });
    setIsEditing(false);
  };

  const statusOptions: MemberStatus[] = [
    'Active',
    'Inactive',
    'First Timer',
    'Returning Visitor',
    'Transferred',
    'Graduated',
    'Archived',
  ];

  const currentPortfolio: MemberPortfolio =
    member.portfolio ||
    (member.status === 'Graduated' ? 'Alumni' : member.studentInfo?.isStudent ? 'Schools' : 'Community');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with profile banner */}
        <div className="p-5 bg-gradient-to-r from-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-xl font-extrabold text-orange-400">
                {member.fullName.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{member.fullName}</h2>
                {member.preferredName && (
                  <span className="text-xs text-slate-400 font-normal">
                    ({member.preferredName})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-400 font-mono text-[10px] font-bold border border-slate-700">
                  {member.id}
                </span>

                {/* Portfolio Tag */}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    currentPortfolio === 'Schools'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : currentPortfolio === 'Alumni'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {currentPortfolio === 'Schools' && <GraduationCap className="w-3 h-3" />}
                  {currentPortfolio === 'Alumni' && <Building className="w-3 h-3" />}
                  {currentPortfolio === 'Community' && <Briefcase className="w-3 h-3" />}
                  <span>Portfolio: {currentPortfolio}</span>
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    member.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : member.status === 'First Timer'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewIdCard(member)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 transition-colors"
              title="View Digital ID Pass & QR"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Direct Member Deletion Button */}
            <button
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 transition-colors cursor-pointer"
              title="Delete Member Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Column: Contact & Core Details */}
            <div className="space-y-4">
              
              {/* Registration PIN Record */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Registration PIN Information
                  </span>
                  <span className="font-mono text-amber-400 text-xs font-black">{member.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-amber-200/70 block text-[10px] font-semibold">Name (Surname)</span>
                    {!isEditing ? (
                      <span className="font-bold text-white text-xs">{lastName || member.lastName || member.fullName.split(' ')[0]}</span>
                    ) : (
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Surname / Last Name"
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-amber-200/70 block text-[10px] font-semibold">First Name</span>
                    {!isEditing ? (
                      <span className="font-bold text-white text-xs">{firstName || member.firstName || member.fullName.split(' ')[1] || member.fullName}</span>
                    ) : (
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-amber-200/70 block text-[10px] font-semibold">Fellowship Status</span>
                    {!isEditing ? (
                      <span className="font-bold text-amber-300 text-xs">{member.status}</span>
                    ) : (
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as MemberStatus)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-semibold text-amber-300"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <span className="text-amber-200/70 block text-[10px] font-semibold">Year of Study</span>
                    {!isEditing ? (
                      <span className="font-bold text-cyan-300 text-xs">Year {member.studentInfo?.yearOfStudy || yearOfStudy || 1}</span>
                    ) : (
                      <select
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-semibold text-cyan-300"
                      >
                        <option value={1}>Year 1 (Fresher)</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                        <option value={5}>Year 5</option>
                      </select>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-amber-200/70 block text-[10px] font-semibold">Hostel or Residence (Direct Entry)</span>
                    {!isEditing ? (
                      <span className="font-bold text-emerald-300 text-xs">{member.hostelOrResidence || member.residence || hostelOrResidence || 'Not specified'}</span>
                    ) : (
                      <input
                        type="text"
                        value={hostelOrResidence}
                        onChange={(e) => setHostelOrResidence(e.target.value)}
                        placeholder="Type hostel or residence..."
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white placeholder-slate-500"
                      />
                    )}
                  </div>

                  <div className="sm:col-span-2 pt-1.5 border-t border-amber-500/20 flex items-center justify-between">
                    <span className="text-amber-200/80 text-[10px] font-semibold flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-amber-400" /> Academic Portfolio (PIN Field):
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      (member.portfolio || portfolio) === 'Schools'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : (member.portfolio || portfolio) === 'Alumni'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {member.portfolio || portfolio || 'Schools'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 space-y-2.5">
                <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  Contact Information
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone Number</span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200 text-xs">{member.phone}</span>
                    ) : (
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200 text-xs">{member.email || 'N/A'}</span>
                    ) : (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Portfolio, Education & Notes */}
            <div className="space-y-4">
              
              {/* Portfolio & Academic Details */}
              <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 space-y-2.5">
                <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                    Portfolio & Affiliation
                  </span>
                  <span className="text-[10px] text-slate-400">Schools • Alumni • Community</span>
                </div>

                {isEditing && (
                  <div className="pb-2 border-b border-slate-800">
                    <span className="text-slate-400 block text-[10px] mb-1">Select Portfolio</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Schools', 'Alumni', 'Community'] as MemberPortfolio[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPortfolio(p)}
                          className={`py-1 px-2 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            portfolio === p
                              ? p === 'Schools'
                                ? 'bg-blue-600 text-white'
                                : p === 'Alumni'
                                ? 'bg-purple-600 text-white'
                                : 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2.5">
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {portfolio === 'Schools' ? 'University / School' : portfolio === 'Alumni' ? 'Alma Mater' : 'Organization / Community Role'}
                    </span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200 text-xs">{member.studentInfo?.campus || 'N/A'}</span>
                    ) : (
                      <>
                        <input
                          type="text"
                          list="uganda-universities-list"
                          value={campus}
                          onChange={(e) => setCampus(e.target.value)}
                          placeholder="Select or enter institution..."
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                        <datalist id="uganda-universities-list">
                          {UGANDA_UNIVERSITIES.map((u) => (
                            <option key={u} value={u} />
                          ))}
                        </datalist>
                      </>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {portfolio === 'Schools' ? 'Course / Program' : portfolio === 'Alumni' ? 'Degree Completed' : 'Occupation / Field'}
                    </span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200 text-xs">{member.studentInfo?.course || 'Not specified'}</span>
                    ) : (
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. Program / Degree / Profession"
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Administrative Notes */}
              <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 space-y-2">
                <span className="text-slate-400 block text-[11px] font-semibold">Administrative Notes</span>
                {!isEditing ? (
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {member.notes || 'No administrative notes recorded for this member.'}
                  </p>
                ) : (
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes..."
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Modal Footer with Delete Access */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Member Record</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Confirmation Modal for Member Deletion */}
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Member Record?</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Are you sure you want to permanently delete <strong className="text-white">{member.fullName}</strong> ({member.id})? This will remove their record from the fellowship registry across all connected parties.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteMember(member.id, 'User confirmed deletion from profile view');
                    setIsConfirmDeleteOpen(false);
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
