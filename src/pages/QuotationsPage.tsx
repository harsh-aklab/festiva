import { useState } from 'react';
import {
  ChevronLeft, FileText, Check, X, ArrowRight, MessageSquare,
  Info, Star, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sampleQuotations } from '@/data/catalogue';
import { providers } from '@/data/providers';
import { formatPrice, formatDate } from '@/utils/format';
import type { Quotation } from '@/types';

export function QuotationsPage() {
  const { navigate } = useApp();
  const [quotations, setQuotations] = useState<Quotation[]>(sampleQuotations);
  const [selectedIds, setSelectedIds] = useState<string[]>(sampleQuotations.map((q) => q.id));
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAccept = (id: string) => {
    setAcceptedId(id);
    setQuotations(quotations.map(q => q.id === id ? { ...q, status: 'accepted' } : q));
  };

  const selectedQuotations = quotations.filter((q) => selectedIds.includes(q.id));

  const statusColors: Record<string, string> = {
    draft: 'bg-cream-100 text-forest-500',
    sent: 'bg-blue-50 text-blue-600',
    revised: 'bg-gold-50 text-gold-700',
    accepted: 'bg-forest-50 text-forest-600',
    expired: 'bg-red-50 text-red-600',
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva">
        <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm mb-4">
            <FileText className="w-4 h-4" /> Quotation Comparison
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">Compare Quotations</h1>
          <p className="text-forest-400 mt-2">Review, compare, and accept quotations from your selected providers.</p>
        </div>

        {/* Honest disclosure */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gold-50 border border-gold-200 mb-6">
          <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gold-700">
            Final quotes must be approved by the relevant provider before being presented as confirmed prices.
            These are sample quotations for demonstration. Negotiate with providers through the messaging system for revised offers.
          </p>
        </div>

        {/* Select toggle */}
        <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-4 mb-6">
          <h3 className="text-sm font-semibold text-forest-700 mb-3">Select quotations to compare:</h3>
          <div className="flex flex-wrap gap-2">
            {quotations.map((q) => {
              const provider = providers.find((p) => p.id === q.providerId);
              const isSelected = selectedIds.includes(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => toggleSelect(q.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-forest-600 text-cream-50'
                      : 'bg-cream-100 text-forest-500 hover:bg-cream-200'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {q.providerName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison table */}
        {selectedQuotations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-cream-100 overflow-hidden mb-6 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50">
                  <th className="text-left p-4 text-sm font-semibold text-forest-700">Item</th>
                  {selectedQuotations.map((q) => (
                    <th key={q.id} className="text-right p-4 min-w-[180px]">
                      <p className="font-serif text-base font-bold text-forest-800 text-right">{q.providerName}</p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className={`badge-festiva ${statusColors[q.status]}`}>{q.status}</span>
                        {acceptedId === q.id && (
                          <span className="badge-festiva bg-forest-100 text-forest-600">
                            <CheckCircle2 className="w-3 h-3" /> Accepted
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Items */}
                {(() => {
                  const allItems = new Set<string>();
                  selectedQuotations.forEach((q) => q.items.forEach((i) => allItems.add(i.name)));
                  return Array.from(allItems).map((itemName) => (
                    <tr key={itemName} className="border-b border-cream-100">
                      <td className="p-4 text-sm text-forest-600">{itemName}</td>
                      {selectedQuotations.map((q) => {
                        const item = q.items.find((i) => i.name === itemName);
                        return (
                          <td key={q.id} className="p-4 text-right">
                            {item ? (
                              <span className="text-sm font-medium text-forest-700">{formatPrice(item.price, q.currency)}</span>
                            ) : (
                              <X className="w-4 h-4 text-cream-300 ml-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ));
                })()}
                {/* Total row */}
                <tr className="bg-forest-50 border-t-2 border-forest-200">
                  <td className="p-4 font-serif text-lg font-bold text-forest-800">Total</td>
                  {selectedQuotations.map((q) => (
                    <td key={q.id} className="p-4 text-right">
                      <span className="font-serif text-xl font-bold text-forest-700">{formatPrice(q.total, q.currency)}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Individual quotation cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {selectedQuotations.map((q) => {
            const provider = providers.find((p) => p.id === q.providerId);
            return (
              <div key={q.id} className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
                {/* Provider header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-cream-100">
                  {provider && (
                    <img src={provider.profilePhoto} alt={q.providerName} className="w-12 h-12 rounded-xl object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-serif text-base font-bold text-forest-800">{q.providerName}</h3>
                    {provider && (
                      <div className="flex items-center gap-1 text-xs text-forest-400">
                        <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                        {provider.rating} • {provider.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 mb-4">
                  {q.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {item.included ? <Check className="w-3.5 h-3.5 text-forest-500" /> : <X className="w-3.5 h-3.5 text-cream-300" />}
                        <span className="text-forest-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-forest-700">{formatPrice(item.price, q.currency)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-cream-200 mb-4">
                  <span className="font-serif text-lg font-bold text-forest-800">Total</span>
                  <span className="font-serif text-2xl font-bold text-forest-700">{formatPrice(q.total, q.currency)}</span>
                </div>

                {/* Terms */}
                <div className="p-3 rounded-xl bg-cream-50 mb-4 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-forest-600">Terms</p>
                    <p className="text-xs text-forest-400 mt-0.5">{q.terms}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-forest-600">Exclusions</p>
                    <p className="text-xs text-forest-400 mt-0.5">{q.exclusions}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-forest-400">
                    <Clock className="w-3.5 h-3.5" /> Valid until {formatDate(q.validUntil)}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {acceptedId === q.id ? (
                    <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 flex items-center gap-2 text-sm text-forest-600">
                      <CheckCircle2 className="w-4 h-4 text-forest-500" />
                      Quotation accepted! Proceed to booking.
                    </div>
                  ) : (
                    <button onClick={() => handleAccept(q.id)} className="btn-primary w-full text-sm py-2.5">
                      <Check className="w-4 h-4" /> Accept Quotation
                    </button>
                  )}
                  <button onClick={() => navigate('messages')} className="btn-secondary w-full text-sm py-2.5">
                    <MessageSquare className="w-4 h-4" /> Negotiate / Ask Question
                  </button>
                  {acceptedId === q.id && (
                    <button onClick={() => navigate('booking')} className="btn-gold w-full text-sm py-2.5">
                      Proceed to Booking
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedQuotations.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-cream-100">
            <AlertCircle className="w-12 h-12 text-cream-300 mx-auto mb-4" />
            <p className="text-forest-400 text-lg">No quotations selected for comparison.</p>
            <p className="text-sm text-forest-400 mt-1">Select at least one quotation above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
