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
  Briefcase,
  Users,
  BookOpen,
  User,
  ShieldCheck,
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
      alert('Please fill in Name (Surname), First Name, Phone Contact, and Hostel / Residence.');
      return;
    }

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

    // Email and alt phone removed from user entry to decongest registration
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

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // Ignore
    }

    onSuccess(newMember.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header - Clean & Decongested */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Member Registration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quick registration intake desk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Member Identity & Personal Information */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Name (Surname) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Mugisha, Kigozi, Namubiru"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  First Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Samuel, Esther, David"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  Fellowship Status <span className="text-rose-400">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MemberStatus)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                >
                  <option value="First Timer">🌟 First Timer</option>
                  <option value="Active">Active Fellowship Member</option>
                  <option value="Returning Visitor">Returning Visitor</option>
                  <option value="Graduated">Graduated / Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Gender <span className="text-rose-400">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-orange-400" />
                  Phone Contact <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+256 700 000000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-400" />
                  Hostel or Residence <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hostelOrResidence}
                  onChange={(e) => setHostelOrResidence(e.target.value)}
                  placeholder="e.g. Olympia, Nana, Akamwesi, Kansanga..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Academic Portfolio Selection */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-400" />
                Portfolio Category
              </span>
              <span className="text-[11px] text-slate-400">Select category</span>
            </div>

            {/* 3 Portfolio Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPortfolio('Schools')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portfolio === 'Schools'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Schools</span>
              </button>

              <button
                type="button"
                onClick={() => setPortfolio('Alumni')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portfolio === 'Alumni'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Alumni</span>
              </button>

              <button
                type="button"
                onClick={() => setPortfolio('Community')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portfolio === 'Community'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Community</span>
              </button>
            </div>

            {/* Dynamic Portfolio Fields */}
            {portfolio === 'Schools' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    University / Higher Institution
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium text-blue-300"
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
                      className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Course of Study
                    </label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. LLB, Computer Science, BBA"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Year of Study
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium text-cyan-300"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Graduated University / Alma Mater
                  </label>
                  <select
                    value={alumniInstitution}
                    onChange={(e) => setAlumniInstitution(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium text-purple-300"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Degree / Course
                    </label>
                    <input
                      type="text"
                      value={alumniCourse}
                      onChange={(e) => setAlumniCourse(e.target.value)}
                      placeholder="e.g. Medicine, LLB, BBA"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      value={alumniGradYear}
                      onChange={(e) => setAlumniGradYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {portfolio === 'Community' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={communityOccupation}
                    onChange={(e) => setCommunityOccupation(e.target.value)}
                    placeholder="e.g. Healthcare, Business, Engineer"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Organization / Area
                  </label>
                  <input
                    type="text"
                    value={communityAffiliation}
                    onChange={(e) => setCommunityAffiliation(e.target.value)}
                    placeholder="e.g. Kansanga Community / Private Firm"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Register Member</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
