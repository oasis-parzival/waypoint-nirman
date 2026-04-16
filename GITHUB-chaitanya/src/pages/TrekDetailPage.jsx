const TrekDetailPage = () => {
  return (
    <main className="pb-32 pt-20">
      {/* Hero Section */}
      <section className="relative h-[618px] w-full flex items-end">
        <img 
          alt="Karakoram Range Peaks" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYmxZmAGogaEdqi9A6eftbgUQtv6CxkRJFT4s4fQF-hpeGpFp2tZXX7DNLFLxmNHq9nAPHDHFYpQbb8N0hyGt9THFGiSA2Yj1AQ1RFO6rHwE3QiQRBGZPXEOHqRfW6Sn7EDtSlTw8vSLaCL3h4bOZCp5pwRgAin-rO4y4_jgYFvlECITbOv4uUk2zdI75-3rVkvzzC6iukGwv1z6GiLSLzGSTrg8S-5AiQyg_CYv5CYm1buLk0882tFxYOPTAlf8UJ_0bWscQR48Y"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1412] via-[#0f1412]/40 to-transparent"></div>
        <div className="relative z-10 px-6 pb-12 w-full max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.05em]">Expedition Grade</span>
            <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.05em]">Extreme Difficulty</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.03em] mb-4 text-on-background">K2 Base Camp</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-light leading-relaxed">A journey into the throne room of the mountain gods. Traverse the mighty Baltoro Glacier to reach the foot of the world's most savage peak.</p>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Max Altitude", value: "5,150m", icon: "mountain_flag" },
            { label: "Distance", value: "95km", icon: "route" },
            { label: "Duration", value: "14 Days", icon: "calendar_today" },
            { label: "Low Temp", value: "-15°C", icon: "device_thermostat" }
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-low p-6 rounded-[1.5rem] flex flex-col justify-between">
              <span className="material-symbols-outlined text-primary mb-4">{stat.icon}</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-outline mb-1 font-bold">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="sticky top-[72px] z-40 bg-[#0f1412]/80 backdrop-blur-md px-6 border-b border-outline-variant/10">
        <div className="max-w-6xl mx-auto flex gap-8">
          <button className="py-4 border-b-2 border-tertiary text-tertiary text-[10px] font-bold uppercase tracking-widest font-bold">Overview</button>
          <button className="py-4 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-on-surface font-bold">Route Map</button>
          <button className="py-4 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-on-surface font-bold">Gear List</button>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Main Column */}
        <div className="md:col-span-8 space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">The Cartographer’s View</h2>
            <p className="text-on-surface-variant leading-relaxed text-lg mb-6">
              The trek to K2 Base Camp is widely considered one of the world's great expeditions. This isn't just a walk; it's a technical traverse through the heart of the Karakoram. The path leads you from the dusty village of Askole deep into a wilderness of ice and granite.
            </p>
            <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-surface-container relative">
              <img alt="Topo map aesthetic" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGh55WhggT8tSPPy8QhI7oILtMllJzmRmlDCxgSs1tXTFv4h-bYYh09OTghKpZ6HsEuxIb4DpjBdcl66wmzEW6MZhClJfJKOf3aTBj13EJRKv-bDUx0gdCnzcZ-icKN4dFWCU8-FuJtleoY7CGnzNpLgPyc0ShMNQNUlkoYDid_IVk9iLbMn01TNNylGexkQlkh2YLOjlF3MEJEcFADpSQDt3mwXk2dESUrCO2HnunN46AphFhWkXlIRvSbgg1LWTpkdgBAVzjcQQ"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#181d1a]/90 backdrop-blur-xl p-8 rounded-[2rem] text-center border border-outline-variant/20 shadow-2xl">
                  <span className="material-symbols-outlined text-4xl text-tertiary mb-2">map</span>
                  <p className="font-bold tracking-tight text-xl">Interactive Route Active</p>
                  <p className="text-sm text-on-surface-variant">Available for offline exploration</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-8 tracking-tight">Daily Breakdown</h2>
            <div className="space-y-4">
              {[
                { day: "01", title: "Skardu to Jola", desc: "Jeep transit through the rugged Shigar Valley. Dusty trails and the first sight of the Braldu River." },
                { day: "04", title: "Paiju to Khoburtse", desc: "First steps onto the Baltoro Glacier. A landscape dominated by rock and ice towers." }
              ].map((item) => (
                <div key={item.day} className="bg-surface-container-low rounded-[1.5rem] p-6 flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant/10">
                    <span className="text-xl font-bold text-tertiary">{item.day}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                    <p className="text-on-surface-variant text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-8">
          <div className="bg-surface-container p-8 rounded-[2.5rem] border border-outline-variant/10">
            <h3 className="text-[10px] uppercase tracking-widest text-outline mb-6 font-bold">Elevation Profile</h3>
            <div className="h-32 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a0d1bc" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#a0d1bc" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0 40 L0 35 Q15 32 25 30 T50 20 T75 10 T100 5 L100 40 Z" fill="url(#chartGradient)"></path>
                <path d="M0 35 Q15 32 25 30 T50 20 T75 10 T100 5" fill="none" stroke="#a0d1bc" strokeWidth="0.5"></path>
              </svg>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-[10px] font-bold">START: 2,230m</span>
              <span className="text-[10px] font-bold">PEAK: 5,150m</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/5">
            <h3 className="text-[10px] uppercase tracking-widest text-outline mb-6 font-bold">Kit Essentials</h3>
            <ul className="space-y-4">
              {["4-Season Expedition Tent", "-20°C Down Sleeping Bag", "Technical Ice Axe", "Glacier Rated Eyewear"].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 w-full z-50 px-6 py-8 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-end">
          <button className="pointer-events-auto bg-gradient-to-br from-[#ffb693] to-[#ff7525] text-[#351000] px-10 py-5 rounded-full font-bold tracking-tight text-lg shadow-[0_20px_50px_rgba(255,117,37,0.3)] flex items-center gap-3 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">edit_calendar</span>
            Plan this Trek
          </button>
        </div>
      </div>
    </main>
  );
};

export default TrekDetailPage;
