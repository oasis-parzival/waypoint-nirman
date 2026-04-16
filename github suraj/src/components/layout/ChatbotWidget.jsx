import React, { useState, useRef, useEffect } from 'react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Tactical Signal Active. I am your Waypoint Sentinel. How can I assist with your mission?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { 
              role: 'system', 
              content: 'You are the Waypoint Sentinel, a tactical AI assistant for Waypoint, an elite trekking platform. Provide high-intelligence reconnaissance, terrain analysis, and safety protocols. Use a professional, mission-focused, technical tone. Keep responses concise (max 3 sentences) and actionable. Use terminology like "operative", "grid", "recce", "coordinates".' 
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.5,
          max_tokens: 300
        })
      });

      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || "Signal interference detected. Retry uplink.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (err) {
      console.error('Sentinel Link Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Tactical link severed. Intelligence unavailable.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end pointer-events-none">
      {/* CHAT WINDOW */}
      <div className={`mb-6 w-[85vw] md:w-[400px] h-[500px] glass-card rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden transition-all duration-500 shadow-2xl pointer-events-auto ${
        isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}>
        <div className="bg-primary p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-black animate-ping"></div>
             <span className="text-black font-black uppercase text-[10px] tracking-widest">Waypoint Sentinel</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-black hover:rotate-90 transition-transform">
             <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </div>

        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar bg-black/40">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-[11px] leading-relaxed font-label ${
                  msg.role === 'user' 
                    ? 'bg-primary text-black font-bold' 
                    : 'bg-white/5 border border-white/10 text-white/80'
                }`}>
                   {msg.content}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5">
           <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Direct intelligence request..."
                className="w-full bg-black/40 border border-white/10 rounded-full pl-6 pr-12 py-4 text-[10px] text-white outline-none focus:border-primary/50 transition-all font-label"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
           </div>
        </div>
      </div>

      {/* CHAT TOGGLE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-2 pointer-events-auto ${
          isOpen 
            ? 'bg-white text-black border-transparent' 
            : 'bg-primary text-black border-primary/20 hover:scale-110'
        }`}
      >
        <span className="material-symbols-outlined text-3xl font-bold">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;
