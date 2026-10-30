import { useState } from 'react';
import {
  Calendar, MapPin, Users, Wallet, CheckCircle2, Save, ArrowRight,
  ChevronLeft, Sparkles, Building, Palette, Accessibility,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cities, areas, venueTypes, eventTypesList, allServices } from '@/data/catalogue';
import type { EventType, ServiceType, VenueType, SetupType } from '@/types';

export function PlanEventPage() {
  const { eventDraft, updateEventDraft, navigate } = useApp();
  const [savedFlash, setSavedFlash] = useState(false);

  const toggleService = (service: ServiceType) => {
    const current = eventDraft.services;
    if (current.includes(service)) {
      updateEventDraft({ services: current.filter((s) => s !== service) });
    } else {
      updateEventDraft({ services: [...current, service] });
    }
  };

  const handleSaveDraft = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const isFormValid = eventDraft.eventType && eventDraft.city && eventDraft.guestCount && eventDraft.budget;

  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="container-festiva max-w-4xl">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1 text-sm text-forest-400 hover:text-forest-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Smart Event Requirement Form
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-800">
            Tell us about your event
          </h1>
          <p className="text-forest-400 mt-3 text-lg max-w-2xl mx-auto">
            The more details you share, the better we can match you with the right providers.
            Your draft is saved as you go.
          </p>
        </div>

        {/* Form sections */}
        <div className="space-y-6">
          {/* Event basics */}
          <FormCard icon={Calendar} title="Event Basics" step={1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Event Type" required>
                <select
                  value={eventDraft.eventType}
                  onChange={(e) => updateEventDraft({ eventType: e.target.value as EventType })}
                  className="input-festiva"
                >
                  <option value="">Select event type</option>
                  {eventTypesList.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Event Date" required>
                <input
                  type="date"
                  value={eventDraft.eventDate}
                  onChange={(e) => updateEventDraft({ eventDate: e.target.value })}
                  className="input-festiva"
                />
              </Field>
              <Field label="Are your dates flexible?">
                <label className="flex items-center gap-3 py-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => updateEventDraft({ flexibleDates: !eventDraft.flexibleDates })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      eventDraft.flexibleDates ? 'bg-forest-500' : 'bg-cream-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        eventDraft.flexibleDates ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                  <span className="text-sm text-forest-600">
                    {eventDraft.flexibleDates ? 'Yes, I have flexibility' : 'No, date is fixed'}
                  </span>
                </label>
              </Field>
            </div>
          </FormCard>

          {/* Location */}
          <FormCard icon={MapPin} title="Location" step={2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="City" required>
                <select
                  value={eventDraft.city}
                  onChange={(e) => updateEventDraft({ city: e.target.value, area: '' })}
                  className="input-festiva"
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </Field>
              <Field label="Area">
                <select
                  value={eventDraft.area}
                  onChange={(e) => updateEventDraft({ area: e.target.value })}
                  className="input-festiva"
                  disabled={!eventDraft.city}
                >
                  <option value="">Select area</option>
                  {(areas[eventDraft.city] || []).map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Venue Address / Landmark">
                  <input
                    type="text"
                    placeholder="e.g. Near Forum Mall, Whitefield"
                    value={eventDraft.venueLocation}
                    onChange={(e) => updateEventDraft({ venueLocation: e.target.value })}
                    className="input-festiva"
                  />
                </Field>
              </div>
              <Field label="Venue Type">
                <select
                  value={eventDraft.venueType}
                  onChange={(e) => updateEventDraft({ venueType: e.target.value as VenueType })}
                  className="input-festiva"
                >
                  <option value="">Select venue type</option>
                  {venueTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Indoor or Outdoor?">
                <div className="flex gap-2 py-1">
                  {(['Indoor', 'Outdoor'] as SetupType[]).map((setup) => (
                    <button
                      key={setup}
                      type="button"
                      onClick={() => updateEventDraft({ setupType: setup })}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        eventDraft.setupType === setup
                          ? 'border-forest-500 bg-forest-50 text-forest-700'
                          : 'border-cream-200 text-forest-400 hover:border-cream-300'
                      }`}
                    >
                      {setup}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </FormCard>

          {/* Guests & Budget */}
          <FormCard icon={Wallet} title="Guests & Budget" step={3}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Estimated Guest Count" required>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300" />
                  <input
                    type="number"
                    min={1}
                    placeholder="100"
                    value={eventDraft.guestCount}
                    onChange={(e) => updateEventDraft({ guestCount: e.target.value ? Number(e.target.value) : '' })}
                    className="input-festiva pl-10"
                  />
                </div>
              </Field>
              <Field label="Total Budget" required>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-300" />
                  <input
                    type="number"
                    min={0}
                    placeholder="50000"
                    value={eventDraft.budget}
                    onChange={(e) => updateEventDraft({ budget: e.target.value ? Number(e.target.value) : '' })}
                    className="input-festiva pl-10"
                  />
                </div>
              </Field>
              <Field label="Currency">
                <select
                  value={eventDraft.currency}
                  onChange={(e) => updateEventDraft({ currency: e.target.value })}
                  className="input-festiva"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </Field>
            </div>
          </FormCard>

          {/* Services */}
          <FormCard icon={Building} title="Services Required" step={4}>
            <p className="text-sm text-forest-400 mb-4">Select all the services you need for your event.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {allServices.map((service) => {
                const selected = eventDraft.services.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                      selected
                        ? 'border-forest-500 bg-forest-50 text-forest-700 shadow-sm'
                        : 'border-cream-200 text-forest-400 hover:border-cream-300 hover:bg-cream-50'
                    }`}
                  >
                    {service}
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 inline-block ml-1 text-forest-500" />}
                  </button>
                );
              })}
            </div>
          </FormCard>

          {/* Style & Theme */}
          <FormCard icon={Palette} title="Theme & Style Preferences" step={5}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Preferred Theme">
                <input
                  type="text"
                  placeholder="e.g. Royal Garden, Rustic Bohemian"
                  value={eventDraft.theme}
                  onChange={(e) => updateEventDraft({ theme: e.target.value })}
                  className="input-festiva"
                />
              </Field>
              <Field label="Preferred Colours">
                <input
                  type="text"
                  placeholder="e.g. Pastel pink, gold, cream"
                  value={eventDraft.colors}
                  onChange={(e) => updateEventDraft({ colors: e.target.value })}
                  className="input-festiva"
                />
              </Field>
              <Field label="Style">
                <input
                  type="text"
                  placeholder="e.g. Elegant, Modern, Traditional"
                  value={eventDraft.style}
                  onChange={(e) => updateEventDraft({ style: e.target.value })}
                  className="input-festiva"
                />
              </Field>
              <Field label="Cultural Requirements">
                <input
                  type="text"
                  placeholder="e.g. Traditional rituals, specific customs"
                  value={eventDraft.culturalRequirements}
                  onChange={(e) => updateEventDraft({ culturalRequirements: e.target.value })}
                  className="input-festiva"
                />
              </Field>
            </div>
          </FormCard>

          {/* Special requests */}
          <FormCard icon={Accessibility} title="Special Requests & Accessibility" step={6}>
            <div className="space-y-4">
              <Field label="Special Requests">
                <textarea
                  rows={3}
                  placeholder="Any special requirements, dietary needs, entertainment preferences, etc."
                  value={eventDraft.specialRequests}
                  onChange={(e) => updateEventDraft({ specialRequests: e.target.value })}
                  className="input-festiva resize-none"
                />
              </Field>
              <Field label="Accessibility Needs">
                <textarea
                  rows={2}
                  placeholder="e.g. Wheelchair access, sign language interpreter, etc."
                  value={eventDraft.accessibilityNeeds}
                  onChange={(e) => updateEventDraft({ accessibilityNeeds: e.target.value })}
                  className="input-festiva resize-none"
                />
              </Field>
            </div>
          </FormCard>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-between items-center">
          <button
            onClick={handleSaveDraft}
            className="btn-secondary w-full sm:w-auto"
          >
            <Save className="w-4 h-4" />
            {savedFlash ? 'Draft Saved!' : 'Save Draft'}
          </button>
          <button
            onClick={() => navigate('recommendations')}
            disabled={!isFormValid}
            className="btn-primary w-full sm:w-auto"
          >
            Get AI Recommendations
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {!isFormValid && (
          <p className="text-center text-xs text-forest-300 mt-3">
            Please fill in event type, city, guest count, and budget to get recommendations.
          </p>
        )}
      </div>
    </div>
  );
}

function FormCard({
  icon: Icon,
  title,
  step,
  children,
}: {
  icon: typeof Calendar;
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-cream-100 bg-cream-50/50">
        <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-forest-600" />
        </div>
        <h2 className="font-serif text-lg font-bold text-forest-800">{title}</h2>
        <span className="ml-auto w-7 h-7 rounded-full bg-forest-600 text-cream-50 text-xs font-bold flex items-center justify-center">
          {step}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-600 mb-2">
        {label}
        {required && <span className="text-gold-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
