import React, { useState } from 'react';

const PlanPage = () => {
  const [formData, setFormData] = useState({
    trekName: '',
    date: '',
    groupSize: '',
    experience: 'Intermediate',
    duration: '',
    notes: ''
  });

  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
  const GROQ_MODEL = 'llama-3.1-8b-instant';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const callGroqAI = async (type) => {
    setIsLoading(true);
    setError('');
    setResult('');

    let prompt = '';
    if (type === 'plan') {
      prompt = `Act as an elite Himalayan mountaineer and expedition architect. Generate a PROFESSIONAL, HIGH-FIDELITY daily expedition plan for a trek named "${formData.trekName}". 
      Details: Date: ${formData.date}, Group Size: ${formData.groupSize}, Difficulty: ${formData.experience}, Duration: ${formData.duration} days. 
      Additional Notes: ${formData.notes}. 
      Include daily ascent goals, base camp logistics, and safety checkpoints. 
      IMPORTANT: Do not use markdown symbols like * or #. Use clear section headers in ALL CAPS and plain bullet points with dashes.`;
    } else if (type === 'packing') {
      prompt = `Generate a technical equipment and packing list for the "${formData.trekName}" trek. 
      Experience Level: ${formData.experience}. Focus on high-altitude survival gear, layering systems, and specialized equipment. 
      IMPORTANT: Avoid markdown symbols. Use clean text categories and plain dashes for lists.`;
    } else {
      prompt = `Provide expert strategic recommendations and trail alternatives for an expedition to "${formData.trekName}" for a ${formData.experience} level group. 
      Include risk assessment and weather-window optimization advice. 
      IMPORTANT: No markdown symbols (* or #). Use plain, structured text.`;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) throw new Error('Failed to connect to Intelligence Engine');

      const data = await response.json();
      setResult(data.choices[0].message.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-primary selection:text-on-primary font-body">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          src="/cinematic_himalayan_summit_onyx_glow_1776257020425.png" 
          className="w-full h-full object-cover scale-105 opacity-30 grayscale blur-[2px]" 
          alt="Backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
      </div>

      <main className="relative z-10 pt-32 pb-44 px-4 md:px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* FORM SIDE */}
        <section className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Expedition Architect v1.0</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-headline leading-tight tracking-tighter uppercase italic">Plan Your <br/><span className="text-primary">Next Ascent.</span></h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">Neural pathfinding for technical terrain. Enter your parameters to initialize the engine.</p>
          </div>

          <div className="space-y-6 glass-card p-8 rounded-[2.5rem] border border-white/5">
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Trek Objective</label>
                  <input 
                    name="trekName"
                    value={formData.trekName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 transition-colors placeholder:text-white/10" 
                    placeholder="e.g. Everest Base Camp, K2 Summit"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Window Date</label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-primary/40 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Group Size</label>
                    <input 
                      type="number"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-primary/40 transition-colors" 
                      placeholder="01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Difficulty</label>
                    <select 
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white/90 font-bold outline-none focus:border-primary/40 transition-colors appearance-none cursor-pointer"
                    >
                      <option className="bg-[#0a0a0a] text-white">Beginner</option>
                      <option className="bg-[#0a0a0a] text-white">Intermediate</option>
                      <option className="bg-[#0a0a0a] text-white">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Duration (Days)</label>
                    <input 
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-primary/40 transition-colors" 
                      placeholder="07"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-label mb-2 block">Intelligence Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 transition-colors placeholder:text-white/10 h-24 resize-none" 
                    placeholder="Specific requirements, medical focus..."
                  />
                </div>
             </div>

             <div className="flex flex-col gap-3 pt-6">
                <button 
                  onClick={() => callGroqAI('plan')}
                  disabled={isLoading}
                  className="bg-primary text-black font-black uppercase tracking-[0.2em] py-5 rounded-full text-[10px] md:text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? 'Processing Neural Path...' : <><span className="material-symbols-outlined text-lg">auto_awesome</span> Generate AI Plan</>}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => callGroqAI('packing')}
                    disabled={isLoading}
                    className="bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[0.1em] py-4 rounded-full text-[9px] hover:bg-white/10 transition-all font-label disabled:opacity-50"
                  >
                    Packing List
                  </button>
                  <button 
                    onClick={() => callGroqAI('recommendations')}
                    disabled={isLoading}
                    className="bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[0.1em] py-4 rounded-full text-[9px] hover:bg-white/10 transition-all font-label disabled:opacity-50"
                  >
                    Get Advice
                  </button>
                </div>
             </div>
          </div>
        </section>

        {/* RESULT SIDE */}
        <section className="lg:col-span-7">
           <div className="h-full min-h-[600px] glass-card rounded-[2.5rem] border border-white/10 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/5 to-transparent flex items-center px-10">
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] font-label">Intelligence Output</span>
              </div>
              
              <div className="flex-grow p-10 pt-24 overflow-y-auto hide-scrollbar">
                 {isLoading ? (
                   <div className="flex flex-col items-center justify-center h-full space-y-6">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Topography</p>
                   </div>
                 ) : error ? (
                   <div className="flex items-center gap-4 text-red-400 bg-red-400/10 p-6 rounded-2xl border border-red-400/20">
                      <span className="material-symbols-outlined font-bold">error</span>
                      <p className="font-bold text-sm tracking-wide">{error}</p>
                   </div>
                 ) : result ? (
                   <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-headings:text-white prose-strong:text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="whitespace-pre-wrap font-body text-base leading-relaxed text-white/70">
                        {result}
                      </div>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-20 group">
                      <span className="material-symbols-outlined text-8xl md:text-[10rem] transition-transform duration-1000 group-hover:rotate-12">robot_2</span>
                      <div className="space-y-2">
                        <p className="text-xl md:text-2xl font-bold font-headline uppercase italic">Awaiting Parameters</p>
                        <p className="text-sm font-label uppercase tracking-widest">Architect your ascent on the left</p>
                      </div>
                   </div>
                 )}
              </div>

              {result && (
                <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest font-label"
                    >
                      <span className="material-symbols-outlined text-sm">print</span> Export Plan
                    </button>
                </div>
              )}
           </div>
        </section>
      </main>

      {/* MOBILE NAV SPACER */}
      <div className="h-32 md:hidden"></div>
    </div>
  );
};

export default PlanPage;
