import { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, Send, Search, MessageSquare, FileText,
  CheckCircle2, Bell,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sampleMessages } from '@/data/catalogue';
import { timeAgo } from '@/utils/format';
import type { Message } from '@/types';

export function MessagesPage() {
  const { navigate } = useApp();
  const [conversations, setConversations] = useState<Message[]>(sampleMessages);
  const [activeId, setActiveId] = useState<string | null>(sampleMessages[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length]);

  const sendMessage = () => {
    if (!inputText.trim() || !activeId) return;
    setConversations(conversations.map((c) =>
      c.id === activeId
        ? {
            ...c,
            messages: [...c.messages, {
              id: `msg-${Date.now()}`,
              sender: 'customer',
              text: inputText,
              timestamp: new Date().toISOString(),
            }],
            lastUpdated: new Date().toISOString(),
            unreadCount: 0,
          }
        : c
    ));
    setInputText('');
  };

  const filteredConversations = conversations.filter((c) =>
    c.providerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">Messages</h1>
          <p className="text-forest-400 mt-2">Chat with your service providers about enquiries, quotations, and bookings.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-cream-100 overflow-hidden h-[600px] flex">
          {/* Conversation list */}
          <div className={`w-full sm:w-80 border-r border-cream-100 flex flex-col ${activeId ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-cream-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-cream-50 text-sm text-forest-700 placeholder-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-100"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full flex items-start gap-3 p-4 text-left border-b border-cream-100 transition-colors ${
                    activeId === conv.id ? 'bg-forest-50' : 'hover:bg-cream-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-forest-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-forest-700 truncate">{conv.providerName}</p>
                      <span className="text-xs text-forest-300 shrink-0 ml-2">{timeAgo(conv.lastUpdated)}</span>
                    </div>
                    <p className="text-xs text-forest-400 truncate mt-0.5">
                      {conv.messages[conv.messages.length - 1].text}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-gold-400 text-forest-900 text-xs font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="p-4 border-b border-cream-100 flex items-center gap-3">
                <button onClick={() => setActiveId(null)} className="sm:hidden text-forest-400">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-forest-600" />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-base font-bold text-forest-800">{activeConversation.providerName}</p>
                  <p className="text-xs text-forest-400">Usually responds within 2 hours</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream-50/30">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        msg.sender === 'customer'
                          ? 'bg-forest-600 text-cream-50 rounded-br-md'
                          : 'bg-white text-forest-700 border border-cream-200 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-cream-200' : 'text-forest-300'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-cream-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-cream-50 text-sm text-forest-700 placeholder-forest-300 border border-cream-200 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                    className="w-11 h-11 rounded-xl bg-forest-600 text-cream-50 flex items-center justify-center hover:bg-forest-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex flex-1 items-center justify-center text-forest-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-cream-300 mx-auto mb-3" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Notification types */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: MessageSquare, label: 'Enquiry Conversations', desc: 'Direct messaging with providers' },
            { icon: FileText, label: 'Quotation Updates', desc: 'Notified when quotes are sent or revised' },
            { icon: CheckCircle2, label: 'Booking Notifications', desc: 'Booking confirmations and status updates' },
            { icon: Bell, label: 'Event Reminders', desc: 'Reminders before your event date' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-4 rounded-xl bg-white border border-cream-100">
                <div className="w-9 h-9 rounded-lg bg-forest-50 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-forest-600" />
                </div>
                <p className="text-sm font-semibold text-forest-700">{item.label}</p>
                <p className="text-xs text-forest-400 mt-0.5">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
