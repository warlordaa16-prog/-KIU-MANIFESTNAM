import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Gender, MemberStatus, MemberPortfolio, UGANDA_UNIVERSITIES } from '../../types';
import {
  X,
  Sparkles,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Phone,
  KeyRound,
  ShieldCheck,
  Building,
  Briefcase,
  Users,
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

  const [step, setStep] = useState<1 | 2>(1);

  // Core Required Registration PIN Fields
  const [lastName, setLastName] = useState(''); // Name (Surname)
  const [firstName, setFirstName] = useState(''); // First Name
  const [status, setStatus] = useState<MemberStatus>('First Timer'); // Fellowship Status in PIN fields
  const [phone, setPhone] = useState('+256 '); // Phone Contact
  const [yearOfStudy, setYearOfStudy] = useState(1); // Year of Study
  const [hostelOrResidence, setHostelOrResidence] = useState(''); // Direct Custom Hostel / Residence

  // Portfolio Selection: Schools, Alumni, Community
  const [portfolio, setPortfolio] = useState<MemberPortfolio>('Schools');

  // Additional Details (Nickname removed)
  const [gender, setGender] = useState<Gender>('Male');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Schools Portfolio: Ugandan Universities
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Member Registration
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  PIN System
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Register new members across Schools, Alumni, and Community portfolios
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress indicator */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 font-bold ${
              step === 1 ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[11px]">1</span>
            <span>Registration PIN Fields & Status</span>
          </button>
          <div className="w-12 h-0.5 bg-slate-800" />
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 font-bold ${
              step === 2 ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[11px]">2</span>
            <span>Portfolios (Schools, Alumni, Community)</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: REGISTRATION PIN CORE FIELDS & FELLOWSHIP STATUS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    Registration PIN Information & Fellowship Status
                  </span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  Primary Access Key
                </span>
              </div>

              {/* Fellowship Status in PIN Fields */}
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Fellowship Status <span className="text-rose-400">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MemberStatus)}
                  className="w-full bg-slate-800 border-2 border-amber-500/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  <option value="First Timer">🌟 First Timer (Visiting for the first time)</option>
                  <option value="Active">Active Fellowship Member</option>
                  <option value="Returning Visitor">Returning Visitor</option>
                  <option value="Graduated">Graduated / Alumni</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Fellowship status is embedded directly in this registration record.
                </p>
              </div>

              {/* Names: Surname + First Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone Contact & Year of Study */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>Year 1 (Freshman)</option>
                    <option value={2}>Year 2 (Sophomore)</option>
                    <option value={3}>Year 3 (Penultimate / Junior)</option>
                    <option value={4}>Year 4 (Senior)</option>
                    <option value={5}>Year 5+ (Medical / Engineering / Postgrad)</option>
                  </select>
                </div>
              </div>

              {/* Direct Custom Hostel / Residence */}
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
                  placeholder="e.g. Olympia Hostel, Nana Hostel, Kansanga, Kabalagala..."
                  className="w-full bg-slate-800 border-2 border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none font-medium transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Direct custom input. People in the same hostel/residence are automatically organized into fellowship groups.
                </p>
              </div>

              {/* Additional Contact Info */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PORTFOLIOS (SCHOOLS, ALUMNI, COMMUNITY) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Step 2: Member Portfolio Assignment
                </span>
                <span className="text-[10px] text-slate-400">Choose fellowship portfolio</span>
              </div>

              {/* Portfolio Selection Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPortfolio('Schools')}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    portfolio === 'Schools'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Schools</span>
                  <span className="text-[9px] font-normal opacity-80">Students & Scholars</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortfolio('Alumni')}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    portfolio === 'Alumni'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Alumni</span>
                  <span className="text-[9px] font-normal opacity-80">Graduates & Elders</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortfolio('Community')}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    portfolio === 'Community'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                  <span className="text-[9px] font-normal opacity-80">Professionals & Area</span>
                </button>
              </div>

              {/* Details based on Portfolio */}
              {portfolio === 'Schools' && (
                <div className="space-y-3.5 p-4 rounded-xl bg-slate-850/60 border border-blue-500/20">
                  <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    Schools Portfolio: University & Campus Information
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      University / Higher Institution <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium text-blue-300"
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
                        className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Course / Program</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. Bachelor of Laws / BSc Software Engineering / BPharm"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {portfolio === 'Alumni' && (
                <div className="space-y-3.5 p-4 rounded-xl bg-slate-850/60 border border-purple-500/20">
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-purple-400" />
                    Alumni Portfolio: Graduate & Career Information
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Graduated University / Alma Mater
                    </label>
                    <select
                      value={alumniInstitution}
                      onChange={(e) => setAlumniInstitution(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium text-purple-300"
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
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Degree / Course Completed</label>
                      <input
                        type="text"
                        value={alumniCourse}
                        onChange={(e) => setAlumniCourse(e.target.value)}
                        placeholder="e.g. Bachelor of Medicine, BBA, LLB"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year / Cohort</label>
                      <input
                        type="text"
                        value={alumniGradYear}
                        onChange={(e) => setAlumniGradYear(e.target.value)}
                        placeholder="e.g. 2024, 2025"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {portfolio === 'Community' && (
                <div className="space-y-3.5 p-4 rounded-xl bg-slate-850/60 border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    Community Portfolio: Neighborhood & Professional Affiliation
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Occupation / Field of Work
                    </label>
                    <input
                      type="text"
                      value={communityOccupation}
                      onChange={(e) => setCommunityOccupation(e.target.value)}
                      placeholder="e.g. Healthcare Professional, Civil Engineer, Business Owner, Educator"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Organization / Business / Area Role
                    </label>
                    <input
                      type="text"
                      value={communityAffiliation}
                      onChange={(e) => setCommunityAffiliation(e.target.value)}
                      placeholder="e.g. Makindye Community Leader / Kansanga Business Forum / Private Practice"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to PIN Fields
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Fast Register
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Portfolio Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Register Member & Issue Registration PIN</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
