import React, { useState } from 'react';
import { Member, MemberStatus, MemberPortfolio, UGANDA_UNIVERSITIES } from '../../types';
import { useFellowship } from '../../context/FellowshipContext';
import {
  X,
  User,
  GraduationCap,
  Edit2,
  Save,
  Phone,
  QrCode,
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
  const { updateMember, deleteMember } = useFellowship();

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
      const derivedLast =
        member.lastName || (member.fullName.split(' ').length > 1 ? member.fullName.split(' ')[0] : member.fullName);
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

  const cleanTelHref = `tel:${member.phone.replace(/[^\d+]/g, '')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Handle */}
        <div className="pt-2.5 pb-1 sm:hidden flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-lg font-extrabold text-orange-400">
                {member.fullName.charAt(0)}
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-white truncate">{member.fullName}</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                <span className="font-mono font-bold text-amber-400">{member.id}</span>
                <span aria-hidden="true">·</span>
                <span>{currentPortfolio}</span>
                <span aria-hidden="true">·</span>
                <span>{member.status}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onViewIdCard(member)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 transition-colors cursor-pointer"
              title="View QR Pass"
              aria-label="View QR Pass"
            >
              <QrCode className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: PIN & Contact */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="font-bold text-amber-300 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    Registration Identity
                  </span>
                  <span className="font-mono text-amber-400 text-xs font-extrabold">{member.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-amber-200/70 block text-[11px] font-semibold mb-1">Surname</span>
                    {!isEditing ? (
                      <span className="font-bold text-white text-sm">
                        {lastName || member.lastName || member.fullName.split(' ')[0]}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-amber-200/70 block text-[11px] font-semibold mb-1">First Name</span>
                    {!isEditing ? (
                      <span className="font-bold text-white text-sm">
                        {firstName || member.firstName || member.fullName.split(' ')[1] || member.fullName}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-amber-200/70 block text-[11px] font-semibold mb-1">Fellowship Status</span>
                    {!isEditing ? (
                      <span className="font-bold text-amber-300 text-sm">{member.status}</span>
                    ) : (
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as MemberStatus)}
                        className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-300 font-semibold"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <span className="text-amber-200/70 block text-[11px] font-semibold mb-1">Year of Study</span>
                    {!isEditing ? (
                      <span className="font-bold text-cyan-300 text-sm">
                        {member.studentInfo?.isStudent ? `Year ${member.studentInfo?.yearOfStudy || yearOfStudy || 1}` : 'N/A'}
                      </span>
                    ) : (
                      <select
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(Number(e.target.value))}
                        className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-semibold"
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
                    <span className="text-amber-200/70 block text-[11px] font-semibold mb-1">Hostel or Residence</span>
                    {!isEditing ? (
                      <span className="font-bold text-emerald-300 text-sm">
                        {member.hostelOrResidence || member.residence || hostelOrResidence || 'Not specified'}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={hostelOrResidence}
                        onChange={(e) => setHostelOrResidence(e.target.value)}
                        className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-2.5">
                <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-orange-400" />
                  Contact Information
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Phone Number</span>
                  {!isEditing ? (
                    <a
                      href={cleanTelHref}
                      className="inline-flex items-center gap-2 min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-orange-300 font-mono font-bold text-sm hover:border-orange-500/50"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{member.phone}</span>
                    </a>
                  ) : (
                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Portfolio & Notes */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-3">
                <div className="font-bold text-slate-200 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-orange-400" />
                    Portfolio &amp; Affiliation
                  </span>
                </div>

                {isEditing && (
                  <div className="grid grid-cols-3 gap-1.5 pb-2 border-b border-slate-800">
                    {(['Schools', 'Alumni', 'Community'] as MemberPortfolio[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPortfolio(p)}
                        className={`min-h-[44px] py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                )}

                <div className="space-y-2.5">
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">
                      {portfolio === 'Schools'
                        ? 'University / School'
                        : portfolio === 'Alumni'
                        ? 'Alma Mater'
                        : 'Organization / Community Role'}
                    </span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200 text-sm">
                        {member.studentInfo?.campus || 'N/A'}
                      </span>
                    ) : (
                      <>
                        <input
                          type="text"
                          list="uganda-universities-list"
                          value={campus}
                          onChange={(e) => setCampus(e.target.value)}
                          className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
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
                    <span className="text-slate-400 block text-[11px] mb-1">
                      {portfolio === 'Schools'
                        ? 'Course / Program'
                        : portfolio === 'Alumni'
                        ? 'Degree Completed'
                        : 'Occupation / Field'}
                    </span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200 text-sm">
                        {member.studentInfo?.course || 'Not specified'}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Administrative Notes */}
              <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-2">
                <span className="text-slate-400 block text-xs font-semibold">Notes</span>
                {!isEditing ? (
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {member.notes || 'No notes recorded for this member.'}
                  </p>
                ) : (
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Action Footer */}
        <div className="px-4 py-3.5 pb-safe bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Confirmation Modal for Member Deletion */}
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border-t sm:border border-rose-500/40 rounded-t-3xl sm:rounded-2xl p-5 pb-safe max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Member Record?</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Are you sure you want to permanently delete <strong className="text-white">{member.fullName}</strong> ({member.id})?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
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
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
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
