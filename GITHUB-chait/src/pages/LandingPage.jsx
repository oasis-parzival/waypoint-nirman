import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const { scrollYProgress } = useScroll();

  // TRACKER LOGIC
  const trekkerY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const pathHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const swipeCards = [
    {
      title: "01. Offline Grid Sync",
      desc: "Encrypted, zero-bandwidth navigation profiles for real-time safety.",
      icon: "bolt",
      svg: (
        <svg viewBox="0 0 200 150" className="w-full h-32 text-primary/80">
          <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M20 100 L100 60 L180 100 L100 140 Z" fill="none" stroke="url(#gridGrad)" strokeWidth="1" />
          <path d="M40 90 L100 60 L160 90 L100 120 Z" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
          <path d="M90 100 L100 110 L110 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M110 100 L100 90 L90 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="60" r="3" fill="currentColor" className="animate-pulse" />
          <circle cx="20" cy="100" r="2" fill="currentColor" strokeOpacity="0.5" />
          <circle cx="180" cy="100" r="2" fill="currentColor" strokeOpacity="0.5" />
        </svg>
      )
    },
    {
      title: "02. Neural Pathfinding",
      desc: "AI-driven route synthesis analyzing 40 years of climate patterns in milliseconds.",
      icon: "hub",
      svg: (
        <svg viewBox="0 0 200 150" className="w-full h-32 text-primary/80">
          <circle cx="60" cy="40" r="4" fill="currentColor" />
          <circle cx="140" cy="40" r="4" fill="currentColor" />
          <circle cx="100" cy="75" r="6" fill="currentColor" className="animate-pulse" />
          <circle cx="60" cy="110" r="4" fill="currentColor" />
          <circle cx="140" cy="110" r="4" fill="currentColor" />
          <path d="M60 40 L100 75 L140 40" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M60 110 L100 75 L140 110" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M60 40 L60 110" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M140 40 L140 110" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M30 75 L100 75 L170 75" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="20 10" />
        </svg>
      )
    },
    {
      title: "03. LiDAR Mapping",
      desc: "Ultra-precise terrain rendering with 0.5m resolution for absolute route truth.",
      icon: "layers",
      svg: (
        <svg viewBox="0 0 200 150" className="w-full h-32 text-primary/80">
          <path d="M20 120 Q 60 40 100 120 T 180 120" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 110 Q 60 30 100 110 T 180 110" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          <path d="M20 100 Q 60 20 100 100 T 180 100" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="20" y1="20" x2="180" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" strokeOpacity="0.3" />
          <motion.line 
            x1="0" y1="0" x2="200" y2="0" 
            stroke="currentColor" 
            strokeWidth="40" 
            strokeOpacity="0.1"
            animate={{ y: [20, 130, 20] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="100" cy="70" r="2" fill="currentColor" />
        </svg>
      )
    }
  ];


  // TOUCH LOGIC
  const [touchStart, setTouchStart] = useState(null);
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const distance = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(distance) > 50) setActiveCardIndex((prev) => (prev + 1) % swipeCards.length);
  };

  return (
    <div className="relative min-h-screen bg-black selection:bg-primary selection:text-on-primary no-scrollbar overflow-x-hidden">
      
      {/* MAP PROGRESSION TRACKER (Fixed Right) */}
      <div className="fixed right-4 md:right-12 top-1/4 bottom-1/4 w-1 z-[100] flex flex-col items-center">
        <div className="relative h-full w-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div className="absolute top-0 w-full bg-primary" style={{ height: pathHeight }} />
        </div>
        <motion.div className="absolute z-[101] -translate-x-1/2 left-1/2" style={{ top: trekkerY }}>
          <span className="material-symbols-outlined text-primary text-2xl md:text-3xl drop-shadow-[0_0_15px_rgba(160,209,188,0.8)]">directions_walk</span>
        </motion.div>
      </div>

      <div className="relative z-10 w-full">
        {/* HERO SECTION */}
        <section className="relative h-screen w-full flex flex-col justify-center items-center px-6 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
              <source src="/background-video.mp4" type="video/mp4" />
            </video>
            <img src="/cinematic_himalayan_summit_onyx_glow_1776257020425.png" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen" alt="Summit Backdrop" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black"></div>
          </div>

          <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-white italic font-label">Neural Expedition Protocol v4.0</span>
              </motion.div>
              <h1 className="text-6xl md:text-[12rem] font-bold tracking-tighter leading-[0.9] text-white font-headline uppercase">
                Ascend <br/> <span className="bg-gradient-to-r from-primary via-primary-fixed to-tertiary text-transparent bg-clip-text italic text-glow">Limitless.</span>
              </h1>
              <p className="text-white/60 text-xl md:text-3xl max-w-2xl mx-auto font-light leading-relaxed font-body">
                Redefining high-altitude exploration through neural pathfinding and cryogenic safety mapping.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
              <Link to="/discover" className="bg-primary text-on-primary px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-[0_0_60px_rgba(160,209,188,0.3)] hover:scale-105 active:scale-95 transition-all text-center">
                Initialize Route
              </Link>
              <button className="border-2 border-white/20 text-white px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/5 active:scale-95 transition-all">
                The Field Archive
              </button>
            </div>
          </div>
        </section>

        {/* STACKING CARDS SECTION */}
        <section className="py-32 md:py-64 px-6 bg-black relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Intelligence Core</span>
                <h2 className="text-5xl md:text-8xl font-bold text-white uppercase leading-tight font-headline">Unstacking <br />the <span className="italic text-primary">Void.</span></h2>
              </div>
              <p className="text-white/40 text-xl md:text-2xl leading-relaxed font-body max-w-xl">
                Our interface is a live data portal. {window.innerWidth < 768 ? 'Swipe' : 'Hover'} the core packets to explore the lidar-precise reality of the mountain terrain.
              </p>
            </div>

            <div
              className={`relative h-[500px] flex items-center justify-center ${window.innerWidth < 768 ? 'touch-none' : 'unstack-on-hover'} order-1 lg:order-2`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {(window.innerWidth < 768 ? swipeCards : swipeCards).map((card, index) => {
                const isTop = index === activeCardIndex;
                return (
                  <motion.div
                    key={index}
                    animate={window.innerWidth < 768 ? {
                      scale: isTop ? 1 : 0.9,
                      y: isTop ? 0 : index * 12,
                      opacity: isTop ? 1 : 0.2,
                      zIndex: isTop ? 30 : 10
                    } : {}}
                    className={`absolute w-full max-w-[320px] md:max-w-[380px] h-[450px] md:h-[520px] ${index === 0 ? 'bg-indigo-950/20' : index === 1 ? 'bg-primary/5' : 'bg-white/5'} border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl backdrop-blur-xl ${window.innerWidth >= 768 ? 'stacked-card' : ''}`}
                    style={window.innerWidth >= 768 ? { zIndex: (index + 1) * 10 } : {}}
                  >
                    <div className="space-y-6">
                      <span className={`material-symbols-outlined ${index === 1 ? 'text-primary' : 'text-white/40'} text-6xl md:text-7xl`}>{card.icon}</span>
                      <h4 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tighter font-headline">{card.title}</h4>
                      <div className="py-4">
                        {card.svg}
                      </div>
                    </div>

                    <p className="text-white/50 text-base md:text-lg leading-relaxed font-body">{card.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PREMIUM STATS BANNER */}
        <section className="py-24 border-y border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { l: 'Max Ascent', v: '8,848m', c: 'text-primary' },
              { l: 'Precision', v: '0.5m', c: 'text-white' },
              { l: 'Latency', v: '0.02s', c: 'text-primary' },
              { l: 'Reliability', v: '99.9%', c: 'text-white' }
            ].map(s => (
              <div key={s.l} className="space-y-2">
                <p className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase font-label">{s.l}</p>
                <p className={`text-5xl md:text-7xl font-bold tracking-tighter uppercase italic font-headline ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 md:py-64 text-center px-6 relative bg-black">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/20 blur-[180px] rounded-full"></div>
          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-6xl md:text-[11rem] font-bold text-white tracking-tighter leading-[0.8] uppercase font-headline">Explore <br /> the <span className="text-primary text-glow">Void.</span></h2>
            <p className="text-white/40 text-xl md:text-2xl font-light max-w-xl mx-auto pb-8 font-body">The peaks are waiting for a new kind of explorer. Deploy your intent below.</p>
            <button className="bg-white text-black px-16 md:px-24 py-6 md:py-8 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs active:scale-95 transition-all shadow-2xl">
              Access Beta Engine
            </button>
          </div>
        </section>
        
        <div className="h-32 md:hidden"></div>
      </div>
    </div>
  );
};

export default LandingPage;
