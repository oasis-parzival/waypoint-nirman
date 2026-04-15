import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto space-y-12 md:space-y-16">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] font-label">Explorer Profile</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mt-2 font-headline">Cartographer’s <br className="md:hidden" /> <span className="text-primary italic">Ledger</span></h1>
        </div>
        <div className="flex gap-4">
          <button className="flex-grow md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all font-label">Edit Bio</button>
          <button className="flex-grow md:flex-none px-6 py-3 bg-primary text-on-primary rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all font-label">New Map</button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total Ascent", value: "24,540m", icon: "mountain_flag", color: "text-primary" },
          { label: "Maps Rendered", value: "12", icon: "target", color: "text-white" },
          { label: "Active Plans", value: "03", icon: "schedule", color: "text-white" },
          { label: "XP Level", value: "Elite", icon: "verified", color: "text-tertiary" }
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <span className={`material-symbols-outlined ${stat.color} text-2xl`}>{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 font-label">{stat.label}</p>
              <p className="text-2xl md:text-4xl font-bold text-white tracking-tighter font-headline">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        {/* Saved Treks */}
        <div className="lg:col-span-12 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white font-headline">Saved Archivals</h3>
            <Link to="/discover" className="text-primary font-bold text-[10px] uppercase tracking-widest font-label">Explore More</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Karakoram K2", status: "Plan Active", date: "Sep 2025" },
              { name: "Baltoro Glacier", status: "Archived", date: "Aug 2024" }
            ].map((trek) => (
              <div key={trek.name} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl group cursor-pointer hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-primary font-headline">0{trek.name[0]}</div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors font-headline">{trek.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-label">{trek.date}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/60 font-label">{trek.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
