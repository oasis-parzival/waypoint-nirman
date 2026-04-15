import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen selection:bg-primary selection:text-on-primary">
      {/* PERSISTENT HIGH-FIDELITY BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          src="/cinematic_himalayan_summit_onyx_glow_1776257020425.png" 
          className="w-full h-full object-cover scale-110 md:scale-100 opacity-60" 
          alt="Himalayan Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
      </div>

      <div className="relative z-10 w-full">
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 pt-20 text-center">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-white font-label italic">The Alpinist’s Intelligence Engine</span>
              </div>
              <h1 className="text-6xl md:text-[12rem] font-bold tracking-tight leading-[0.9] text-white font-headline">
                Ascend <br/> <span className="bg-gradient-to-r from-primary via-primary-fixed to-tertiary text-transparent bg-clip-text italic text-glow">Limitless.</span>
              </h1>
              <p className="text-white/60 text-xl md:text-3xl max-w-2xl mx-auto font-light leading-relaxed font-body pt-4">
                Redefining the boundaries of high-altitude exploration through neural pathfinding and cryogenic safety mapping.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 pt-12">
              <button className="bg-primary text-on-primary px-16 py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-[0_0_60px_rgba(160,209,188,0.4)] hover:scale-110 active:scale-95 transition-all">
                Initialize Route
              </button>
              <button className="glass-card text-white px-16 py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white/10 active:scale-95 transition-all">
                The Field Archive
              </button>
            </div>
          </div>
        </section>

        {/* STACKING CARDS SECTION */}
        <section className="py-44 px-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">Intelligence Core</span>
                <h2 className="text-5xl md:text-8xl font-bold text-white font-headline leading-tight">Unstacking the <br/><span className="text-primary italic">Future of Earth.</span></h2>
              </div>
              <p className="text-white/40 text-xl leading-relaxed font-body max-w-xl">Our interface isn’t just a UI—it’s a data portal. Hover the core to unstack the layers of our neural mapping engine and explore the lidar-precise reality of the mountains.</p>
              <div className="space-y-6">
                 {['0.5m LiDAR Precision Rendering', 'Neural Route Synthesis v4.2', 'Secure Offline Grid Sync'].map((f) => (
                   <div key={f} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-primary transition-all duration-500"></div>
                      <span className="text-white/40 group-hover:text-white font-bold tracking-widest uppercase text-xs transition-colors font-label">{f}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* STACKING COMPONENT */}
            <div className="relative h-[600px] flex items-center justify-center unstack-on-hover order-1 lg:order-2 card-stack-container">
               {/* Card 1 (Bottom) */}
               <div className="absolute w-[280px] md:w-[380px] h-[480px] glass-card stacked-card rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl origin-bottom z-10">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-primary text-5xl opacity-40">layers</span>
                    <h4 className="text-white text-3xl font-bold font-headline tracking-tighter">01. Topography</h4>
                  </div>
                  <p className="text-white/30 text-base font-body">The base layer of reality. Processed via billion-point LiDAR clouds to render every crevasse and ridge with absolute truth.</p>
               </div>
               {/* Card 2 (Middle) */}
               <div className="absolute w-[280px] md:w-[380px] h-[480px] glass-card stacked-card rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl border-primary/20 bg-primary/5 origin-bottom z-20">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-tertiary text-5xl opacity-40">hub</span>
                    <h4 className="text-white text-3xl font-bold font-headline tracking-tighter">02. Neural Mesh</h4>
                  </div>
                  <p className="text-white/40 text-base font-body">The intelligence layer. Millions of route permutations balanced against 40 years of climate patterns in 20ms of neural compute.</p>
               </div>
               {/* Card 3 (Top) */}
               <div className="absolute w-[280px] md:w-[380px] h-[480px] glass-card stacked-card rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl border-white/20 bg-white/5 origin-bottom z-30">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-white text-5xl opacity-40">bolt</span>
                    <h4 className="text-white text-3xl font-bold font-headline tracking-tighter">03. Logic Packets</h4>
                  </div>
                  <p className="text-white/50 text-base font-body">The execution layer. Deployed as encrypted cryptographic route profiles for zero-bandwidth terrain navigation and real-time safe-camps.</p>
               </div>
            </div>
          </div>
        </section>

        {/* PREMIUM STATS BANNER */}
        <section className="py-24 border-y border-white/10 bg-black/40 backdrop-blur-xl">
           <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { l: 'Max Ascent', v: '8,848m', c: 'text-primary' },
                { l: 'Precision', v: '0.5m', c: 'text-white' },
                { l: 'Latency', v: '0.02s', c: 'text-tertiary' },
                { l: 'Reliability', v: '99.9%', c: 'text-white' }
              ].map(s => (
                <div key={s.l} className="space-y-2 group">
                   <p className="text-[10px] font-bold text-white/20 tracking-[0.4em] uppercase group-hover:text-primary transition-colors font-label">{s.l}</p>
                   <p className={`text-4xl md:text-6xl font-black font-headline tracking-tighter ${s.c}`}>{s.v}</p>
                </div>
              ))}
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-64 text-center px-4 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/10 blur-[180px] rounded-full pointer-events-none"></div>
           <div className="max-w-4xl mx-auto space-y-12 relative z-10 transition-transform duration-1000">
              <h2 className="text-6xl md:text-[11rem] font-black text-white tracking-tighter leading-[0.8] font-headline uppercase">Explore <br/> the <span className="text-primary text-glow">Void.</span></h2>
              <p className="text-white/40 text-xl md:text-2xl font-light font-body max-w-xl mx-auto pb-8">The peaks are waiting for a new kind of explorer. Deploy your intent below.</p>
              <button className="bg-white text-black px-16 md:px-24 py-6 md:py-8 rounded-full font-black uppercase tracking-[0.4em] text-[10px] md:text-xs hover:scale-110 hover:shadow-[0_0_80px_rgba(255,255,255,0.25)] active:scale-95 transition-all">
                Access Beta Engine
              </button>
           </div>
        </section>

        {/* FOOTER PADDING FOR MOBILE */}
        <div className="h-44 md:hidden"></div>
      </div>
    </div>
  );
};

export default LandingPage;
