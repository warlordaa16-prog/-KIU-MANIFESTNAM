import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Gender, MemberStatus, UGANDA_UNIVERSITIES } from '../../types';
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

  // Additional Details (Nickname removed)
  const [gender, setGender] = useState<Gender>('Male');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Academic Profile: Ugandan Universities (KIU, MAK, KYU, UCU, etc.)
  const [isStudent, setIsStudent] = useState(true);
  const [campus, setCampus] = useState<string>('Kampala International University (KIU)');
  const [customUniversity, setCustomUniversity] = useState('');
  const [course, setCourse] = useState('');

  // First attendance date
  const [dateOfFirstAttendance] = useState(
    new Date().toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const effectiveHostel = hostelOrResidence.trim();
  const effectiveCampus = isStudent
    ? (campus === 'Other University / Higher Institution'
        ? customUniversity.trim() || 'Other Higher Institution'
        : campus)
    : 'Non-Student / Working Professional';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !effectiveHostel) {
      alert('Please fill in Name (Surname), First Name, Phone Contact, and Hostel / Residence.');
      return;
    }

    const fullName = `${lastName.trim()} ${firstName.trim()}`;
    const isFirstTimer = status === 'First Timer';

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
      studentInfo: {
        isStudent,
        campus: effectiveCampus,
        course: isStudent ? course.trim() : undefined,
        yearOfStudy: isStudent ? Number(yearOfStudy) : undefined,
      },
      status,
      isFirstTimer,
      dateOfFirstAttendance,
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
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base tracking-tight">
                Manifest Member Fast Registration & PIN Issuer
              </h2>
              <p className="text-xs text-slate-400">
                Issues unique Registration PIN with Name, First Name, Fellowship Status, Year of Study, Hostel & Phone
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

        {/* Multi-step progress indicator (Step 1: PIN Fields, Step 2: Academic Profile) */}
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
            <span>Academic Profile</span>
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
                  Core PIN Credentials
                </span>
              </div>

              {/* Name (Surname) and First Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Name (Surname / Last Name) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Mugisha"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Brian"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Fellowship Status & Phone Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    Fellowship Status <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MemberStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-semibold text-amber-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="First Timer">🌟 First Timer</option>
                    <option value="Returning Visitor">Returning Visitor</option>
                    <option value="Active">Active Regular Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-yellow-400" />
                    Phone Contact (WhatsApp/Call) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 701 892341"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Year of Study & Hostel / Residence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-cyan-400" />
                    Year of Study <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold text-cyan-300"
                  >
                    <option value={1}>Year 1 (Fresher)</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                    <option value={5}>Year 5 (Medicine / Engineering)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    Hostel or Residence <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hostelOrResidence}
                    onChange={(e) => setHostelOrResidence(e.target.value)}
                    placeholder="Enter hostel, hall, or residence area..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium text-emerald-300"
                  />
                </div>
              </div>

              {/* Additional Personal Details (Nickname removed) */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="brian.mugi@gmail.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {status === 'First Timer' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">First-Timer Welcome Protocol:</span> A digital Registration PIN pass and membership profile will be generated instantly for immediate scanning and verification.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: STUDENT & ACADEMIC INFORMATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Step 2: Academic Profile
                </span>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                  />
                  <span>Is Currently a Student</span>
                </label>
              </div>

              {isStudent ? (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      University / Higher Institution <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium text-amber-300"
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
                        className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
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
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300">
                  <p className="font-semibold text-white">Non-Student Member / Working Professional</p>
                  <p className="mt-1 text-slate-400">
                    This profile will be categorized under Alumni & Associates Fellowship network.
                  </p>
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
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to PIN Fields
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Fast Register
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                Academic Profile <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
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

