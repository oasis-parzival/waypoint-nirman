import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ExperienceForm = ({ onSubmit, user }) => {
  const [formData, setFormData] = useState({
    userName: '',
    trekName: '',
    location: '',
    coords: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    story: '',
    region: 'Sahyadri'
  });
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert('Field credentials required. Please login.');
    
    // Auto-fill user name if not set
    const finalUserName = formData.userName.trim() || user.email.split('@')[0];
    
    const [lat, lng] = formData.coords.split(',').map(c => parseFloat(c.trim()));
    onSubmit({
      ...formData,
      userName: finalUserName,
      coords: [lat || 19.2319, lng || 73.7744], // Default to Harishchandragad if empty for demo
      photos: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' 
      ]
    });
    
    setFormData({ 
      userName: '', 
      trekName: '', 
      location: '', 
      coords: '', 
      rating: 5, 
      date: new Date().toISOString().split('T')[0], 
      story: '', 
      region: 'Sahyadri' 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-card p-8 rounded-3xl border border-white/5 bg-white/[0.03] shadow-2xl"
    >
      <div className="flex items-center gap-4 mb-8">
         <div className="w-1.5 h-8 bg-primary rounded-full" />
         <h2 className="text-3xl font-headline italic text-white uppercase tracking-tighter">Add Recon</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Operative Alias</label>
          <input 
            type="text" 
            placeholder={user ? user.email.split('@')[0] : "Field Operative"}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-label text-sm text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
            value={formData.userName}
            onChange={(e) => setFormData({...formData, userName: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Objective (Trek Name)</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Alang Fort"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-label text-sm text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
              value={formData.trekName}
              onChange={(e) => setFormData({...formData, trekName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Region</label>
            <select 
              className="w-full bg-[#0f1412] border border-white/10 rounded-2xl px-5 py-4 font-label text-sm text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
            >
              <option value="Sahyadri">Sahyadri</option>
              <option value="North India">North India</option>
              <option value="North East">North East</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Exact Location</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Igatpuri, MH"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-label text-sm text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Grid Coords (Lat, Lng)</label>
            <input 
              type="text" 
              placeholder="19.2, 73.7"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-label text-sm text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all"
              value={formData.coords}
              onChange={(e) => setFormData({...formData, coords: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Field Observation</label>
          <textarea 
            required
            rows="4"
            placeholder="Document route conditions, weather, and tactical obstacles..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-label text-sm text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all resize-none"
            value={formData.story}
            onChange={(e) => setFormData({...formData, story: e.target.value})}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Intensity</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`material-symbols-outlined text-xl transition-all ${
                    formData.rating >= star ? 'text-primary scale-110' : 'text-white/10'
                  }`}
                >
                   star
                </button>
              ))}
            </div>
          </div>
          
          <button 
             type="button"
             onClick={() => alert('Photo transmission coming in v2.5')}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
          >
             <span className="material-symbols-outlined text-lg">add_a_photo</span>
             Attach Visuals
          </button>
        </div>

        <button 
          type="submit"
          disabled={!user}
          className={`w-full px-10 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[11px] transition-all shadow-2xl font-label ${
             user ? 'bg-primary text-black hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed opacity-50'
          }`}
        >
          {user ? 'Transmit Recon Data' : 'OPERATIVE LOGIN REQUIRED'}
        </button>
      </form>
    </motion.div>
  );
};

export default ExperienceForm;
