import { useState } from 'react';
import {
  ChevronLeft, Shield, Users, BadgeCheck, Flag, BarChart3,
  DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  Star, Settings, FileText, Eye,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { providers } from '@/data/providers';
import { formatPrice } from '@/utils/format';

type Tab = 'overview' | 'users' | 'verification' | 'reports' | 'bookings' | 'analytics' | 'settings';

export function AdminDashboardPage() {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'users', label: 'Users & Providers', icon: Users },
    { id: 'verification', label: 'Verification', icon: BadgeCheck },
    { id: 'reports', label: 'Reports & Disputes', icon: Flag },
    { id: 'bookings', label: 'Bookings', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-700 flex items-center justify-center">
            <Shield className="w-6 h-6 text-cream-50" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-800">Admin Dashboard</h1>
            <p className="text-forest-400 text-sm">Platform administration and oversight</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                        activeTab === tab.id ? 'bg-forest-700 text-cream-50' : 'text-forest-500 hover:bg-cream-50'
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

          <div className="lg:col-span-3">
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'verification' && <AdminVerification />}
            {activeTab === 'reports' && <AdminReports />}
            {activeTab === 'bookings' && <AdminBookings />}
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Users} label="Total Users" value="1,247" trend="+12%" />
        <StatBox icon={BadgeCheck} label="Active Providers" value={String(providers.length)} trend="+3%" />
        <StatBox icon={FileText} label="Bookings (Month)" value="89" trend="+18%" />
        <StatBox icon={DollarSign} label="Platform Revenue" value="₹2.8L" trend="+24%" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
          <h3 className="font-serif text-lg font-bold text-forest-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-500" /> Pending Actions
          </h3>
          <div className="space-y-2">
            <ActionRow text="3 verification requests pending review" color="gold" />
            <ActionRow text="2 customer disputes to investigate" color="red" />
            <ActionRow text="5 new provider applications" color="blue" />
            <ActionRow text="1 featured listing request" color="forest" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
          <h3 className="font-serif text-lg font-bold text-forest-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Suspicious Activity
          </h3>
          <div className="space-y-2">
            <ActionRow text="No suspicious activity detected" color="forest" />
            <ActionRow text="0 failed payment attempts" color="forest" />
            <ActionRow text="0 fake review reports" color="forest" />
          </div>
          <p className="text-xs text-forest-400 mt-3">Last checked: 2 hours ago</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h3 className="font-serif text-xl font-bold text-forest-800 mb-4">Platform Activity (Last 7 Days)</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const heights = [45, 60, 35, 80, 95, 70, 50];
            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-forest-500 to-forest-300 transition-all hover:from-forest-600 hover:to-forest-400"
                    style={{ height: `${heights[i]}%` }}
                  />
                </div>
                <span className="text-xs text-forest-400">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Users & Providers</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-cream-200 text-left">
              <th className="p-3 text-sm font-semibold text-forest-700">Business / Name</th>
              <th className="p-3 text-sm font-semibold text-forest-700">City</th>
              <th className="p-3 text-sm font-semibold text-forest-700">Rating</th>
              <th className="p-3 text-sm font-semibold text-forest-700">Status</th>
              <th className="p-3 text-sm font-semibold text-forest-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img src={p.profilePhoto} alt={p.businessName} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-sm font-medium text-forest-700">{p.businessName}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-forest-500">{p.city}</td>
                <td className="p-3 text-sm text-forest-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-gold-400 text-gold-400" />{p.rating}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`badge-festiva ${p.verified ? 'bg-forest-50 text-forest-600' : 'bg-gold-50 text-gold-700'}`}>
                    {p.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="p-3">
                  <button className="btn-ghost text-xs">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminVerification() {
  const unverified = providers.filter((p) => !p.verified);
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Verification Requests</h2>
      {unverified.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-10 h-10 text-forest-300 mx-auto mb-3" />
          <p className="text-forest-400">All providers are verified.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unverified.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-cream-50">
              <img src={p.profilePhoto} alt={p.businessName} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-forest-700">{p.businessName}</p>
                <p className="text-xs text-forest-400">{p.location} • {p.services.join(', ')}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-xs py-2 px-3">Approve</button>
                <button className="btn-secondary text-xs py-2 px-3">Review</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 p-4 rounded-xl bg-forest-50 border border-forest-100">
        <p className="text-sm text-forest-500">
          Verification includes business registration check, portfolio review, and identity confirmation.
          Only verified providers receive the verified badge on their profile.
        </p>
      </div>
    </div>
  );
}

function AdminReports() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Reports & Disputes</h2>
      <div className="space-y-3">
        <ReportItem type="Dispute" text="Customer disputes decoration quality with Celebration Decor Co." status="open" date="Oct 15, 2026" />
        <ReportItem type="Report" text="User reported inappropriate portfolio image" status="investigating" date="Oct 12, 2026" />
        <ReportItem type="Complaint" text="Provider complaints about commission rate" status="resolved" date="Oct 8, 2026" />
      </div>
    </div>
  );
}

function AdminBookings() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
      <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Platform Bookings</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatBox icon={FileText} label="Total Bookings" value="156" trend="+15%" />
        <StatBox icon={CheckCircle2} label="Completed" value="98" trend="+20%" />
        <StatBox icon={Clock} label="Pending" value="23" trend="-5%" />
        <StatBox icon={DollarSign} label="Commission Earned" value="₹1.4L" trend="+18%" />
      </div>
      <div className="space-y-2">
        <BookingRow customer="Priya Sharma" provider="Blossom & Bloom Decor" date="Nov 16, 2026" amount={47000} commission={4700} />
        <BookingRow customer="Rajesh Kumar" provider="Evergreen Events Co." date="Dec 5, 2026" amount={89000} commission={8900} />
        <BookingRow customer="Sneha Patil" provider="Celebration Decor Co." date="Nov 20, 2026" amount={17800} commission={1780} />
      </div>
    </div>
  );
}

