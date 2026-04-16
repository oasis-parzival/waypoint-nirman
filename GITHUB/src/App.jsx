import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import PlanPage from './pages/PlanPage';
import OfflinePage from './pages/OfflinePage';
import CommunityPage from './pages/CommunityPage';
import Experiences from './pages/Experiences';
import TrekDetailPage from './pages/TrekDetailPage';
import Header from './components/layout/Header';
import WeatherPage from './pages/WeatherPage';
import AdminDashboard from './pages/AdminDashboard';
import SOSButton from './components/emergency/SOSButton';
import Footer from './components/layout/Footer';
import ChatbotWidget from './components/layout/ChatbotWidget';
import AuthOverlay from './components/auth/AuthOverlay';
import ScrollToTop from './components/layout/ScrollToTop';

function AppContent() {
  const [session, setSession] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {!isAdminPage && (
        <Header 
          user={session?.user} 
          onLoginClick={() => setIsAuthOpen(true)} 
        />
      )}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/trek/:id" element={<TrekDetailPage />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatbotWidget />}
      {!isAdminPage && <SOSButton user={session?.user} />}
      
      <AuthOverlay 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
