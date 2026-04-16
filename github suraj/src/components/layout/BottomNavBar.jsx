import { Link, useLocation } from 'react-router-dom';

const BottomNavBar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Discover', path: '/discover', icon: 'explore' },
    { name: 'Plan', path: '/plan', icon: 'map' },
    { name: 'Dashboard', path: '/dashboard', icon: 'person' },
    { name: 'Community', path: '/community', icon: 'forum' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
      <div className="flex justify-around items-center px-6 py-4 bg-[#06261D]/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              location.pathname === link.path ? 'text-primary scale-110' : 'text-white/40'
            }`}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: location.pathname === link.path ? "'FILL' 1" : "'FILL' 0" }}>
              {link.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
