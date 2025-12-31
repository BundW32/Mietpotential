import React, { useState, useRef, useEffect } from 'react';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import { UserInput, AnalysisResult } from './types';
import { analyzePotential } from './services/geminiService';
import { AlertCircle, Scale, RefreshCcw, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Loading Screen State
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Starte Analyse...");
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  // --- WORDPRESS INTEGRATION ---
  useEffect(() => {
    const sendHeight = () => {
      if (appRef.current) {
        const height = appRef.current.scrollHeight;
        window.parent.postMessage({ type: 'setHeight', height }, '*');
      }
    };
    sendHeight();
    window.addEventListener('resize', sendHeight);
    const observer = new ResizeObserver(sendHeight);
    if (appRef.current) observer.observe(appRef.current);
    return () => {
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
    };
  }, [result, userInput, error, isLoading, progress]); // Added progress to trigger resize during loading

  // --- LOADING SIMULATION ---
  const simulateProgress = () => {
    setProgress(0);
    // Determine status text based on percentage
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev; // Wait at 92% for real data
        
        // Dynamic speed: Fast at start, slow at end
        const remaining = 95 - prev;
        const jump = Math.max(0.2, Math.random() * (remaining / 15));
        const newProgress = prev + jump;

        // Update Text
        if (newProgress < 25) setLoadingText("Initialisiere KI-Modell...");
        else if (newProgress < 50) setLoadingText("Analysiere Makro-Lage...");
        else if (newProgress < 75) setLoadingText("Vergleiche Mietpreise in der Umgebung...");
        else setLoadingText("Berechne Mietpotenzial & Rendite...");

        return newProgress;
      });
    }, 150);
    return () => clearInterval(timer);
  };

  const handleAnalysis = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data);
    setResult(null);
    
    // Start the fake progress bar
    const stopTimer = simulateProgress();

    try {
      const analysis = await analyzePotential(data);
      
      // Success! Finish the bar
      stopTimer();
      setProgress(100);
      setLoadingText("Analyse erfolgreich abgeschlossen!");
      
      // Small delay to let user see 100%
      setTimeout(() => {
        setResult(analysis);
        setIsLoading(false);
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 600);

    } catch (err: any) {
      stopTimer();
      console.error("App Error:", err);
      let msg = "Die Analyse konnte nicht abgeschlossen werden.";
      if (err.message?.includes("500") || err.message?.includes("Internal Server Error")) {
        msg = "Der Server ist überlastet. Bitte versuchen Sie es gleich noch einmal.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    // DARK MODE: bg-slate-950 and text-slate-100
    <div ref={appRef} className="w-full bg-slate-950 text-slate-100 font-sans selection:bg-[#f5931f]/30 overflow-hidden min-h-[600px]">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        
        {/* Header - Optimized for Dark Mode */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10">
               <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_0_10px_rgba(245,147,31,0.3)]">
                  <path d="M45 15 L75 5 L75 95 H45 V15 Z" fill="#f5931f" />
                  <path d="M15 35 L40 30 V95 H15 V35 Z" fill="#f5931f" />
                  <path d="M80 30 L105 35 V95 H80 V30 Z" fill="#f5931f" />
                  <rect x="10" y="95" width="100" height="5" fill="#f5931f" />
               </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white leading-none uppercase tracking-tight">B & W</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Immobilien Management</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="inline-block px-3 py-1 bg-slate-900 rounded-full text-[10px] font-bold text-[#f5931f] uppercase tracking-wider border border-slate-800 shadow-sm">
              KI Miet-Potential
            </span>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        
        {isLoading ? (
          /* DARK LOADING SCREEN */
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
            
            {/* Progress Circle & Text */}
            <div className="relative mb-8">
               <div className="h-24 w-24 rounded-full border-4 border-slate-800"></div>
               <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-[#f5931f] border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white tabular-nums">{Math.round(progress)}%</span>
               </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 animate-pulse text-center">
              {loadingText}
            </h3>
            
            {/* Linear Bar */}
            <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden mt-6">
              <div 
                className="h-full bg-gradient-to-r from-[#f5931f] to-orange-400 transition-all duration-300 ease-out shadow-[0_0_10px_#f5931f]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-slate-500 mt-6 text-center max-w-sm leading-relaxed">
              Wir analysieren Echtzeit-Datenquellen für Ihren Standort. <br/> Dies kann einen Moment dauern.
            </p>
          </div>

        ) : (
          /* INPUT FORM */
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <InputForm isLoading={isLoading} onSubmit={handleAnalysis} />
          </section>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl flex items-start gap-3 animate-in fade-in shadow-lg">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <h3 className="font-bold text-red-400 text-[10px] uppercase tracking-wider">Analyse Fehler</h3>
              <p className="text-red-200/80 text-xs mt-1">{error}</p>
              <button 
                onClick={() => userInput && handleAnalysis(userInput)} 
                className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600/80 px-3 py-1.5 rounded hover:bg-red-500 transition-colors"
              >
                <RefreshCcw size={12} /> Erneut versuchen
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div ref={resultsRef} className="scroll-mt-8">
          {result && userInput && !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <AnalysisResults result={result} input={userInput} />
            </div>
          )}
        </div>

        {/* Disclaimer - Dark Mode */}
        <div className="mt-12 pt-8 border-t border-slate-800 space-y-4 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-start gap-3 text-slate-500">
            <Scale size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Haftungsausschluss</h4>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Diese KI-basierte Analyse dient der ersten Orientierung und ersetzt kein Verkehrswertgutachten. 
                Die <strong>B&W Immobilien Management UG</strong> übernimmt keine Gewähr für die Richtigkeit der algorithmischen Prognosen.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
