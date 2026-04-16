import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-dim pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-outline-variant/10 pt-12">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">explore</span>
            <span className="font-bold tracking-[-0.02em] text-[#dfe4e0] text-3xl">Waypoint</span>
          </div>
          <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
            Advanced geospacial intelligence for the modern Himalayan cartographer. Built in India for the world's peaks.
          </p>
        </div>
        <div>
          <h4 className="text-on-background font-bold text-xs uppercase tracking-widest mb-6">Platforms</h4>
          <ul className="space-y-4 text-on-surface-variant text-sm font-medium">
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">iOS Engine</a></li>
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">Android Tracker</a></li>
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">Web Dashboard</a></li>
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">WatchOS Interface</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-on-background font-bold text-xs uppercase tracking-widest mb-6">Resources</h4>
          <ul className="space-y-4 text-on-surface-variant text-sm font-medium">
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">Safety Protocols</a></li>
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">Topo-Documentation</a></li>
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">Expedition Logs</a></li>
            <li><a className="hover:text-primary transition-colors hover:cursor-pointer" href="#">Support</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
