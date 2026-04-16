import React, { useState } from 'react';
import { createGearRequest } from '../../services/gearService';

const GearRequestForm = ({ trekName, onRequestCreated }) => {
  const [formData, setFormData] = useState({
    gearName: '',
    quantity: 1,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gearName || formData.quantity < 1) {
      setMessage({ type: 'error', text: 'Please provide a gear name and valid quantity.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const payload = {
      user_id: "mock-user", // Later: supabase.auth.user().id
      trek_name: trekName || "Unspecified Trek",
      gear_item: formData.gearName,
      quantity: parseInt(formData.quantity),
      notes: formData.notes,
      status: "pending",
      created_at: new Date()
    };

    try {
      const result = await createGearRequest(payload);
      if (result.success) {
        setMessage({ type: 'success', text: 'Gear request submitted successfully.' });
        setFormData({ gearName: '', quantity: 1, notes: '' });
        if (onRequestCreated) onRequestCreated(result.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary text-2xl">backpack</span>
        <h2 className="text-xl font-bold text-white font-headline uppercase italic">Request Gear</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Gear Item</label>
            <input 
              name="gearName"
              value={formData.gearName}
              onChange={handleChange}
              className="w-full block bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-primary/40 transition-colors placeholder:text-white/10 text-sm" 
              placeholder="e.g. Crampons, Oxygen Tank"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Quantity</label>
            <input 
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full block bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-primary/40 transition-colors text-sm" 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Requirements / Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full block bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 transition-colors placeholder:text-white/10 h-24 resize-none text-sm" 
              placeholder="Specific size, brand or preference..."
            />
          </div>
        </div>

        {message.text && (
          <div className={`text-xs font-bold uppercase tracking-widest p-4 rounded-xl border ${
            message.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-400/10 border-red-400/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-full text-[10px] hover:bg-primary transition-all shadow-xl disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting Signal...' : 'Confirm Request'}
        </button>
      </form>
    </div>
  );
};

export default GearRequestForm;
