export type EventType =
  | 'Weddings'
  | 'Birthdays'
  | 'Engagements'
  | 'Anniversaries'
  | 'Corporate Events'
  | 'Baby Showers'
  | 'Private Parties';

export type VenueType =
  | 'Home'
  | 'Terrace'
  | 'Lawn'
  | 'Banquet Hall'
  | 'Hotel'
  | 'Outdoor Venue';

export type ServiceType =
  | 'Decoration'
  | 'Catering'
  | 'Photography'
  | 'Videography'
  | 'Venue'
  | 'Entertainment'
  | 'Lighting'
  | 'Sound'
  | 'Makeup'
  | 'Event Coordination';

export type SetupType = 'Indoor' | 'Outdoor';

export interface EventRequirement {
  eventType: EventType | '';
  eventDate: string;
  flexibleDates: boolean;
  city: string;
  area: string;
  venueLocation: string;
  venueType: VenueType | '';
  guestCount: number | '';
  budget: number | '';
  currency: string;
  services: ServiceType[];
  theme: string;
  colors: string;
  style: string;
  culturalRequirements: string;
  setupType: SetupType | '';
  specialRequests: string;
  accessibilityNeeds: string;
}

export interface Provider {
  id: string;
  businessName: string;
  profilePhoto: string;
  location: string;
  city: string;
  services: ServiceType[];
  eventTypes: EventType[];
  portfolioImages: string[];
  startingPrice: number;
  currency: string;
  packageDetails: string;
  serviceArea: string;
  travelCharges: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  responseTime: string;
  yearsActive: number;
  bio: string;
  styles: string[];
  availableDates: string[];
}

export interface DecorationItem {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  unit: string;
  available: boolean;
  style: string;
  color: string;
  eventTypes: EventType[];
}

export interface DecorationPackage {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  itemIds: string[];
  eventTypes: EventType[];
  style: string;
}

export interface Review {
  id: string;
  providerId: string;
  customerName: string;
  rating: number;
  date: string;
  event: EventType;
  text: string;
  verified: boolean;
}

export interface Theme {
  id: string;
  name: string;
  image: string;
  description: string;
  priceRange: string;
  eventTypes: EventType[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface Quotation {
  id: string;
  providerId: string;
  providerName: string;
  items: { name: string; price: number; included: boolean }[];
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'revised' | 'accepted' | 'expired';
  validUntil: string;
  terms: string;
  exclusions: string;
}

export interface Booking {
  id: string;
  providerName: string;
  services: ServiceType[];
  eventDate: string;
  location: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  deposit: number;
  totalAmount: number;
  currency: string;
  cancellationPolicy: string;
}

export interface Message {
  id: string;
  providerId: string;
  providerName: string;
  customerName: string;
  messages: {
    id: string;
    sender: 'customer' | 'provider';
    text: string;
    timestamp: string;
  }[];
  unreadCount: number;
  lastUpdated: string;
}

export interface Category {
  type: EventType;
  icon: string;
  image: string;
  count: number;
  description: string;
}

export type PageRoute =
  | 'home'
  | 'plan'
  | 'marketplace'
  | 'provider'
  | 'recommendations'
  | 'design-studio'
  | 'budget'
  | 'quotations'
  | 'booking'
  | 'customer-dashboard'
  | 'provider-dashboard'
  | 'admin-dashboard'
  | 'messages';

export type UserRole = 'customer' | 'provider' | 'admin';
