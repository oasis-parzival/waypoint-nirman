import React, { useState, useEffect } from 'react';

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

const getFallbackImageUrl = (trek, { width = 800, height = 600 } = {}) => {
  const regionKeywords = (() => {
    switch (trek?.region) {
      case 'Sahyadri': return ['Maharashtra', 'fort'];
      case 'North East': return ['Northeast India', 'mountains', 'trek'];
      default: return ['Himalayas', 'mountains', 'trek'];
    }
  })();
  const parts = [trek?.Trek_Name, trek?.District, ...regionKeywords, 'landscape']
    .filter(Boolean).map(s => String(s).trim()).filter(Boolean);
  const query = encodeURIComponent(parts.join(','));
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

const fetchWikiSearchTopTitle = async (search, signal) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&origin=*&srsearch=${encodeURIComponent(search)}`;
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.query?.search?.[0]?.title || null;
};

const resolveTrekImageUrl = async (trek, signal) => {
  const candidates = buildWikiTitleCandidates(trek);
  for (const title of candidates) {
    const img = await fetchWikiImageUrl(title, signal);
    if (img) return img;
  }
  const searchQuery = [normalizeTitle(trek?.Trek_Name), normalizeTitle(trek?.District), trek?.region === 'Sahyadri' ? 'fort' : 'trek', 'India'].filter(Boolean).join(' ');
  const bestTitle = await fetchWikiSearchTopTitle(searchQuery, signal);
  if (bestTitle) {
    const img = await fetchWikiImageUrl(bestTitle, signal);
    if (img) return img;
  }
  return null;
};

const TrekIntelligenceCard = ({ trek, onDetailClick }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => getFallbackImageUrl(trek));

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
  const GROQ_MODEL = 'llama-3.1-8b-instant';

  useEffect(() => {
    const cacheKey = normalizeTitle(trek.Trek_Name).toLowerCase();
    const manualOverride = manualImageOverrides.get(cacheKey);

    if (manualOverride) {
      setImageSrc(manualOverride);
      return;
    }

    if (wikiImageCache.has(cacheKey)) {
      setImageSrc(wikiImageCache.get(cacheKey));
      return;
    }

    const controller = new AbortController();
    resolveTrekImageUrl(trek, controller.signal).then(url => {
      if (url) {
        wikiImageCache.set(cacheKey, url);
        setImageSrc(url);
      }
    });

    return () => controller.abort();
  }, [trek.Trek_Name]);

  const askIntelligence = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!query) return;

    setIsThinking(true);
    setAnswer('');

    // Comprehensive RAG Context
    const context = Object.entries(trek)
      .map(([key, val]) => `${key}: ${val}`)
      .join('\n');

    const prompt = `You are the Waypoint AI Intelligence System. 
    Using the provided context, answer the user's question about this specific trek. 
    Be concise, technical, and high-fidelity. 
    
    [CONTEXT]
    ${context}
    
    [QUESTION]
    ${query}`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          max_tokens: 250
        })
      });

      const data = await response.json();
      setAnswer(data.choices[0].message.content);
    } catch (err) {
      setAnswer("Intelligence nexus failed to synchronize.");
    } finally {
      setIsThinking(false);
    }
  };

  // High-fidelity trek & mountain images from Unsplash
  const trekImages = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1626621427131-cc2d8549927d",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1511497584788-876760111969",
    "https://images.unsplash.com/photo-1433086561291-728f4b6a9391"
  ];

  const seed = trek.Trek_Name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  const imageUrl = `${trekImages[seed % trekImages.length]}?auto=format&fit=crop&q=80&w=800`;

  return (
    <div 
      onClick={() => onDetailClick(trek)}
      className="group relative bg-surface-container-low rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={imageSrc}
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800`;
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
          alt={trek.Trek_Name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent"></div>
        <div className="absolute top-6 left-6 flex gap-2">
           <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-primary uppercase tracking-widest font-label">
             {trek.Difficulty}
           </span>
        </div>
      </div>

      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <h3 className="text-2xl font-bold font-headline tracking-tighter text-white group-hover:text-primary transition-colors">{trek.Trek_Name}</h3>
             <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] font-label">
               {trek.District}{trek.region === 'Sahyadri' ? ', Maharashtra' : `, ${trek.region}`}
             </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsAsking(!isAsking);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAsking ? 'bg-primary text-black scale-90' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            <span className="material-symbols-outlined text-xl">{isAsking ? 'close' : 'robot_2'}</span>
          </button>
        </div>

        <div className={`transition-all duration-500 overflow-hidden ${isAsking ? 'max-h-80 opacity-100 mt-2 pt-4' : 'max-h-0 opacity-0'}`}>
           <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5">
             {!answer && !isThinking ? (
               <form onSubmit={askIntelligence} className="relative">
                  <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Query Trek Nexus..."
                    className="w-full bg-transparent border-none text-white text-[11px] outline-none placeholder:text-white/10 font-body"
                  />
                  <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
                     <span className="material-symbols-outlined text-sm">send</span>
                  </button>
               </form>
             ) : (
               <div className="space-y-3">
                  <div className="flex items-start gap-2">
                     <span className="material-symbols-outlined text-primary text-xs mt-0.5">auto_awesome</span>
                     <div className="flex-grow">
                        {isThinking ? (
                          <div className="h-4 flex items-center gap-1">
                             <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse"></div>
                             <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          </div>
                        ) : (
                          <p className="text-[11px] leading-relaxed text-white/70 font-body">{answer}</p>
                        )}
                     </div>
                  </div>
                  {!isThinking && (
                    <button onClick={(e) => {e.stopPropagation(); setAnswer(''); setQuery('');}} className="text-[8px] font-bold text-white/20 uppercase tracking-widest hover:text-primary">Clear</button>
                  )}
               </div>
             )}
           </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
           <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] font-label">Best: {trek.Best_Season}</span>
           <div className="flex items-center gap-2 text-white/40">
              <span className="text-[9px] font-bold uppercase tracking-widest font-label group-hover:text-primary transition-colors">Tactical View</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrekIntelligenceCard;
