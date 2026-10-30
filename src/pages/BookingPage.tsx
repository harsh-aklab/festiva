import { useState } from 'react';
import {
  ChevronLeft, Calendar, MapPin, FileText, CheckCircle2, Clock,
  CreditCard, Download, Info, AlertTriangle, ArrowRight, Shield,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sampleBookings } from '@/data/catalogue';
import { formatPrice, formatDate } from '@/utils/format';
import type { Booking } from '@/types';

const statusConfig: Record<string, { color: string; label: string; icon: typeof Clock }> = {
  pending: { color: 'bg-gold-50 text-gold-700 border-gold-200', label: 'Pending Confirmation', icon: Clock },
  confirmed: { color: 'bg-forest-50 text-forest-600 border-forest-200', label: 'Confirmed', icon: CheckCircle2 },
  'in-progress': { color: 'bg-blue-50 text-blue-600 border-blue-200', label: 'In Progress', icon: Clock },
  completed: { color: 'bg-forest-100 text-forest-700 border-forest-200', label: 'Completed', icon: CheckCircle2 },
  cancelled: { color: 'bg-red-50 text-red-600 border-red-200', label: 'Cancelled', icon: AlertTriangle },
};

export function BookingPage() {
  const { navigate } = useApp();
  const [bookings] = useState<Booking[]>(sampleBookings);

  return (
    <div className="animate-fade-in py-8">
      <div className="container-festiva max-w-4xl">
        <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm mb-4">
            <FileText className="w-4 h-4" /> Booking & Payments
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">Your Bookings</h1>
          <p className="text-forest-400 mt-2">Track bookings, deposits, and payment status.</p>
        </div>

        {/* Payment disclosure */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gold-50 border border-gold-200 mb-6">
          <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gold-700">
            <strong>Payments are not yet active.</strong> A real payment provider will be integrated after configuration,
            testing, and security review. We will never store raw card details. Do not enter real payment information.
          </p>
        </div>

        {/* Bookings */}
        <div className="space-y-4">
          {bookings.map((booking) => {
            const status = statusConfig[booking.status];
            const StatusIcon = status.icon;
            const depositPaid = booking.deposit > 0;
            const remaining = booking.totalAmount - booking.deposit;

            return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-card border border-cream-100 overflow-hidden">
                {/* Status bar */}
                <div className={`flex items-center gap-2 px-5 py-3 border-b ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{status.label}</span>
                  <span className="ml-auto text-xs">Booking #{booking.id.toUpperCase()}</span>
                </div>

                <div className="p-5">
                  {/* Provider info */}
                  <h3 className="font-serif text-xl font-bold text-forest-800">{booking.providerName}</h3>
                  <div className="flex items-center gap-1 text-sm text-forest-400 mt-1">
                    <MapPin className="w-4 h-4" /> {booking.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-forest-400 mt-1">
                    <Calendar className="w-4 h-4" /> {formatDate(booking.eventDate)}
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {booking.services.map((service) => (
                      <span key={service} className="badge-festiva bg-cream-100 text-forest-600">{service}</span>
                    ))}
                  </div>

                  {/* Payment breakdown */}
                  <div className="mt-5 p-4 rounded-xl bg-cream-50">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-forest-500">Total Amount</span>
                        <span className="font-serif text-lg font-bold text-forest-700">{formatPrice(booking.totalAmount, booking.currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-forest-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-400" /> Deposit {depositPaid ? 'Paid' : 'Due'}
                        </span>
                        <span className="font-medium text-forest-600">{formatPrice(booking.deposit, booking.currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-forest-500">Remaining Balance</span>
                        <span className="font-medium text-forest-600">{formatPrice(remaining, booking.currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation policy */}
                  <div className="mt-4 p-3 rounded-xl bg-cream-50">
                    <p className="text-xs font-semibold text-forest-600 mb-1 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Cancellation Policy
                    </p>
                    <p className="text-xs text-forest-400">{booking.cancellationPolicy}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {booking.status === 'pending' && (
                      <button disabled className="btn-primary text-sm py-2.5 px-4 opacity-50 cursor-not-allowed">
                        <CreditCard className="w-4 h-4" /> Pay Deposit (Coming Soon)
                      </button>
                    )}
                    {booking.status === 'confirmed' && remaining > 0 && (
                      <button disabled className="btn-primary text-sm py-2.5 px-4 opacity-50 cursor-not-allowed">
                        <CreditCard className="w-4 h-4" /> Pay Balance (Coming Soon)
                      </button>
                    )}
                    <button disabled className="btn-secondary text-sm py-2.5 px-4 opacity-50 cursor-not-allowed">
                      <Download className="w-4 h-4" /> Download Receipt
                    </button>
                    <button onClick={() => navigate('messages')} className="btn-ghost text-sm py-2.5 px-4">
                      Message Provider
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking workflow steps */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-forest-800 mb-6">Booking Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Select Provider & Services', desc: 'Choose your provider and required services.' },
              { step: 2, title: 'Confirm Quotation', desc: 'Review and accept the provider\'s quotation.' },
              { step: 3, title: 'Pay Deposit', desc: 'Secure your booking with a deposit payment.' },
              { step: 4, title: 'Event & Balance', desc: 'Enjoy your event, then pay the remaining balance.' },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-2xl bg-white border border-cream-100">
                <div className="w-8 h-8 rounded-full bg-forest-600 text-cream-50 text-sm font-bold flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <h3 className="font-serif text-base font-bold text-forest-800">{item.title}</h3>
                <p className="text-xs text-forest-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('marketplace')} className="btn-secondary">
            Find More Providers
          </button>
          <button onClick={() => navigate('customer-dashboard')} className="btn-primary">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
