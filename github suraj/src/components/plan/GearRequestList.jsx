import React from 'react';

const GearRequestList = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="glass-card p-10 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center opacity-30">
        <span className="material-symbols-outlined text-5xl mb-4">inventory_2</span>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-label">No gear requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] font-label">Your Gear Requests</h3>
        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{requests.length} Active</span>
      </div>
      
      <div className="space-y-3">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className="glass-card p-5 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all group"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{request.gear_item}</h4>
                  <span className="text-[10px] text-white/30">× {request.quantity}</span>
                </div>
                {request.notes && (
                  <p className="text-[11px] text-white/40 leading-relaxed italic">"{request.notes}"</p>
                )}
                <p className="text-[9px] text-white/20 font-label uppercase tracking-widest pt-1">
                  Requested for: {request.trek_name}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                  request.status === 'pending' 
                    ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' 
                    : 'text-primary bg-primary/10 border-primary/20'
                }`}>
                  {request.status}
                </span>
                <span className="text-[9px] text-white/20 font-label">
                  {new Date(request.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GearRequestList;
