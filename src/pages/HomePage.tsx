import { useState } from 'react';
import {
  Search, MapPin, Calendar, ArrowRight, Star, Sparkles, Heart, Cake,
  Diamond, Building2, Baby, PartyPopper, TrendingUp, Wallet, Quote,
  CheckCircle2, ChevronRight, Images,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories, providers } from '@/data/providers';
import { themes, testimonials } from '@/data/catalogue';
import { cities, allServices } from '@/data/catalogue';
import { ProviderCard } from '@/components/ProviderCard';
import { SectionReveal } from '@/components/SectionReveal';
import { formatPrice } from '@/utils/format';
import type { EventType } from '@/types';

const iconMap: Record<string, typeof Heart> = {
  Heart, Cake, Diamond, Building2, Baby, PartyPopper,
};

export function HomePage() {
  const { navigate, updateEventDraft } = useApp();
  const [searchService, setSearchService] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const featuredProviders = providers.filter((p) => p.verified).slice(0, 4);
  const trendingThemes = themes.slice(0, 3);
  const budgetThemes = themes.slice(3, 6);

  const handleSearch = () => {
    if (searchService) {
      const matched = allServices.find((s) => s.toLowerCase().includes(searchService.toLowerCase()));
      if (matched) {
        updateEventDraft({ services: [matched] });
      }
    }
    if (searchLocation) {
      const matchedCity = cities.find((c) => c.toLowerCase().includes(searchLocation.toLowerCase()));
      if (matchedCity) updateEventDraft({ city: matchedCity });
    }
    if (searchDate) updateEventDraft({ eventDate: searchDate });
    navigate('marketplace');
  };

  const handleCategoryClick = (type: EventType) => {
    updateEventDraft({ eventType: type });
    navigate('marketplace');
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6028500/pexels-photo-6028500.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920"
            alt="Elegant event decoration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/70 via-forest-900/50 to-forest-800/60" />
        </div>

        <div className="relative container-festiva py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-50/10 backdrop-blur border border-cream-50/20 text-cream-100 text-sm mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-gold-300" />
              Plan, design, and book your perfect event
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-50 leading-tight text-balance animate-fade-up animate-delay-100">
              Your Perfect Event Starts Here.
            </h1>
            <p className="text-lg sm:text-xl text-cream-200 mt-4 max-w-2xl leading-relaxed animate-fade-up animate-delay-200">
              Connect with trusted event planners, decorators, caterers, photographers, and venues.
              Compare quotations, design your space, and book with confidence.
            </p>

            {/* Search bar */}
            <div className="mt-8 bg-cream-50 rounded-2xl p-3 sm:p-4 shadow-xl animate-fade-up animate-delay-300">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300" />
                  <input
                    type="text"
                    placeholder="What do you need? (e.g. Decoration, Catering)"
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream-50 text-forest-800 placeholder-forest-300 border border-cream-200 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all text-sm"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300" />
                  <input
                    type="text"
                    placeholder="City (e.g. Bengaluru)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream-50 text-forest-800 placeholder-forest-300 border border-cream-200 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all text-sm"
                  />
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300" />
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream-50 text-forest-800 placeholder-forest-300 border border-cream-200 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all text-sm"
                  />
                </div>
                <button onClick={handleSearch} className="btn-primary shrink-0">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8 animate-fade-up animate-delay-500">
              {[
                { label: 'Service Providers', value: '500+' },
                { label: 'Events Planned', value: '2,000+' },
                { label: 'Cities Covered', value: '8' },
                { label: 'Customer Rating', value: '4.8★' },
              ].map((stat) => (
                <div key={stat.label} className="text-cream-100">
                  <p className="font-serif text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-cream-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <div className="container-festiva">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">Popular Event Categories</h2>
              <p className="section-subtitle">Find the perfect providers for your celebration type</p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || Heart;
              return (
                <SectionReveal key={cat.type} delay={i * 60}>
                  <button
                    onClick={() => handleCategoryClick(cat.type)}
                    className="group relative w-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.type}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-forest-900/10" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-cream-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-gold-300" />
                        <span className="text-xs text-cream-200">{cat.count} providers</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold">{cat.type}</h3>
                      <p className="text-xs text-cream-200 mt-0.5">{cat.description}</p>
                    </div>
                  </button>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Planning form CTA */}
      <section className="py-12 bg-forest-50">
        <div className="container-festiva">
          <SectionReveal>
            <div className="relative rounded-3xl overflow-hidden bg-forest-700 p-8 sm:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-forest-600 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-forest-500 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30" />
              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
                    Tell us what you need. We'll find the perfect match.
                  </h2>
                  <p className="text-cream-200 mt-3 text-lg">
                    Fill out our smart event requirement form and get AI-powered recommendations
                    from real providers in your area.
                  </p>
                </div>
                <button
                  onClick={() => navigate('plan')}
                  className="btn-gold shrink-0 text-lg px-8 py-4"
                >
                  Start Planning
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 sm:py-20">
        <div className="container-festiva">
          <SectionReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Featured Planners</h2>
                <p className="section-subtitle">Top-rated, verified providers ready to make your event unforgettable</p>
              </div>
              <button
                onClick={() => navigate('marketplace')}
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-forest-600 hover:gap-2 transition-all"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProviders.map((provider, i) => (
              <SectionReveal key={provider.id} delay={i * 80}>
                <ProviderCard provider={provider} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Themes */}
      <section className="py-16 sm:py-20 bg-cream-100">
        <div className="container-festiva">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">Trending Event Themes</h2>
              <p className="section-subtitle">Get inspired by the latest decoration and design trends</p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingThemes.map((theme, i) => (
              <SectionReveal key={theme.id} delay={i * 100}>
                <div className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('design-studio')}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-cream-50">
                    <div className="flex items-center gap-1 mb-2">
                      <TrendingUp className="w-4 h-4 text-gold-300" />
                      <span className="text-xs text-cream-200">{theme.priceRange}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold">{theme.name}</h3>
                    <p className="text-sm text-cream-200 mt-1">{theme.description}</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-gold-300 group-hover:gap-2 transition-all">
                      Explore in Design Studio
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Budget-friendly inspiration */}
      <section className="py-16 sm:py-20">
        <div className="container-festiva">
          <SectionReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Budget-Friendly Inspiration</h2>
                <p className="section-subtitle">Beautiful events don't need to break the bank</p>
              </div>
              <button
                onClick={() => navigate('budget')}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-forest-600 hover:gap-3 transition-all"
              >
                <Wallet className="w-4 h-4" />
                Budget Calculator
              </button>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgetThemes.map((theme, i) => (
              <SectionReveal key={theme.id} delay={i * 80}>
                <div
                  className="card-festiva overflow-hidden cursor-pointer"
                  onClick={() => navigate('design-studio')}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 badge-festiva bg-gold-400 text-forest-900">
                      <Wallet className="w-3 h-3" />
                      {theme.priceRange}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-forest-800">{theme.name}</h3>
                    <p className="text-sm text-forest-400 mt-1">{theme.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {theme.eventTypes.map((type) => (
                        <span key={type} className="badge-festiva bg-cream-100 text-forest-500">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-forest-50">
        <div className="container-festiva">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">How Festiva Works</h2>
              <p className="section-subtitle">From idea to celebration in four simple steps</p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: 'Tell us your needs', desc: 'Share your event type, date, budget, and preferences.' },
              { icon: Sparkles, title: 'Get AI recommendations', desc: 'Our system matches you with suitable providers from real records.' },
              { icon: Images, title: 'Design & compare', desc: 'Preview decorations, compare quotations, and message providers.' },
              { icon: CheckCircle2, title: 'Book with confidence', desc: 'Accept a quotation, track your booking, and enjoy your event.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <SectionReveal key={step.title} delay={i * 100}>
                  <div className="text-center p-6 rounded-2xl bg-white border border-cream-200">
                    <div className="relative inline-flex">
                      <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-forest-600" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold-400 text-forest-900 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-forest-800 mt-4">{step.title}</h3>
                    <p className="text-sm text-forest-400 mt-2">{step.desc}</p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="container-festiva">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">Loved by Event Planners</h2>
              <p className="section-subtitle">Real stories from customers who found their perfect providers</p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <SectionReveal key={testimonial.id} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-card h-full flex flex-col">
                  <Quote className="w-8 h-8 text-gold-300 mb-4" />
                  <p className="text-forest-600 leading-relaxed flex-1 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-1 mt-4 mb-4">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-4 h-4 ${n <= testimonial.rating ? 'fill-gold-400 text-gold-400' : 'text-cream-300'}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-cream-100">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-forest-700">{testimonial.name}</p>
                      <p className="text-xs text-forest-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-cream-100">
        <div className="container-festiva">
          <SectionReveal>
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/12954016/pexels-photo-12954016.jpeg?auto=compress&cs=tinysrgb&h=800&w=1920"
                alt="Beautiful event venue"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-900/80 to-forest-800/50" />
              <div className="absolute inset-0 flex items-center">
                <div className="container-festiva">
                  <div className="max-w-lg">
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 text-balance">
                      Ready to plan your perfect event?
                    </h2>
                    <p className="text-cream-200 mt-3 text-lg">
                      Start with a free event requirement form. No commitment required.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <button onClick={() => navigate('plan')} className="btn-gold text-lg px-8 py-4">
                        Start Planning
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigate('marketplace')}
                        className="btn-secondary bg-cream-50/10 border-cream-50/30 text-cream-50 hover:bg-cream-50/20 text-lg px-8 py-4"
                      >
                        Browse Providers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
