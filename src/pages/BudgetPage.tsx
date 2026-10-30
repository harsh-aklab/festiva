import { useState, useMemo } from 'react';
import {
  Wallet, Plus, Minus, Trash2, ChevronLeft, Info, TrendingUp,
  Check, AlertTriangle, Calculator,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { decorationItems } from '@/data/catalogue';
import { providers } from '@/data/providers';
import { formatPrice } from '@/utils/format';
import type { ServiceType } from '@/types';

interface BudgetLine {
  id: string;
  category: string;
  description: string;
  amount: number;
  isPackage?: boolean;
}

const serviceProviders: Record<string, number> = {
  Decoration: 0,
  Catering: 0,
  Photography: 0,
  Videography: 0,
  Venue: 0,
  Entertainment: 0,
  Lighting: 0,
  Sound: 0,
  Makeup: 0,
  'Event Coordination': 0,
};

export function BudgetPage() {
  const { navigate, eventDraft, selectedDecorationIds, decorationQuantities } = useApp();
  const [guestCount, setGuestCount] = useState(typeof eventDraft.guestCount === 'number' ? eventDraft.guestCount : 100);
  const [perPlateCost, setPerPlateCost] = useState(350);
  const [venueRental, setVenueRental] = useState(25000);
  const [travelCost, setTravelCost] = useState(2000);
  const [labourCost, setLabourCost] = useState(5000);
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [customLines, setCustomLines] = useState<BudgetLine[]>([]);

  // Decoration costs from selected items
  const decorationCost = useMemo(() => {
    return selectedDecorationIds.reduce((sum, id) => {
      const item = decorationItems.find((i) => i.id === id);
      if (!item) return sum;
      return sum + item.price * (decorationQuantities[id] || 1);
    }, 0);
  }, [selectedDecorationIds, decorationQuantities]);

  // Service provider costs from event draft
  const serviceCosts = useMemo(() => {
    const costs: Record<string, number> = {};
    eventDraft.services.forEach((service) => {
      if (service === 'Decoration') {
        costs[service] = decorationCost;
      } else if (service === 'Catering') {
        costs[service] = guestCount * perPlateCost;
      } else {
        // Find starting price from providers matching this service
        const matchingProviders = providers.filter((p) => p.services.includes(service as ServiceType));
        const minPrice = matchingProviders.length > 0
          ? Math.min(...matchingProviders.map((p) => p.startingPrice))
          : 0;
        costs[service] = minPrice;
      }
    });
    return costs;
  }, [eventDraft.services, decorationCost, guestCount, perPlateCost]);

  const totalServiceCost = Object.values(serviceCosts).reduce((sum, v) => sum + v, 0);
  const venueCost = eventDraft.services.includes('Venue') ? venueRental : 0;
  const subtotal = totalServiceCost + venueCost + travelCost + labourCost +
    customLines.reduce((sum, l) => sum + l.amount, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount - discount;
  const budget = typeof eventDraft.budget === 'number' ? eventDraft.budget : 0;
  const remaining = budget - total;
  const remainingPct = budget > 0 ? Math.max(0, Math.min(100, (remaining / budget) * 100)) : 0;

  const addCustomLine = () => {
    setCustomLines([...customLines, {
      id: `custom-${Date.now()}`,
      category: 'Custom',
      description: 'New item',
      amount: 0,
    }]);
  };

  const updateCustomLine = (id: string, field: keyof BudgetLine, value: string | number) => {
    setCustomLines(customLines.map((l) => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeCustomLine = (id: string) => {
    setCustomLines(customLines.filter((l) => l.id !== id));
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva max-w-5xl">
        <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm mb-4">
            <Calculator className="w-4 h-4" /> Budget Calculator
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">Event Budget Estimator</h1>
          <p className="text-forest-400 mt-2">Get an itemized cost breakdown. Estimates only — final prices come from confirmed quotations.</p>
        </div>

        {/* Honest disclosure */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gold-50 border border-gold-200 mb-6">
          <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gold-700">
            These are estimates based on starting prices and your inputs. They are not confirmed quotations.
            Always request a formal quotation from providers before making decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Decoration items */}
            {selectedDecorationIds.length > 0 && (
              <BudgetCard title="Decoration Items" icon={Wallet}>
                <div className="space-y-2">
                  {selectedDecorationIds.map((id) => {
                    const item = decorationItems.find((i) => i.id === id);
                    if (!item) return null;
                    const qty = decorationQuantities[id] || 1;
                    return (
                      <div key={id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-medium text-forest-700">{item.name}</p>
                            <p className="text-xs text-forest-400">{formatPrice(item.price)} x {qty}</p>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-forest-700">{formatPrice(item.price * qty)}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2 font-semibold text-forest-700">
                    <span>Decoration Subtotal</span>
                    <span>{formatPrice(decorationCost)}</span>
                  </div>
                </div>
              </BudgetCard>
            )}

            {/* Service providers */}
            {eventDraft.services.length > 0 && (
              <BudgetCard title="Service Providers" icon={TrendingUp}>
                <div className="space-y-2">
                  {eventDraft.services.map((service) => (
                    <div key={service} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-forest-700">{service}</p>
                        {service === 'Catering' && (
                          <p className="text-xs text-forest-400">{guestCount} guests x {formatPrice(perPlateCost)}/plate</p>
                        )}
                        {service !== 'Catering' && service !== 'Decoration' && service !== 'Venue' && (
                          <p className="text-xs text-forest-400">Starting price estimate</p>
                        )}
                        {service === 'Venue' && (
                          <p className="text-xs text-forest-400">Venue rental estimate</p>
                        )}
                      </div>
                      <span className="font-serif font-bold text-forest-700">{formatPrice(serviceCosts[service] || 0)}</span>
                    </div>
                  ))}
                </div>
              </BudgetCard>
            )}

            {/* Other costs */}
            <BudgetCard title="Additional Costs" icon={Wallet}>
              <div className="space-y-4">
                {eventDraft.services.includes('Catering') && (
                  <CostInput label="Per-plate catering cost" value={perPlateCost} onChange={setPerPlateCost} />
                )}
                {eventDraft.services.includes('Venue') && (
                  <CostInput label="Venue rental" value={venueRental} onChange={setVenueRental} />
                )}
                <CostInput label="Travel & transport" value={travelCost} onChange={setTravelCost} />
                <CostInput label="Labour & setup" value={labourCost} onChange={setLabourCost} />
                <div>
                  <label className="block text-sm font-medium text-forest-600 mb-2">Guest Count</label>
                  <input
                    type="number"
                    min={1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                    className="input-festiva"
                  />
                </div>
              </div>
            </BudgetCard>

            {/* Custom lines */}
            <BudgetCard title="Custom Items" icon={Plus}>
              <div className="space-y-2">
                {customLines.map((line) => (
                  <div key={line.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateCustomLine(line.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="input-festiva flex-1 text-sm py-2"
                    />
                    <input
                      type="number"
                      value={line.amount}
                      onChange={(e) => updateCustomLine(line.id, 'amount', Number(e.target.value))}
                      placeholder="Amount"
                      className="input-festiva w-28 text-sm py-2"
                    />
                    <button onClick={() => removeCustomLine(line.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addCustomLine} className="btn-ghost text-sm w-full justify-center border border-dashed border-cream-300">
                  <Plus className="w-4 h-4" /> Add Custom Item
                </button>
              </div>
            </BudgetCard>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6 sticky top-24">
              <h3 className="font-serif text-lg font-bold text-forest-800 mb-4">Cost Summary</h3>

              {/* Budget progress */}
              {budget > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-forest-500">Budget</span>
                    <span className="font-serif font-bold text-forest-700">{formatPrice(budget)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-cream-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        remaining < 0 ? 'bg-red-400' : 'bg-forest-500'
                      }`}
                      style={{ width: `${100 - remainingPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-forest-400">Spent: {formatPrice(total)}</span>
                    <span className={remaining < 0 ? 'text-red-600 font-semibold' : 'text-forest-600 font-semibold'}>
                      {remaining < 0 ? `${formatPrice(Math.abs(remaining))} over` : `${formatPrice(remaining)} left`}
                    </span>
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-2 text-sm">
                <SummaryRow label="Services subtotal" value={subtotal} />
                {taxRate > 0 && <SummaryRow label={`Tax (${taxRate}%)`} value={taxAmount} />}
                {discount > 0 && <SummaryRow label="Discount" value={-discount} />}
                <div className="border-t border-cream-200 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-forest-800">Total</span>
                    <span className="font-serif text-2xl font-bold text-forest-700">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Tax & discount controls */}
              <div className="mt-4 pt-4 border-t border-cream-100 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-forest-500 mb-1">Tax Rate (%)</label>
                  <input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))} className="input-festiva text-sm py-2" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-forest-500 mb-1">Discount (₹)</label>
                  <input type="number" min={0} value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))} className="input-festiva text-sm py-2" />
                </div>
              </div>

              {remaining < 0 && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">Your estimate exceeds your budget. Consider reducing services or guest count.</p>
                </div>
              )}

              <button onClick={() => navigate('quotations')} className="btn-primary w-full mt-4 text-sm">
                Compare Quotations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetCard({ title, icon: Icon, children }: { title: string; icon: typeof Wallet; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
      <h2 className="font-serif text-lg font-bold text-forest-800 mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-forest-500" /> {title}
      </h2>
      {children}
    </div>
  );
}

function CostInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-600 mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400 font-medium">₹</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="input-festiva pl-8"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-forest-500">{label}</span>
      <span className={`font-medium ${value < 0 ? 'text-forest-600' : 'text-forest-700'}`}>{formatPrice(Math.abs(value))}</span>
    </div>
  );
}
