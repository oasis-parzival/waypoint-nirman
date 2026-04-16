import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon issues in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Marker Creator
const createCustomMarker = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const MapPage = () => {
  const [allTreks, setAllTreks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const loadAllTreks = async () => {
      try {
        const sources = [
          { name: 'Sahyadri', file: '/trek_details_sahyadri.csv', color: '#22d3ee' }, // Cyan
          { name: 'North India', file: '/trek_details_north.csv', color: '#a0d1bc' }, // Emerald
          { name: 'North East', file: '/trek_details_north_east.csv', color: '#fbbf24' } // Amber
        ];

        const allResults = await Promise.all(sources.map(async (source) => {
          const response = await fetch(source.file);
          const csvText = await response.text();
          const lines = csvText.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          return lines.slice(1).map(line => {
            const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (!parts || parts.length < headers.length) return null;
            
            const obj = { region: source.name, regionColor: source.color };
            headers.forEach((header, i) => {
              let val = parts[i] || '';
              val = val.replace(/^"|"$/g, '').trim();
              if (header) obj[header] = val;
            });

            // Convert Lat/Lon to numbers if they exist
            if (obj.Latitude && obj.Longitude) {
              obj.latNum = parseFloat(obj.Latitude);
              obj.lngNum = parseFloat(obj.Longitude);
              if (isNaN(obj.latNum) || isNaN(obj.lngNum)) return null;
            } else {
              return null; // Skip if no coordinates
            }

            return obj;
          }).filter(item => item !== null);
        }));

        setAllTreks(allResults.flat());
      } catch (err) {
        console.error("Map data synchronization failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllTreks();
  }, []);

  const filteredTreks = allTreks.filter(t => activeRegion === 'All' || t.region === activeRegion);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* HUD OVERLAY */}
      <div className="absolute top-28 left-6 z-[1000] space-y-4 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 pointer-events-auto shadow-2xl">
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label block mb-2">Cartographical Nexus</span>
          <h1 className="text-3xl font-bold text-white tracking-tighter uppercase font-headline">Tactical <span className="text-primary italic">Live Grid.</span></h1>
          <p className="text-white/40 text-xs mt-2 max-w-xs leading-relaxed">Spatial distribution of global expedition vectors and terrain markers.</p>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          {['All', 'Sahyadri', 'North India', 'North East'].map(region => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                activeRegion === region 
                ? 'bg-primary text-black' 
                : 'bg-black/60 text-white/40 border border-white/5 hover:bg-black/80'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="flex-grow relative z-0">
        {isLoading ? (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] font-label">Synchronizing Vectors...</p>
          </div>
        ) : (
          <MapContainer 
            center={[22.5937, 78.9629]} 
            zoom={5} 
            className="w-full h-full"
            style={{ background: '#0a0f0d' }}
          >
            {/* Dark Mode Map Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {filteredTreks.map((trek, idx) => (
              <Marker 
                key={`${trek.Trek_Name}-${idx}`} 
                position={[trek.latNum, trek.lngNum]}
                icon={createCustomMarker(trek.regionColor)}
              >
                <Popup className="premium-popup">
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-white/10 min-w-[200px] space-y-3">
                    <div className="space-y-1">
                      <span className="text-primary font-bold text-[8px] uppercase tracking-widest font-label">{trek.region}</span>
                      <h3 className="text-lg font-bold text-white font-headline leading-tight">{trek.Trek_Name}</h3>
                      <p className="text-[10px] text-white/40">{trek.District}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-widest">
                       <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/20 block mb-0.5 font-label">Alt</span>
                          <span className="text-white">{trek.Height_m}m</span>
                       </div>
                       <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/20 block mb-0.5 font-label">Diff</span>
                          <span className="text-white">{trek.Difficulty}</span>
                       </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate('/discover', { state: { initialSearch: trek.Trek_Name } })}
                        className="flex-grow py-2 bg-white/5 text-white/60 text-[8px] font-bold uppercase tracking-widest rounded-lg border border-white/5 hover:bg-white/10 transition-all"
                      >
                        View Intel
                      </button>
                      <button 
                        onClick={() => navigate('/plan', { 
                          state: { 
                            trekName: trek.Trek_Name,
                            location: trek.District,
                            difficulty: trek.Difficulty || 'Moderate',
                            duration: trek.Days || '2',
                            description: trek.Description,
                            bestSeason: trek.Best_Season,
                            history: trek.Historical_Significance
                          } 
                        })}
                        className="flex-grow py-2 bg-primary text-black text-[8px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all"
                      >
                        Initialize Plan
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container {
          background: #0a0f0d !important;
        }
        .premium-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          color: white !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .premium-popup .leaflet-popup-tip {
          background: #181d1a !important;
        }
        .premium-popup .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          margin-right: 24px !important;
          margin-bottom: 40px !important;
        }
        .leaflet-control-zoom a {
          background-color: rgba(0,0,0,0.8) !important;
          color: #a0d1bc !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #a0d1bc !important;
          color: black !important;
        }
      `}} />
    </div>
  );
};

export default MapPage;
