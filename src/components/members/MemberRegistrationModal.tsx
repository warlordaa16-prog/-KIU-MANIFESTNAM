import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Gender, MemberStatus, MemberPortfolio, UGANDA_UNIVERSITIES } from '../../types';
import {
  X,
  Sparkles,
  GraduationCap,
  CheckCircle,
  MapPin,
  Phone,
  KeyRound,
  ShieldCheck,
  Building,
  Briefcase,
  Users,
  BookOpen,
  User,
  Mail,
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

  // Core Required Registration PIN Fields
  const [lastName, setLastName] = useState(''); // Name (Surname)
  const [firstName, setFirstName] = useState(''); // First Name
  const [status, setStatus] = useState<MemberStatus>('First Timer'); // Fellowship Status in PIN fields
  const [phone, setPhone] = useState('+256 '); // Phone Contact
  const [yearOfStudy, setYearOfStudy] = useState(1); // Year of Study
  const [hostelOrResidence, setHostelOrResidence] = useState(''); // Direct Custom Hostel / Residence

  // Academic Portfolio in PIN Field (Schools, Alumni, Community)
  const [portfolio, setPortfolio] = useState<MemberPortfolio>('Schools');

  // Additional Contact & Demographics (Nickname removed)
  const [gender, setGender] = useState<Gender>('Male');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Schools (Academic) Portfolio Fields
  const [campus, setCampus] = useState<string>('Kampala International University (KIU)');
  const [customUniversity, setCustomUniversity] = useState('');
  const [course, setCourse] = useState('');

  // Alumni Portfolio Fields
  const [alumniInstitution, setAlumniInstitution] = useState<string>('Kampala International University (KIU)');
  const [alumniCourse, setAlumniCourse] = useState('');
  const [alumniGradYear, setAlumniGradYear] = useState('');

  // Community Portfolio Fields
  const [communityOccupation, setCommunityOccupation] = useState('');
  const [communityAffiliation, setCommunityAffiliation] = useState('');

  // First attendance date
  const [dateOfFirstAttendance] = useState(
    new Date().toISOString().split('T')[0]
  );

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

    const newMember = addMember({
      fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      preferredName: firstName.trim(),
      gender,
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@manifest.org`,
      dateOfBirth: dateOfBirth || undefined,
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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // Ignore if unavailable
    }

    onSuccess(newMember.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Member Registration
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  PIN System
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 hidden sm:inline-flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Academic Portfolios
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Register new fellowship members with Registration PIN credentials and Academic Portfolio affiliation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* MAIN CONTAINER: REGISTRATION PIN FIELDS & ACADEMIC PORTFOLIO */}
          <div className="rounded-2xl bg-slate-950/70 border-2 border-amber-500/40 p-4 sm:p-5 space-y-5 shadow-xl relative overflow-hidden">
            
            {/* Top Badge & Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-amber-300 tracking-wide uppercase">
                    Registration PIN Fields & Academic Portfolio
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Primary identification, fellowship status, residence, and academic credentials
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/30">
                Auto PIN Generated on Save
              </span>
            </div>

            {/* Field Section 1: Core Personal Identity */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                1. Member Identity & Status
              </div>

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
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Fellowship Status <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MemberStatus)}
                    className="w-full bg-slate-900 border-2 border-amber-500/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="First Timer">🌟 First Timer (Visiting for the first time)</option>
                    <option value="Active">Active Fellowship Member</option>
                    <option value="Returning Visitor">Returning Visitor</option>
                    <option value="Graduated">Graduated / Alumni</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-amber-400" />
                    Phone Contact <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 700 000000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Direct Custom Hostel / Residence Entry */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Hostel or Residence (Direct Entry) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hostelOrResidence}
                  onChange={(e) => setHostelOrResidence(e.target.value)}
                  placeholder="e.g. Olympia Hostel, Nana Hostel, Akamwesi, Kansanga, Kabalagala..."
                  className="w-full bg-slate-900 border-2 border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-medium transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Direct custom entry. Fellowship members in the same hostel or residence are automatically organized into fellowship family groups.
                </p>
              </div>
            </div>

            {/* Field Section 2: ACADEMIC PORTFOLIOS (INTEGRATED INTO PIN FIELD) */}
            <div className="pt-4 border-t border-amber-500/20 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  2. Academic Portfolio in PIN Field
                  <span className="text-[10px] font-normal text-slate-400 lowercase">
                    (Schools, Alumni, Community)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Select portfolio category
                </span>
              </div>

              {/* Portfolio Selection Buttons */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPortfolio('Schools')}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    portfolio === 'Schools'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Schools</span>
                  <span className="text-[9px] font-normal opacity-85">Students & Scholars</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortfolio('Alumni')}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    portfolio === 'Alumni'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Alumni</span>
                  <span className="text-[9px] font-normal opacity-85">Graduates & Elders</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortfolio('Community')}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    portfolio === 'Community'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                  <span className="text-[9px] font-normal opacity-85">Professionals & Area</span>
                </button>
              </div>

              {/* Dynamic Portfolio Academic Information */}
              {portfolio === 'Schools' && (
                <div className="space-y-3.5 p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                  <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    Schools Portfolio: Academic & University Information
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      University / Higher Institution <span className="text-rose-400">*</span>
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
                        Course / Program of Study
                      </label>
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. Bachelor of Laws / BSc Software Eng / BPharm"
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
                        <option value={1}>Year 1 (Freshman / Fresher)</option>
                        <option value={2}>Year 2 (Sophomore)</option>
                        <option value={3}>Year 3 (Penultimate / Junior)</option>
                        <option value={4}>Year 4 (Senior)</option>
                        <option value={5}>Year 5+ (Medical / Engineering / Postgrad)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {portfolio === 'Alumni' && (
                <div className="space-y-3.5 p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    Alumni Portfolio: Graduate & Career Information
                  </div>

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
                        Degree / Course Completed
                      </label>
                      <input
                        type="text"
                        value={alumniCourse}
                        onChange={(e) => setAlumniCourse(e.target.value)}
                        placeholder="e.g. Bachelor of Medicine, LLB, BBA"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Graduation Year / Cohort
                      </label>
                      <input
                        type="text"
                        value={alumniGradYear}
                        onChange={(e) => setAlumniGradYear(e.target.value)}
                        placeholder="e.g. 2024, 2025"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {portfolio === 'Community' && (
                <div className="space-y-3.5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    Community Portfolio: Neighborhood & Professional Affiliation
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Occupation / Field of Work
                      </label>
                      <input
                        type="text"
                        value={communityOccupation}
                        onChange={(e) => setCommunityOccupation(e.target.value)}
                        placeholder="e.g. Healthcare, Civil Engineer, Business Owner"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Organization / Area Role
                      </label>
                      <input
                        type="text"
                        value={communityAffiliation}
                        onChange={(e) => setCommunityAffiliation(e.target.value)}
                        placeholder="e.g. Kansanga Community Forum / Private Practice"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ADDITIONAL CONTACT & DEMOGRAPHIC DETAILS (CLEAN SUPPLEMENTARY SECTION) */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              3. Additional Contact & Demographics (Optional)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. member@gmail.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alt Phone (Optional)</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="e.g. +256 750 000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Register Member & Issue Registration PIN</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
