import React, { useState, useRef, useEffect } from 'react';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import { UserInput, AnalysisResult } from './types';
import { analyzePotential } from './services/geminiService';
import { AlertCircle, Scale, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  // --- WORDPRESS INTEGRATION (Crucial for your site) ---
  useEffect(() => {
    const sendHeight = () => {
      if (appRef.current) {
        const height = appRef.current.scrollHeight;
        // Sends the exact height to your WordPress page
        window.parent.postMessage({ type: 'setHeight', height }, '*');
      }
    };

    // Check height on load, resize, and DOM changes
    sendHeight();
    window.addEventListener('resize', sendHeight);
    const observer = new ResizeObserver(sendHeight);
    if (appRef.current) {
      observer.observe(appRef.current);
    }

    return () => {
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
    };
  }, [result, userInput, error]); // Update height whenever content changes

  const handleAnalysis = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data);
    setResult(null);

    try {
      const analysis = await analyzePotential(data);
      setResult(analysis);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err: any) {
      console.error("App Error:", err);
      let msg = "Die Analyse konnte nicht abgeschlossen werden.";
      if (err.message?.includes("500") || err.message?.includes("Internal Server Error")) {
        msg = "Der Analyse-Server ist momentan überlastet. Bitte versuchen Sie es in wenigen Sekunden erneut.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 'overflow-hidden' ensures no scrollbars appear inside the frame
    <div ref={appRef} className="w-full bg-transparent text-slate-900 font-sans selection:bg-[#f5931f]/30 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8">
               <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                  <path d="M45 15 L75 5 L75 95 H45 V15 Z" fill="#f5931f" />
                  <path d="M15 35 L40 30 V95 H15 V35 Z" fill="#f5931f" />
                  <path d="M80 30 L105 35 V95 H80 V30 Z" fill="#f5931f" />
                  <rect x="10" y="95" width="100" height="5" fill="#f5931f" />
               </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-[#034933] leading-none uppercase tracking-tight">B & W</h1>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Immobilien Management UG</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-wider border border-slate-200">
              Miet-Potential-Check
            </span>
          </div>
        </div>

        {/* Input Form */}
        <section className="animate-in fade-in slide-in-from-top-2 duration-500">
          <InputForm isLoading={isLoading} onSubmit={handleAnalysis} />
        </section>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-in fade-in shadow-sm">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <h3 className="font-bold text-red-800 text-[10px] uppercase tracking-wider">Fehler</h3>
              <p className="text-red-600 text-xs mt-0.5">{error}</p>
              <button 
                onClick={() => userInput && handleAnalysis(userInput)} 
                className="mt-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-700 hover:text-red-900 underline"
              >
                <RefreshCcw size={12} /> Neu laden
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div ref={resultsRef} className="scroll-mt-4">
          {result && userInput && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <AnalysisResults result={result} input={userInput} />
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 opacity-80">
          <div className="flex items-start gap-2 text-slate-400">
            <Scale size={14} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Haftungsausschluss</h4>
              <p className="text-[10px] leading-relaxed">
                Diese KI-basierte Analyse dient der ersten Orientierung und ersetzt kein Gutachten. 
                Die <strong>B&W Immobilien Management UG (haftungsbeschränkt)</strong> übernimmt keine Gewähr für die Richtigkeit der Prognosen.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
