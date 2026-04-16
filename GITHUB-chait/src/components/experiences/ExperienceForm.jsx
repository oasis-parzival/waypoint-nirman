import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ExperienceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: '',
    trekName: '',
    location: '',
    coords: '',
    rating: 0,
    date: '',
    story: '',
    region: 'Sahyadri'
  });
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const [lat, lng] = formData.coords.split(',').map(c => parseFloat(c.trim()));
    onSubmit({
      ...formData,
      coords: [lat || 0, lng || 0],
      photos: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' // Placeholder for uploaded photo
      ]
    });
    setFormData({ userName: '', trekName: '', location: '', coords: '', rating: 0, date: '', story: '', region: 'Sahyadri' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 rounded-2xl border border-white/10"
    >
      <h2 className="text-2xl font-headline italic text-primary mb-6 uppercase tracking-wider">Add Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Your Name</label>
          <input 
            type="text" 
            required
            placeholder="Field Operative Name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-label text-sm focus:outline-none focus:border-primary/50 transition-colors"
            value={formData.userName}
            onChange={(e) => setFormData({...formData, userName: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Trek Name</label>
            <input 
              type="text" 
              required
              placeholder="Objective"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-label text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={formData.trekName}
              onChange={(e) => setFormData({...formData, trekName: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Region</label>
            <select 
              className="w-full bg-[#0f1412] border border-white/10 rounded-xl px-4 py-3 font-label text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
            >
              <option value="Sahyadri">Sahyadri</option>
              <option value="North India">North India</option>
              <option value="North East">North East</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Coordinates (Lat, Lng)</label>
            <input 
              type="text" 
              placeholder="e.g. 19.2, 73.7"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-label text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={formData.coords}
              onChange={(e) => setFormData({...formData, coords: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Date</label>
            <input 
              type="date" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-label text-sm focus:outline-none focus:border-primary/50 transition-colors [color-scheme:dark]"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Your Story</label>
          <textarea 
            required
            rows="4"
            placeholder="Field notes and tactical observations..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-label text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
            value={formData.story}
            onChange={(e) => setFormData({...formData, story: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`material-symbols-outlined text-xl transition-colors ${
                    formData.rating >= star ? 'text-primary' : 'text-white/10'
                  }`}
                >
                  {formData.rating >= star ? 'star' : 'star_outline'}
                </button>
              ))}
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/30 hover:bg-white/5 transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              multiple
              accept="image/*"
            />
            <span className="material-symbols-outlined text-3xl text-white/20 group-hover:text-primary/50 transition-colors">cloud_upload</span>
            <span className="font-label text-xs font-bold text-white/40 uppercase tracking-widest">Add Trek Photos</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full px-10 py-5 bg-primary text-background font-black uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(160,209,188,0.2)] mt-4"
        >
          Transmit Recon
        </button>
      </form>
    </motion.div>
  );
};

export default ExperienceForm;
