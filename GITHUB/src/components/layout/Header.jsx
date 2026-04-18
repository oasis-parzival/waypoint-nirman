import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Header = ({ user, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Discover', path: '/discover', icon: 'explore' },
    { name: 'Map', path: '/map', icon: 'location_on' },
    { name: 'Offline', path: '/offline', icon: 'grid_view' },
    { name: 'Community', path: '/community', icon: 'forum' },
    { name: 'Experiences', path: '/experiences', icon: 'reviews' },
    { name: 'Plan', path: '/plan', icon: 'edit_calendar' },
    { name: 'Weather', path: '/weather', icon: 'cloudy_snowing' },
    { name: 'Dashboard', path: '/dashboard', icon: 'person' },
    { name: 'Admin', path: '/admin', icon: 'terminal' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[2000] w-[94%] md:w-max">
        <div className="flex items-center justify-between md:justify-start gap-6 md:gap-12 px-5 md:px-10 py-3 md:py-4 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Waypoint Logo" 
                className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white font-headline group-hover:text-primary transition-colors uppercase italic">WAYPOINT</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${location.pathname === link.path ? 'text-primary' : 'text-white/40'} font-bold text-[10px] uppercase tracking-[0.2em] hover:text-white transition-all duration-300 font-label`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
             {user && (
               <span className="hidden md:block text-[9px] font-bold text-white/30 truncate max-w-[100px] uppercase tracking-widest">{user.email.split('@')[0]}</span>
             )}
             
             {/* THE "THREE LINES" TOGGLE (MOBILE & TABLET FOCUS) */}
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="md:hidden w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/5 relative z-[2100]"
             >
               <span className="material-symbols-outlined text-white text-2xl">
                 {isMenuOpen ? 'close' : 'menu'}
               </span>
             </button>

             {/* DESKTOP LOGOUT / LOGIN */}
             <div className="hidden md:block">
                {user ? (
                  <button 
                    onClick={handleSignOut}
                    className="bg-white/5 border border-white/10 text-white px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all font-label"
                  >
                    Logout
                  </button>
                ) : (
                  <button 
                    onClick={onLoginClick}
                    className="bg-white text-black px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl font-label"
                  >
                    Login
                  </button>
                )}
             </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU OVERLAY */}
      <div className={`fixed inset-0 z-[1950] bg-[#050505]/98 backdrop-blur-3xl transition-all duration-500 md:hidden overflow-y-auto custom-scrollbar ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="min-h-full flex flex-col bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            {/* CENTERED BLOCK WITH LEFT-ALIGNED ITEMS - ADDED TOP PADDING TO AVOID PILL */}
            <div className="flex-grow flex flex-col items-center justify-center p-10 pt-32">
               <div className="flex flex-col gap-6 md:gap-10 items-start">
                  {navLinks.map((link, idx) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-8 group transition-all duration-500 delay-${idx * 75} ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                      <div className="w-10 flex justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-125 transition-transform">{link.icon}</span>
                      </div>
                      <span className="text-3xl md:text-5xl font-black text-white group-hover:text-primary transition-colors uppercase italic tracking-tighter italic">{link.name}</span>
                    </Link>
                  ))}
                  
                  {user ? (
                    <button 
                      onClick={handleSignOut}
                      className={`flex items-center gap-8 group mt-4 transition-all duration-500 delay-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                      <div className="w-10 flex justify-center">
                         <span className="material-symbols-outlined text-red-500 text-3xl group-hover:scale-125 transition-transform">logout</span>
                      </div>
                      <span className="text-3xl md:text-5xl font-black text-white hover:text-red-500 transition-colors uppercase italic tracking-tighter">Sign Out</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setIsMenuOpen(false); onLoginClick(); }}
                      className={`flex items-center gap-8 group mt-4 transition-all duration-500 delay-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                      <div className="w-10 flex justify-center">
                         <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-125 transition-transform">login</span>
                      </div>
                      <span className="text-3xl md:text-5xl font-black text-white hover:text-primary transition-colors uppercase italic tracking-tighter">Authenticate</span>
                    </button>
                  )}
               </div>
            </div>
            
            <div className="p-12 text-center">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Trek Intelligence System • v2.0</p>
            </div>
         </div>
      </div>
    </>
  );
};

export default Header;
