import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  ShieldAlert, 
  Box, 
  Users, 
  Search, 
  Activity, 
  Bell, 
  Map as MapIcon, 
  ChevronRight, 
  MoreVertical,
  Terminal,
  Clock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('command-center');
  const [sosSignals, setSosSignals] = useState([]);
  const [gearRequests, setGearRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.id === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // Mock stats - in a real app, these would come from an aggregation query
  const stats = [
    { label: 'Active Agents', value: '128', sub: '+12 this week', icon: <Users size={20} />, color: 'var(--accent-mint)' },
    { label: 'Live Expeditions', value: '14', sub: 'In Summit Push', icon: <Activity size={20} />, color: 'var(--accent-mint)' },
    { label: 'Gear Inventory', value: '842', sub: '92% Available', icon: <Box size={20} />, color: 'var(--accent-mint)' },
    { label: 'Emergency Alerts', value: sosSignals.filter(s => s.status === 'ACTIVE').length, sub: 'Critical Response', icon: <ShieldAlert size={20} />, color: '#FF4444', urgent: true },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: sosData } = await supabase
        .from('sos_signals')
        .select('*')
        .order('created_at', { ascending: false });
      setSosSignals(sosData || []);

      const { data: gearData } = await supabase
        .from('gear_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setGearRequests(gearData || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const sosSubscription = supabase.channel('sos_updates').on('postgres_changes', { event: '*', table: 'sos_signals', schema: 'public' }, () => fetchData()).subscribe();
      const gearSubscription = supabase.channel('gear_updates').on('postgres_changes', { event: '*', table: 'gear_requests', schema: 'public' }, () => fetchData()).subscribe();
      return () => {
        supabase.removeChannel(sosSubscription);
        supabase.removeChannel(gearSubscription);
      };
    }
  }, [isAuthenticated]);

  const resolveSos = async (id) => {
    await supabase.from('sos_signals').update({ status: 'RESOLVED' }).eq('id', id);
    fetchData();
  };

  const updateGear = async (id, status) => {
    await supabase.from('gear_requests').update({ status }).eq('id', id);
    fetchData();
  };

  // Chart Data
  const lineData = {
    labels: ['NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR'],
    datasets: [{
      label: 'Expeditions',
      data: [45, 62, 51, 78, 89, 103],
      borderColor: '#6BFFB8',
      backgroundColor: 'rgba(107, 255, 184, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const doughnutData = {
    labels: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
    datasets: [{
      data: [35, 45, 15, 5],
      backgroundColor: ['#6BFFB8', '#3D9968', '#FFD166', '#FF4444'],
    }]
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050605] flex items-center justify-center p-6 font-barlow relative overflow-hidden">
        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="w-full max-w-md bg-[#0D0F0D] p-10 rounded-[2.5rem] border border-[#6BFFB8]/10 shadow-[0_0_50px_rgba(107,255,184,0.05)] relative z-10">
           <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#6BFFB8]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#6BFFB8]/20">
                 <Terminal className="text-[#6BFFB8]" size={32} />
              </div>
              <h1 className="text-3xl font-black italic uppercase italic tracking-tighter text-white font-headline mb-2">Command Access</h1>
              <p className="text-[10px] font-bold text-[#4A5A4A] uppercase tracking-[0.3em]">Authorized Personnel Only</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-[#6BFFB8] uppercase tracking-widest ml-1">Universal ID</label>
                 <input 
                    type="text"
                    required
                    value={loginForm.id}
                    onChange={(e) => setLoginForm({...loginForm, id: e.target.value})}
                    className="w-full bg-[#161A16] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#6BFFB8]/30 transition-all font-bold placeholder:text-white/5"
                    placeholder="ENTER ID"
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-[#6BFFB8] uppercase tracking-widest ml-1">Security Key</label>
                 <input 
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full bg-[#161A16] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#6BFFB8]/30 transition-all font-bold placeholder:text-white/5"
                    placeholder="••••••••"
                 />
              </div>

              {loginError && (
                 <div className="flex items-center gap-2 text-[#FF4444] bg-[#FF4444]/10 p-3 rounded-xl border border-[#FF4444]/20">
                    <XCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">ACCESS DENIED: INVALID CREDENTIALS</span>
                 </div>
              )}

              <button 
                type="submit"
                className="w-full bg-[#6BFFB8] text-black font-black uppercase py-5 rounded-2xl text-xs tracking-[0.2em] mt-6 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(107,255,184,0.2)]"
              >
                Establish Uplink
              </button>
           </form>

           <div className="mt-10 text-center opacity-20">
              <p className="text-[8px] font-bold text-white uppercase tracking-[0.5em]">Trek Intelligence Network • Terminal 01</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell flex h-screen w-screen bg-[#0D0F0D] text-white font-barlow overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#0F120F] border-r border-[#6BFFB8]/10 flex flex-col p-6 z-[100] transition-all">
        <div className="flex items-center gap-3 mb-2 px-3">
          <Terminal className="text-[#6BFFB8]" size={24} />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter font-headline">WAYPOINT</h1>
        </div>
        <div className="bg-[#6BFFB8]/10 text-[#6BFFB8] text-[9px] font-black px-2 py-1 rounded inline-block self-start ml-3 mb-10 tracking-[0.1em]">ADMIN TACTICAL</div>

        <nav className="flex-grow space-y-1">
           <p className="text-[10px] font-bold text-[#4A5A4A] tracking-[0.2em] mb-4 px-3 uppercase">Command</p>
           {[
             { id: 'command-center', label: 'Center', icon: <BarChart3 size={18} /> },
             { id: 'sos-hub', label: 'SOS Hub', icon: <ShieldAlert size={18} />, badge: sosSignals.filter(s=>s.status==='ACTIVE').length },
             { id: 'gear-depot', label: 'Gear Depot', icon: <Box size={18} /> },
             { id: 'analytics', label: 'Analytics', icon: <MapIcon size={18} /> }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all border-l-2 ${
                 activeTab === item.id 
                   ? 'bg-[#6BFFB8]/10 text-[#6BFFB8] border-[#6BFFB8]' 
                   : 'text-[#4A5A4A] border-transparent hover:bg-[#6BFFB8]/5 hover:text-[#8A9A8A]'
               }`}
             >
               {item.icon}
               {item.label}
               {item.badge > 0 && <span className="ml-auto bg-[#FF4444] text-white text-[9px] px-1.5 py-0.5 rounded font-black">{item.badge}</span>}
             </button>
           ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#6BFFB8]/10">
           <div className="bg-[#161A16] p-3 rounded-xl border border-[#6BFFB8]/10 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#6BFFB8]/20 text-[#6BFFB8] rounded-lg flex items-center justify-center font-black text-xs">AD</div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold">Admin_Delta</span>
                 <span className="text-[9px] text-[#6BFFB8] font-bold uppercase tracking-widest">Base Commander</span>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* TOPBAR */}
                    <header className="px-4 py-3 md:px-8 md:py-4 border-b border-[#6BFFB8]/10 flex flex-col md:flex-row md:items-center justify-between bg-[#0D0F0D]/80 backdrop-blur-md z-[90] sticky top-0 md:relative">
                       <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
                          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white font-headline">{activeTab.replace('-',' ')}</h2>
                          <div className="flex md:hidden items-center gap-2 bg-[#6BFFB8]/10 px-3 py-1 rounded-full border border-[#6BFFB8]/20">
                             <div className="w-1.5 h-1.5 bg-[#6BFFB8] rounded-full animate-ping" />
                             <span className="text-[9px] font-black text-[#6BFFB8] uppercase">LIVE</span>
                          </div>
                       </div>
                       
                        <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
                          <div className="relative group flex-grow md:flex-grow-0">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5A4A] group-focus-within:text-[#6BFFB8] transition-colors" size={14} />
                             <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="VECTORS..."
                                className="bg-[#1E221E] border border-[#6BFFB8]/10 rounded-lg py-2.5 md:py-2 pl-10 pr-4 text-[10px] md:text-xs text-white outline-none focus:border-[#6BFFB8]/30 w-full md:w-64 transition-all md:focus:w-72"
                             />
                          </div>
                          <div className="hidden md:flex items-center gap-2 bg-[#6BFFB8]/10 px-4 py-2 rounded-full border border-[#6BFFB8]/20">
                             <div className="w-1.5 h-1.5 bg-[#6BFFB8] rounded-full animate-ping" />
                             <span className="text-[10px] font-black text-[#6BFFB8] uppercase tracking-[0.1em]">Uplink Stable</span>
                          </div>
                       </div>
                    </header>

        {/* CONTENT SCROLL */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
           
           {/* ALERTS TICKER */}
           <div className="bg-[#6BFFB8]/5 border border-[#6BFFB8]/10 py-2 px-5 rounded-lg mb-8 flex items-center gap-3 overflow-hidden">
              <Bell size={12} className="text-[#6BFFB8] animate-bounce" />
              <div className="text-[10px] font-bold text-[#8A9A8A] uppercase tracking-[0.2em] whitespace-nowrap animate-marquee">
                System Active // Neural Link Confirmed // All Base Sectors Operational // Monitoring 14 High-Altitude Signals
              </div>
           </div>

           {/* DASHBOARD GRID */}
           <AnimatePresence mode="wait">
              {activeTab === 'command-center' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                   {/* STATS */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {stats.map((stat, i) => (
                        <div key={i} className={`bg-[#161A16] p-6 rounded-[1.5rem] border border-[#6BFFB8]/10 relative overflow-hidden group hover:border-[#6BFFB8]/30 transition-all ${stat.urgent ? 'border-[#FF4444]/30' : ''}`}>
                           <div className="absolute right-4 top-4 opacity-10 group-hover:scale-125 transition-transform" style={{ color: stat.color }}>{stat.icon}</div>
                           <p className="text-[11px] font-bold text-[#8A9A8A] uppercase tracking-wider mb-2">{stat.label}</p>
                           <h4 className="text-4xl font-black font-headline italic tracking-tighter mb-1">{stat.value}</h4>
                           <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: stat.color }}>{stat.sub}</p>
                        </div>
                      ))}
                   </div>

                   {/* CHARTS */}
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8 bg-[#161A16] p-8 rounded-[2rem] border border-[#6BFFB8]/10">
                         <div className="flex justify-between mb-8">
                            <div>
                               <h3 className="text-lg font-black italic uppercase italic">Launch Frequency</h3>
                               <p className="text-[10px] text-[#4A5A4A] uppercase font-bold tracking-widest">Global Expedition Volume</p>
                            </div>
                         </div>
                         <div className="h-[200px] md:h-[300px]">
                            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(107,255,184,0.05)' }, ticks: { color: '#4A5A4A', font: { size: 9 } } }, x: { grid: { display: false }, ticks: { color: '#4A5A4A', font: { size: 9 } } } } }} />
                         </div>
                      </div>
                      <div className="lg:col-span-4 bg-[#161A16] p-8 rounded-[2rem] border border-[#6BFFB8]/10">
                         <div className="mb-8 text-center">
                            <h3 className="text-lg font-black italic uppercase italic">Trek Proficiency</h3>
                            <p className="text-[10px] text-[#4A5A4A] uppercase font-bold tracking-widest">User Difficulty Metrics</p>
                         </div>
                         <div className="h-[200px] md:h-[300px] flex items-center justify-center">
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#4A5A4A', font: { size: 9 }, padding: 10 } } }, cutout: '75%' }} />
                         </div>
                      </div>
                   </div>

                   {/* MAP PREVIEW */}
                   <div className="bg-[#161A16] rounded-[2rem] border border-[#6BFFB8]/10 h-[400px] overflow-hidden relative">
                      <div className="absolute inset-0 bg-[#0D0F0D] opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                      <div className="absolute top-6 left-8 flex items-center gap-4">
                         <div className="bg-[#6BFFB8]/10 border border-[#6BFFB8]/20 px-4 py-2 rounded-lg">
                            <span className="text-[10px] font-black text-[#6BFFB8] uppercase tracking-widest">TACTICAL SECTOR: HIMALAYAS</span>
                         </div>
                      </div>
                      <div className="absolute bottom-6 right-8 text-right">
                         <p className="text-[8px] font-bold text-[#4A5A4A] uppercase tracking-[0.5em]">Topographical Overlay v4.2</p>
                      </div>

                      {/* MOCK VECTOR DOTS */}
                      {[
                        { t: '30%', l: '40%', name: 'Summit Group A' },
                        { t: '50%', l: '60%', name: 'Rendezvous B' },
                        { t: '20%', l: '25%', name: 'Base Camp X' },
                      ].map((dot, idx) => (
                        <div key={idx} className="absolute group" style={{ top: dot.t, left: dot.l }}>
                           <div className="w-3 h-3 bg-[#6BFFB8] rounded-full animate-ping absolute -inset-0.5 opacity-50" />
                           <div className="w-2 h-2 bg-[#6BFFB8] rounded-full relative z-10" />
                           <div className="absolute top-4 left-4 bg-black/80 border border-[#6BFFB8]/20 p-2 rounded-lg text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              VECTOR: {dot.name}
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'sos-hub' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   {sosSignals.filter(s=>s.status==='ACTIVE').length > 0 ? (
                     <div className="space-y-6">
                        {sosSignals.map(signal => (
                          <div key={signal.id} className={`bg-[#161A16] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-l-4 md:border-l-8 transition-all ${signal.status === 'ACTIVE' ? 'border-[#FF4444] animate-sos-glow' : 'border-[#4A5A4A] opacity-60'}`}>
                             <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-8 flex flex-col justify-center">
                                   <div className="flex items-center gap-4 mb-4">
                                      <span className="text-[#FF4444] text-[10px] font-black uppercase tracking-[0.2em]">● SOS SIGNAL #{signal.id.toString().substring(0,6)}</span>
                                      <span className="text-[#4A5A4A] text-[9px] font-bold">{new Date(signal.created_at).toLocaleString()}</span>
                                   </div>
                                   <h3 className="text-xl md:text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-2 break-all text-white font-headline">{signal.user_email}</h3>
                                   <p className="text-[#6BFFB8] font-bold text-[9px] md:text-[11px] tracking-widest mb-4 md:mb-6 uppercase">LOCATION: {signal.coordinates.lat.toFixed(6)}, {signal.coordinates.lng.toFixed(6)}</p>
                                   <div className="prose prose-invert border-t border-white/5 pt-4">
                                      <p className="text-white/60 text-sm italic font-medium">"{signal.message}"</p>
                                   </div>
                                </div>
                                <div className="md:col-span-4 bg-black/30 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                         <label className="text-[8px] font-black text-[#4A5A4A] uppercase tracking-widest">Priority</label>
                                         <span className="block text-xs font-bold text-white uppercase">{signal.priority}</span>
                                      </div>
                                      <div className="space-y-1">
                                         <label className="text-[8px] font-black text-[#4A5A4A] uppercase tracking-widest">Medical</label>
                                         <span className="block text-xs font-bold text-[#FFD166] uppercase">Critical Alert</span>
                                      </div>
                                   </div>
                                   <div className="mt-8 space-y-3">
                                      {signal.status === 'ACTIVE' ? (
                                        <>
                                          <button 
                                            onClick={() => resolveSos(signal.id)}
                                            className="w-full bg-[#6BFFB8] text-black font-black uppercase py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all outline-none"
                                          >
                                            ACKNOWLEDGE & RESOLVE
                                          </button>
                                          <button className="w-full bg-white/5 text-white/40 border border-white/10 font-black uppercase py-3 rounded-2xl text-[9px] tracking-widest hover:bg-white/10">NOTIFY RESCUE BASE</button>
                                        </>
                                      ) : (
                                        <div className="flex items-center justify-center gap-2 text-[#6BFFB8] py-4 bg-[#6BFFB8]/5 rounded-2xl border border-[#6BFFB8]/20">
                                           <CheckCircle2 size={16} />
                                           <span className="text-[10px] font-black uppercase tracking-widest">Situation Resolved</span>
                                        </div>
                                      )}
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-20 italic">
                        <ShieldAlert size={100} className="mb-6" />
                        <h4 className="text-2xl font-black uppercase tracking-widest">HQ SECURE</h4>
                        <p className="text-sm">No active emergency signals on the net.</p>
                     </div>
                   )}
                </motion.div>
              )}

              {activeTab === 'gear-depot' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                   {/* PENDING REQUESTS SECTION */}
                   <div className="bg-[#161A16] rounded-[2.5rem] border border-[#6BFFB8]/10 overflow-hidden">
                      <div className="p-8 border-b border-[#6BFFB8]/10 flex justify-between items-center">
                         <div>
                            <h3 className="text-xl font-black italic uppercase">Equipment Requests</h3>
                            <p className="text-[10px] text-[#4A5A4A] uppercase font-bold tracking-widest">Strategic Asset Deployment</p>
                         </div>
                         <div className="flex gap-2">
                            <span className="bg-[#FFD166]/10 text-[#FFD166] text-[9px] font-black px-3 py-1.5 rounded-full border border-[#FFD166]/20">
                              {gearRequests.filter(r=>r.status==='PENDING').length} IN QUEUE
                            </span>
                         </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                         <table className="w-full text-left">
                            <thead className="bg-[#1c211c]">
                               <tr>
                                  <th className="px-8 py-4 text-[10px] font-bold text-[#4A5A4A] uppercase tracking-widest">ID</th>
                                  <th className="px-8 py-4 text-[10px] font-bold text-[#4A5A4A] uppercase tracking-widest">Agent</th>
                                  <th className="px-8 py-4 text-[10px] font-bold text-[#4A5A4A] uppercase tracking-widest">Mission</th>
                                  <th className="px-8 py-4 text-[10px] font-bold text-[#4A5A4A] uppercase tracking-widest">Inventory</th>
                                  <th className="px-8 py-4 text-[10px] font-bold text-[#4A5A4A] uppercase tracking-widest">Status</th>
                                  <th className="px-8 py-4 text-[10px] font-bold text-[#4A5A4A] uppercase tracking-widest">Control</th>
                               </tr>
                            </thead>
                            <tbody>
                               {gearRequests.map((req, idx) => (
                                 <tr key={req.id} className="border-b border-[#6BFFB8]/5 hover:bg-[#6BFFB8]/5 transition-colors">
                                    <td data-label="ID" className="px-8 py-6 font-mono text-[10px] text-[#6BFFB8]">G-{(idx+100)}</td>
                                    <td data-label="Agent" className="px-8 py-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-[#6BFFB8]/10 flex items-center justify-center text-[#6BFFB8] font-black text-[10px]">
                                             {req.user_email?.[0].toUpperCase()}
                                          </div>
                                          <span className="text-xs font-bold">{req.user_email}</span>
                                       </div>
                                    </td>
                                    <td data-label="Mission" className="px-8 py-6">
                                       <span className="text-[10px] font-bold text-white uppercase tracking-wider">{req.trek_name}</span>
                                    </td>
                                    <td data-label="Inventory" className="px-8 py-6">
                                       <div className="flex flex-wrap gap-1 max-w-[200px]">
                                          {req.gear_items.map(item => (
                                            <span key={item} className="text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60 font-black uppercase">
                                              {item}
                                            </span>
                                          ))}
                                       </div>
                                    </td>
                                    <td data-label="Status" className="px-8 py-6">
                                       <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                         req.status === 'PENDING' ? 'bg-[#FFD166]/10 text-[#FFD166] border border-[#FFD166]/20' :
                                         req.status === 'APPROVED' ? 'bg-[#6BFFB8]/10 text-[#6BFFB8] border border-[#6BFFB8]/20' :
                                         'bg-[#FF4444]/10 text-[#FF4444] border border-[#FF4444]/20'
                                       }`}>
                                          {req.status}
                                       </span>
                                    </td>
                                    <td data-label="Control" className="px-8 py-6">
                                       {req.status === 'PENDING' ? (
                                         <div className="flex items-center gap-2">
                                            <button onClick={() => updateGear(req.id, 'APPROVED')} className="p-2 bg-[#6BFFB8] text-black rounded-lg hover:scale-110 transition-transform"><CheckCircle2 size={14}/></button>
                                            <button onClick={() => updateGear(req.id, 'REJECTED')} className="p-2 bg-[#FF4444] text-white rounded-lg hover:scale-110 transition-transform"><XCircle size={14}/></button>
                                         </div>
                                       ) : (
                                         <span className="text-[9px] font-bold text-[#4A5A4A] italic">Closed Case</span>
                                       )}
                                    </td>
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                         {gearRequests.length === 0 && (
                           <div className="p-12 text-center text-[#4A5A4A] italic text-xs uppercase tracking-widest">Inventory logs empty. awaiting requests.</div>
                         )}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                   <div className="bg-[#161A16] p-8 rounded-[2rem] border border-[#6BFFB8]/10 h-[400px]">
                      <h3 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3">
                         <MapIcon className="text-[#6BFFB8]" size={20} /> Regional Dominance
                      </h3>
                      <Bar 
                        data={{
                          labels: ['Kedarnath', 'Roopkund', 'Chadar', 'Pin Parvati', 'Hampta'],
                          datasets: [{ data: [120, 85, 42, 67, 98], backgroundColor: '#6BFFB8', borderRadius: 8 }]
                        }} 
                        options={{ 
                          maintainAspectRatio: false, 
                          plugins: { legend: { display: false } },
                          scales: { y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#4A5A4A' } }, x: { grid: { display: false }, ticks: { color: '#4A5A4A' } } }
                        }}
                      />
                   </div>
                   <div className="bg-[#161A16] p-8 rounded-[2rem] border border-[#6BFFB8]/10 h-[400px]">
                      <h3 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3">
                         <Activity className="text-[#6BFFB8]" size={20} /> Neural Link Uptime
                      </h3>
                      <Line 
                        data={{
                          labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
                          datasets: [{ data: [99.8, 99.9, 99.7, 99.9, 100, 99.9], borderColor: '#6BFFB8', tension: 0.4 }]
                        }} 
                        options={{ 
                          maintainAspectRatio: false, 
                          plugins: { legend: { display: false } },
                          scales: { y: { min: 99, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#4A5A4A' } }, x: { grid: { display: false }, ticks: { color: '#4A5A4A' } } }
                        }}
                      />
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>

      <style jsx>{`
        .font-barlow { font-family: 'Barlow', sans-serif; }
        .font-headline { font-family: 'Barlow Condensed', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(107,255,184,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(107,255,184,0.3); }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @keyframes sos-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 68, 68, 0.1); }
          50% { box-shadow: 0 0 40px rgba(255, 68, 68, 0.3); }
        }
        .animate-sos-glow {
          animation: sos-glow 2s infinite;
        }

        @media (max-width: 1024px) {
           .admin-shell { flex-direction: column; overflow-y: auto; }
           aside { 
             width: 100%; 
             height: auto; 
             border-right: none; 
             border-bottom: 1px solid rgba(107,255,184,0.1); 
             padding: 1rem;
             position: sticky;
             top: 0;
             background: #0F120F;
           }
           aside h1 { font-size: 1.25rem; }
           aside .mb-10 { mb-4 !important; }
           nav { 
             display: flex; 
             overflow-x: auto; 
             padding-bottom: 0.5rem; 
             gap: 0.5rem;
             mask-image: linear-gradient(to right, black 80%, transparent);
           }
           nav button { flex-shrink: 0; width: auto !important; padding: 0.5rem 1rem !important; }
           nav p { display: none; }
           .sidebar-bottom { display: none; }
           
           header { height: auto; padding: 1rem; flex-direction: column; gap: 1rem; }
           header .w-64 { width: 100%; }
           
           main { height: auto; overflow: visible; }
           .custom-scrollbar { overflow: visible; padding: 1rem !important; }
        }

        @media (max-width: 640px) {
           .grid-cols-12 { grid-template-columns: 1fr; }
           .lg\:col-span-8, .lg\:col-span-4 { grid-column: span 1 / span 1; }
           .text-4xl { font-size: 2rem; }
           .p-8 { padding: 1.5rem !important; }
           table thead { display: none; }
           table tr { display: block; margin-bottom: 1rem; border: 1px solid rgba(107,255,184,0.1); border-radius: 1rem; background: rgba(255,255,255,0.02); }
           table td { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem !important; border-bottom: 1px solid rgba(107,255,184,0.05); }
           table td::before { content: attr(data-label); font-[10px]; font-weight: 800; color: #4A5A4A; text-transform: uppercase; }
           table td:last-child { border-bottom: none; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
