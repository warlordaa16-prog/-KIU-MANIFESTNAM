import React, { useState } from 'react';
import { Member, MemberStatus } from '../../types';
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
    followUps = [],
  } = useFellowship();

  const [activeTab, setActiveTab] = useState<'profile' | 'followup'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<MemberStatus>('Active');
  const [course, setCourse] = useState('');
  const [campus, setCampus] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (member) {
      setFullName(member.fullName);
      setPreferredName(member.preferredName || '');
      setPhone(member.phone);
      setEmail(member.email);
      setStatus(member.status);
      setCourse(member.studentInfo?.course || '');
      setCampus(member.studentInfo?.campus || '');
      setYearOfStudy(member.studentInfo?.yearOfStudy || 1);
      setNotes(member.notes || '');
      setIsEditing(false);
      setActiveTab('profile');
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const memberFollowUp = (followUps || []).find((f) => f.memberId === member.id);

  const handleSave = () => {
    updateMember(member.id, {
      fullName,
      preferredName: preferredName || undefined,
      phone,
      email,
      status,
      notes: notes || undefined,
      studentInfo: {
        ...member.studentInfo,
        course,
        campus,
        yearOfStudy: Number(yearOfStudy),
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
                <h3 className="text-lg font-bold text-white leading-tight">{member.fullName}</h3>
                <span className="font-mono text-[11px] font-bold text-orange-400 bg-orange-950/80 border border-orange-800/80 px-2 py-0.5 rounded">
                  {member.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  {member.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  {member.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewIdCard(member)}
              className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="View Digital Pass & QR"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Pass & QR</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-slate-800 text-orange-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Member Profile
            </button>

            {memberFollowUp && (
              <button
                onClick={() => setActiveTab('followup')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'followup'
                    ? 'bg-slate-800 text-orange-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Follow-Up Care</span>
                <span className="px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 text-[10px]">
                  {memberFollowUp.status}
                </span>
              </button>
            )}
          </div>

          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-3 py-1 rounded bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Save className="w-3 h-3" /> Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              
              {/* Status Banner */}
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Lifecycle Status</div>
                  {!isEditing ? (
                    <div className="text-sm font-extrabold text-orange-400 mt-0.5">{member.status}</div>
                  ) : (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MemberStatus)}
                      className="mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">First Attended</div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {member.dateOfFirstAttendance || '2026-08-20'}
                  </div>
                </div>
              </div>

              {/* Student & Academic Info */}
              <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 space-y-2.5">
                <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                  Academic Profile
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Campus</span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200">{member.studentInfo?.campus || 'N/A'}</span>
                    ) : (
                      <input
                        type="text"
                        value={campus}
                        onChange={(e) => setCampus(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Course / Program</span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200">{member.studentInfo?.course || 'Non-Student'}</span>
                    ) : (
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Year of Study</span>
                    {!isEditing ? (
                      <span className="font-semibold text-slate-200">Year {member.studentInfo?.yearOfStudy || 'N/A'}</span>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Registration Number</span>
                    <span className="font-semibold text-slate-200">{member.studentInfo?.registrationNumber || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold mb-1">Administrative Notes</span>
                {!isEditing ? (
                  <p className="p-3 rounded-lg bg-slate-850 border border-slate-800 text-slate-300">
                    {member.notes || 'No administrative notes recorded.'}
                  </p>
                ) : (
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                )}
              </div>

            </div>
          )}

          {/* TAB 2: FOLLOW-UP TIMELINE */}
          {activeTab === 'followup' && memberFollowUp && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-orange-300 font-semibold uppercase">Follow-Up Officer</div>
                  <div className="text-xs font-bold text-white">{memberFollowUp.coordinatorName || 'Coordination Team'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-orange-300 font-semibold uppercase">Status</div>
                  <div className="text-xs font-bold text-orange-300">{memberFollowUp.status}</div>
                </div>
              </div>

              <div className="font-bold text-slate-300 mt-2">Interaction Timeline</div>
              
              <div className="space-y-2">
                {memberFollowUp.interactions.map((int) => (
                  <div key={int.id} className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-orange-400">{int.action}</span>
                      <span className="text-slate-400">{int.date}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{int.result}</p>
                    <div className="text-[10px] text-slate-500">Coordinator: {int.coordinatorName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Registered on {member.registrationDate}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
