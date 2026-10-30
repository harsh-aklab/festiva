import { useState } from 'react';
import {
  ChevronLeft, Send, Search, CheckCircle2, AlertCircle,
  FileText, Heart, Calendar, MessageSquare, Bell, Star,
  Download, Eye, ArrowRight, User, CreditCard,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { providers } from '@/data/providers';
import { sampleBookings, sampleQuotations, sampleMessages, decorationItems } from '@/data/catalogue';
import { formatPrice, formatDate, timeAgo } from '@/utils/format';

type Tab = 'overview' | 'requirements' | 'saved' | 'previews' | 'quotations' | 'bookings' | 'messages' | 'reviews';

export function CustomerDashboardPage() {
  const { navigate, eventDraft, savedProviderIds, savedDecorationIds } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const savedProviders = providers.filter((p) => savedProviderIds.includes(p.id));
  const savedItems = decorationItems.filter((i) => savedDecorationIds.includes(i.id));
  const unreadMessages = sampleMessages.reduce((sum, m) => sum + m.unreadCount, 0);

  const tabs: { id: Tab; label: string; icon: typeof User; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'requirements', label: 'Event Requirements', icon: Calendar },
    { id: 'saved', label: 'Saved Items', icon: Heart, count: savedProviders.length + savedItems.length },
    { id: 'quotations', label: 'Quotations', icon: FileText, count: sampleQuotations.length },
    { id: 'bookings', label: 'Bookings', icon: CheckCircle2, count: sampleBookings.length },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessages },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">Customer Dashboard</h1>
          <p className="text-forest-400 mt-2">Manage your event planning, bookings, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-4 sticky top-24">
              {/* Profile mini */}
              <div className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-cream-50">
                <div className="w-12 h-12 rounded-full bg-forest-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-forest-600" />
                </div>
                <div>
                  <p className="font-serif text-base font-bold text-forest-800">Welcome back!</p>
                  <p className="text-xs text-forest-400">Customer Account</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-forest-600 text-cream-50'
                          : 'text-forest-500 hover:bg-cream-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.id ? 'bg-cream-50/20' : 'bg-forest-100 text-forest-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && <OverviewTab navigate={navigate} eventDraft={eventDraft} savedProviders={savedProviders.length} savedItems={savedItems.length} />}
            {activeTab === 'requirements' && <RequirementsTab eventDraft={eventDraft} navigate={navigate} />}
            {activeTab === 'saved' && <SavedTab savedProviders={savedProviders} savedItems={savedItems} navigate={navigate} />}
            {activeTab === 'quotations' && <QuotationsTab navigate={navigate} />}
            {activeTab === 'bookings' && <BookingsTab navigate={navigate} />}
            {activeTab === 'messages' && <MessagesTab navigate={navigate} />}
            {activeTab === 'reviews' && <ReviewsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ navigate, eventDraft, savedProviders, savedItems }: {
  navigate: (r: any) => void;
  eventDraft: any;
  savedProviders: number;
  savedItems: number;
}) {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Quotations" value={sampleQuotations.length} color="forest" />
        <StatCard icon={CheckCircle2} label="Bookings" value={sampleBookings.length} color="gold" />
        <StatCard icon={Heart} label="Saved Items" value={savedProviders + savedItems} color="forest" />
        <StatCard icon={MessageSquare} label="Unread Messages" value={sampleMessages.reduce((s, m) => s + m.unreadCount, 0)} color="gold" />
      </div>

      {/* Current event summary */}
      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Current Event Summary</h2>
        {eventDraft.eventType ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoBox label="Event Type" value={eventDraft.eventType} />
            <InfoBox label="City" value={eventDraft.city || 'Not set'} />
            <InfoBox label="Guests" value={eventDraft.guestCount ? String(eventDraft.guestCount) : 'Not set'} />
            <InfoBox label="Budget" value={eventDraft.budget ? formatPrice(eventDraft.budget, eventDraft.currency) : 'Not set'} />
            <InfoBox label="Date" value={eventDraft.eventDate || 'Not set'} />
            <InfoBox label="Services" value={`${eventDraft.services.length} selected`} />
            <InfoBox label="Venue Type" value={eventDraft.venueType || 'Not set'} />
            <InfoBox label="Setup" value={eventDraft.setupType || 'Not set'} />
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-10 h-10 text-cream-300 mx-auto mb-3" />
            <p className="text-forest-400">You haven't set up your event requirements yet.</p>
            <button onClick={() => navigate('plan')} className="btn-primary mt-4">
              Start Planning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        {eventDraft.eventType && (
          <button onClick={() => navigate('plan')} className="btn-ghost mt-4 text-sm">
            Edit Requirements
          </button>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ActionCard icon={Search} title="Find Providers" desc="Browse the marketplace" onClick={() => navigate('marketplace')} />
        <ActionCard icon={Eye} title="Design Studio" desc="Create your event design" onClick={() => navigate('design-studio')} />
        <ActionCard icon={CreditCard} title="Budget Calculator" desc="Estimate your costs" onClick={() => navigate('budget')} />
      </div>

      {/* Recent notifications */}
      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-forest-500" /> Recent Notifications
        </h2>
        <div className="space-y-3">
          <NotificationItem icon={FileText} text="Blossom & Bloom Decor sent you a quotation" time="2 hours ago" />
          <NotificationItem icon={MessageSquare} text="New message from Lens & Light Photography" time="1 day ago" />
          <NotificationItem icon={CheckCircle2} text="Your booking with Lens & Light Photography is confirmed" time="3 days ago" />
          <NotificationItem icon={Calendar} text="Event reminder: Your event is on Nov 16, 2026" time="5 days ago" />
        </div>
      </div>
    </div>
  );
}

function RequirementsTab({ eventDraft, navigate }: { eventDraft: any; navigate: (r: any) => void }) {
  const fields = [
    { label: 'Event Type', value: eventDraft.eventType },
    { label: 'Event Date', value: eventDraft.eventDate ? formatDate(eventDraft.eventDate) : '' },
    { label: 'Flexible Dates', value: eventDraft.flexibleDates ? 'Yes' : 'No' },
    { label: 'City', value: eventDraft.city },
    { label: 'Area', value: eventDraft.area },
    { label: 'Venue Location', value: eventDraft.venueLocation },
    { label: 'Venue Type', value: eventDraft.venueType },
    { label: 'Guest Count', value: eventDraft.guestCount ? String(eventDraft.guestCount) : '' },
    { label: 'Budget', value: eventDraft.budget ? formatPrice(eventDraft.budget, eventDraft.currency) : '' },
    { label: 'Services', value: eventDraft.services.join(', ') },
    { label: 'Theme', value: eventDraft.theme },
    { label: 'Colours', value: eventDraft.colors },
    { label: 'Style', value: eventDraft.style },
    { label: 'Cultural Requirements', value: eventDraft.culturalRequirements },
    { label: 'Setup Type', value: eventDraft.setupType },
    { label: 'Special Requests', value: eventDraft.specialRequests },
    { label: 'Accessibility Needs', value: eventDraft.accessibilityNeeds },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-800">Event Requirements</h2>
        <button onClick={() => navigate('plan')} className="btn-ghost text-sm">
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="p-3 rounded-xl bg-cream-50">
            <p className="text-xs font-semibold text-forest-400 uppercase tracking-wide">{field.label}</p>
            <p className="text-sm text-forest-700 mt-1">{field.value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedTab({ savedProviders, savedItems, navigate }: { savedProviders: any[]; savedItems: any[]; navigate: (r: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Saved Providers ({savedProviders.length})</h2>
        {savedProviders.length === 0 ? (
          <EmptyState icon={Heart} text="No saved providers yet" action="Browse Providers" onClick={() => navigate('marketplace')} />
        ) : (
          <div className="space-y-3">
            {savedProviders.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
                <img src={p.profilePhoto} alt={p.businessName} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-serif text-base font-bold text-forest-800">{p.businessName}</p>
                  <p className="text-xs text-forest-400">{p.location} • {formatPrice(p.startingPrice, p.currency)}+</p>
                </div>
                <button onClick={() => navigate('marketplace')} className="btn-ghost text-sm">View</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Saved Decorations ({savedItems.length})</h2>
        {savedItems.length === 0 ? (
          <EmptyState icon={Heart} text="No saved decorations yet" action="Browse Catalogue" onClick={() => navigate('design-studio')} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {savedItems.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-cream-100">
                <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
                <div className="p-2">
                  <p className="text-sm font-medium text-forest-700 truncate">{item.name}</p>
                  <p className="text-xs text-forest-400">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuotationsTab({ navigate }: { navigate: (r: any) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-800">Quotations ({sampleQuotations.length})</h2>
        <button onClick={() => navigate('quotations')} className="btn-ghost text-sm">Compare All</button>
      </div>
      <div className="space-y-3">
        {sampleQuotations.map((q) => (
          <div key={q.id} className="p-4 rounded-xl bg-cream-50 flex items-center justify-between">
            <div>
              <p className="font-semibold text-forest-700">{q.providerName}</p>
              <p className="text-xs text-forest-400">{q.items.length} items • Valid until {formatDate(q.validUntil)}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-lg font-bold text-forest-700">{formatPrice(q.total, q.currency)}</p>
              <span className={`badge-festiva ${q.status === 'sent' ? 'bg-blue-50 text-blue-600' : q.status === 'revised' ? 'bg-gold-50 text-gold-700' : 'bg-forest-50 text-forest-600'}`}>
                {q.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsTab({ navigate }: { navigate: (r: any) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-800">Bookings ({sampleBookings.length})</h2>
        <button onClick={() => navigate('booking')} className="btn-ghost text-sm">View All</button>
      </div>
      <div className="space-y-3">
        {sampleBookings.map((b) => (
          <div key={b.id} className="p-4 rounded-xl bg-cream-50">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-forest-700">{b.providerName}</p>
              <span className={`badge-festiva ${b.status === 'confirmed' ? 'bg-forest-50 text-forest-600' : 'bg-gold-50 text-gold-700'}`}>
                {b.status}
              </span>
            </div>
            <p className="text-xs text-forest-400 mt-1">{formatDate(b.eventDate)} • {b.location}</p>
            <p className="text-sm font-medium text-forest-700 mt-2">{formatPrice(b.totalAmount, b.currency)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab({ navigate }: { navigate: (r: any) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-800">Messages</h2>
        <button onClick={() => navigate('messages')} className="btn-ghost text-sm">Open Messages</button>
      </div>
      <div className="space-y-3">
        {sampleMessages.map((m) => (
          <div key={m.id} className="p-4 rounded-xl bg-cream-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-forest-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-forest-700">{m.providerName}</p>
              <p className="text-xs text-forest-400 truncate">{m.messages[m.messages.length - 1].text}</p>
            </div>
            {m.unreadCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-gold-400 text-forest-900 text-xs font-bold flex items-center justify-center">
                {m.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsTab() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Reviews</h2>
      <p className="text-sm text-forest-400 mb-4">
        You can submit reviews for completed bookings. Reviews help other customers make informed decisions.
      </p>
      <div className="p-4 rounded-xl bg-cream-50 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-forest-300 shrink-0 mt-0.5" />
        <p className="text-sm text-forest-400">You have no completed bookings eligible for review yet. Once a booking is marked as completed, you'll be able to submit a review here.</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof User; label: string; value: number; color: string }) {
  const bg = color === 'forest' ? 'bg-forest-100 text-forest-600' : 'bg-gold-100 text-gold-700';
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-4">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-serif text-2xl font-bold text-forest-800">{value}</p>
      <p className="text-xs text-forest-400">{label}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-cream-50">
      <p className="text-xs font-semibold text-forest-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-forest-700 mt-1">{value}</p>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, onClick }: { icon: typeof User; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl shadow-card border border-cream-100 p-5 text-left hover:shadow-card-hover transition-all group">
      <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-forest-600" />
      </div>
      <h3 className="font-serif text-base font-bold text-forest-800">{title}</h3>
      <p className="text-xs text-forest-400 mt-1">{desc}</p>
      <span className="text-sm font-semibold text-forest-600 mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
        Go <ArrowRight className="w-4 h-4" />
      </span>
    </button>
  );
}

function NotificationItem({ icon: Icon, text, time }: { icon: typeof User; text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors">
      <div className="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-forest-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-forest-700">{text}</p>
        <p className="text-xs text-forest-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text, action, onClick }: { icon: typeof User; text: string; action: string; onClick: () => void }) {
  return (
    <div className="text-center py-8">
      <Icon className="w-10 h-10 text-cream-300 mx-auto mb-3" />
      <p className="text-forest-400 text-sm mb-3">{text}</p>
      <button onClick={onClick} className="btn-ghost text-sm">{action}</button>
    </div>
  );
}
