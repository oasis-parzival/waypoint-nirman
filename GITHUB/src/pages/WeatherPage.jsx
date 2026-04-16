import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WEATHER_API_KEY = 'ecf38ca4cb9b455fa86113143261604';
const GROQ_API_KEY = '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';

const WeatherPage = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('PANVEL'); // Default
  const [error, setError] = useState(null);

  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // Use 'q' parameter which accepts city name or 'lat,lon'
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${query}&days=3&aqi=yes`
      );
      if (!response.ok) throw new Error('Location not found in technical database.');
      const data = await response.json();
      setWeatherData(data);
      setSearchQuery(data.location.name); // Sync search bar with actual location name
      runSentinelAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLiveLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your current terminal.");
      fetchWeather('PANVEL');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      (err) => {
        console.warn('Location Access Denied:', err);
        setError("Location access denied. Falling back to default coordinates.");
        fetchWeather('PANVEL');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const runSentinelAnalysis = async (data) => {
    setIsAnalyzing(true);
    try {
      const prompt = `
        Analyze the following weather data for a tactical trekking mission:
        Location: ${data.location.name}, ${data.location.region}
        Conditions: ${data.current.condition.text}
        Temperature: ${data.current.temp_c}°C
        Wind: ${data.current.wind_kph} kph ${data.current.wind_dir}
        Humidity: ${data.current.humidity}%
        UV Index: ${data.current.uv}
        Visibility: ${data.current.vis_km} km
        Precipitation: ${data.current.precip_mm} mm
        
        Provide a tactical terrain assessment. Is it safe for high-altitude movement? What gear is critical? 
        Use a professional, military-intel tone. Max 4 concise sentences.
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are the Waypoint Sentinel. Provide tactical weather intelligence for elite trekkers.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 250
        })
      });

      const result = await response.json();
      setAnalysis(result.choices[0]?.message?.content || "Analysis signal lost.");
    } catch (err) {
      console.error('Analysis failed:', err);
      setAnalysis("Sentinel uplink failed. Terrain analysis unavailable.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchWeather(searchQuery);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-background text-on-surface overflow-hidden relative">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tertiary/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 font-label">Tactical Weather Uplink</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white font-headline">
              MET-INT <span className="text-primary">TRACKING</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={getLiveLocation}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full px-6 py-4 transition-all text-primary"
            >
              <span className="material-symbols-outlined text-sm font-bold">location_on</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Sync GPS</span>
            </button>

            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="TARGET COORDINATES (CITY)..."
                className="bg-white/5 border border-white/10 rounded-full px-8 py-4 w-full md:w-[400px] text-sm uppercase font-bold tracking-widest outline-none focus:border-primary/50 transition-all font-label"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                <span className="material-symbols-outlined font-bold">radar</span>
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="glass-card p-6 rounded-3xl border-red-500/20 mb-8 flex items-center gap-4">
            <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
            <p className="font-bold text-red-500 uppercase tracking-widest text-xs">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-primary/20 rounded-full animate-spin border-t-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl animate-pulse">satellite_alt</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 animate-pulse">Syncing with Sentinel Satellites...</p>
          </div>
        ) : weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* MAIN CARD - CURRENT CONDITIONS */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="glass-card rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
                {/* SCANNER EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent h-1/2 -translate-y-full group-hover:animate-scanner pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={weatherData.current.condition.icon} alt="Weather" className="w-20 h-20 filter drop-shadow-[0_0_10px_rgba(160,209,188,0.5)]" />
                      <div>
                        <p className="text-5xl font-black text-white uppercase italic font-headline">{weatherData.location.name}</p>
                        <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs font-label">{weatherData.current.condition.text}</p>
                      </div>
                    </div>

                    <div className="flex items-end gap-2 text-white">
                      <span className="text-8xl md:text-9xl font-black tracking-tighter italic font-headline">{Math.round(weatherData.current.temp_c)}°</span>
                      <span className="text-2xl font-bold pb-4 text-white/40 uppercase font-headline">Celsius</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    {[
                      { label: 'Humidity', val: `${weatherData.current.humidity}%`, icon: 'water_drop' },
                      { label: 'Wind Speed', val: `${weatherData.current.wind_kph} kph`, icon: 'air' },
                      { label: 'Pressure', val: `${weatherData.current.pressure_mb} mb`, icon: 'compress' },
                      { label: 'Visibility', val: `${weatherData.current.vis_km} km`, icon: 'visibility' },
                    ].map((idx) => (
                      <div key={idx.label} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="material-symbols-outlined text-primary/40 text-sm">{idx.icon}</span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{idx.label}</span>
                        <span className="text-sm font-black text-white">{idx.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 h-px bg-white/10" />

                <div className="mt-8 flex flex-wrap gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-orange-500">wb_sunny</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">UV Index</p>
                      <p className="text-sm font-black text-white">{weatherData.current.uv} ({weatherData.current.uv > 6 ? 'HIGH ALERT' : 'MODERATE'})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-500">rainy</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Precipitation</p>
                      <p className="text-sm font-black text-white">{weatherData.current.precip_mm} mm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">navigation</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Wind Vector</p>
                      <p className="text-sm font-black text-white">{weatherData.current.wind_dir} @ {weatherData.current.wind_degree}°</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* HOURLY FORECAST */}
              <div className="glass-card rounded-[2rem] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] font-label italic flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">history_toggle_off</span>
                    Chronological Projection
                  </h3>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Next 24 Hours</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {weatherData.forecast.forecastday[0].hour.filter((_, i) => i % 2 === 0).map((hour, idx) => (
                    <div key={idx} className="flex-shrink-0 w-24 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-white/10 transition-colors">
                      <span className="text-[10px] font-bold text-white/40">{hour.time.split(' ')[1]}</span>
                      <img src={hour.condition.icon} alt="Icon" className="w-8 h-8" />
                      <span className="text-lg font-black text-white font-headline">{Math.round(hour.temp_c)}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR - SENTINEL AI ANALYSIS */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-card rounded-[2.5rem] p-8 border-primary/20 bg-primary/5 h-full flex flex-col relative overflow-hidden">
                {/* DECORATIVE ELEMENTS */}
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-10 h-10 border-r-2 border-t-2 border-primary/30" />
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center rotate-3 shadow-[0_0_30px_rgba(160,209,188,0.4)]">
                      <span className="material-symbols-outlined text-black text-3xl font-bold">smart_toy</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Sentinel Analysis</h2>
                    <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">Neural Link Active</p>
                  </div>
                </div>

                <div className="flex-grow">
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="absolute -left-2 -top-2 text-primary/20 text-4xl font-serif">"</span>
                      <p className="text-[12px] leading-relaxed text-white/80 font-label tracking-wide border-l-2 border-primary/20 pl-6 py-2">
                        {analysis}
                      </p>
                      <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                        <div className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-primary text-sm mt-1">task_alt</span>
                          <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Mission Readiness</p>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: weatherData.current.vis_km > 5 ? '90%' : '40%' }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-primary text-sm mt-1">verified_user</span>
                          <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Safety Protocols</p>
                            <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest">
                              {weatherData.current.precip_mm > 0 ? 'CRITICAL GEAR: WATERPROOFING REQUIRED' : 'GEAR STATUS: OPTIMAL'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-12 p-6 bg-black/40 rounded-3xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/20 uppercase">Air Quality Index</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black">STABLE</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white italic font-headline">{weatherData.current.air_quality.pm2_5.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-white/40 mb-1 tracking-widest uppercase italic">Micrograms/m³</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scanner {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .animate-scanner {
          animation: scanner 3s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default WeatherPage;
