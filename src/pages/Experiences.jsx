import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ExperienceForm from '../components/experiences/ExperienceForm';
import TacticalMap from '../components/experiences/TacticalMap';
import ExperienceFeed from '../components/experiences/ExperienceFeed';

const Experiences = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    fetchExperiences();
    return () => subscription.unsubscribe();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trek_experiences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching field recon:', error);
    else setReviews(data || []);
    setLoading(false);
  };

  const handleAddReview = async (newReview) => {
    if (!user) return alert('Field credentials required. Please authenticate.');

    const { data, error } = await supabase
      .from('trek_experiences')
      .insert({
        user_id: user.id,
        user_name: newReview.userName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newReview.userName}`,
        trek_name: newReview.trekName,
        location: newReview.location,
        region: newReview.region,
        coords: newReview.coords,
        rating: newReview.rating,
        date: newReview.date,
        story: newReview.story,
        photos: newReview.photos
      })
      .select()
      .single();

    if (error) {
      console.error('Error transmitting recon:', error);
      alert('Transmission failed. Check coordinates and credentials.');
    } else {
      setReviews(prev => [data, ...prev]);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 space-y-12 max-w-7xl mx-auto overflow-x-hidden transition-all duration-500">
      <header className="space-y-4 text-center md:text-left">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-2"
        >
           <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Network v2.4</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-headline italic text-white leading-none uppercase tracking-tighter flex flex-wrap items-center gap-4 justify-center md:justify-start"
        >
          <img src="/logo.png" alt="Nexus Logo" className="w-12 h-12 md:w-20 md:h-20" />
          <span>TREK <span className="text-primary text-glow italic">NEXUS.</span></span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/40 max-w-2xl font-body text-sm md:text-lg leading-relaxed"
        >
          A live tactical portal for trekkers to broadcast field reconnaissance, coordinate shared logistics, and visualize movement across the most challenging terrain.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Map and Form */}
        <div className="xl:col-span-4 space-y-8 order-2 xl:order-1">
          <ExperienceForm onSubmit={handleAddReview} user={user} />
          <div className="sticky top-32 space-y-8">
             <TacticalMap reviews={reviews} />
             <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Grid Status</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                   <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <p className="text-2xl font-headline italic text-primary">{reviews.length}</p>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">Active Recce</p>
                   </div>
                   <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <p className="text-2xl font-headline italic text-white">4.8</p>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">Avg Intensity</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Feed */}
        <div className="xl:col-span-8 order-1 xl:order-2">
          {loading ? (
             <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Syncing Nexus Feed...</span>
             </div>
          ) : (
            <ExperienceFeed reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
