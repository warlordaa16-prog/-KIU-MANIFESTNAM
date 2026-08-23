import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { CommunicationMessage } from '../../types';
import {
  MessageSquare,
  Send,
  Users,
  Smartphone,
  Mail,
  Bell,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  Home,
  Download,
} from 'lucide-react';

export const CommunicationManager: React.FC = () => {
  const {
    messages,
    sendMessage,
    members,
    homes,
    departments,
    currentUserName,
  } = useFellowship();

  const [channel, setChannel] = useState<'SMS' | 'Email' | 'Announcement' | 'In-App'>('SMS');
  const [recipientGroup, setRecipientGroup] = useState<'All Members' | 'First Timers' | 'Home Group' | 'Department' | 'Leaders' | 'Absent Last Week'>('All Members');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedHomeId, setSelectedHomeId] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');

  // Target count calculation
  let targetCount = members.length;
  if (recipientGroup === 'First Timers') {
    targetCount = members.filter((m) => m.status === 'First Timer' || m.isFirstTimer).length;
  } else if (recipientGroup === 'Leaders') {
    targetCount = members.filter((m) => m.role && m.role !== 'Member').length;
  } else if (recipientGroup === 'Home Group' && selectedHomeId) {
    targetCount = members.filter((m) => m.homeId === selectedHomeId).length;
  } else if (recipientGroup === 'Department' && selectedDeptId) {
    targetCount = members.filter((m) => m.departmentIds?.includes(selectedDeptId)).length;
  }

  const templates: { name: string; title: string; body: string }[] = [
    {
      name: '🌟 Friday Fellowship Reminder',
      title: 'Manifest Friday Gathering Notice',
      body:
        'Dear Manifest family! Join us this Friday at 5:00 PM for a glorious evening in God\'s presence. Bring a friend along! Venue: Main Sanctuary.',
    },
    {
      name: '❤️ First-Timer Welcome Note',
      title: 'Welcome to Manifest Fellowship Family',
      body:
        'We were blessed to have you in fellowship with us! May God\'s grace overflow in your life. Your assigned Home Fellowship will reach out shortly.',
    },
    {
      name: '🏠 Weekly Home Cell Alert',
      title: 'Home Cell Fellowship This Wednesday',
      body:
        'Reminder: Home fellowship meets this Wednesday at 6:00 PM for prayer and fellowship. See you at your cell meeting point!',
    },
  ];

  const handleApplyTemplate = (tmpl: (typeof templates)[0]) => {
    setTitle(tmpl.title);
    setBody(tmpl.body);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    sendMessage({
      channel,
      senderName: currentUserName,
      title: title.trim(),
      body: body.trim(),
      recipientGroup,
      recipientCount: targetCount,
      status: 'Sent',
      targetGroupId: selectedHomeId || selectedDeptId || undefined,
    });

    setTitle('');
    setBody('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Section 16 Messaging & Broadcast Network
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Communication & Broadcast Center
          </h1>
          <p className="text-xs text-slate-400">
            Direct SMS reminders, WhatsApp broadcasts, and customized segmented announcements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Compose Message */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-400" />
              Compose Broadcast Message
            </h3>

            {/* Template Buttons */}
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                Quick Message Templates:
              </span>
              <div className="flex flex-wrap gap-2">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.name}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition-colors"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              
              {/* Channel & Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-bold text-purple-300"
                  >
                    <option value="SMS">📱 Bulk SMS Gateway</option>
                    <option value="In-App">🔔 In-App Notice</option>
                    <option value="Email">✉️ Email Newsletter</option>
                    <option value="Announcement">📢 Sanctuary Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Group</label>
                  <select
                    value={recipientGroup}
                    onChange={(e) => setRecipientGroup(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  >
                    <option value="All Members">All Registered Members ({members.length})</option>
                    <option value="First Timers">First Timers & Visitors</option>
                    <option value="Leaders">Leaders & Ministers Only</option>
                    <option value="Home Group">Specific Home Cell</option>
                    <option value="Department">Specific Department</option>
                  </select>
                </div>
              </div>

              {/* Conditional Group selectors */}
              {recipientGroup === 'Home Group' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Select Home Cell</label>
                  <select
                    value={selectedHomeId}
                    onChange={(e) => setSelectedHomeId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  >
                    <option value="">-- Choose Home Cell --</option>
                    {homes.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {recipientGroup === 'Department' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Select Department</label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                  >
                    <option value="">-- Choose Ministry --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Broadcast Header / Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Manifest Gathering Notice for Friday"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Message Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Message Content Body</label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {body.length} characters ({Math.ceil(body.length / 160) || 1} SMS)
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type broadcast text..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Broadcast to {targetCount} Souls</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Broadcast Logs & History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Broadcasts History
                </h3>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {messages.length} Sent
                </span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{msg.title}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {msg.channel}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                      "{msg.body}"
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Group: <strong className="text-purple-300">{msg.recipientGroup}</strong> ({msg.recipientCount})</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
