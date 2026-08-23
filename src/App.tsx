import React, { useState } from 'react';
import { FellowshipProvider, useFellowship } from './context/FellowshipContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { WatermarkBackground } from './components/common/WatermarkBackground';
import { ThemeWatermarkDrawer } from './components/common/ThemeWatermarkDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { MemberDirectory } from './components/members/MemberDirectory';
import { MemberRegistrationModal } from './components/members/MemberRegistrationModal';
import { MemberProfileModal } from './components/members/MemberProfileModal';
import { MemberIdCardModal } from './components/members/MemberIdCardModal';
import { AttendanceManager } from './components/attendance/AttendanceManager';
import { FirstTimerFollowUpManager } from './components/followup/FirstTimerFollowUpManager';
import { HomesManager } from './components/homes/HomesManager';
import { DepartmentsManager } from './components/departments/DepartmentsManager';
import { FinanceManager } from './components/finance/FinanceManager';
import { EventsManager } from './components/events/EventsManager';
import { CommunicationManager } from './components/communication/CommunicationManager';
import { ReportsManager } from './components/reports/ReportsManager';
import { THEME_PRESETS } from './themeConstants';
import { Member } from './types';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    members,
    recordAttendance,
    activeEventId,
    events,
    currentUserName,
    currentTheme,
    watermarkOpacity,
    isWatermarkGlow,
    showToast,
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

  const handleOpenProfileById = (memberId: string) => {
    const found = members.find((m) => m.id === memberId);
    if (found) {
      setProfileMember(found);
    }
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

  const handleQuickCheckIn = (member: Member) => {
    const activeEvent = events.find((e) => e.id === activeEventId) || events[0];
    if (activeEvent) {
      recordAttendance({
        memberId: member.id,
        memberName: member.fullName,
        memberPhone: member.phone,
        eventId: activeEvent.id,
        eventName: activeEvent.name,
        status: 'Present',
        recordedBy: currentUserName,
        checkInMethod: 'Quick Action',
      });
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
        onOpenQuickCheckIn={() => setActiveTab('attendance')}
        onOpenRecordIncome={() => setActiveTab('finances')}
        onOpenExpenseRequest={() => setActiveTab('finances')}
        onOpenBroadcast={() => setActiveTab('communication')}
        onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Navigation Sidebar */}
        <Sidebar onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)} />

        {/* Dynamic Center Stage Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <AdminDashboard
                onOpenRegister={() => setIsRegisterOpen(true)}
                onOpenAttendance={() => setActiveTab('attendance')}
                onOpenFollowUp={() => setActiveTab('follow-up')}
                onOpenFinances={() => setActiveTab('finances')}
                onSelectMember={handleOpenProfile}
              />
            )}

            {(activeTab === 'members' || activeTab === 'students') && (
              <MemberDirectory
                onOpenRegister={() => setIsRegisterOpen(true)}
                onSelectMember={handleOpenProfile}
                onViewIdCard={handleOpenIdCard}
                onQuickCheckInMember={handleQuickCheckIn}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceManager
                onOpenRegister={() => setIsRegisterOpen(true)}
                onSelectMember={handleOpenProfile}
              />
            )}

            {(activeTab === 'follow-up' || activeTab === 'first-timers') && (
              <FirstTimerFollowUpManager
                onOpenRegister={() => setIsRegisterOpen(true)}
                onSelectMemberById={handleOpenProfileById}
              />
            )}

            {activeTab === 'homes' && (
              <HomesManager
                onSelectMember={handleOpenProfile}
                onOpenRegister={() => setIsRegisterOpen(true)}
              />
            )}

            {activeTab === 'departments' && (
              <DepartmentsManager onSelectMember={handleOpenProfile} />
            )}

            {activeTab === 'finances' && <FinanceManager />}

            {activeTab === 'events' && (
              <EventsManager
                onSelectMember={handleOpenProfile}
                onOpenCheckInForEvent={(eventId) => setActiveTab('attendance')}
              />
            )}

            {(activeTab === 'communication' || activeTab === 'communications') && (
              <CommunicationManager />
            )}

            {(activeTab === 'reports' || activeTab === 'admin') && <ReportsManager />}
          </div>
        </main>
      </div>

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
        onViewIdCard={(m) => {
          setProfileMember(null);
          setIdCardMember(m);
        }}
      />

      <MemberIdCardModal
        member={idCardMember}
        isOpen={!!idCardMember}
        onClose={() => setIdCardMember(null)}
      />

      {/* Toast Notification Container */}
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

