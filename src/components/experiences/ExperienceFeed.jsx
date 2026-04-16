import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceCard from './ExperienceCard';

const ExperienceFeed = ({ reviews }) => {
  const [activeRegion, setActiveRegion] = useState('All');
  const regions = ['All', 'Sahyadri', 'North India', 'North East'];

  const filteredReviews = activeRegion === 'All' 
    ? reviews 
    : reviews.filter(r => r.region === activeRegion);

  return (
    <div className="space-y-8">
      {/* Region Filter */}
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`px-8 py-3 rounded-full font-label text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeRegion === region 
                ? 'bg-primary text-background shadow-[0_5px_15px_rgba(160,209,188,0.3)] scale-105' 
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Feed Nexus */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="w-full"
            >
              <ExperienceCard review={review} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExperienceFeed;
