import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AuthOverlay = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              age: parseInt(age)
            }
          }
        });

        if (authError) throw authError;
        setMessage('Tactical credentials initialized! Check email for verification.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-surface-container-low border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-colors duration-700"></div>
        
        <div className="p-8 sm:p-12 space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Security Nexus v1.0</span>
            <h2 className="text-3xl font-bold text-white font-headline uppercase italic tracking-tighter">
              {isSignUp ? 'Initialize' : 'Authorize'} <span className="text-primary">Profile.</span>
            </h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-3">
              {isSignUp && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary/40 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label ml-1">Age</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary/40 transition-all text-sm"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="identity@waypoint.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label ml-1">Access Protocol</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-sm"
                  required
                />
              </div>
            </div>

            {message && (
              <p className={`text-[11px] font-bold text-center px-4 py-3 rounded-xl ${message.includes('sent') ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message}
              </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-black uppercase tracking-[0.2em] py-5 rounded-full text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Processing...' : isSignUp ? 'Begin Initialization' : 'Authorize Session'}
            </button>
          </form>

          <div className="pt-4 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] hover:text-primary transition-colors font-label"
            >
              {isSignUp ? 'Already a member? Sign In' : "Don't have a profile? Sign Up"}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all border border-white/5"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  );
};

export default AuthOverlay;