function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Users} label="Active Users" value="1,247" trend="+12%" />
        <StatBox icon={TrendingUp} label="Growth Rate" value="18%" trend="+3%" />
        <StatBox icon={Star} label="Avg. Rating" value="4.7" trend="+0.1" />
        <StatBox icon={DollarSign} label="Avg. Booking" value="₹45K" trend="+8%" />
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h3 className="font-serif text-xl font-bold text-forest-800 mb-4">Top Categories</h3>
        <div className="space-y-2">
          {[
            { name: 'Weddings', count: 62, pct: 100 },
            { name: 'Corporate Events', count: 38, pct: 61 },
            { name: 'Birthdays', count: 28, pct: 45 },
            { name: 'Engagements', count: 15, pct: 24 },
            { name: 'Baby Showers', count: 8, pct: 13 },
          ].map((cat) => (
            <div key={cat.name} className="flex items-center gap-4">
              <span className="text-sm text-forest-600 w-32">{cat.name}</span>
              <div className="flex-1 h-6 rounded-full bg-cream-100 overflow-hidden">
                <div className="h-full rounded-full bg-forest-500 flex items-center justify-end pr-2" style={{ width: `${cat.pct}%` }}>
                  <span className="text-xs text-cream-50 font-medium">{cat.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h3 className="font-serif text-xl font-bold text-forest-800 mb-4">City Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { city: 'Bengaluru', count: 42 },
            { city: 'Hyderabad', count: 31 },
            { city: 'Mumbai', count: 28 },
            { city: 'Delhi', count: 25 },
            { city: 'Pune', count: 15 },
            { city: 'Chennai', count: 8 },
            { city: 'Kolkata', count: 4 },
            { city: 'Jaipur', count: 3 },
          ].map((c) => (
            <div key={c.city} className="p-3 rounded-xl bg-cream-50 text-center">
              <p className="font-serif text-xl font-bold text-forest-700">{c.count}</p>
              <p className="text-xs text-forest-400">{c.city}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Business Model Settings</h2>
        <div className="space-y-4">
          <SettingRow label="Commission Rate" value="10%" description="Percentage charged on completed bookings" />
          <SettingRow label="Customer Lead Price" value="₹50" description="Price per lead sent to providers" />
          <SettingRow label="Featured Listing Fee" value="₹2,000/month" description="Monthly fee for featured provider placement" />
          <SettingRow label="Provider Subscription" value="₹999/month" description="Monthly subscription for premium provider features" />
        </div>
        <div className="mt-4 p-4 rounded-xl bg-gold-50 border border-gold-200">
          <p className="text-sm text-gold-700">
            Payment and billing are not yet active. These settings will take effect when real payment processing is implemented.
            Do not charge users until billing is fully tested.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
        <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Categories & Locations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Weddings', 'Birthdays', 'Engagements', 'Anniversaries', 'Corporate Events', 'Baby Showers', 'Private Parties'].map((cat) => (
            <div key={cat} className="p-3 rounded-xl bg-cream-50 flex items-center justify-between">
              <span className="text-sm text-forest-600">{cat}</span>
              <button className="text-forest-300 hover:text-forest-500">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, trend }: { icon: typeof Shield; label: string; value: string; trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-forest-600" />
        </div>
        <span className={`text-xs font-semibold ${isPositive ? 'text-forest-600' : 'text-red-500'}`}>{trend}</span>
      </div>
      <p className="font-serif text-2xl font-bold text-forest-800">{value}</p>
      <p className="text-xs text-forest-400">{label}</p>
    </div>
  );
}

function ActionRow({ text, color }: { text: string; color: string }) {
  const colors: Record<string, string> = {
    gold: 'bg-gold-50 text-gold-700 border-gold-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    forest: 'bg-forest-50 text-forest-600 border-forest-200',
  };
  return (
    <div className={`p-2.5 rounded-lg border text-sm ${colors[color]}`}>{text}</div>
  );
}

function ReportItem({ type, text, status, date }: { type: string; text: string; status: string; date: string }) {
  const statusColor = status === 'open' ? 'bg-red-50 text-red-600' : status === 'investigating' ? 'bg-gold-50 text-gold-700' : 'bg-forest-50 text-forest-600';
  return (
    <div className="p-4 rounded-xl bg-cream-50">
      <div className="flex items-center justify-between mb-2">
        <span className="badge-festiva bg-cream-200 text-forest-600">{type}</span>
        <span className={`badge-festiva ${statusColor}`}>{status}</span>
      </div>
      <p className="text-sm text-forest-700">{text}</p>
      <p className="text-xs text-forest-400 mt-1">{date}</p>
    </div>
  );
}

function BookingRow({ customer, provider, date, amount, commission }: { customer: string; provider: string; date: string; amount: number; commission: number }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50">
      <div>
        <p className="text-sm font-semibold text-forest-700">{customer} → {provider}</p>
        <p className="text-xs text-forest-400">{date}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-forest-700">{formatPrice(amount)}</p>
        <p className="text-xs text-forest-400">Commission: {formatPrice(commission)}</p>
      </div>
    </div>
  );
}

function SettingRow({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50">
      <div>
        <p className="font-semibold text-forest-700">{label}</p>
        <p className="text-xs text-forest-400">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-serif text-lg font-bold text-forest-700">{value}</span>
        <button className="btn-ghost text-xs">Edit</button>
      </div>
    </div>
  );
}
