import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const BottomNavBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Discover', path: '/discover', icon: 'explore' },
    { name: 'Plan', path: '/plan', icon: 'map' },
    { name: 'Dashboard', path: '/dashboard', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-[100] md:hidden">
      {/* Global Menu Popup */}
      {isMenuOpen && (
        <div className="absolute bottom-24 right-0 min-w-48 p-4 glass-card rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/experiences"
                className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <span className="font-label text-sm font-bold tracking-tight">Experiences</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      <div className="flex justify-around items-center px-6 py-4 bg-[#06261D]/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 ${location.pathname === link.path ? 'text-primary' : 'text-white/40'
              }`}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: location.pathname === link.path ? "'FILL' 1" : "'FILL' 0" }}>
              {link.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
          </Link>
        ))}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 ${isMenuOpen ? 'text-primary' : 'text-white/40'
            }`}
        >
          <span className="material-symbols-outlined text-2xl">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavBar;

