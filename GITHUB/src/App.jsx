import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Footer from './components/layout/Footer';
import ChatbotWidget from './components/layout/ChatbotWidget';
import AuthOverlay from './components/auth/AuthOverlay';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  const [session, setSession] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background flex flex-col font-body">
        <Header 
          user={session?.user} 
          onLoginClick={() => setIsAuthOpen(true)} 
        />
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
            <Route path="/trek/:id" element={<TrekDetailPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatbotWidget />
        
        <AuthOverlay 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
