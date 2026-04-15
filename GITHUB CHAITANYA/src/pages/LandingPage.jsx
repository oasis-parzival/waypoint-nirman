import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const containerRef = useRef(null);

  // 1. SCROLL & MAP PROGRESSION LOGIC
  // Tracks progress for the Trekker icon and the emerald trail path
  const { scrollYProgress } = useScroll();

  // Maps scroll progress (0 to 1) to vertical position on the screen (25% to 75% of viewport)
  const trekkerY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const pathHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // 2. SWIPEABLE CARDS CONTENT
  const swipeCards = [
    {
      title: "01. LiDAR Mapping",
      desc: "Ultra-precise terrain rendering with 0.5m resolution for absolute route truth.",
      icon: "layers"
    },
    {
      title: "02. Neural Pathfinding",
      desc: "AI-driven route synthesis analyzing 40 years of climate patterns in milliseconds.",
      icon: "hub"
    },
    {
      title: "03. Offline Grid Sync",
      desc: "Encrypted, zero-bandwidth navigation profiles for real-time safety.",
      icon: "bolt"
    }
  ];

  // 3. TOUCH INTERACTION LOGIC (S20 Ultra / Mobile First)
  const [touchStart, setTouchStart] = useState(null);

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      setActiveCardIndex((prev) => (prev + 1) % swipeCards.length);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 selection:bg-primary selection:text-on-primary no-scrollbar overflow-x-hidden">

      {/* MAP PROGRESSION TRACKER (Fixed Right) */}
      <div className="fixed right-4 md:right-8 top-1/4 bottom-1/4 w-1 z-50 flex flex-col items-center">
        <div className="relative h-full w-0.5 bg-white/10 rounded-full overflow-hidden">
          {/* The Emerald Trail */}
          <motion.div
            className="absolute top-0 w-full bg-primary"
            style={{ height: pathHeight }}
          />
        </div>

        {/* THE TREKKER ICON */}
        <motion.div
          className="absolute z-[51] -translate-x-1/2 left-1/2"
          style={{ top: trekkerY }}
        >
          <span className="material-symbols-outlined text-primary text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(160,209,188,0.6)]">
            directions_walk
          </span>
        </motion.div>
      </div>

      <div className="relative z-10 w-full">
        {/* 1. HERO SECTION - VIDEO TILE */}
        <section className="relative h-[90vh] md:h-screen w-full flex flex-col justify-center items-center px-6 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay loop muted playsInline
              className="w-full h-full object-cover opacity-40"
            >
              <source src="/background-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            <h1 className="text-6xl md:text-[12rem] font-black tracking-tighter leading-[0.9] text-white uppercase">
              Ascend <br /> <span className="italic">Limitless.</span>
            </h1>
            <p className="text-white/70 text-xl md:text-3xl max-w-2xl mx-auto font-light leading-relaxed">
              Redefining the boundaries of high-altitude exploration through neural pathfinding and cryogenic safety mapping.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
              <button className="bg-primary text-on-primary px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs active:scale-95 transition-all w-full md:w-auto">
                Initialize Route
              </button>
              <button className="border-2 border-white/20 text-white px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/5 active:scale-95 transition-all w-full md:w-auto">
                The Field Archive
              </button>
            </div>
          </div>
        </section>

        {/* 2. STACKING CARDS SECTION (Logic Packets) */}
        <section className="py-32 md:py-44 px-6 bg-slate-900 relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">Intelligence Core</span>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase leading-tight">Unstacking <br />the <span className="italic">Void.</span></h2>
              </div>
              <p className="text-white/40 text-xl leading-relaxed font-body max-w-xl">
                Our interface isn’t just a UI—it’s a data portal. Swipe the core packets to explore the lidar-precise reality of the mountains.
              </p>
            </div>

            {/* STACKING COMPONENT - TOUCH ENABLED */}
            <div
              className="relative h-[500px] flex items-center justify-center touch-none order-1 lg:order-2"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {swipeCards.map((card, index) => {
                const isTop = index === activeCardIndex;
                return (
                  <motion.div
                    key={index}
                    animate={{
                      scale: isTop ? 1 : 0.9,
                      y: isTop ? 0 : index * 12,
                      opacity: isTop ? 1 : 0.2,
                      zIndex: isTop ? 30 : 10
                    }}
                    className="absolute w-full max-w-[350px] h-[480px] bg-slate-800 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl"
                  >
                    <div className="space-y-4">
                      <span className="material-symbols-outlined text-primary text-5xl">{card.icon}</span>
                      <h4 className="text-white text-3xl font-black uppercase tracking-tighter">{card.title}</h4>
                    </div>
                    <p className="text-white/50 text-base leading-relaxed">{card.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. PREMIUM STATS BANNER */}
        <section className="py-24 border-y border-white/5 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { l: 'Max Ascent', v: '8,848m', c: 'text-primary' },
              { l: 'Precision', v: '0.5m', c: 'text-white' },
              { l: 'Latency', v: '0.02s', c: 'text-primary' },
              { l: 'Reliability', v: '99.9%', c: 'text-white' }
            ].map(s => (
              <div key={s.l} className="space-y-2">
                <p className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase">{s.l}</p>
                <p className={`text-4xl md:text-6xl font-black tracking-tighter ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FINAL CTA */}
        <section className="py-32 md:py-64 text-center px-6 relative bg-slate-900">
          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-6xl md:text-[11rem] font-black text-white tracking-tighter leading-[0.8] uppercase">Explore <br /> the <span className="text-primary">Void.</span></h2>
            <p className="text-white/40 text-xl md:text-2xl font-light max-w-xl mx-auto pb-8">The peaks are waiting for a new kind of explorer. Deploy your intent below.</p>
            <button className="bg-white text-black px-16 py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs active:scale-95 transition-all">
              Access Beta Engine
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;