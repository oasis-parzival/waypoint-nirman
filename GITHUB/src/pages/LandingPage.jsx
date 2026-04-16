import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isUnstacked, setIsUnstacked] = useState(false);
  const { scrollYProgress } = useScroll();

  // TRACKER LOGIC
  const trekkerY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const pathHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

  return (
    <div className="relative min-h-screen bg-black selection:bg-primary selection:text-on-primary overflow-x-hidden">
      
      {/* MAP PROGRESSION TRACKER (Fixed Right) - Hidden on Mobile */}
      <div className="fixed right-6 md:right-12 top-1/4 bottom-1/4 w-1 z-[100] hidden md:flex flex-col items-center">
        <div className="relative h-full w-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div className="absolute top-0 w-full bg-primary" style={{ height: pathHeight }} />
        </div>
        <motion.div className="absolute z-[101] -translate-x-1/2 left-1/2" style={{ top: trekkerY }}>
          <span className="material-symbols-outlined text-primary text-2xl md:text-3xl drop-shadow-[0_0_15px_rgba(160,209,188,0.8)]">directions_walk</span>
        </motion.div>
      </div>

      <div className="relative z-10 w-full">
        {/* HERO SECTION */}
        <section className="relative h-screen w-full flex flex-col justify-start md:justify-center items-center px-4 md:px-6 pt-32 md:pt-0 text-center overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 md:opacity-30">
              <source src="/background-video.mp4" type="video/mp4" />
            </video>
            <img src="/logo.png" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] md:w-[120%] opacity-5 mix-blend-screen scale-110 md:scale-125 select-none" alt="" />
            <img src="/cinematic_himalayan_summit_onyx_glow_1776257020425.png" className="absolute inset-0 w-full h-full object-cover opacity-15 md:opacity-20 mix-blend-screen" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
          </div>

          <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 relative z-10">
            <div className="space-y-4 md:space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 font-label">Neural Expedition Protocol v4.0</span>
              </motion.div>
              <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.95] text-white font-headline uppercase">
                Ascend <br/> <span className="bg-gradient-to-r from-primary via-primary-fixed to-tertiary text-transparent bg-clip-text italic text-glow">Limitless.</span>
              </h1>
              <p className="text-white/60 text-lg md:text-2xl max-w-xl mx-auto font-light leading-relaxed font-body">
                Redefining high-altitude exploration through neural pathfinding and cryogenic safety mapping.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 pt-12 md:pt-16 relative z-20">
              <Link to="/plan" className="bg-primary text-on-primary px-10 md:px-16 py-4 md:py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-[0_0_40px_rgba(160,209,188,0.2)] hover:scale-105 hover:bg-white transition-all text-center">
                Initialize Route
              </Link>
              <button className="border border-white/20 text-white px-10 md:px-16 py-4 md:py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/5 transition-all">
                The Field Archive
              </button>
            </div>
          </div>
        </section>

        {/* STACKING CARDS SECTION */}
        <section className="py-20 md:py-32 px-6 bg-black relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-3 md:space-y-4 text-center lg:text-left">
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Intelligence Core</span>
                <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-tight font-headline">Unstacking <br className="hidden md:block" />the <span className="italic text-primary">Void.</span></h2>
              </div>
              <p className="text-white/40 text-lg md:text-2xl leading-relaxed font-body max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                Our interface is a live data portal. Tap the core packets to explore the lidar-precise reality of the mountain terrain.
              </p>
            </div>

            <motion.div 
              className="relative min-h-[500px] md:h-[600px] flex items-center justify-center cursor-pointer perspective-[1500px] py-20"
              initial="stacked"
              animate={isUnstacked ? "unstacked" : "stacked"}
              whileHover={window.innerWidth >= 768 ? "unstacked" : ""}
              onClick={() => setIsUnstacked(!isUnstacked)}
            >
              {swipeCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={{
                    stacked: {
                      x: 0,
                      y: index * 15,
                      rotate: 0,
                      rotateY: 0,
                      scale: 1 - index * 0.05,
                      zIndex: (swipeCards.length - index) * 10,
                    },
                    unstacked: {
                      x: window.innerWidth < 768 ? 0 : (index - 1) * 380,
                      y: window.innerWidth < 768 ? (index - 1) * 400 : (index - 1) * -20,
                      rotate: window.innerWidth < 768 ? 0 : (index - 1) * 8,
                      rotateY: window.innerWidth < 768 ? 5 : 10,
                      scale: window.innerWidth < 768 ? 1 : 0.9,
                      zIndex: 50,
                    }
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 150, 
                    damping: 20,
                    delay: isUnstacked ? index * 0.1 : 0 
                  }}
                  className={`absolute w-full max-w-[280px] md:max-w-[340px] h-[380px] md:h-[460px] ${
                    index === 0 ? 'bg-indigo-950/40' : index === 1 ? 'bg-primary/10' : 'bg-white/5'
                  } border border-white/20 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl ring-1 ring-white/10`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="space-y-4 md:space-y-6" style={{ transform: "translateZ(50px)" }}>
                    <div className="flex justify-between items-start">
                      <span className="material-symbols-outlined text-primary text-4xl md:text-5xl">{card.icon}</span>
                      <span className="text-[10px] text-white/20 font-mono">SECURE_PACKET_0{index + 1}</span>
                    </div>
                    <h4 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-tight font-headline">{card.title}</h4>
                  </div>
                  
                  <div className="space-y-4" style={{ transform: "translateZ(30px)" }}>
                     <div className="h-[2px] w-8 bg-primary/40 mb-4"></div>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed font-body italic">
                      {card.desc}
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full bg-primary/20"></div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* PREMIUM STATS BANNER */}
        <section className="py-16 md:py-20 border-y border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { l: 'Max Ascent', v: '8,848m', c: 'text-primary' },
              { l: 'Precision', v: '0.5m', c: 'text-white' },
              { l: 'Latency', v: '0.02s', c: 'text-primary' },
              { l: 'Reliability', v: '99.9%', c: 'text-white' }
            ].map(s => (
              <div key={s.l} className="space-y-1">
                <p className="text-[9px] font-bold text-white/20 tracking-[0.3em] uppercase font-label">{s.l}</p>
                <p className={`text-3xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase italic font-headline ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 md:py-40 text-center px-6 relative bg-black overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-[60%] bg-primary/10 blur-[120px] md:blur-[180px] rounded-full"></div>
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 relative z-10">
            <div className="flex justify-center mb-0 md:mb-4">
               <img src="/logo.png" alt="" className="w-12 h-12 md:w-20 md:h-20 opacity-60" />
            </div>
            <h2 className="text-5xl md:text-9xl lg:text-[10rem] font-bold text-white tracking-tighter leading-[0.85] uppercase font-headline">Explore <br /> the <span className="text-primary text-glow">Void.</span></h2>
            <p className="text-white/40 text-lg md:text-2xl font-light max-w-lg mx-auto font-body">The peaks are waiting for a new kind of explorer. Deploy your intent below.</p>
            <Link to="/plan" className="bg-white text-black px-12 md:px-20 py-4 md:py-6 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl inline-block mt-4">
              Access Beta Engine
            </Link>
          </div>
        </section>
        
        <div className="h-16 md:hidden"></div>
      </div>
    </div>
  );
};

export default LandingPage;
