import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { supabase } from '../lib/supabase';
import TrekIntelligenceCard from '../components/discovery/TrekIntelligenceCard';

const wikiImageCache = new Map();

const manualImageOverrides = new Map([
  ['hampta pass', 'https://banzaras.in/wp-content/uploads/2025/06/WhatsApp-Image-2025-06-24-at-13.38.04.jpeg'],
  ['ambolgad fort', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeWLCwoO1Y5r7hLqU2oSb2L9SE85BO44bl_w&s'],
  ['asava fort', 'https://d3sftlgbtusmnv.cloudfront.net/blog/wp-content/uploads/2024/10/Asava-Fort-Cover-Photo-840x425.jpg'],
  ['ballarpur fort', 'https://redearth.in/blog/wp-content/uploads/2022/03/Ballarpur-Fort-Pallavi-Jayaraman-1-1024x635.jpg'],
  ['bhamer', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgfxaB8GeJfJARxZm5YFlleHYj8EVJYSTX2w&s'],
  ['nag tibba', 'https://imgcld.yatra.com/ytimages/image/upload/v1517481327/AdvNation/ANN_TRP171/BloomingRhododendronForest_1432206825_NQvgOC.jpg'],
  ['beas kund', 'https://himtrek.co.in/wp-content/uploads/2025/07/Premium-Beas-Kund-Trek.webp'],
  ['deo tibba base camp', 'https://brozaadventures.com/soft/file_store/detaild_itenary/1952889226CJ.jpg'],
  ['brahmatal', 'https://storage.googleapis.com/stateless-www-justwravel-com/2019/06/Brahmataal-JustWravel-4-1024x682.jpg'],
  ['buran ghati', 'https://i.ytimg.com/vi/6ZmQQAsBTrY/maxresdefault.jpg'],
  ['green lake trek', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrve4i3W1JdO8GfVUrh6OVNnWvxjtQRoQnTg&s'],
  ['phalut trek', 'https://cdn.prod.website-files.com/66e19a4069802b9bae69e911/6710e16c5b15ece70c1101aa_trek-blog-7.jpg'],
  ['talley valley trek', 'https://www.bikatadventures.com/images/Expeditions/IMG980x500/img-talle-valley-trek-arunachal-pradesh-Bikat-Adventures.png']
]);

const normalizeTitle = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const getFallbackImageUrl = (trek, { width = 1200, height = 800 } = {}) => {
  const regionKeywords = (() => {
    switch (trek?.region) {
      case 'Sahyadri': return ['Maharashtra', 'fort'];
      case 'North East': return ['Northeast India', 'mountains', 'trek'];
      default: return ['Himalayas', 'mountains', 'trek'];
    }
  })();
  const parts = [trek?.Trek_Name, trek?.District, ...regionKeywords, 'landscape']
    .filter(Boolean).map(s => String(s).trim()).filter(Boolean);
  const query = parts.map(encodeURIComponent).join(',');
  return `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=${width}`;
};

const buildWikiTitleCandidates = (trek) => {
  const trekName = normalizeTitle(trek?.Trek_Name);
  const district = normalizeTitle(trek?.District);
  if (!trekName) return [];
  const candidates = [trekName];
  if (district) {
    candidates.push(`${trekName}, ${district}`);
    candidates.push(`${trekName} (${district})`);
  }
  if (trek?.region === 'Sahyadri') {
    if (!/\bfort\b/i.test(trekName)) candidates.push(`${trekName} Fort`);
    candidates.push(`${trekName} (fort)`);
  }
  return Array.from(new Set(candidates));
};

const fetchWikiImageUrl = async (title, signal) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.originalimage?.source || data?.thumbnail?.source || null;
};

const fetchWikiPageImageUrl = async (title, signal, width) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=${width}&format=json&origin=*&titles=${encodeURIComponent(title)}`;
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const data = await response.json();
  const pages = data?.query?.pages;
  const firstPage = pages ? Object.values(pages)[0] : null;
  return firstPage?.thumbnail?.source || null;
};

const fetchWikiSearchTopTitle = async (search, signal) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&origin=*&srsearch=${encodeURIComponent(search)}`;
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.query?.search?.[0]?.title || null;
};

const fetchCommonsImageUrl = async (search, signal, width) => {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=1&gsrsearch=${encodeURIComponent(search)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json&origin=*`;
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const data = await response.json();
  const pages = data?.query?.pages;
  const firstPage = pages ? Object.values(pages)[0] : null;
  const info = firstPage?.imageinfo?.[0];
  return info?.thumburl || info?.url || null;
};

const resolveTrekImageUrl = async (trek, signal, width) => {
  const candidates = buildWikiTitleCandidates(trek);
  for (const title of candidates) {
    const img = await fetchWikiImageUrl(title, signal);
    if (img) return img;
    const pageImg = await fetchWikiPageImageUrl(title, signal, width);
    if (pageImg) return pageImg;
  }
  const trekName = normalizeTitle(trek?.Trek_Name);
  const district = normalizeTitle(trek?.District);
  const hint = trek?.region === 'Sahyadri' ? 'fort' : 'trek';
  const searchQuery = [trekName, district, hint, 'India'].filter(Boolean).join(' ');
  const bestTitle = await fetchWikiSearchTopTitle(searchQuery, signal);
  if (bestTitle) {
    const img = await fetchWikiImageUrl(bestTitle, signal);
    if (img) return img;
    const pageImg = await fetchWikiPageImageUrl(bestTitle, signal, width);
    if (pageImg) return pageImg;
  }
  const commonsImg = await fetchCommonsImageUrl(searchQuery, signal, width);
  if (commonsImg) return commonsImg;
  return null;
};

const DiscoverPage = () => {
  const [allTreks, setAllTreks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [selectedTrekImageSrc, setSelectedTrekImageSrc] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const navigate = useNavigate();

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const names = allTreks
      .filter((t) => activeRegion === 'All' || t.region === activeRegion)
      .map((t) => t.Trek_Name)
      .filter(Boolean);

    const unique = Array.from(new Set(names));

    return unique
      .filter((name) => {
        const n = String(name).toLowerCase();
        return n.startsWith(q) || n.split(/\s+/).some((w) => w.startsWith(q));
      })
      .sort((a, b) => String(a).localeCompare(String(b)))
      .slice(0, 8);
  }, [allTreks, activeRegion, searchQuery]);

  useEffect(() => {
    setActiveSuggestionIndex(searchSuggestions.length ? 0 : -1);
  }, [searchSuggestions]);

  const applySuggestion = (name) => {
    setSearchQuery(name);
    setIsSearchFocused(false);
    setActiveSuggestionIndex(-1);
  };

  useEffect(() => {
    if (!selectedTrek) {
      setSelectedTrekImageSrc(null);
      return;
    }

    const cacheKey = normalizeTitle(selectedTrek.Trek_Name).toLowerCase();
    const manualOverride = manualImageOverrides.get(cacheKey);

    if (manualOverride) {
      setSelectedTrekImageSrc(manualOverride);
      return;
    }

    if (wikiImageCache.has(cacheKey)) {
      const cached = wikiImageCache.get(cacheKey);
      setSelectedTrekImageSrc(cached || getFallbackImageUrl(selectedTrek));
      return;
    }

    // High-fidelity resolution sequence
    const controller = new AbortController();
    resolveTrekImageUrl(selectedTrek, controller.signal, 1200)
      .then((url) => {
        wikiImageCache.set(cacheKey, url);
        if (url) setSelectedTrekImageSrc(url);
        else setSelectedTrekImageSrc(getFallbackImageUrl(selectedTrek));
      })
      .catch(() => {});

    return () => controller.abort();
  }, [selectedTrek]);

  const handleInitializePlan = () => {
    if (!selectedTrek) return;
    
    // Smoothly transition to the generator with pre-filled vectors
    navigate('/plan', { 
      state: { 
        trekName: selectedTrek.Trek_Name,
        location: selectedTrek.District,
        difficulty: selectedTrek.Difficulty || 'Moderate',
        duration: selectedTrek.Days || '2'
      } 
    });
  };

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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label font-headline italic">Expedition Matrix</span>
              <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase font-headline">The <span className="text-primary italic">Nexus.</span></h1>
              <p className="text-white/40 text-lg md:text-2xl font-light font-body max-w-xl">Unified catalog of global route intelligence and tactical terrain data.</p>
            </div>
            <div className="relative group w-full md:w-96">
              <div className={`relative flex items-center bg-white/5 backdrop-blur-3xl rounded-full border transition-all duration-500 overflow-hidden ${isSearchFocused ? 'border-primary ring-4 ring-primary/10' : 'border-white/10 group-hover:border-white/20'}`}>
                <span className={`material-symbols-outlined ml-6 transition-colors ${isSearchFocused ? 'text-primary' : 'text-white/20'}`}>search</span>
                <input 
                  type="text"
                  placeholder="Query expeditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                      applySuggestion(searchSuggestions[activeSuggestionIndex]);
                    } else if (e.key === 'ArrowDown') {
                      setActiveSuggestionIndex(prev => Math.min(prev + 1, searchSuggestions.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      setActiveSuggestionIndex(prev => Math.max(prev - 1, 0));
                    }
                  }}
                  className="w-full bg-transparent px-4 py-6 text-white text-sm outline-none placeholder:text-white/10 font-label tracking-widest font-bold"
                />
              </div>

              {/* SEARCH SUGGESTIONS DROP-DOWN */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-surface-container-low/95 backdrop-blur-2xl border border-white/5 rounded-[2rem] overflow-hidden z-50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-3">
                    {searchSuggestions.map((name, i) => (
                      <button
                        key={name}
                        onClick={() => applySuggestion(name)}
                        className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${i === activeSuggestionIndex ? 'bg-primary text-black' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                      >
                         {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  <img 
                    src={selectedTrekImageSrc || `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200`}
                    className="w-full h-full object-cover"
                    alt={selectedTrek.Trek_Name}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200";
                    }}
                  />
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
                    <button 
                      onClick={handleInitializePlan}
                      className="w-full md:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] md:text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
                    >
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
