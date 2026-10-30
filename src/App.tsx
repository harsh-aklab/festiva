import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { PlanEventPage } from '@/pages/PlanEventPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { DesignStudioPage } from '@/pages/DesignStudioPage';
import { BudgetPage } from '@/pages/BudgetPage';
import { QuotationsPage } from '@/pages/QuotationsPage';
import { BookingPage } from '@/pages/BookingPage';
import { CustomerDashboardPage } from '@/pages/CustomerDashboardPage';
import { ProviderDashboardPage } from '@/pages/ProviderDashboardPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { ProviderProfile } from '@/components/ProviderProfile';
import { providers } from '@/data/providers';

function AppContent() {
  const { route, selectedProviderId } = useApp();

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  const renderPage = () => {
    switch (route) {
      case 'home': return <HomePage />;
      case 'plan': return <PlanEventPage />;
      case 'marketplace': return <MarketplacePage />;
      case 'provider': return selectedProvider ? <ProviderProfile provider={selectedProvider} /> : <HomePage />;
      case 'recommendations': return <RecommendationsPage />;
      case 'design-studio': return <DesignStudioPage />;
      case 'budget': return <BudgetPage />;
      case 'quotations': return <QuotationsPage />;
      case 'booking': return <BookingPage />;
      case 'customer-dashboard': return <CustomerDashboardPage />;
      case 'provider-dashboard': return <ProviderDashboardPage />;
      case 'admin-dashboard': return <AdminDashboardPage />;
      case 'messages': return <MessagesPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
