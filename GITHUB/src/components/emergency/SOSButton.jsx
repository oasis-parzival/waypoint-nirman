import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const SOSButton = ({ user }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, LOCATING, SENDING, SENT, ERROR
  const [countdown, setCountdown] = useState(3);

  const triggerSOS = async () => {
    setStatus('SENDING');
    
    // SIMULATED LOCATION: Mumbai - Pune Expressway Bhatan, Somathne, Panvel, Mumbai, Maharashtra 410207
    const latitude = 18.9567;
    const longitude = 73.1650;

    try {
      const { error } = await supabase
        .from('sos_signals')
        .insert([
          {
            user_id: user?.id,
            user_email: user?.email || 'ANONYMOUS_OPERATIVE',
            coordinates: { lat: latitude, lng: longitude },
            location_name: 'Mumbai - Pune Expressway (Bhatan Sector)',
            priority: 'CRITICAL',
            status: 'ACTIVE',
            message: 'EMERGENCY: USER STRANDED NEAR BHATAN TUNNEL, PANVEL. REQUESTING IMMEDIATE EXTRACTION.'
          }
        ]);

      if (error) throw error;
      setStatus('SENT');
      setTimeout(() => setStatus('IDLE'), 5000);
    } catch (err) {
      console.error('SOS Failed:', err);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  const startTrigger = () => {
    setIsTriggering(true);
    let count = 3;
    setCountdown(3);
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        triggerSOS();
        setIsTriggering(false);
      }
    }, 1000);
    
    window.sosInterval = interval;
  };

  const cancelTrigger = () => {
    clearInterval(window.sosInterval);
    setIsTriggering(false);
    setStatus('IDLE');
  };

  return (
    <div className="fixed bottom-32 right-8 z-[1000]">
      <AnimatePresence>
        {isTriggering && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="absolute bottom-20 right-0 w-64 glass-card p-6 rounded-3xl border-red-500/50 bg-red-500/10 backdrop-blur-3xl text-center"
          >
            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-4">Confirm Emergency</p>
            <div className="text-6xl font-black text-white mb-6">{countdown}</div>
            <button 
              onClick={cancelTrigger}
              className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/80 transition-all"
            >
              Abort Signal
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onMouseDown={status === 'IDLE' ? startTrigger : undefined}
        onMouseUp={isTriggering ? cancelTrigger : undefined}
        onTouchStart={status === 'IDLE' ? startTrigger : undefined}
        onTouchEnd={isTriggering ? cancelTrigger : undefined}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.4)] border-2 ${
          status === 'SENT' ? 'bg-green-500 border-green-400' :
          status === 'ERROR' ? 'bg-gray-800 border-red-500' :
          'bg-red-600 border-red-400 animate-pulse active:scale-90'
        }`}
      >
        <span className="material-symbols-outlined text-white text-3xl font-bold">
          {status === 'IDLE' && 'sos'}
          {status === 'LOCATING' && 'gps_fixed'}
          {status === 'SENDING' && 'sensors'}
          {status === 'SENT' && 'check_circle'}
          {status === 'ERROR' && 'error'}
        </span>
        
        {/* STATUS TOOLTIP */}
        {status !== 'IDLE' && (
          <div className="absolute right-20 bg-black/80 px-4 py-2 rounded-lg border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
             {status === 'LOCATING' && 'Acquiring Lat/Lng...'}
             {status === 'SENDING' && 'Broadcasting Signal...'}
             {status === 'SENT' && 'Signal Confirmed by Base'}
             {status === 'ERROR' && 'Signal Failed'}
          </div>
        )}
      </button>
    </div>
  );
};

export default SOSButton;
