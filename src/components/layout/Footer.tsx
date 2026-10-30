import { Sparkles, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageRoute } from '@/types';

const footerLinks: { title: string; links: { label: string; route: PageRoute }[] }[] = [
  {
    title: 'Plan',
    links: [
      { label: 'Plan Your Event', route: 'plan' },
      { label: 'AI Recommendations', route: 'recommendations' },
      { label: 'Design Studio', route: 'design-studio' },
      { label: 'Budget Calculator', route: 'budget' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Find Providers', route: 'marketplace' },
      { label: 'Compare Quotations', route: 'quotations' },
      { label: 'Book a Service', route: 'booking' },
      { label: 'Messages', route: 'messages' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Customer Dashboard', route: 'customer-dashboard' },
      { label: 'Provider Dashboard', route: 'provider-dashboard' },
      { label: 'Admin Dashboard', route: 'admin-dashboard' },
    ],
  },
];

export function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-forest-800 text-cream-100 mt-20">
      <div className="container-festiva py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-forest-700" />
              </div>
              <span className="font-serif text-2xl font-bold text-cream-50">Festiva</span>
            </div>
            <p className="text-cream-200 text-sm leading-relaxed max-w-sm">
              Your perfect event starts here. Festiva connects you with trusted event planners,
              decorators, caterers, photographers, and venues — all in one elegant platform.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center hover:bg-forest-600 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon className="w-4 h-4 text-cream-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-lg font-semibold text-cream-50 mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.route)}
                      className="text-sm text-cream-200 hover:text-cream-50 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-forest-700 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream-300">
            © 2026 Festiva. Phase 1 Prototype — sample data for demonstration.
          </p>
          <div className="flex items-center gap-4 text-sm text-cream-300">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> hello@festiva.app
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> +91 90000 00000
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
