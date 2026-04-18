import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import Dashboard from './pages/Dashboard';
import PlanPage from './pages/PlanPage';
import TrekDetailPage from './pages/TrekDetailPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BottomNavBar from './components/layout/BottomNavBar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col font-body">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trek/:id" element={<TrekDetailPage />} />
          </Routes>
        </main>
        <Footer />
        <BottomNavBar />
      </div>
    </Router>
  );
}

export default App;
