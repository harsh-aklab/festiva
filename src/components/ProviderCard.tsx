import { Star, BadgeCheck, MapPin, Heart, ArrowRight } from 'lucide-react';
import type { Provider } from '@/types';
import { formatPrice } from '@/utils/format';
import { useApp } from '@/context/AppContext';

interface ProviderCardProps {
  provider: Provider;
  matchReasons?: string[];
}

export function ProviderCard({ provider, matchReasons }: ProviderCardProps) {
  const { selectProvider, toggleSavedProvider, savedProviderIds } = useApp();
  const isSaved = savedProviderIds.includes(provider.id);

  return (
    <div
      className="card-festiva overflow-hidden cursor-pointer group"
      onClick={() => selectProvider(provider.id)}
    >
      {/* Portfolio image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={provider.portfolioImages[0]}
          alt={provider.businessName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedProvider(provider.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isSaved ? 'fill-gold-400 text-gold-400' : 'text-forest-500'
            }`}
          />
        </button>
        {provider.verified && (
          <div className="absolute top-3 left-3 badge-festiva bg-forest-600 text-cream-50">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2.5 py-1">
          <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
          <span className="text-xs font-bold text-forest-800">{provider.rating}</span>
          <span className="text-xs text-forest-400">({provider.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-lg font-bold text-forest-800 group-hover:text-forest-600 transition-colors">
          {provider.businessName}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-sm text-forest-400">
          <MapPin className="w-3.5 h-3.5" />
          {provider.location}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {provider.services.slice(0, 3).map((service) => (
            <span key={service} className="badge-festiva bg-cream-100 text-forest-600">
              {service}
            </span>
          ))}
          {provider.services.length > 3 && (
            <span className="badge-festiva bg-cream-100 text-forest-400">
              +{provider.services.length - 3} more
            </span>
          )}
        </div>

        {/* Match reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-forest-50 border border-forest-100">
            <p className="text-xs font-semibold text-forest-600 mb-1.5">Why this matches</p>
            <ul className="space-y-1">
              {matchReasons.slice(0, 3).map((reason, i) => (
                <li key={i} className="text-xs text-forest-500 flex items-start gap-1.5">
                  <span className="text-forest-400 mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-100">
          <div>
            <p className="text-xs text-forest-400">Starting from</p>
            <p className="font-serif text-lg font-bold text-forest-700">
              {formatPrice(provider.startingPrice, provider.currency)}
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-forest-600 group-hover:gap-2 transition-all">
            View profile
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
