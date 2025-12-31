import React, { useState } from 'react';
import { PropertyType, Condition, UserInput } from '../types';
import { Calculator, MapPin, Ruler, Home, Coins, CalendarDays } from 'lucide-react';

interface InputFormProps {
  isLoading: boolean;
  onSubmit: (data: UserInput) => void;
}

const InputForm: React.FC<InputFormProps> = ({ isLoading, onSubmit }) => {
  const [formData, setFormData] = useState<UserInput>({
    address: '',
    propertyType: PropertyType.APARTMENT,
    sizeSqm: 60,
    rooms: 2,
    yearBuilt: 1990, // Standardwert für Baujahr
    condition: Condition.WELL_KEPT,
    currentColdRent: 500,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Zahlenfelder korrekt als Nummer speichern
      [name]: ['sizeSqm', 'rooms', 'yearBuilt', 'currentColdRent'].includes(name)
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    /* Container: Dark Mode Background & Border */
    <div className="bg-slate-900/50 rounded-2xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
      
      {/* Form Header */}
      <div className="bg-slate-900 p-6 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calculator className="text-[#f5931f]" size={20} />
          Ihre Immobilien-Daten
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Geben Sie die Eckdaten ein für eine präzise KI-Analyse.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Adresse */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Adresse</label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#f5931f] transition-colors h-5 w-5" />
            <input
              type="text"
              name="address"
              required
              placeholder="Musterstraße 1, 10115 Berlin"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:ring-1 focus:ring-[#f5931f] focus:border-[#f5931f] transition-all outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Objektart */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Objektart</label>
            <div className="relative">
                <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-[#f5931f] focus:border-[#f5931f] appearance-none cursor-pointer outline-none"
                >
                {Object.values(PropertyType).map(type => (
                    <option key={type} value={type} className="bg-slate-900">{type}</option>
                ))}
                </select>
            </div>
          </div>

          {/* Zustand */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zustand</label>
            <div className="relative">
                <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-[#f5931f] focus:border-[#f5931f] appearance-none cursor-pointer outline-none"
                >
                {Object.values(Condition).map(cond => (
                    <option key={cond} value={cond} className="bg-slate-900">{cond}</option>
                ))}
                </select>
            </div>
          </div>

          {/* Wohnfläche */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wohnfläche (m²)</label>
            <div className="relative group">
              <Ruler className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#f5931f] transition-colors h-5 w-5" />
              <input
                type="number"
                name="sizeSqm"
                min="10"
                required
                value={formData.sizeSqm}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none transition-all"
              />
            </div>
          </div>

          {/* Zimmer */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zimmer</label>
            <div className="relative group">
              <Home className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#f5931f] transition-colors h-5 w-5" />
              <input
                type="number"
                name="rooms"
                min="1"
                step="0.5"
                required
                value={formData.rooms}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none transition-all"
              />
            </div>
          </div>

          {/* Baujahr (HIER IST ES!) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Baujahr</label>
            <div className="relative group">
              <CalendarDays className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#f5931f] transition-colors h-5 w-5" />
              <input
                type="number"
                name="yearBuilt"
                min="1800"
                max={new Date().getFullYear()}
                required
                value={formData.yearBuilt}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none transition-all"
              />
            </div>
          </div>

          {/* Kaltmiete */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aktuelle Kaltmiete (€)</label>
            <div className="relative group">
              <Coins className="absolute left-3 top-3 text-slate-500 group-focus-within:text-[#f5931f] transition-colors h-5 w-5" />
              <input
                type="number"
                name="currentColdRent"
                min="0"
                required
                value={formData.currentColdRent}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg text-slate-900 font-bold text-lg shadow-[0_0_20px_rgba(245,147,31,0.2)] transition-all transform hover:-translate-y-0.5 active:translate-y-0
            ${isLoading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-[#f5931f] hover:bg-[#ffaa40] hover:shadow-[0_0_30px_rgba(245,147,31,0.4)]'}`}
        >
          {isLoading ? 'Analysiere Daten...' : 'POTENZIAL BERECHNEN'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
