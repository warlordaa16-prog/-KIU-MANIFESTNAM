import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Gender, MemberStatus, MemberPortfolio, UGANDA_UNIVERSITIES } from '../../types';
import {
  X,
  GraduationCap,
  CheckCircle,
  MapPin,
  Phone,
  Building,
  Users,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemberRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMemberId: string) => void;
}

export const MemberRegistrationModal: React.FC<MemberRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addMember } = useFellowship();

  // Core essential registration fields - decongested for fast intake
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<MemberStatus>('First Timer');
  const [gender, setGender] = useState<Gender>('Male');
  const [phone, setPhone] = useState('+256 ');
  const [hostelOrResidence, setHostelOrResidence] = useState('');
  const [formError, setFormError] = useState('');

  // Academic Portfolio selection (Schools, Alumni, Community)
  const [portfolio, setPortfolio] = useState<MemberPortfolio>('Schools');

  // Schools Portfolio
  const [campus, setCampus] = useState<string>('Kampala International University (KIU)');
  const [customUniversity, setCustomUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(1);

  // Alumni Portfolio
  const [alumniInstitution, setAlumniInstitution] = useState<string>('Kampala International University (KIU)');
  const [alumniCourse, setAlumniCourse] = useState('');
  const [alumniGradYear, setAlumniGradYear] = useState('');

  // Community Portfolio
  const [communityOccupation, setCommunityOccupation] = useState('');
  const [communityAffiliation, setCommunityAffiliation] = useState('');

  // Attendance date
  const [dateOfFirstAttendance] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const effectiveHostel = hostelOrResidence.trim();
  const effectiveCampus =
    campus === 'Other University / Higher Institution'
      ? customUniversity.trim() || 'Other Higher Institution'
      : campus;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !effectiveHostel) {
      setFormError('Please fill in Surname, First Name, Phone Contact, and Hostel / Residence.');
      return;
    }
    setFormError('');

    const fullName = `${lastName.trim()} ${firstName.trim()}`;
    const isFirstTimer = status === 'First Timer';

    let resolvedCampus = effectiveCampus;
    let resolvedCourse = course.trim();

    if (portfolio === 'Alumni') {
      resolvedCampus = alumniInstitution.trim() || 'Ugandan University Graduate';
      resolvedCourse = alumniCourse.trim() || 'Fellowship Alumni';
    } else if (portfolio === 'Community') {
      resolvedCampus = communityAffiliation.trim() || 'Community & Professional Network';
      resolvedCourse = communityOccupation.trim() || 'Community Partner';
    }

    const fallbackEmail = `${firstName.toLowerCase().trim()}.${lastName.toLowerCase().trim()}@manifest.org`;

    const newMember = addMember({
      fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      preferredName: firstName.trim(),
      gender,
      phone: phone.trim(),
      email: fallbackEmail,
      hostelOrResidence: effectiveHostel,
      residence: effectiveHostel.split(',')[0],
      portfolio,
      studentInfo: {
        isStudent: portfolio === 'Schools',
        campus: resolvedCampus,
        course: resolvedCourse || undefined,
        yearOfStudy: portfolio === 'Schools' ? Number(yearOfStudy) : undefined,
      },
      status,
      isFirstTimer,
      dateOfFirstAttendance,
      notes:
        portfolio === 'Alumni' && alumniGradYear
          ? `Alumni Class of ${alumniGradYear}`
          : portfolio === 'Community' && communityOccupation
          ? `Occupation: ${communityOccupation}`
          : undefined,
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    // Reset core fields for fast consecutive mobile entry
    setLastName('');
    setFirstName('');
    setPhone('+256 ');
    setHostelOrResidence('');
    setCourse('');
    setAlumniCourse('');
    setAlumniGradYear('');
    setCommunityOccupation('');
    setCommunityAffiliation('');

    onSuccess(newMember.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Handle */}
        <div className="pt-2.5 pb-1 sm:hidden flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Member Registration</h2>
              <p className="text-xs text-slate-400 mt-0.5">Quick mobile intake</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close registration sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="member-registration-form" onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Member Identity & Personal Information */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Name (Surname) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Mugisha, Kigozi"
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  First Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Samuel, Esther"
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  Fellowship Status <span className="text-rose-400">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MemberStatus)}
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-semibold"
                >
                  <option value="First Timer">First Timer</option>
                  <option value="Active">Active Fellowship Member</option>
                  <option value="Returning Visitor">Returning Visitor</option>
                  <option value="Graduated">Graduated / Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Gender <span className="text-rose-400">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  Phone Contact <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+256 700 000000"
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  Hostel or Residence <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hostelOrResidence}
                  onChange={(e) => setHostelOrResidence(e.target.value)}
                  placeholder="e.g. Olympia, Nana, Kansanga..."
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Academic Portfolio Selection */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-400" />
                Portfolio Category
              </span>
            </div>

            {/* 3 Portfolio Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPortfolio('Schools')}
                className={`min-h-[44px] py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portfolio === 'Schools'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Schools</span>
              </button>

              <button
                type="button"
                onClick={() => setPortfolio('Alumni')}
                className={`min-h-[44px] py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portfolio === 'Alumni'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Alumni</span>
              </button>

              <button
                type="button"
                onClick={() => setPortfolio('Community')}
                className={`min-h-[44px] py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portfolio === 'Community'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Community</span>
              </button>
            </div>

            {/* Dynamic Portfolio Fields */}
            {portfolio === 'Schools' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    University / Higher Institution
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-blue-300 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {UGANDA_UNIVERSITIES.map((univ) => (
                      <option key={univ} value={univ}>
                        {univ}
                      </option>
                    ))}
                  </select>

                  {campus === 'Other University / Higher Institution' && (
                    <input
                      type="text"
                      required
                      value={customUniversity}
                      onChange={(e) => setCustomUniversity(e.target.value)}
                      placeholder="Type specific university or college name..."
                      className="mt-2 w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Course of Study
                    </label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. LLB, Computer Science"
                      className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Year of Study
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(Number(e.target.value))}
                      className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-cyan-300 focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value={1}>Year 1</option>
                      <option value={2}>Year 2</option>
                      <option value={3}>Year 3</option>
                      <option value={4}>Year 4</option>
                      <option value={5}>Year 5+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {portfolio === 'Alumni' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Graduated University / Alma Mater
                  </label>
                  <select
                    value={alumniInstitution}
                    onChange={(e) => setAlumniInstitution(e.target.value)}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-purple-300 focus:outline-none focus:border-purple-500 font-medium"
                  >
                    {UGANDA_UNIVERSITIES.map((univ) => (
                      <option key={univ} value={univ}>
                        {univ}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Degree / Course
                    </label>
                    <input
                      type="text"
                      value={alumniCourse}
                      onChange={(e) => setAlumniCourse(e.target.value)}
                      placeholder="e.g. Medicine, LLB, BBA"
                      className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={alumniGradYear}
                      onChange={(e) => setAlumniGradYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {portfolio === 'Community' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={communityOccupation}
                    onChange={(e) => setCommunityOccupation(e.target.value)}
                    placeholder="e.g. Healthcare, Business"
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Organization / Area
                  </label>
                  <input
                    type="text"
                    value={communityAffiliation}
                    onChange={(e) => setCommunityAffiliation(e.target.value)}
                    placeholder="e.g. Kansanga Community"
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Sticky Thumb-Zone Footer */}
        <div className="px-4 py-3.5 sm:px-6 pb-safe bg-slate-900 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="member-registration-form"
            className="flex-1 min-h-[48px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Register Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};
