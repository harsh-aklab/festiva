import { useState } from 'react';
import {
  ChevronLeft, Edit, Star, TrendingUp, MessageSquare, Calendar,
  CheckCircle2, Clock, AlertCircle, FileText, DollarSign, Users,
  Image, Package, Eye, ArrowRight, BadgeCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { providers } from '@/data/providers';
import { decorationItems, decorationPackages } from '@/data/catalogue';
import { formatPrice, formatDate } from '@/utils/format';

type Tab = 'overview' | 'profile' | 'services' | 'enquiries' | 'quotations' | 'bookings' | 'inventory' | 'analytics';

export function ProviderDashboardPage() {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editingProfile, setEditingProfile] = useState(false);

  const provider = providers[0]; // Using first provider as the logged-in provider

  const tabs: { id: Tab; label: string; icon: typeof Edit }[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'profile', label: 'Business Profile', icon: Edit },
    { id: 'services', label: 'Services & Packages', icon: Package },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8 flex items-center gap-4">
          <img src={provider.profilePhoto} alt={provider.businessName} className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-800">{provider.businessName}</h1>
              {provider.verified && (
                <span className="badge-festiva bg-forest-100 text-forest-600">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-forest-400 text-sm">{provider.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id ? 'bg-forest-600 text-cream-50' : 'text-forest-500 hover:bg-cream-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && <ProviderOverview provider={provider} />}
            {activeTab === 'profile' && <ProviderProfileEdit provider={provider} editing={editingProfile} setEditing={setEditingProfile} />}
            {activeTab === 'services' && <ProviderServices provider={provider} />}
            {activeTab === 'enquiries' && <ProviderEnquiries />}
            {activeTab === 'quotations' && <ProviderQuotations />}
            {activeTab === 'bookings' && <ProviderBookings />}
            {activeTab === 'inventory' && <ProviderInventory />}
            {activeTab === 'analytics' && <ProviderAnalytics provider={provider} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderOverview({ provider }: { provider: typeof providers[0] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={MessageSquare} label="New Enquiries" value={3} color="forest" />
        <StatBox icon={Calendar} label="Upcoming Bookings" value={2} color="gold" />
        <StatBox icon={DollarSign} label="Revenue (Month)" value="₹1.2L" color="forest" />
        <StatBox icon={Star} label="Rating" value={provider.rating} color="gold" />
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Profile Completion</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-3 rounded-full bg-cream-100 overflow-hidden">
              <div className="h-full rounded-full bg-forest-500" style={{ width: '85%' }} />
            </div>
          </div>
          <span className="font-serif text-lg font-bold text-forest-700">85%</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <CheckItem text="Business name and photo" done />
          <CheckItem text="Services and pricing" done />
          <CheckItem text="Portfolio images" done />
          <CheckItem text="Service area defined" done />
          <CheckItem text="Availability calendar updated" done={false} />
          <CheckItem text="Package details added" done={false} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Recent Enquiries</h2>
        <div className="space-y-3">
          <EnquiryItem name="Priya Sharma" event="Wedding" date="Nov 16, 2026" city="Bengaluru" status="new" />
          <EnquiryItem name="Rajesh Kumar" event="Corporate Event" date="Dec 5, 2026" city="Bengaluru" status="replied" />
          <EnquiryItem name="Sneha Patil" event="Birthday Party" date="Nov 20, 2026" city="Pune" status="new" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Verification Status</h2>
        {provider.verified ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-forest-50 border border-forest-200">
            <BadgeCheck className="w-6 h-6 text-forest-600" />
            <div>
              <p className="font-semibold text-forest-700">Your business is verified</p>
              <p className="text-sm text-forest-400">Verification includes business registration and portfolio review.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gold-50 border border-gold-200">
            <Clock className="w-6 h-6 text-gold-600" />
            <div>
              <p className="font-semibold text-gold-700">Verification pending</p>
              <p className="text-sm text-gold-600">Submit your business documents for verification review.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProviderProfileEdit({ provider, editing, setEditing }: { provider: typeof providers[0]; editing: boolean; setEditing: (v: boolean) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-800">Business Profile</h2>
        <button onClick={() => setEditing(!editing)} className="btn-ghost text-sm">
          <Edit className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img src={provider.profilePhoto} alt={provider.businessName} className="w-20 h-20 rounded-2xl object-cover" />
          <div>
            <p className="font-serif text-lg font-bold text-forest-800">{provider.businessName}</p>
            <p className="text-sm text-forest-400">{provider.location}</p>
            {editing && <button className="btn-ghost text-sm mt-2">Change Photo</button>}
          </div>
        </div>

        <ProfileField label="Business Name" value={provider.businessName} editing={editing} />
        <ProfileField label="Bio" value={provider.bio} editing={editing} multiline />
        <ProfileField label="Location" value={provider.location} editing={editing} />
        <ProfileField label="Service Area" value={provider.serviceArea} editing={editing} />
        <ProfileField label="Travel Charges" value={provider.travelCharges} editing={editing} />
        <ProfileField label="Starting Price" value={formatPrice(provider.startingPrice, provider.currency)} editing={editing} />
        <ProfileField label="Response Time" value={provider.responseTime} editing={editing} />
        <ProfileField label="Years Active" value={String(provider.yearsActive)} editing={editing} />

        <div>
          <p className="text-xs font-semibold text-forest-400 uppercase tracking-wide mb-2">Services Offered</p>
          <div className="flex flex-wrap gap-2">
            {provider.services.map((s) => (
              <span key={s} className="badge-festiva bg-cream-100 text-forest-600">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-forest-400 uppercase tracking-wide mb-2">Styles</p>
          <div className="flex flex-wrap gap-2">
            {provider.styles.map((s) => (
              <span key={s} className="badge-festiva bg-cream-100 text-forest-600">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {editing && (
        <div className="mt-6 flex gap-3">
          <button onClick={() => setEditing(false)} className="btn-primary">Save Changes</button>
          <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
        </div>
      )}
    </div>
  );
}

function ProviderServices({ provider }: { provider: typeof providers[0] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Service Packages</h2>
        <p className="text-sm text-forest-400 mb-4">{provider.packageDetails}</p>
        <div className="p-4 rounded-xl bg-cream-50">
          <p className="font-semibold text-forest-700">Starting Price: {formatPrice(provider.startingPrice, provider.currency)}</p>
        </div>
        <button className="btn-secondary text-sm mt-4">
          <Package className="w-4 h-4" /> Add New Package
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Portfolio</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {provider.portfolioImages.map((img, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden group">
              <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/30 transition-all flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 text-cream-50 text-xs font-medium transition-all">Remove</button>
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-cream-300 rounded-xl h-24 flex flex-col items-center justify-center text-forest-400 hover:border-forest-400 hover:text-forest-600 transition-all">
            <Image className="w-5 h-5 mb-1" />
            <span className="text-xs">Add Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProviderEnquiries() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Customer Enquiries</h2>
      <div className="space-y-3">
        <EnquiryItem name="Priya Sharma" event="Wedding" date="Nov 16, 2026" city="Bengaluru" status="new" />
        <EnquiryItem name="Rajesh Kumar" event="Corporate Event" date="Dec 5, 2026" city="Bengaluru" status="replied" />
        <EnquiryItem name="Sneha Patil" event="Birthday Party" date="Nov 20, 2026" city="Pune" status="new" />
        <EnquiryItem name="Vikram Nair" event="Wedding" date="Dec 12, 2026" city="Bengaluru" status="quoted" />
      </div>
    </div>
  );
}

function ProviderQuotations() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Quotations Sent</h2>
      <div className="space-y-3">
        <QuotationRow customer="Priya Sharma" event="Wedding" amount={47000} status="sent" />
        <QuotationRow customer="Rajesh Kumar" event="Corporate Event" amount={89000} status="accepted" />
        <QuotationRow customer="Sneha Patil" event="Birthday Party" amount={17800} status="revised" />
      </div>
      <button className="btn-primary text-sm mt-4">
        <FileText className="w-4 h-4" /> Create New Quotation
      </button>
    </div>
  );
}

function ProviderBookings() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Bookings Calendar</h2>
      <div className="space-y-3">
        <BookingRow customer="Priya Sharma" event="Wedding" date="Nov 16, 2026" status="confirmed" amount={47000} />
        <BookingRow customer="Rajesh Kumar" event="Corporate Event" date="Dec 5, 2026" status="pending" amount={89000} />
        <BookingRow customer="Sneha Patil" event="Birthday Party" date="Nov 20, 2026" status="pending" amount={17800} />
      </div>
    </div>
  );
}

function ProviderInventory() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Decoration Inventory</h2>
      <p className="text-sm text-forest-400 mb-4">Manage your decoration items and availability.</p>
      <div className="space-y-2">
        {decorationItems.slice(0, 6).map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-forest-700">{item.name}</p>
              <p className="text-xs text-forest-400">{formatPrice(item.price)} per {item.unit}</p>
            </div>
            <span className={`badge-festiva ${item.available ? 'bg-forest-50 text-forest-600' : 'bg-red-50 text-red-600'}`}>
              {item.available ? 'Available' : 'Out of Stock'}
            </span>
            <button className="btn-ghost text-xs">Toggle</button>
          </div>
        ))}
      </div>
      <button className="btn-secondary text-sm mt-4">
        <Package className="w-4 h-4" /> Add Inventory Item
      </button>
    </div>
  );
}

function ProviderAnalytics({ provider }: { provider: typeof providers[0] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Eye} label="Profile Views" value={342} color="forest" />
        <StatBox icon={MessageSquare} label="Enquiries" value={28} color="gold" />
        <StatBox icon={CheckCircle2} label="Bookings" value={12} color="forest" />
        <StatBox icon={DollarSign} label="Revenue" value="₹4.5L" color="gold" />
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Performance Summary</h2>
        <div className="space-y-3">
          <MetricBar label="Response Rate" value={92} />
          <MetricBar label="Booking Conversion" value={43} />
          <MetricBar label="Customer Satisfaction" value={Math.round(provider.rating * 20)} />
          <MetricBar label="Repeat Customers" value={35} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Event Type Breakdown</h2>
        <div className="space-y-2">
          {provider.eventTypes.map((type, i) => (
            <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-cream-50">
              <span className="text-sm text-forest-600">{type}</span>
              <span className="text-sm font-semibold text-forest-700">{[12, 8, 5, 3, 2][i] || 1} bookings</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: typeof Edit; label: string; value: any; color: string }) {
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

function CheckItem({ text, done }: { text: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? <CheckCircle2 className="w-4 h-4 text-forest-500" /> : <Clock className="w-4 h-4 text-gold-400" />}
      <span className={done ? 'text-forest-600' : 'text-gold-600'}>{text}</span>
    </div>
  );
}

function EnquiryItem({ name, event, date, city, status }: { name: string; event: string; date: string; city: string; status: string }) {
  const statusColor = status === 'new' ? 'bg-gold-50 text-gold-700' : status === 'replied' ? 'bg-forest-50 text-forest-600' : 'bg-blue-50 text-blue-600';
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50 hover:bg-cream-100 transition-colors">
      <div>
        <p className="font-semibold text-forest-700">{name}</p>
        <p className="text-xs text-forest-400">{event} • {date} • {city}</p>
      </div>
      <span className={`badge-festiva ${statusColor}`}>{status}</span>
    </div>
  );
}

function QuotationRow({ customer, event, amount, status }: { customer: string; event: string; amount: number; status: string }) {
  const statusColor = status === 'sent' ? 'bg-blue-50 text-blue-600' : status === 'accepted' ? 'bg-forest-50 text-forest-600' : 'bg-gold-50 text-gold-700';
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50">
      <div>
        <p className="font-semibold text-forest-700">{customer}</p>
        <p className="text-xs text-forest-400">{event}</p>
      </div>
      <div className="text-right">
        <p className="font-serif font-bold text-forest-700">{formatPrice(amount)}</p>
        <span className={`badge-festiva ${statusColor}`}>{status}</span>
      </div>
    </div>
  );
}

function BookingRow({ customer, event, date, status, amount }: { customer: string; event: string; date: string; status: string; amount: number }) {
  const statusColor = status === 'confirmed' ? 'bg-forest-50 text-forest-600' : 'bg-gold-50 text-gold-700';
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50">
      <div>
        <p className="font-semibold text-forest-700">{customer}</p>
        <p className="text-xs text-forest-400">{event} • {date}</p>
      </div>
      <div className="text-right">
        <p className="font-serif font-bold text-forest-700">{formatPrice(amount)}</p>
        <span className={`badge-festiva ${statusColor}`}>{status}</span>
      </div>
    </div>
  );
}

function ProfileField({ label, value, editing, multiline }: { label: string; value: string; editing: boolean; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold text-forest-400 uppercase tracking-wide mb-1">{label}</p>
      {editing ? (
        <textarea
          defaultValue={value}
          rows={multiline ? 3 : 1}
          className="input-festiva text-sm resize-none"
        />
      ) : (
        <p className="text-sm text-forest-700">{value}</p>
      )}
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-forest-500">{label}</span>
        <span className="text-sm font-semibold text-forest-700">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-cream-100 overflow-hidden">
        <div className="h-full rounded-full bg-forest-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
