import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PageRoute, EventRequirement, UserRole } from '@/types';

interface AppState {
  route: PageRoute;
  selectedProviderId: string | null;
  savedProviderIds: string[];
  savedDecorationIds: string[];
  selectedDecorationIds: string[];
  decorationQuantities: Record<string, number>;
  eventDraft: EventRequirement;
  venuePhoto: string | null;
  userRole: UserRole;
  navigate: (route: PageRoute) => void;
  selectProvider: (id: string) => void;
  toggleSavedProvider: (id: string) => void;
  toggleSavedDecoration: (id: string) => void;
  toggleSelectedDecoration: (id: string) => void;
  setDecorationQuantity: (id: string, qty: number) => void;
  updateEventDraft: (updates: Partial<EventRequirement>) => void;
  setVenuePhoto: (photo: string | null) => void;
  setUserRole: (role: UserRole) => void;
}

const defaultEventDraft: EventRequirement = {
  eventType: '',
  eventDate: '',
  flexibleDates: false,
  city: '',
  area: '',
  venueLocation: '',
  venueType: '',
  guestCount: '',
  budget: '',
  currency: 'INR',
  services: [],
  theme: '',
  colors: '',
  style: '',
  culturalRequirements: '',
  setupType: '',
  specialRequests: '',
  accessibilityNeeds: '',
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<PageRoute>('home');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>([]);
  const [savedDecorationIds, setSavedDecorationIds] = useState<string[]>([]);
  const [selectedDecorationIds, setSelectedDecorationIds] = useState<string[]>([]);
  const [decorationQuantities, setDecorationQuantities] = useState<Record<string, number>>({});
  const [eventDraft, setEventDraft] = useState<EventRequirement>(defaultEventDraft);
  const [venuePhoto, setVenuePhoto] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('customer');

  const navigate = useCallback((r: PageRoute) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectProvider = useCallback((id: string) => {
    setSelectedProviderId(id);
    setRoute('provider');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleSavedProvider = useCallback((id: string) => {
    setSavedProviderIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const toggleSavedDecoration = useCallback((id: string) => {
    setSavedDecorationIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectedDecoration = useCallback((id: string) => {
    setSelectedDecorationIds((prev) => {
      if (prev.includes(id)) {
        setDecorationQuantities((q) => {
          const { [id]: _, ...rest } = q;
          return rest;
        });
        return prev.filter((p) => p !== id);
      }
      setDecorationQuantities((q) => ({ ...q, [id]: 1 }));
      return [...prev, id];
    });
  }, []);

  const setDecorationQuantity = useCallback((id: string, qty: number) => {
    setDecorationQuantities((q) => ({ ...q, [id]: Math.max(1, qty) }));
  }, []);

  const updateEventDraft = useCallback((updates: Partial<EventRequirement>) => {
    setEventDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        route,
        selectedProviderId,
        savedProviderIds,
        savedDecorationIds,
        selectedDecorationIds,
        decorationQuantities,
        eventDraft,
        venuePhoto,
        userRole,
        navigate,
        selectProvider,
        toggleSavedProvider,
        toggleSavedDecoration,
        toggleSelectedDecoration,
        setDecorationQuantity,
        updateEventDraft,
        setVenuePhoto,
        setUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
