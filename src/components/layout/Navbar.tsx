import { useState } from 'react';
import { Sparkles, Menu, X, Heart, Search, Bell, User, LayoutDashboard, Shield, MessageSquare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageRoute, UserRole } from '@/types';

const navLinks: { label: string; route: PageRoute }[] = [
  { label: 'Home', route: 'home' },
  { label: 'Plan Event', route: 'plan' },
  { label: 'Find Providers', route: 'marketplace' },
  { label: 'AI Recommendations', route: 'recommendations' },
  { label: 'Design Studio', route: 'design-studio' },
  { label: 'Budget Calculator', route: 'budget' },
];

const roleLinks: Record<UserRole, { label: string; route: PageRoute; icon: typeof User }[]> = {
  customer: [
    { label: 'Dashboard', route: 'customer-dashboard', icon: LayoutDashboard },
    { label: 'Messages', route: 'messages', icon: MessageSquare },
  ],
  provider: [
    { label: 'Provider Dashboard', route: 'provider-dashboard', icon: LayoutDashboard },
    { label: 'Messages', route: 'messages', icon: MessageSquare },
  ],
  admin: [
    { label: 'Admin Dashboard', route: 'admin-dashboard', icon: Shield },
  ],
};

export function Navbar() {
  const { route, navigate, userRole, setUserRole, savedProviderIds } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleNav = (r: PageRoute) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-md border-b border-cream-200">
      <div className="container-festiva">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cream-50" />
            </div>
            <span className="font-serif text-2xl font-bold text-forest-700">Festiva</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  route === link.route
                    ? 'bg-forest-100 text-forest-700'
                    : 'text-forest-500 hover:text-forest-700 hover:bg-forest-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('marketplace')}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-forest-500 hover:bg-forest-50 transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNav('customer-dashboard')}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-forest-500 hover:bg-forest-50 transition-all relative"
              aria-label="Saved providers"
            >
              <Heart className="w-5 h-5" />
              {savedProviderIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-400 text-forest-900 text-[10px] font-bold flex items-center justify-center">
                  {savedProviderIds.length}
                </span>
              )}
            </button>

            {/* Role switcher + dashboard links */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-forest-600 text-cream-50 text-sm font-medium hover:bg-forest-700 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline capitalize">{userRole}</span>
              </button>
              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-xl shadow-card-hover border border-cream-200 py-2 animate-slide-down">
                    <p className="px-3 py-1 text-xs font-semibold text-forest-300 uppercase tracking-wide">View as</p>
                    {(['customer', 'provider', 'admin'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setUserRole(role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm capitalize transition-colors ${
                          userRole === role
                            ? 'bg-forest-50 text-forest-700 font-semibold'
                            : 'text-forest-500 hover:bg-cream-50'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                    <div className="border-t border-cream-200 my-2" />
                    <p className="px-3 py-1 text-xs font-semibold text-forest-300 uppercase tracking-wide">Dashboard</p>
                    {roleLinks[userRole].map((link) => {
                      const Icon = link.icon;
                      return (
                        <button
                          key={link.route}
                          onClick={() => {
                            handleNav(link.route);
                            setRoleMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-forest-600 hover:bg-cream-50 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {link.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-forest-600 hover:bg-forest-50 transition-all"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50 animate-slide-down">
          <nav className="container-festiva py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  route === link.route
                    ? 'bg-forest-100 text-forest-700'
                    : 'text-forest-500 hover:bg-forest-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-cream-200 my-2" />
            {roleLinks[userRole].map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNav(link.route)}
                  className="flex items-center gap-2 text-left px-4 py-3 rounded-xl text-sm font-medium text-forest-500 hover:bg-forest-50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
