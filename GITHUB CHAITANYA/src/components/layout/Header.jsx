import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
    { name: 'Plan', path: '/plan' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-6 bg-transparent">
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
        <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-transform active:scale-95 border-none shadow-none">
          Login
        </button>
    </header>
  );
};

export default Header;
