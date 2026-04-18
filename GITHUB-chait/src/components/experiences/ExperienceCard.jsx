import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group">
      <div 
        className={`glass-card rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-h-[2000px]' : 'max-h-[600px]'
        }`}
      >
        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={review.avatar} 
                alt={review.userName} 
                className="w-12 h-12 rounded-full border border-primary/20 bg-primary/10"
              />
              <div>
                <h3 className="text-xl md:text-2xl font-headline italic text-primary leading-none">
                  {review.trekName}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">
                  {review.userName} • {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Location</span>
              <span className="text-sm font-label font-bold text-white/80">{review.location}</span>
            </div>
          </div>

          {/* Media Grid - Using Stacking logic */}
          <div className="card-stack-container relative h-[300px] md:h-[400px] unstack-on-hover py-10">
            {review.photos.map((photo, idx) => (
              <div 
                key={idx}
                className="stacked-card absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ 
                  zIndex: review.photos.length - idx,
                  transform: `translateZ(${idx * -50}px) translateY(${idx * 10}px)` 
                }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src={photo} 
                    alt={`Trek step ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                </div>
              </div>
            ))}
            
            {/* Visual Label for Stacking */}
            <div className="absolute top-4 right-4 z-[50] flex items-center gap-2 bg-background/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-xs text-primary">layers</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Tactical Layer {review.photos.length}</span>
            </div>
          </div>

          {/* Story Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`material-symbols-outlined text-sm ${
                    review.rating >= star ? 'text-primary' : 'text-white/10'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            
            <p className={`text-white/70 font-label leading-relaxed text-sm md:text-base ${!isExpanded && 'line-clamp-3'}`}>
              {review.story}
            </p>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="group/btn flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-all"
            >
              {isExpanded ? 'Compress Recon' : 'Read Full Log'}
              <span className={`material-symbols-outlined text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                keyboard_double_arrow_down
              </span>
            </button>
          </div>
        </div>

        {/* Tactical Footer Overlay */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/5 bg-white/[0.02] p-6 md:p-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Latitude</span>
                  <span className="text-sm font-label font-bold text-primary">{review.coords[0].toFixed(4)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Longitude</span>
                  <span className="text-sm font-label font-bold text-primary">{review.coords[1].toFixed(4)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Elevation Index</span>
                  <span className="text-sm font-label font-bold text-white/80">CLASS-{review.rating}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Status</span>
                  <span className="text-sm font-label font-bold text-green-400/80">VERIFIED</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExperienceCard;
