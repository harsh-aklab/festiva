import { Star, BadgeCheck, MapPin, Heart, Camera, Clock, CheckCircle2, ArrowRight, MessageSquare, FileText } from 'lucide-react';
import type { Provider } from '@/types';
import { formatPrice } from '@/utils/format';
import { useApp } from '@/context/AppContext';
import { reviews } from '@/data/catalogue';

interface ProviderProfileProps {
  provider: Provider;
}

export function ProviderProfile({ provider }: ProviderProfileProps) {
  const { navigate, toggleSavedProvider, savedProviderIds } = useApp();
  const isSaved = savedProviderIds.includes(provider.id);
  const providerReviews = reviews.filter((r) => r.providerId === provider.id);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden rounded-b-3xl">
        <img
          src={provider.portfolioImages[0]}
          alt={provider.businessName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="container-festiva">
            <div className="flex items-end gap-4">
              <img
                src={provider.profilePhoto}
                alt={provider.businessName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-cream-50 shadow-lg"
              />
              <div className="flex-1 text-cream-50">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold">{provider.businessName}</h1>
                  {provider.verified && (
                    <span className="badge-festiva bg-forest-500 text-cream-50">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-cream-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {provider.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400" /> {provider.rating} ({provider.reviewCount} reviews)
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {provider.responseTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleSavedProvider(provider.id)}
                className="w-11 h-11 rounded-full bg-cream-50/90 backdrop-blur flex items-center justify-center hover:bg-cream-50 transition-all"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-gold-400 text-gold-400' : 'text-forest-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-festiva py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="font-serif text-xl font-bold text-forest-800 mb-3">About</h2>
              <p className="text-forest-500 leading-relaxed">{provider.bio}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 rounded-xl bg-cream-50">
                  <p className="font-serif text-2xl font-bold text-forest-700">{provider.yearsActive}</p>
                  <p className="text-xs text-forest-400 mt-1">Years Active</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-cream-50">
                  <p className="font-serif text-2xl font-bold text-forest-700">{provider.reviewCount}</p>
                  <p className="text-xs text-forest-400 mt-1">Reviews</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-cream-50">
                  <p className="font-serif text-2xl font-bold text-forest-700">{provider.rating}</p>
                  <p className="text-xs text-forest-400 mt-1">Rating</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-cream-50">
                  <p className="font-serif text-2xl font-bold text-forest-700">{provider.eventTypes.length}</p>
                  <p className="text-xs text-forest-400 mt-1">Event Types</p>
                </div>
              </div>
            </section>

            {/* Portfolio */}
            <section>
              <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 gap-3">
                {provider.portfolioImages.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src={img}
                      alt={`Portfolio ${i + 1}`}
                      className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/20 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </section>

            {/* Services & Event Types */}
            <section>
              <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Services & Expertise</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-cream-200">
                  <h3 className="text-sm font-semibold text-forest-700 mb-3">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service) => (
                      <span key={service} className="badge-festiva bg-forest-100 text-forest-700">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white border border-cream-200">
                  <h3 className="text-sm font-semibold text-forest-700 mb-3">Event Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.eventTypes.map((type) => (
                      <span key={type} className="badge-festiva bg-gold-100 text-gold-700">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-white border border-cream-200 mt-4">
                <h3 className="text-sm font-semibold text-forest-700 mb-3">Styles</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.styles.map((style) => (
                    <span key={style} className="badge-festiva bg-cream-100 text-forest-600">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Availability */}
            <section>
              <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">Availability</h2>
              <div className="p-5 rounded-xl bg-white border border-cream-200">
                <div className="flex flex-wrap gap-2">
                  {provider.availableDates.map((date) => (
                    <span
                      key={date}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-forest-600 bg-forest-50 border border-forest-100"
                    >
                      {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-forest-400 mt-3">
                  These are sample available dates for this prototype. Real availability will be confirmed when the booking system is connected.
                </p>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="font-serif text-xl font-bold text-forest-800 mb-4">
                Reviews ({providerReviews.length})
              </h2>
              <div className="space-y-4">
                {providerReviews.length === 0 && (
                  <p className="text-forest-400 text-sm">No reviews yet for this provider.</p>
                )}
                {providerReviews.map((review) => (
                  <div key={review.id} className="p-5 rounded-xl bg-white border border-cream-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-forest-600">
                            {review.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-forest-700">{review.customerName}</p>
                          <p className="text-xs text-forest-400">{review.event} • {review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-3.5 h-3.5 ${
                              n <= review.rating ? 'fill-gold-400 text-gold-400' : 'text-cream-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-forest-500 leading-relaxed">{review.text}</p>
                    {review.verified && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-forest-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-400" />
                        Verified booking
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Pricing card */}
              <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-card">
                <p className="text-sm text-forest-400">Starting from</p>
                <p className="font-serif text-3xl font-bold text-forest-700">
                  {formatPrice(provider.startingPrice, provider.currency)}
                </p>
                <p className="text-sm text-forest-400 mt-2">{provider.packageDetails}</p>

                <div className="space-y-2 mt-4 pt-4 border-t border-cream-100">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-forest-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-forest-600">Service Area</p>
                      <p className="text-forest-400">{provider.serviceArea}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Camera className="w-4 h-4 text-forest-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-forest-600">Travel Charges</p>
                      <p className="text-forest-400">{provider.travelCharges}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-forest-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-forest-600">Response Time</p>
                      <p className="text-forest-400">{provider.responseTime}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => navigate('quotations')}
                    className="btn-primary w-full"
                  >
                    <FileText className="w-4 h-4" />
                    Request Quotation
                  </button>
                  <button
                    onClick={() => navigate('messages')}
                    className="btn-secondary w-full"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </button>
                  <button
                    onClick={() => navigate('booking')}
                    className="btn-gold w-full"
                  >
                    Proceed to Booking
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-forest-300 mt-4 text-center">
                  Prices are starting estimates. Final quotes are provided by the provider.
                </p>
              </div>

              {/* Trust note */}
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100">
                <p className="text-xs text-forest-500 leading-relaxed">
                  {provider.verified
                    ? 'This provider has been verified by Festiva. Verification includes business registration and portfolio review.'
                    : 'This provider has not yet been verified. Please exercise due diligence before making payments.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
