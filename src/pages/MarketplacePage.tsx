import { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, Star, BadgeCheck, MapPin, X,
  ChevronDown, Calendar,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { providers } from '@/data/providers';
import { cities, allServices, allStyles, eventTypesList } from '@/data/catalogue';
import { ProviderCard } from '@/components/ProviderCard';
import type { ServiceType, EventType } from '@/types';

export function MarketplacePage() {
  const { eventDraft } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(eventDraft.city || '');
  const [selectedService, setSelectedService] = useState<ServiceType | ''>('');
  const [selectedEventType, setSelectedEventType] = useState<EventType | ''>(eventDraft.eventType || '');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price-low' | 'price-high' | 'reviews'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = providers.filter((p) => {
      if (search && !p.businessName.toLowerCase().includes(search.toLowerCase()) &&
        !p.bio.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCity && p.city !== selectedCity) return false;
      if (selectedService && !p.services.includes(selectedService as ServiceType)) return false;
      if (selectedEventType && !p.eventTypes.includes(selectedEventType as EventType)) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (verifiedOnly && !p.verified) return false;
      if (maxPrice > 0 && p.startingPrice > maxPrice) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.startingPrice - b.startingPrice;
        case 'price-high': return b.startingPrice - a.startingPrice;
        case 'reviews': return b.reviewCount - a.reviewCount;
        default: return b.rating - a.rating;
      }
    });
    return result;
  }, [search, selectedCity, selectedService, selectedEventType, minRating, verifiedOnly, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedService('');
    setSelectedEventType('');
    setMinRating(0);
    setVerifiedOnly(false);
    setMaxPrice(0);
    setSearch('');
  };

  const activeFilterCount = [selectedCity, selectedService, selectedEventType].filter(Boolean).length +
    (minRating > 0 ? 1 : 0) + (verifiedOnly ? 1 : 0) + (maxPrice > 0 ? 1 : 0);

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
            Find Event Service Providers
          </h1>
          <p className="text-forest-400 mt-2">
            Browse {providers.length} providers across {cities.length} cities. All listings use sample data for this prototype.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300" />
            <input
              type="text"
              placeholder="Search by business name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-festiva pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-forest-600 text-cream-50 text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-forest-800">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-forest-400 hover:text-forest-600 flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {/* City */}
                <FilterSection title="City">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="input-festiva text-sm py-2"
                  >
                    <option value="">All cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </FilterSection>

                {/* Service */}
                <FilterSection title="Service Type">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value as ServiceType | '')}
                    className="input-festiva text-sm py-2"
                  >
                    <option value="">All services</option>
                    {allServices.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </FilterSection>

                {/* Event type */}
                <FilterSection title="Event Type">
                  <select
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value as EventType | '')}
                    className="input-festiva text-sm py-2"
                  >
                    <option value="">All event types</option>
                    {eventTypesList.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </FilterSection>

                {/* Rating */}
                <FilterSection title="Minimum Rating">
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          minRating === rating
                            ? 'bg-forest-100 text-forest-700 border border-forest-300'
                            : 'bg-cream-50 text-forest-400 border border-cream-200'
                        }`}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Max price */}
                <FilterSection title="Max Starting Price">
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={5000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-forest-500"
                  />
                  <p className="text-xs text-forest-400 mt-1">
                    {maxPrice === 0 ? 'No limit' : `Up to ₹${maxPrice.toLocaleString()}`}
                  </p>
                </FilterSection>

                {/* Verified */}
                <FilterSection title="Verification">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setVerifiedOnly(!verifiedOnly)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        verifiedOnly ? 'bg-forest-500' : 'bg-cream-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          verifiedOnly ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                    <span className="text-sm text-forest-600 flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4 text-forest-500" /> Verified only
                    </span>
                  </label>
                </FilterSection>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-forest-400">
                <span className="font-semibold text-forest-700">{filtered.length}</span> providers found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-forest-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm font-medium text-forest-700 bg-transparent border border-cream-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-forest-400"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
            </div>

            {/* Provider grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-cream-100">
                <Search className="w-12 h-12 text-cream-300 mx-auto mb-4" />
                <p className="text-forest-400 text-lg">No providers match your filters.</p>
                <button onClick={clearFilters} className="btn-ghost mt-4">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-forest-500 uppercase tracking-wide mb-2">{title}</label>
      {children}
    </div>
  );
}
