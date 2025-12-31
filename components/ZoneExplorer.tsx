import React, { useState } from 'react';
import { MapPin, Info } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  description: string;
  color: string;
  examples: string[];
}

interface ZoneExplorerProps {
  zones: Zone[];
  cityName: string;
}

const ZoneExplorer: React.FC<ZoneExplorerProps> = ({ zones, cityName }) => {
  const [activeZone, setActiveZone] = useState<string | null>(zones[0]?.id || null);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <MapPin className="text-[#f5931f]" size={16} />
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">
          Lage-Analyse: {cityName}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Sidebar List */}
        <div className="border-b md:border-b-0 md:border-r border-slate-800 p-2 space-y-1">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${
                activeZone === zone.id 
                  ? 'bg-[#f5931f] text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {zone.name}
              {activeZone === zone.id && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="col-span-2 p-6 bg-slate-950/30">
          {zones.map((zone) => {
             if (zone.id !== activeZone) return null;
             return (
               <div key={zone.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
                 <h4 className="text-lg font-black text-white mb-2">{zone.name}</h4>
                 <p className="text-sm text-slate-400 leading-relaxed mb-6">{zone.description}</p>
                 
                 <div>
                   <p className="text-[10px] font-bold text-[#f5931f] uppercase tracking-widest mb-2 flex items-center gap-1">
                     <Info size={12} /> Typische Merkmale
                   </p>
                   <div className="flex flex-wrap gap-2">
                     {zone.examples.map((ex, i) => (
                       <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-slate-300">
                         {ex}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default ZoneExplorer;
