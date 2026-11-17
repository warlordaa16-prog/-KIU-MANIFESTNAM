import React, { useState } from 'react';
import { FellowshipProvider, useFellowship } from './context/FellowshipContext';
import { Header } from './components/common/Header';
import { BottomTaskbar } from './components/common/BottomTaskbar';
import { WatermarkBackground } from './components/common/WatermarkBackground';
import { ToastContainer } from './components/common/ToastContainer';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { MemberDirectory } from './components/members/MemberDirectory';
import { MemberRegistrationModal } from './components/members/MemberRegistrationModal';
import { MemberProfileModal } from './components/members/MemberProfileModal';
import { MemberIdCardModal } from './components/members/MemberIdCardModal';
import { FellowshipGroupsManager } from './components/groups/FellowshipGroupsManager';
import { AdminPortal } from './components/admin/AdminPortal';
import { THEME_PRESETS } from './themeConstants';
import { Member } from './types';
import { Plus } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    members,
    currentTheme,
    watermarkOpacity,
    isWatermarkGlow,
  } = useFellowship();

  const themeConfig = THEME_PRESETS[currentTheme] || THEME_PRESETS['obsidian-kiu'];

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [profileMember, setProfileMember] = useState<Member | null>(null);
  const [idCardMember, setIdCardMember] = useState<Member | null>(null);

  const handleOpenProfile = (member: Member) => {
    setProfileMember(member);
  };

  const handleOpenIdCard = (member: Member) => {
    setIdCardMember(member);
  };

  const handleRegistrationSuccess = (newMemberId: string) => {
    setIsRegisterOpen(false);
    const newM = members.find((m) => m.id === newMemberId);
    if (newM) {
      setIdCardMember(newM);
    }
  };

  const showMobileFab = activeTab === 'dashboard' || activeTab === 'members' || activeTab === 'students';

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} flex flex-col font-sans transition-colors duration-500 relative selection:bg-orange-500 selection:text-white`}>
      {/* Subtle Watermark Background */}
      <WatermarkBackground
        opacity={watermarkOpacity}
        theme={currentTheme}
        glow={isWatermarkGlow}
      />

      {/* Mobile-First Sticky Top App Bar */}
      <Header onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Connectivity Indicator when Offline */}
      <OfflineIndicator />

      {/* Main Dynamic View with Safe Bottom Clearance for Fixed Tab Bar */}
      <main className="flex-1 overflow-y-auto px-3.5 py-4 sm:p-6 lg:p-8 pb-28 sm:pb-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onOpenRegister={() => setIsRegisterOpen(true)}
              onSelectMember={handleOpenProfile}
              onViewAllMembers={() => setActiveTab('members')}
            />
          )}

          {(activeTab === 'members' || activeTab === 'students') && (
            <MemberDirectory
              onOpenRegister={() => setIsRegisterOpen(true)}
              onSelectMember={handleOpenProfile}
              onViewIdCard={handleOpenIdCard}
            />
          )}

          {activeTab === 'groups' && <FellowshipGroupsManager />}

          {(activeTab === 'reports' || activeTab === 'admin') && <AdminPortal />}
        </div>
      </main>

      {/* Thumb-Zone Floating Action Button (Mobile) */}
      {showMobileFab && (
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="sm:hidden fixed bottom-[76px] right-4 z-30 h-12 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-orange-500/30 flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
          aria-label="Register Member"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Register</span>
        </button>
      )}

      {/* Fixed Native Bottom Tab Bar */}
      <BottomTaskbar />

      {/* Modals & Bottom Sheets */}
      <MemberRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />

      <MemberProfileModal
        member={profileMember}
        isOpen={!!profileMember}
        onClose={() => setProfileMember(null)}
        onViewIdCard={handleOpenIdCard}
      />

      <MemberIdCardModal
        member={idCardMember}
        isOpen={!!idCardMember}
        onClose={() => setIdCardMember(null)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <FellowshipProvider>
      <MainAppContent />
    </FellowshipProvider>
  );
}
