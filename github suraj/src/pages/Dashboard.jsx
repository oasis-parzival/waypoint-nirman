import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ full_name: '', avatar_url: '', experience_level: 'Beginner' });
  const [completedTreks, setCompletedTreks] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTrek, setNewTrek] = useState({ name: '', difficulty: 'Beginner' });
  const [rankInfo, setRankInfo] = useState({ rank: 'Loading...', score: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchCompletedTreks(session.user.id);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchCompletedTreks(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
      setNewName(data.full_name || '');
    }
  };

  const calculateMetrics = (treks) => {
    let score = 0;
    treks.forEach(t => {
      if (t.difficulty === 'Advanced') score += 3;
      else if (t.difficulty === 'Intermediate') score += 2;
      else score += 1;
    });

    const rankTiers = [
      { name: 'Grandmaster', min: 101, color: 'text-[#FF3B3B]' },
      { name: 'Heroic', min: 76, color: 'text-[#FF8A00]' },
      { name: 'Diamond', min: 51, color: 'text-[#00F0FF]' },
      { name: 'Platinum', min: 31, color: 'text-[#E0E0E0]' },
      { name: 'Gold', min: 16, color: 'text-[#FFD700]' },
      { name: 'Silver', min: 6, color: 'text-[#C0C0C0]' },
      { name: 'Bronze', min: 0, color: 'text-[#CD7F32]' }
    ];

    const currentRank = rankTiers.find(r => score >= r.min) || rankTiers[rankTiers.length - 1];
    setRankInfo({ rank: currentRank.name, score: score, color: currentRank.color });
  };

  const fetchCompletedTreks = async (userId) => {
    const { data } = await supabase
      .from('completed_treks')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    
    if (data) {
      setCompletedTreks(data);
      calculateMetrics(data);
    }
  };

  const updateName = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: newName })
      .eq('id', user.id);

    if (!error) {
      setProfile({ ...profile, full_name: newName });
      setIsEditingName(false);
    }
  };

  const addTrek = async (e) => {
    e.preventDefault();
    if (!newTrek.name) return;

    const { error } = await supabase
      .from('completed_treks')
      .insert({ user_id: user.id, trek_name: newTrek.name, difficulty: newTrek.difficulty });

    if (error) {
      console.error('Save failed:', error.message);
      alert(`Tactical Save Failed: ${error.message}`);
    } else {
      setNewTrek({ name: '', difficulty: 'Beginner' });
      fetchCompletedTreks(user.id);
    }
  };

  const analyzeRank = async () => {
    if (completedTreks.length === 0) {
      setRankInfo({ rank: 'Bronze', score: 0 });
      return;
    }

    setIsAnalyzing(true);
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    
    const trekList = completedTreks.map(t => `${t.trek_name} (${t.difficulty})`).join(', ');
    const prompt = `Analyze this hiker's progress: 
    - Current Rank: ${rankInfo.rank}
    - Total XP Score: ${rankInfo.score}
    - Completed Expeditions: ${trekList}
    
    Provide a "Tactical Briefing" (max 3 sentences) evaluating their current terrain mastery and suggesting what difficulty they should target next to reach the next rank. Do not change the rank or score.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      setRankInfo(prev => ({
        ...prev,
        reason: content
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const avatarSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'Waypoint'}`;

  return (
    <div className="pt-32 pb-44 px-4 md:px-6 max-w-7xl mx-auto space-y-12">
      {/* USER HEADER SECTION */}
      <section className="relative overflow-hidden bg-surface-container-low border border-white/5 rounded-[3rem] p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px]"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="text-center md:text-left space-y-4 flex-grow w-full md:w-auto">
             <div className="space-y-1">
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Tactical Explorer ID</span>
                <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                  <h1 className="text-4xl md:text-7xl font-black text-white font-headline tracking-tighter uppercase italic break-all">
                    {profile.full_name || 'Anonymous'}
                  </h1>
                  <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <span className="text-[10px] text-white/40 uppercase font-black font-label">Age</span>
                    <span className="text-xl font-headline text-primary italic font-bold">{profile.age || '--'}</span>
                  </div>
                </div>
                <p className="text-white/20 text-[10px] md:text-xs font-label uppercase tracking-[0.2em] mt-1">{user?.email}</p>
             </div>

             <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${rankInfo.color?.replace('text-', 'bg-') || 'bg-primary'}`}></div>
                   <span className={`text-[10px] font-black uppercase tracking-widest font-label ${rankInfo.color || 'text-white'}`}>Rank: {rankInfo.rank}</span>
                   <span className="text-[10px] text-white/20 font-bold ml-2">XP: {rankInfo.score}</span>
                </div>
                <button onClick={analyzeRank} className="px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all font-label">
                   {isAnalyzing ? 'Request Tactical Briefing' : 'Analyze Strategy'}
                </button>
             </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LOG TREK SECTION */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white font-headline uppercase italic">Log Expedition</h3>
                <p className="text-xs text-white/30 font-label tracking-wide">Journal your completed tactical data</p>
              </div>

              <form onSubmit={addTrek} className="space-y-4">
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Objective Name</label>
                       <input 
                         value={newTrek.name}
                         onChange={(e) => setNewTrek({...newTrek, name: e.target.value})}
                         placeholder="e.g. Harishchandragad"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Terrain Difficulty</label>
                       <select 
                         value={newTrek.difficulty}
                         onChange={(e) => setNewTrek({...newTrek, difficulty: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm appearance-none cursor-pointer"
                       >
                          <option className="bg-black">Beginner</option>
                          <option className="bg-black">Intermediate</option>
                          <option className="bg-black">Advanced</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-full text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl font-label">Save Expedition</button>
              </form>
           </div>

           {/* AI ANALYSIS BOX */}
           {rankInfo.reason && (
             <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary">auto_awesome</span>
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">RAG Intelligence</span>
                </div>
                <p className="text-xs leading-relaxed text-white/60 font-body">{rankInfo.reason}</p>
                <div className="pt-4 border-t border-primary/10">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-white/30 uppercase font-label">Confidence Score</span>
                      <span className="text-2xl font-black text-primary font-headline">{rankInfo.score}/100</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${rankInfo.score}%` }}></div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* COMPLETED TREKS LIST */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h3 className="text-2xl font-bold text-white font-headline uppercase italic tracking-widest">Expedition Ledger</h3>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] font-label font-bold">{completedTreks.length} Vectors Recorded</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTreks.length > 0 ? completedTreks.map((trek) => (
                <div key={trek.id} className="group flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-primary/20 transition-all">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary font-headline text-lg group-hover:scale-110 transition-transform">
                         {trek.trek_name[0]}
                      </div>
                      <div>
                         <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-primary transition-colors">{trek.trek_name}</h4>
                         <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                               trek.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400' : 
                               trek.difficulty === 'Intermediate' ? 'bg-orange-500/10 text-orange-400' : 
                               'bg-green-500/10 text-green-400'
                            }`}>
                               {trek.difficulty}
                            </span>
                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest font-label">
                               {new Date(trek.completed_at).toLocaleDateString()}
                            </span>
                         </div>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-white/10 group-hover:text-primary transition-colors">verified</span>
                </div>
              )) : (
                <div className="col-span-full py-24 text-center space-y-4 opacity-10">
                   <span className="material-symbols-outlined text-8xl">drafts</span>
                   <p className="font-headline text-xl uppercase italic tracking-widest">No Sector Activity Logged</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
