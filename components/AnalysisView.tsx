
import React from 'react';
import { AnalysisResult, UserInput } from '../types';
import { TrendingUp, Info, ExternalLink, ShieldCheck, Target, Euro, BarChart3, Plus, Minus } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface Props {
  result: AnalysisResult;
  input: UserInput;
}

const AnalysisView: React.FC<Props> = ({ result, input }) => {
  const chartData = [
    { name: 'Aktuell', val: input.currentColdRent / input.sizeSqm },
    { name: 'Potential', val: result.estimatedMarketRentPerSqm }
  ];

  const formatCurrency = (v: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Miet-Potential</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{formatCurrency(result.estimatedTotalMarketRent)}</span>
            <span className="text-xs font-bold text-slate-400">/ Monat</span>
          </div>
        </div>
        
        <div className="bg-[#034933] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Mehrerlös p.a.</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#f5931f]">+{formatCurrency(result.potentialYearlyGain)}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} className="text-[#f5931f]" />
              <span className="text-xs font-bold">Steigerung: {result.rentGapPercentage.toFixed(1)}%</span>
            </div>
          </div>
          <Target className="absolute -right-4 -bottom-4 text-white/5" size={100} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sicherheit</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-slate-900">{result.confidenceScore}%</span>
            <ShieldCheck size={20} className="text-green-500" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-1">KI-Konfidenzlevel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Market Insight Block */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-[#f5931f]" size={20} />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Markt-Analyse</h3>
             </div>
             <p className="text-slate-600 leading-relaxed font-serif-brand italic text-lg mb-8">
               "{result.locationAnalysis}"
             </p>

             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} unit="€" />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="val" radius={[8, 8, 0, 0]} barSize={50}>
                      <Cell fill="#cbd5e1" />
                      <Cell fill="#f5931f" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-[10px] font-black text-slate-400 uppercase mt-4 tracking-widest">€ / m² Kaltmiete</p>
             </div>
          </div>

          {/* Sources Section (Critical for Grounding Compliance) */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} /> Marktdaten-Quellen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.sources.map((s, idx) => (
                <a 
                  key={idx} 
                  href={s.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-[#f5931f] transition-all group"
                >
                  <span className="text-xs font-bold text-slate-700 truncate mr-2">{s.title}</span>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-[#f5931f]" />
                </a>
              ))}
              {result.sources.length === 0 && (
                <p className="text-xs text-slate-400 italic">Keine externen Links gefunden. Analyse basiert auf internen Trainingsdaten.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Factors */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Wertfaktoren</h4>
             <div className="space-y-6">
                {result.featureImpacts.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${f.direction === 'positive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                       {f.direction === 'positive' ? <Plus size={16} /> : <Minus size={16} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{f.feature}</p>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${f.direction === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {f.direction === 'positive' ? '+' : ''}{f.impactPercent}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-12 p-6 bg-[#034933] rounded-xl text-white text-center">
                <Euro className="mx-auto mb-2 text-[#f5931f]" size={24} />
                <p className="text-xs font-bold mb-4 uppercase tracking-wider">Lassen Sie Ihr Potential realisieren</p>
                <button className="w-full py-2.5 bg-[#f5931f] text-white rounded-lg text-[11px] font-black uppercase hover:bg-white hover:text-[#034933] transition-all">
                  Experten kontaktieren
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
