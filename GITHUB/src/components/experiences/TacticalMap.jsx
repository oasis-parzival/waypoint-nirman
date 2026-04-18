import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TacticalMap = ({ reviews }) => {
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png', // Modern pin icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-2 rounded-2xl border border-white/10 overflow-hidden h-[400px] relative"
    >
      <div className="absolute top-4 left-4 z-[1000] bg-background/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Tactical Display: Active</span>
        </span>
      </div>

      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={4} 
        style={{ height: '100%', width: '100%', filter: 'grayscale(100%) invert(100%) contrast(90%)' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {reviews.filter(r => r.coords && r.coords.length === 2).map((review) => (
          <Marker 
            key={review.id} 
            position={review.coords}
          >
            <Popup className="tactical-popup">
              <div className="glass-card p-3 rounded-lg border border-white/10 min-w-[150px]">
                <h3 className="text-primary font-headline italic text-base leading-tight">
                  {review.trekName}
                </h3>
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider mt-1">
                  {review.userName}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-primary text-[10px] font-bold">RECAP VIEW</span>
                  <span className="material-symbols-outlined text-primary text-xs">arrow_forward</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #0f1412 !important;
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0f1412 !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .tactical-popup .glass-card {
          filter: invert(1); /* Correction because map is inverted */
          background: rgba(0, 0, 0, 0.8) !important;
          border-color: rgba(0, 0, 0, 0.5) !important;
        }
        .tactical-popup .text-primary {
          color: #a0d1bc !important;
        }
        .tactical-popup .text-white\/60 {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default TacticalMap;
