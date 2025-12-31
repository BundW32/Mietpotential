
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-100 h-24 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-4">
          <div className="h-14 w-14">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <rect x="30" y="10" width="40" height="80" fill="#034933" />
              <rect x="10" y="40" width="30" height="50" fill="#f5931f" />
              <rect x="60" y="30" width="30" height="60" fill="#f5931f" />
              <rect x="5" y="90" width="90" height="4" fill="#034933" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#034933] leading-none uppercase tracking-tighter">B&W</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Immobilien Management</p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-600">
          <a href="#" className="hover:text-[#f5931f] transition-colors">Portfolio</a>
          <a href="#" className="hover:text-[#f5931f] transition-colors">Services</a>
          <a href="#" className="hover:text-[#f5931f] transition-colors">Kontakt</a>
          <button className="px-5 py-2.5 bg-[#034933] text-white rounded-lg hover:bg-[#f5931f] transition-all shadow-lg shadow-[#034933]/10">
            Termin vereinbaren
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
