
import React from 'react';
import { GameMode } from '../types';
import { Language, translations } from '../translations';

interface HeaderProps {
  mode: GameMode;
  onNavigate: (mode: GameMode) => void;
  level?: number;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, onNavigate, level, lang, onLanguageChange }) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 w-full glass-morphism border-b px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate(GameMode.MENU)}
        >
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-lg group-hover:rotate-12 transition-transform">
            <i className="fas fa-flag text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Vexillo</span>
        </div>

        <nav className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => onNavigate(GameMode.CHALLENGE)}
            className={`text-sm font-semibold transition-colors ${mode === GameMode.CHALLENGE ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'}`}
          >
            {t.challenge}
          </button>
          <button 
            onClick={() => onNavigate(GameMode.LIBRARY)}
            className={`text-sm font-semibold transition-colors ${mode === GameMode.LIBRARY ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'}`}
          >
            {t.library}
          </button>
          
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border">
            <button 
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => onLanguageChange('km')}
              className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'km' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              KM
            </button>
          </div>

          {mode === GameMode.CHALLENGE && level && (
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{t.level}</span>
              <span className="text-sm font-black text-blue-600">{level}</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
