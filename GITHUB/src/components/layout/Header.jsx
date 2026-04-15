import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Header = ({ user, onLoginClick }) => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
    { name: 'Plan', path: '/plan' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[60] w-[94%] md:w-max">
      <div className="flex items-center justify-between md:justify-start gap-6 md:gap-12 px-6 md:px-10 py-3 md:py-4 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="material-symbols-outlined text-primary text-xl md:text-2xl group-hover:rotate-90 transition-transform duration-500">explore</span>
          <span className="font-extrabold tracking-tighter text-white text-lg md:text-2xl font-headline uppercase italic">Waypoint</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-white/40'
              } font-bold text-[10px] uppercase tracking-[0.2em] hover:text-white transition-all duration-300 font-label`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-[9px] font-bold text-white/30 truncate max-w-[100px] uppercase tracking-widest">{user.email.split('@')[0]}</span>
            <button 
              onClick={handleSignOut}
              className="bg-white/5 border border-white/10 text-white px-5 md:px-8 py-2 md:py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all font-label"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-white text-black px-5 md:px-8 py-2 md:py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl font-label"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
