import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback for coords if not array or missing
  const lat = Array.isArray(review.coords) ? review.coords[0] : (review.coords?.lat || 19.2319);
  const lng = Array.isArray(review.coords) ? review.coords[1] : (review.coords?.lng || 73.7744);

  return (
    <div className="group font-body">
      <div 
        className={`glass-card rounded-[2.5rem] border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-700 shadow-2xl ${
          isExpanded ? 'ring-2 ring-primary/20' : ''
        }`}
      >
        <div className="p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                 <img 
                   src={review.avatar_url} 
                   alt={review.user_name} 
                   className="w-14 h-14 rounded-2xl border border-primary/20 bg-primary/10 object-cover"
                 />
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-4 border-background" />
              </div>
              <div>
                <h3 className="text-2xl md:text-4xl font-headline italic text-white leading-none uppercase tracking-tighter">
                  {review.trek_name}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mt-2">
                  {review.user_name} • {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Operations Zone</span>
              <span className="text-sm font-label font-bold text-white italic tracking-tight">{review.location}</span>
            </div>
          </div>

          {/* Media Grid - Using Stacking logic */}
          {(review.photos && review.photos.length > 0) && (
            <div className="card-stack-container relative h-[300px] md:h-[450px] unstack-on-hover py-6 md:py-10">
              {review.photos.map((photo, idx) => (
                <div 
                  key={idx}
                  className="stacked-card absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500"
                  style={{ 
                    zIndex: review.photos.length - idx,
                  }}
                >
                  <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                    <img 
                      src={photo} 
                      alt={`Trek reconnaissance ${idx + 1}`} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    {/* Layer Indicator */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-2">
                        <span className="text-[9px] font-black text-white/50 bg-black/40 backdrop-blur px-2 py-1 rounded border border-white/5">DATA_STREAM_{idx + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="absolute top-4 right-4 z-[50] flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                <span className="material-symbols-outlined text-sm text-primary animate-pulse">layers</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Visual Layer {review.photos.length}</span>
              </div>
            </div>
          )}

          {/* Story Preview */}
          <div className="space-y-6">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`material-symbols-outlined text-lg ${
                    review.rating >= star ? 'text-primary' : 'text-white/5'
                  }`}
                >
                  {review.rating >= star ? 'star' : 'star'}
                </span>
              ))}
              <span className="ml-2 text-[10px] font-black text-white/30 uppercase tracking-widest">Intensity Score</span>
            </div>
            
            <p className={`text-white/60 font-body leading-relaxed text-sm md:text-lg selection:bg-primary/20 ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {review.story}
            </p>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="group/btn flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all py-2"
            >
              {isExpanded ? 'Compress Log' : 'Access Full Recon Report'}
              <span className={`material-symbols-outlined text-sm transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Tactical Footer Overlay */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden p-8 md:p-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full" /> Latitude
                  </span>
                  <span className="text-lg font-headline italic text-primary">{Number(lat).toFixed(6)}°</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full" /> Longitude
                  </span>
                  <span className="text-lg font-headline italic text-primary">{Number(lng).toFixed(6)}°</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Terrain Region</span>
                  <span className="text-lg font-headline italic text-white uppercase">{review.region}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Grid Status</span>
                  <span className="text-lg font-headline italic text-green-400">OPERATIONAL</span>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                       <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                    </div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Data integrity verified</span>
                 </div>
                 <span className="text-[9px] font-mono text-white/10 uppercase">UUID: {review.id}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExperienceCard;
