import React, { useState, useEffect } from 'react';
import TrekIntelligenceCard from '../components/discovery/TrekIntelligenceCard';

const DiscoverPage = () => {
  const [allTreks, setAllTreks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrek, setSelectedTrek] = useState(null);

  useEffect(() => {
    const loadAllTreks = async () => {
      try {
        const sources = [
          { name: 'Sahyadri', file: '/trek_details_sahyadri.csv' },
          { name: 'North India', file: '/trek_details_north.csv' },
          { name: 'North East', file: '/trek_details_north_east.csv' }
        ];

        const allResults = await Promise.all(sources.map(async (source) => {
          const response = await fetch(source.file);
          const csvText = await response.text();
          const lines = csvText.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          return lines.slice(1).map(line => {
            // Robust CSV split that respects quotes and handles unquoted spaces
            const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (!parts || parts.length < headers.length) return null;
            
            const obj = { region: source.name };
            headers.forEach((header, i) => {
              let val = parts[i] || '';
              // Remove surrounding quotes and trim
              val = val.replace(/^"|"$/g, '').trim();
              if (header) obj[header] = val;
            });
            return obj;
          }).filter(item => item && item.Trek_Name && item.Trek_Name.toLowerCase() !== 'trek_name');
        }));

        setAllTreks(allResults.flat());
      } catch (err) {
        console.error("Multi-region data synchronization failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllTreks();
  }, []);

  const filteredTreks = allTreks.filter(t => {
    const matchesSearch = 
      t.Trek_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.District?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.Difficulty?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = activeRegion === 'All' || t.region === activeRegion;
    
    return matchesSearch && matchesRegion;
  });

  const regions = ['All', 'Sahyadri', 'North India', 'North East'];

  return (
    <div className="relative min-h-screen selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* PERSISTENT BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/cinematic_himalayan_summit_onyx_glow_1776257020425.png" 
          className="w-full h-full object-cover opacity-20 grayscale blur-[3px] scale-105" 
          alt="Nexus Backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"></div>
      </div>

      <main className="relative z-10 pt-32 pb-44 px-4 md:px-6 max-w-7xl mx-auto space-y-16">
        {/* Search & Filter Header */}
        <section className="space-y-12">
          <div className="space-y-4">
             <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Expedition Matrix</span>
             <h1 className="text-5xl md:text-8xl font-bold text-white font-headline leading-[0.9] tracking-tighter uppercase italic">
               Discover <br/> <span className="text-primary">Intelligence.</span>
             </h1>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
              <div className="flex-grow flex items-center gap-4 px-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-3xl focus-within:border-primary/40 transition-all">
                <span className="material-symbols-outlined text-white/20">search</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/10 font-body text-sm" 
                  placeholder="Global query: Trek name, district, or difficulty..." 
                />
              </div>
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap gap-3">
               {regions.map(region => (
                 <button
                   key={region}
                   onClick={() => setActiveRegion(region)}
                   className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeRegion === region 
                     ? 'bg-primary text-black scale-105 shadow-[0_10px_30px_rgba(34,211,238,0.3)]' 
                     : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white'
                   }`}
                 >
                   {region}
                 </button>
               ))}
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="space-y-12">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
             <h3 className="text-xl font-bold text-white font-headline uppercase italic tracking-widest">
               {activeRegion === 'All' ? 'Global Catalog' : `${activeRegion} Vectors`}
             </h3>
             <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] font-label">{filteredTreks.length} Identifiers Synchronized</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="aspect-[16/20] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5"></div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTreks.slice(0, 36).map((trek, idx) => (
                <TrekIntelligenceCard 
                  key={trek.Trek_Name + idx} 
                  trek={trek} 
                  onDetailClick={(t) => setSelectedTrek(t)}
                />
              ))}
              {filteredTreks.length === 0 && (
                <div className="col-span-full py-32 text-center space-y-4 opacity-20">
                   <span className="material-symbols-outlined text-8xl">search_off</span>
                   <p className="font-headline text-2xl uppercase italic">No Intel Found</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* DETAIL MODAL */}
      {selectedTrek && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
           <div 
             className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
             onClick={() => setSelectedTrek(null)}
           ></div>
           
           <div className="relative w-full max-w-4xl h-[92vh] md:h-auto md:max-h-[90vh] bg-surface-container-low border-t md:border border-white/10 rounded-t-[3rem] md:rounded-[3rem] shadow-[0_-20px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 md:zoom-in">
               {/* Modal Image Header */}
               <div className="relative h-48 md:h-96 w-full flex-shrink-0">
                  {(() => {
                    const maharashtraPhotoIds = [
                      '1626621427131-cc2d8549927d',
                      '1620662512398-94537122e196',
                      '1596422846543-75c6fc197f07',
                      '1589782182703-2aad69c6a23d',
                      '1510253687831-0f581a8ad5f5',
                      '1599427303058-f1737e415fb2',
                      '1605649495447-fd4e34e9e04f',
                      '1603566162896-bc44a821e285',
                      '1621252391054-06f1523450e1',
                      '1609137144813-94c6799059f3'
                    ];
                    const seed = selectedTrek.Trek_Name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
                    const photoId = maharashtraPhotoIds[seed % maharashtraPhotoIds.length];
                    const imageUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1200`;

                    return (
                      <img 
                        src={imageUrl}
                        className="w-full h-full object-cover"
                        alt={selectedTrek.Trek_Name}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200";
                        }}
                      />
                    );
                  })()}
                 <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/40 to-transparent"></div>
                 <button 
                   onClick={() => setSelectedTrek(null)}
                   className="absolute top-6 right-6 w-10 h-10 md:w-12 md:h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-black/80 transition-all z-10"
                 >
                    <span className="material-symbols-outlined text-xl">close</span>
                 </button>
                 
                 <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 space-y-1 md:space-y-2">
                    <span className="text-primary font-bold text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-label">Vector Analysis</span>
                    <h2 className="text-3xl md:text-6xl font-bold text-white font-headline tracking-tighter uppercase italic line-clamp-2">{selectedTrek.Trek_Name}</h2>
                 </div>
              </div>

              {/* Modal Content */}
              <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-8 md:space-y-12 hide-scrollbar">
                 {/* Metrics Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 space-y-1">
                       <span className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-widest font-label font-bold">Altitude</span>
                       <p className="text-lg md:text-xl font-bold text-white tracking-tight">{selectedTrek.Height_m}M</p>
                    </div>
                    <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 space-y-1">
                       <span className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-widest font-label font-bold">District</span>
                       <p className="text-lg md:text-xl font-bold text-primary tracking-tight">{selectedTrek.District}</p>
                    </div>
                    <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 space-y-1">
                       <span className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-widest font-label font-bold">Difficulty</span>
                       <p className="text-lg md:text-xl font-bold text-white tracking-tight">{selectedTrek.Difficulty}</p>
                    </div>
                    <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 space-y-1">
                       <span className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-widest font-label font-bold">Window</span>
                       <p className="text-lg md:text-xl font-bold text-white tracking-tight">{selectedTrek.Best_Season}</p>
                    </div>
                 </div>

                 {/* History & Desc */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-3 md:space-y-4">
                       <h4 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-[0.2em] font-label">Historical Nexus</h4>
                       <p className="text-base md:text-lg leading-relaxed text-white/80 font-body">{selectedTrek.Historical_Significance}</p>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                       <h4 className="text-[10px] md:text-sm font-bold text-white/30 uppercase tracking-[0.2em] font-label">Topographical Brief</h4>
                       <p className="text-[15px] md:text-base leading-relaxed text-white/50 font-body">{selectedTrek.Description}</p>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-6 items-center justify-between font-label pb-24 md:pb-0">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[9px] md:text-[10px] font-bold text-white/20 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">schedule</span> Best Time: {selectedTrek.Best_Season}</span>
                       <span className="hidden md:block w-1 h-1 bg-white/20 rounded-full"></span>
                       <span className="flex items-center gap-2 font-bold text-primary">Status: Accessible</span>
                    </div>
                    <button className="w-full md:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] md:text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)]">
                       Initialize Route Plan
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MOBILE NAV SPACER */}
      <div className="h-32 md:hidden"></div>
    </div>
  );
};

export default DiscoverPage;
