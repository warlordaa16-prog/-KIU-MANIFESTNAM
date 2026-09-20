import React, { useState } from 'react';
import { FellowshipProvider, useFellowship } from './context/FellowshipContext';
import { Header } from './components/common/Header';
import { BottomTaskbar } from './components/common/BottomTaskbar';
import { WatermarkBackground } from './components/common/WatermarkBackground';
import { ThemeWatermarkDrawer } from './components/common/ThemeWatermarkDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { MemberDirectory } from './components/members/MemberDirectory';
import { MemberRegistrationModal } from './components/members/MemberRegistrationModal';
import { MemberProfileModal } from './components/members/MemberProfileModal';
import { MemberIdCardModal } from './components/members/MemberIdCardModal';
import { FellowshipGroupsManager } from './components/groups/FellowshipGroupsManager';
import { ReportsManager } from './components/reports/ReportsManager';
import { THEME_PRESETS } from './themeConstants';
import { Member } from './types';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    members,
    currentUserName,
    currentTheme,
    watermarkOpacity,
    isWatermarkGlow,
  } = useFellowship();

  const themeConfig = THEME_PRESETS[currentTheme] || THEME_PRESETS['obsidian-kiu'];

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
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

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} flex flex-col font-sans transition-colors duration-500 relative selection:bg-orange-500 selection:text-white`}>
      
      {/* High-Impact Watermark Layer with Strong Fill & Theme Aura */}
      <WatermarkBackground
        opacity={watermarkOpacity}
        theme={currentTheme}
        glow={isWatermarkGlow}
      />

      {/* Top Header */}
      <Header
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
      />

      {/* Main Dynamic View (Full width without side bar) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto pb-4">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onOpenRegister={() => setIsRegisterOpen(true)}
              onSelectMember={handleOpenProfile}
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

          {(activeTab === 'reports' || activeTab === 'admin') && <ReportsManager />}
        </div>
      </main>

      {/* Bottom Taskbar Navigation */}
      <BottomTaskbar onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)} />

      {/* Theme & Watermark Customization Drawer */}
      <ThemeWatermarkDrawer
        isOpen={isThemeDrawerOpen}
        onClose={() => setIsThemeDrawerOpen(false)}
      />

      {/* Modals & Dialogs */}
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
