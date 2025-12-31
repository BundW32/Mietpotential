
import React, { useState, useEffect } from 'react';
import { PropertyType, Condition, UserInput } from '../types';
import { MapPin, Ruler, Building, Coins, Sparkles, Loader2, ChevronRight, Home } from 'lucide-react';

interface Props {
  isLoading: boolean;
  onSubmit: (data: UserInput) => void;
}

const InputForm: React.FC<Props> = ({ isLoading, onSubmit }) => {
  const [formData, setFormData] = useState<UserInput>({
    address: '',
    propertyType: PropertyType.APARTMENT,
    sizeSqm: 75,
    rooms: 3,
    yearBuilt: 1990,
    condition: Condition.WELL_KEPT,
    currentColdRent: 700,
    hasTripleGlazing: false,
    hasBalcony: true,
    hasFloorHeating: false,
    isBarrierFree: false,
    hasModernBathroom: true
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (formData.address.length < 5) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(formData.address)}&limit=5`);
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (e) { console.error(e); }
    }, 400);
    return () => clearTimeout(timer);
  }, [formData.address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      <div className="bg-[#034933] px-6 py-4 flex justify-between items-center">
        <h2 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          <Building size={16} className="text-[#f5931f]" />
          Objekt-Eckdaten
        </h2>
        {isLoading && (
          <div className="text-[10px] text-white/70 flex items-center gap-2 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
            <Loader2 className="animate-spin" size={12} />
            KI RECHERCHIERT...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Address Input */}
        <div className="relative">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">Standort (Adresse)</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 text-[#f5931f]" size={18} />
            <input 
              type="text" 
              value={formData.address}
              onChange={(e) => {
                setFormData({...formData, address: e.target.value});
                setShowSuggestions(true);
              }}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#f5931f]/20 focus:border-[#f5931f] transition-all text-slate-800"
              placeholder="Straße, Hausnummer, PLZ, Ort"
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const p = s.properties;
                    setFormData({...formData, address: `${p.street || ''} ${p.housenumber || ''}, ${p.postcode || ''} ${p.city || ''}`});
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm border-b border-slate-100 last:border-0"
                >
                  {s.properties.street} {s.properties.housenumber}, {s.properties.city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">Fläche (m²)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-3 text-slate-400" size={14} />
              <input 
                type="number" 
                value={formData.sizeSqm}
                onChange={(e) => setFormData({...formData, sizeSqm: Number(e.target.value)})}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f5931f] text-sm" 
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">Baujahr</label>
            <input 
              type="number" 
              value={formData.yearBuilt}
              onChange={(e) => setFormData({...formData, yearBuilt: Number(e.target.value)})}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f5931f] text-sm" 
            />
          </div>
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">Ist-Miete (€)</label>
            <div className="relative">
              <Coins className="absolute left-3 top-3 text-slate-400" size={14} />
              <input 
                type="number" 
                value={formData.currentColdRent}
                onChange={(e) => setFormData({...formData, currentColdRent: Number(e.target.value)})}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f5931f] text-sm" 
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">Zimmer</label>
            <input 
              type="number" 
              value={formData.rooms}
              onChange={(e) => setFormData({...formData, rooms: Number(e.target.value)})}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f5931f] text-sm" 
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'hasBalcony', label: 'Balkon' },
            { id: 'hasFloorHeating', label: 'Fußbodenhzg.' },
            { id: 'isBarrierFree', label: 'Barrierefrei' },
            { id: 'hasTripleGlazing', label: '3-fach Glas' }
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-[#f5931f] transition-all">
              <input 
                type="checkbox" 
                checked={(formData as any)[opt.id]}
                onChange={(e) => setFormData({...formData, [opt.id]: e.target.checked})}
                className="w-4 h-4 accent-[#f5931f]"
              />
              <span className="text-[11px] font-bold text-slate-600 uppercase">{opt.label}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.address}
          className="w-full py-4 bg-[#f5931f] text-white font-black rounded-xl shadow-lg shadow-[#f5931f]/20 hover:bg-[#034933] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
          Potential jetzt analysieren
          <ChevronRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default InputForm;
