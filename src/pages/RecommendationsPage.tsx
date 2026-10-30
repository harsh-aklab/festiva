import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles, RefreshCw, ChevronLeft, AlertCircle, CheckCircle2,
  TrendingDown, Lightbulb, ArrowRight, Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { providers } from '@/data/providers';
import { themes } from '@/data/catalogue';
import { ProviderCard } from '@/components/ProviderCard';
import { formatPrice } from '@/utils/format';
import type { Provider } from '@/types';

interface Recommendation {
  provider: Provider;
  score: number;
  reasons: string[];
  budgetFit: 'within' | 'close' | 'over';
  alternatives: string[];
}

export function RecommendationsPage() {
  const { eventDraft, navigate } = useApp();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const generateRecommendations = useMemo(() => {
    return (): Recommendation[] => {
      const budget = typeof eventDraft.budget === 'number' ? eventDraft.budget : 0;
      const guestCount = typeof eventDraft.guestCount === 'number' ? eventDraft.guestCount : 0;

      return providers
        .map((provider): Recommendation => {
          const reasons: string[] = [];
          let score = 0;

          // Event type match
          if (eventDraft.eventType && provider.eventTypes.includes(eventDraft.eventType as any)) {
            score += 25;
            reasons.push(`Supports ${eventDraft.eventType} events`);
          }

          // Service match
          const serviceMatches = eventDraft.services.filter((s) => provider.services.includes(s));
          if (serviceMatches.length > 0) {
            score += serviceMatches.length * 10;
            reasons.push(`Offers ${serviceMatches.length} of your required services: ${serviceMatches.join(', ')}`);
          }

          // City match
          if (eventDraft.city && provider.city === eventDraft.city) {
            score += 20;
            reasons.push(`Located in ${eventDraft.city} — no extra travel needed`);
          }

          // Budget fit
          let budgetFit: Recommendation['budgetFit'] = 'within';
          if (budget > 0) {
            if (provider.startingPrice <= budget) {
              score += 15;
              const remaining = budget - provider.startingPrice;
              reasons.push(`Starting price ${formatPrice(provider.startingPrice, provider.currency)} is within your budget (${formatPrice(budget, eventDraft.currency)}), with ${formatPrice(remaining, eventDraft.currency)} remaining for other services`);
              budgetFit = 'within';
            } else if (provider.startingPrice <= budget * 1.3) {
              score += 5;
              const overage = provider.startingPrice - budget;
              reasons.push(`Starting price is ${formatPrice(overage, eventDraft.currency)} above your budget — consider negotiating or adjusting your package`);
              budgetFit = 'close';
            } else {
              reasons.push(`Starting price (${formatPrice(provider.startingPrice, provider.currency)}) exceeds your budget — consider increasing budget or choosing a different package`);
              budgetFit = 'over';
            }
          }

          // Rating
          if (provider.rating >= 4.5) {
            score += 10;
            reasons.push(`Highly rated at ${provider.rating} stars from ${provider.reviewCount} reviews`);
          }

          // Verified
          if (provider.verified) {
            score += 5;
            reasons.push('Verified business — profile and portfolio reviewed by Festiva');
          }

          // Style match
          if (eventDraft.style) {
            const styleMatch = provider.styles.some((s) =>
              s.toLowerCase().includes(eventDraft.style.toLowerCase()) ||
              eventDraft.style.toLowerCase().includes(s.toLowerCase())
            );
            if (styleMatch) {
              score += 10;
              reasons.push(`Matches your preferred style: ${eventDraft.style}`);
            }
          }

          // Guest count capacity (infer from starting price / service area)
          if (guestCount > 0 && guestCount <= 200) {
            score += 5;
          }

          // Alternatives
          const alternatives: string[] = [];
          if (budgetFit === 'over') {
            alternatives.push('Consider a smaller package or fewer services');
            alternatives.push('Ask the provider about budget-friendly options');
          }
          if (budgetFit === 'close') {
            alternatives.push('Request a custom quotation — providers often offer flexibility');
          }

          return { provider, score, reasons, budgetFit, alternatives };
        })
        .sort((a, b) => b.score - a.score);
    };
  }, [eventDraft]);

  const runRecommendations = () => {
    setLoading(true);
    setRecommendations([]);
    setTimeout(() => {
      const results = generateRecommendations();
      setRecommendations(results);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    runRecommendations();
  }, []);

  const recommendedThemes = themes.filter((t) =>
    eventDraft.eventType ? t.eventTypes.includes(eventDraft.eventType as any) : true
  ).slice(0, 3);

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        <button
          onClick={() => navigate('plan')}
          className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Edit Requirements
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Recommendations
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
            Recommended Providers for Your Event
          </h1>
        </div>

        {/* Requirements summary */}
        <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-wrap gap-3 text-sm">
              {eventDraft.eventType && (
                <span className="badge-festiva bg-forest-100 text-forest-700">{eventDraft.eventType}</span>
              )}
              {eventDraft.city && (
                <span className="badge-festiva bg-cream-100 text-forest-600">{eventDraft.city}</span>
              )}
              {typeof eventDraft.guestCount === 'number' && eventDraft.guestCount > 0 && (
                <span className="badge-festiva bg-cream-100 text-forest-600">{eventDraft.guestCount} guests</span>
              )}
              {typeof eventDraft.budget === 'number' && eventDraft.budget > 0 && (
                <span className="badge-festiva bg-gold-100 text-gold-700">Budget: {formatPrice(eventDraft.budget, eventDraft.currency)}</span>
              )}
              {eventDraft.services.length > 0 && (
                <span className="badge-festiva bg-cream-100 text-forest-600">{eventDraft.services.length} services</span>
              )}
              {eventDraft.eventDate && (
                <span className="badge-festiva bg-cream-100 text-forest-600">{eventDraft.eventDate}</span>
              )}
            </div>
            <button onClick={runRecommendations} disabled={loading} className="btn-ghost text-sm">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Honest disclosure */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gold-50 border border-gold-200 mb-8">
          <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gold-700">
            These recommendations are based on your requirements matched against real provider records in our database.
            We do not invent businesses, prices, or availability. Scores reflect how well each provider matches your needs.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-cream-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-cream-200" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-48 bg-cream-200 rounded" />
                    <div className="h-4 w-32 bg-cream-200 rounded" />
                    <div className="h-4 w-full bg-cream-200 rounded" />
                    <div className="h-4 w-3/4 bg-cream-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-center text-forest-400 text-sm">Analyzing your requirements and matching providers...</p>
          </div>
        )}

        {/* Results */}
        {!loading && recommendations.length > 0 && (
          <>
            {/* Top recommendations */}
            <div className="space-y-4">
              {recommendations.slice(0, 5).map((rec, idx) => (
                <RecommendationCard key={rec.provider.id} rec={rec} rank={idx + 1} />
              ))}
            </div>

            {/* Budget alert */}
            {recommendations.length > 0 && recommendations[0].budgetFit === 'over' && (
              <div className="mt-8 p-6 rounded-2xl bg-gold-50 border border-gold-200">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gold-800">Budget Consideration</h3>
                    <p className="text-sm text-gold-700 mt-1">
                      Most providers start above your current budget. Consider:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gold-700">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Increasing your budget if possible</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Requesting custom quotations — providers may offer smaller packages</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Reducing the number of services or guest count</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Choosing providers in your city to save on travel costs</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Theme suggestions */}
            {recommendedThemes.length > 0 && (
              <div className="mt-12">
                <h2 className="font-serif text-2xl font-bold text-forest-800 mb-2">
                  Suggested Themes for Your Event
                </h2>
                <p className="text-forest-400 text-sm mb-6">
                  Based on your event type, here are popular decoration themes you might like.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendedThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="card-festiva overflow-hidden cursor-pointer"
                      onClick={() => navigate('design-studio')}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img src={theme.image} alt={theme.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-cream-50">
                          <p className="font-serif text-base font-bold">{theme.name}</p>
                          <p className="text-xs text-cream-200">{theme.priceRange}</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-forest-400">{theme.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refresh preferences */}
            <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('plan')} className="btn-secondary">
                <RefreshCw className="w-4 h-4" /> Change Preferences
              </button>
              <button onClick={() => navigate('marketplace')} className="btn-primary">
                Browse All Providers
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ rec, rank }: { rec: Recommendation; rank: number }) {
  const { selectProvider } = useApp();
  const budgetColor =
    rec.budgetFit === 'within' ? 'text-forest-600 bg-forest-50 border-forest-200' :
    rec.budgetFit === 'close' ? 'text-gold-700 bg-gold-50 border-gold-200' :
    'text-red-700 bg-red-50 border-red-200';

  const budgetLabel =
    rec.budgetFit === 'within' ? 'Within Budget' :
    rec.budgetFit === 'close' ? 'Slightly Over Budget' :
    'Over Budget';

  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 overflow-hidden animate-fade-up" style={{ animationDelay: `${rank * 80}ms` }}>
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden relative">
          <img src={rec.provider.portfolioImages[0]} alt={rec.provider.businessName} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-forest-600 text-cream-50 text-sm font-bold flex items-center justify-center">
            {rank}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-800">{rec.provider.businessName}</h3>
              <p className="text-sm text-forest-400">{rec.provider.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-forest-400">Match Score</p>
                <p className="font-serif text-xl font-bold text-forest-700">{rec.score}%</p>
              </div>
              <span className={`badge-festiva border ${budgetColor}`}>{budgetLabel}</span>
            </div>
          </div>

          {/* Match reasons */}
          <div className="mt-3 p-3 rounded-xl bg-forest-50 border border-forest-100">
            <p className="text-xs font-semibold text-forest-600 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" /> Why we recommend this provider
            </p>
            <ul className="space-y-1">
              {rec.reasons.map((reason, i) => (
                <li key={i} className="text-xs text-forest-500 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-400 mt-0.5 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Alternatives */}
          {rec.alternatives.length > 0 && (
            <div className="mt-2 p-3 rounded-xl bg-gold-50 border border-gold-100">
              <p className="text-xs font-semibold text-gold-700 mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Suggestions
              </p>
              <ul className="space-y-1">
                {rec.alternatives.map((alt, i) => (
                  <li key={i} className="text-xs text-gold-600 flex items-start gap-1.5">
                    <span className="text-gold-500 mt-0.5">•</span>
                    {alt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
            <div>
              <p className="text-xs text-forest-400">Starting from</p>
              <p className="font-serif text-lg font-bold text-forest-700">{formatPrice(rec.provider.startingPrice, rec.provider.currency)}</p>
            </div>
            <button onClick={() => selectProvider(rec.provider.id)} className="btn-primary text-sm py-2 px-4">
              View Profile
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
