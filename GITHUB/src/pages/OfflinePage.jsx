import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Helper to center map on new gpx path
const MapResizer = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const OfflinePage = () => {
  const [gpxPath, setGpxPath] = useState([]);
  const [activeTrek, setActiveTrek] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlText = event.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const trackPoints = xmlDoc.getElementsByTagName("trkpt");
      const points = [];
      for (let i = 0; i < trackPoints.length; i++) {
        const lat = parseFloat(trackPoints[i].getAttribute("lat"));
        const lon = parseFloat(trackPoints[i].getAttribute("lon"));
        if (!isNaN(lat) && !isNaN(lon)) points.push([lat, lon]);
      }
      if (points.length > 0) {
        setGpxPath(points);
        setActiveTrek({ id: 'upload', name: file.name.replace('.gpx', ''), district: 'Uploaded Track', points });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-body selection:bg-primary selection:text-black">
      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.15]" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* TOP GAP FOR NAVBAR CLEARANCE */}
      <div className="h-40 md:h-52 w-full flex-shrink-0" id="nav-spacer" />

      <main className="flex-grow flex flex-col items-center px-6 pb-32 relative z-10 w-full max-w-6xl mx-auto">
        
        {/* CENTERED HEADER */}
        <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
           <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-6 mt-12">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Satellite Link Established</span>
           </div>
           <div className="flex items-center gap-6 justify-center">
              <img src="/logo.png" alt="Deploy Logo" className="w-12 h-12 md:w-20 md:h-20" />
              <h1 className="text-4xl md:text-8xl font-black text-white font-headline tracking-tighter uppercase italic leading-none">
                Offline <span className="text-primary italic">Tactical</span> Grids
              </h1>
           </div>
           <p className="text-[10px] md:text-sm text-white/40 font-bold uppercase tracking-[0.6em] max-w-xl mx-auto">
             Military-Grade GPX Visualizer & Path Intelligence
           </p>
        </div>

        {!activeTrek ? (
           /* REVAMPED DEPLOYMENT ZONE */
           <div 
             onClick={() => fileInputRef.current.click()}
             className="w-full relative group cursor-pointer"
           >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[3.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass-card aspect-square md:aspect-[21/9] rounded-[3rem] border border-white/5 bg-black/40 flex flex-col items-center justify-center p-12 overflow-hidden">
                 
                 {/* Decorative radar lines */}
                 <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full scale-[1.5] animate-[spin_20s_linear_infinite]" />
                 <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full scale-[1.2] animate-[spin_15s_linear_infinite_reverse]" />
                 
                 <div className="relative z-10 flex flex-col items-center gap-10">
                    <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-700 shadow-2xl">
                      <span className="material-symbols-outlined text-7xl text-white/10 group-hover:text-primary transition-colors duration-500">radar</span>
                    </div>
                    
                    <div className="space-y-4 text-center">
                       <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-widest">Initialize Vector Command</h2>
                       <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.4em] font-label max-w-xs mx-auto leading-relaxed">
                         Drop GPX file to decode topographical path vectors and initialize tactical radar
                       </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                       <button className="bg-primary text-black font-black uppercase tracking-widest px-12 py-5 rounded-full text-[11px] hover:scale-105 transition-all shadow-[0_0_60px_rgba(0,255,163,0.4)]">
                         Deploy Tactical File
                       </button>
                       <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.5em]">Supported: .GPX / XML</span>
                    </div>
                 </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".gpx" className="hidden" />
           </div>
        ) : (
           /* REVAMPED FOCUS VIEW */
           <div className="w-full space-y-8 animate-in zoom-in-95 duration-700">
              <div className="h-[550px] md:h-[650px] w-full glass-card rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl">
                <MapContainer 
                  center={gpxPath[0] || [18, 73]} 
                  zoom={14} 
                  style={{ height: '100%', width: '100%', background: '#050505' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                  <Polyline 
                    pathOptions={{ color: '#00FFA3', weight: 6, opacity: 1, dashArray: '15, 15' }} 
                    positions={gpxPath} 
                  />
                  <MapResizer bounds={gpxPath} />
                </MapContainer>

                {/* HUD OVERLAY */}
                <div className="absolute top-8 left-8 z-[1000] p-10 glass-card rounded-[2.5rem] border border-white/10 min-w-[320px] bg-black/60 space-y-6">
                   <div className="space-y-1">
                      <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em] font-label">{activeTrek.district}</span>
                      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{activeTrek.name}</h2>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block">Nodes</span>
                        <span className="text-sm font-bold text-white uppercase tabular-nums">{gpxPath.length.toLocaleString()} pts</span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block">Signal</span>
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Encrypted</span>
                      </div>
                   </div>

                   <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => setActiveTrek(null)}
                        className="flex-grow py-5 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all"
                      >
                        Reset Command
                      </button>
                   </div>
                </div>

                <div className="absolute bottom-8 right-8 z-[1000] hidden md:block">
                   <div className="glass-card px-8 py-5 rounded-full border border-primary/30 flex items-center gap-4 bg-primary/5">
                      <radar className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Live Vector Tracking Active</span>
                   </div>
                </div>
              </div>
           </div>
        )}

      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OfflinePage;
