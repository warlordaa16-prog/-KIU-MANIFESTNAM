import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { ManifestLogo } from '../common/ManifestLogo';
import { MemberRegistrationModal } from '../members/MemberRegistrationModal';
import { MemberIdCardModal } from '../members/MemberIdCardModal';
import { Member } from '../../types';
import {
  UserPlus,
  Shield,
  QrCode,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Search,
  Users,
} from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  const { setActiveTab, members, setCurrentUserRole } = useFellowship();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [idLookupQuery, setIdLookupQuery] = useState('');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [idCardMember, setIdCardMember] = useState<Member | null>(null);

  // Admin login quick toggle
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLookupMember = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setFoundMember(null);

    const query = idLookupQuery.trim().toLowerCase();
    if (!query) return;

    const member = members.find(
      (m) =>
        m.id.toLowerCase() === query ||
        m.phone.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
        m.fullName.toLowerCase() === query
    );

    if (member) {
      setFoundMember(member);
    } else {
      setLookupError('No registered member record found with that ID, Name, or Phone.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default coordinator access
    if (loginPassword === 'manifest2026' || loginPassword === 'admin' || loginPassword.length >= 4) {
      setCurrentUserRole('Super Admin');
      setActiveTab('dashboard');
    } else {
      setLoginError('Invalid access code. Use "manifest2026" or your coordinator PIN.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white" id="public-landing-page">
      {/* Top Public Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ManifestLogo size={36} />
            <div>
              <span className="text-white font-black tracking-tight text-base sm:text-lg">MANIFEST</span>
              <span className="ml-1 text-xs font-semibold text-orange-400 uppercase tracking-widest hidden sm:inline">Fellowship</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Now</span>
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Coordinator Login</span>
              <span className="sm:hidden">Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Public Portal Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Official Membership & Community Portal
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">Manifest Fellowship</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Join a vibrant student community at Kampala International University (KIU) and Kansanga. Register today to receive your digital membership pass and get connected with fellowship cells.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Register as New Member
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('digital-pass-lookup');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-orange-400" />
              Verify Digital Pass
            </button>
          </div>
        </div>

        {/* Weekly Fellowship Schedule Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Weekly Fellowship</h3>
            <p className="text-xs text-slate-400">
              Every Thursday at 5:00 PM - 8:00 PM. High-energy praise, word, and student mentorship.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Campus Location</h3>
            <p className="text-xs text-slate-400">
              Kampala International University (KIU) Main Campus, Kansanga - Makindye Division.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Home Cell Meetings</h3>
            <p className="text-xs text-slate-400">
              Mid-week cell groups across Kansanga, Kabalagala, Nsambya, and Ggaba residences.
            </p>
          </div>
        </div>

        {/* Digital Membership Pass Lookup Card */}
        <div id="digital-pass-lookup" className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Find Your Digital Membership Pass</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Already registered? Enter your Member ID (e.g. MAN-2026-000001), phone number, or full name.
            </p>
          </div>

          <form onSubmit={handleLookupMember} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={idLookupQuery}
                onChange={(e) => setIdLookupQuery(e.target.value)}
                placeholder="Member ID, Phone, or Name"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm cursor-pointer shadow-md shadow-orange-500/20"
            >
              Verify
            </button>
          </form>

          {lookupError && (
            <p className="text-xs text-rose-400 text-center font-medium max-w-md mx-auto">
              {lookupError}
            </p>
          )}

          {foundMember && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Verified Active Member
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-base">{foundMember.fullName}</h4>
                  <div className="font-mono text-xs text-orange-400 font-semibold">{foundMember.id}</div>
                  <div className="text-xs text-slate-400 mt-1">{foundMember.academicYear || 'Student'} • {foundMember.faculty || 'KIU Campus'}</div>
                </div>
                <button
                  onClick={() => setIdCardMember(foundMember)}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  View ID Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 Manifest Fellowship. Kansanga, Kampala - Uganda.</p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="text-orange-400 hover:underline cursor-pointer font-medium"
        >
          Coordinator & Admin Sign In
        </button>
      </footer>

      {/* Coordinator Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                Coordinator / Admin Access
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <p className="text-xs text-slate-400">
                Enter your administrative PIN or password to access the full Manifest Fellowship management dashboard.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Access PIN / Passcode</label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter passcode (e.g. manifest2026)"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-400 font-medium">{loginError}</p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Enter Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      <MemberRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(id) => {
          setIsRegisterOpen(false);
          const m = members.find((x) => x.id === id);
          if (m) setIdCardMember(m);
        }}
      />

      {/* Member ID Card Modal */}
      <MemberIdCardModal
        member={idCardMember}
        isOpen={!!idCardMember}
        onClose={() => setIdCardMember(null)}
      />
    </div>
  );
};
