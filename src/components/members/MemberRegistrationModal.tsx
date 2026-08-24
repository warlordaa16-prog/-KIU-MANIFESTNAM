import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { Gender, MemberStatus } from '../../types';
import { X, Sparkles, User, GraduationCap, Heart, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const { addMember, departments } = useFellowship();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [phone, setPhone] = useState('+256 ');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Student Info
  const [isStudent, setIsStudent] = useState(true);
  const [campus, setCampus] = useState('KIU - Main Campus (Kansanga)');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [course, setCourse] = useState('');
  const [faculty, setFaculty] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [expectedGraduationYear, setExpectedGraduationYear] = useState(2028);

  // Fellowship Info
  const [status, setStatus] = useState<MemberStatus>('First Timer');
  const [dateOfFirstAttendance, setDateOfFirstAttendance] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [howFoundManifest, setHowFoundManifest] = useState('Campus Outreach');
  const [invitedBy, setInvitedBy] = useState('');
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleToggleDepartment = (deptId: string) => {
    if (selectedDepartmentIds.includes(deptId)) {
      setSelectedDepartmentIds(selectedDepartmentIds.filter((id) => id !== deptId));
    } else {
      setSelectedDepartmentIds([...selectedDepartmentIds, deptId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Please fill in Full Name and Phone Number.');
      return;
    }

    const isFirstTimer = status === 'First Timer';

    const newMember = addMember({
      fullName: fullName.trim(),
      preferredName: preferredName.trim() || undefined,
      gender,
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@manifest.org`,
      dateOfBirth: dateOfBirth || undefined,
      studentInfo: {
        isStudent,
        campus: isStudent ? campus : 'Non-Student / Working Professional',
        registrationNumber: isStudent ? registrationNumber.trim() : undefined,
        course: isStudent ? course.trim() : undefined,
        faculty: isStudent ? faculty.trim() : undefined,
        yearOfStudy: isStudent ? Number(yearOfStudy) : undefined,
        expectedGraduationYear: isStudent ? Number(expectedGraduationYear) : undefined,
      },
      status,
      isFirstTimer,
      dateOfFirstAttendance,
      howFoundManifest,
      invitedBy: invitedBy.trim() || undefined,
      departmentIds: selectedDepartmentIds,
      notes: notes.trim() || undefined,
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base tracking-tight">
                Manifest Member Fast-Track Registration
              </h2>
              <p className="text-xs text-slate-400">
                Automated unique ID assignment & first-timer follow-up workflow (&lt; 2 minutes)
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
            <span>Personal Info</span>
          </button>
          <div className="w-8 h-0.5 bg-slate-800" />
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 font-bold ${
              step === 2 ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[11px]">2</span>
            <span>Student Profile</span>
          </button>
          <div className="w-8 h-0.5 bg-slate-800" />
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center gap-1.5 font-bold ${
              step === 3 ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[11px]">3</span>
            <span>Fellowship & Home</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Step 1: Personal Identification
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mugisha Brian"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred / Nickname
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. Brian"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
                    Primary Phone (WhatsApp) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 700 000000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alternative Phone
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="+256 770 000000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="brian.mugisha@gmail.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STUDENT INFORMATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Step 2: Student & Academic Information
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
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Campus / Institution</label>
                      <select
                        value={campus}
                        onChange={(e) => setCampus(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="KIU - Main Campus (Kansanga)">KIU - Main Campus (Kansanga, Ggaba Rd)</option>
                        <option value="KIU - School of Law (Kansanga)">KIU - School of Law (Kansanga)</option>
                        <option value="KIU - School of Pharmacy (Kansanga)">KIU - School of Pharmacy & Biomedical</option>
                        <option value="KIU - School of Computing & IT">KIU - School of Computing & IT</option>
                        <option value="KIU - School of Engineering & Applied Sciences">KIU - School of Engineering & Applied Sciences</option>
                        <option value="KIU - School of Business & Management">KIU - School of Business & Management</option>
                        <option value="KIU - School of Education & Humanities">KIU - School of Education & Humanities</option>
                        <option value="KIU - Western Campus (Ishaka / Health Sciences)">KIU - Western Campus (Ishaka / Health Sciences)</option>
                        <option value="Makindye Division Resident / Other Scholar">Makindye Division Resident / Other Scholar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student Registration / ID Number
                      </label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="e.g. 2024-08-01209"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty / School</label>
                      <input
                        type="text"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        placeholder="e.g. School of Law / Computing & IT / Pharmacy / Business"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Study</label>
                      <select
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value={1}>Year 1 (Fresher)</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                        <option value={5}>Year 5 (Medicine / Architecture)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Expected Graduation Year
                      </label>
                      <input
                        type="number"
                        min="2025"
                        max="2032"
                        value={expectedGraduationYear}
                        onChange={(e) => setExpectedGraduationYear(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
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

          {/* STEP 3: FELLOWSHIP & HOME ASSIGNMENT */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Step 3: Fellowship Integration & Home Placement
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    First Attendance Date
                  </label>
                  <input
                    type="date"
                    value={dateOfFirstAttendance}
                    onChange={(e) => setDateOfFirstAttendance(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    How They Found Manifest
                  </label>
                  <select
                    value={howFoundManifest}
                    onChange={(e) => setHowFoundManifest(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Campus Outreach">Campus Outreach / Evangelism</option>
                    <option value="Friend/Member">Friend / Member Invitation</option>
                    <option value="Social Media">Social Media (Instagram/TikTok)</option>
                    <option value="Flyer/Poster">Poster / Banner on Campus</option>
                    <option value="Conference">Special Event / Conference</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Invited By (Name / Contact)
                </label>
                <input
                  type="text"
                  value={invitedBy}
                  onChange={(e) => setInvitedBy(e.target.value)}
                  placeholder="e.g. Paul Okello / Self-attended"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Department Interests */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ministry & Service Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {departments.map((dept) => {
                    const isSelected = selectedDepartmentIds.includes(dept.id);
                    return (
                      <button
                        type="button"
                        key={dept.id}
                        onClick={() => handleToggleDepartment(dept.id)}
                        className={`p-2 rounded-lg border text-left text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {dept.name?.split('&')?.[0] || dept.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  General / Follow-Up Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special interests, prayer requests, accommodation notes..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {status === 'First Timer' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">Automated Follow-Up Workflow will trigger:</span> A follow-up file will be opened automatically, coordinator assigned, and personal outreach scheduled.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as 2 | 3)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Fast Registration & Issue MAN ID</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
