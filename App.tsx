
import React, { useState } from 'react';
import { GameMode } from './types';
import Header from './components/Header';
import Quiz from './components/Quiz';
import Library from './components/Library';
import { Language, translations } from './translations';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const [level, setLevel] = useState(1);
  const [lastScore, setLastScore] = useState(0);
  const [lang, setLang] = useState<Language>('km');

  const t = translations[lang];

  const startChallenge = () => {
    setLevel(1);
    setMode(GameMode.CHALLENGE);
  };

  const handleLevelComplete = () => {
    if (level < 10) {
      setLevel(l => l + 1);
    } else {
      setMode(GameMode.FINISHED);
    }
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    setMode(GameMode.FINISHED);
  };

  const renderContent = () => {
    switch (mode) {
      case GameMode.MENU:
        return (
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="mb-14 inline-flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-600 blur-[40px] opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 w-28 h-28 rounded-[2rem] flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <i className="fas fa-flag text-5xl text-white"></i>
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">VEXILLO</h1>
              <p className={`text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed ${lang === 'km' ? 'font-khmer' : ''}`}>
                {t.menu_desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <button 
                onClick={startChallenge}
                className="group relative overflow-hidden bg-slate-900 text-white px-10 py-10 rounded-[2.5rem] shadow-2xl hover:shadow-blue-200 transition-all hover:-translate-y-2 active:translate-y-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className={`text-3xl font-black mb-2 ${lang === 'km' ? 'font-khmer' : ''}`}>{t.challenge_mode}</span>
                  <span className={`text-slate-400 group-hover:text-blue-50 text-sm font-medium ${lang === 'km' ? 'font-khmer opacity-80' : ''}`}>{t.challenge_sub}</span>
                </div>
              </button>

              <button 
                onClick={() => setMode(GameMode.LIBRARY)}
                className="group bg-white border-2 border-slate-100 text-slate-800 px-10 py-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:border-blue-500 hover:shadow-2xl transition-all hover:-translate-y-2 active:translate-y-0"
              >
                <div className="flex flex-col items-center text-center">
                  <span className={`text-3xl font-black mb-2 ${lang === 'km' ? 'font-khmer' : ''}`}>{t.flag_library}</span>
                  <span className={`text-slate-500 group-hover:text-blue-600 text-sm font-medium ${lang === 'km' ? 'font-khmer opacity-80' : ''}`}>{t.flag_library_sub}</span>
                </div>
              </button>
            </div>

            <div className="mt-20 flex justify-center gap-10 md:gap-16 text-slate-400">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500">
                  <i className="fas fa-layer-group text-xl"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.tiers_3}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500">
                  <i className="fas fa-trophy text-xl"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.levels_10}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500">
                  <i className="fas fa-brain text-xl"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.ai_assisted}</span>
              </div>
            </div>
          </div>
        );

      case GameMode.CHALLENGE:
        return (
          <Quiz 
            level={level} 
            onLevelComplete={handleLevelComplete} 
            onGameOver={handleGameOver} 
            lang={lang}
          />
        );

      case GameMode.LIBRARY:
        return <Library lang={lang} />;

      case GameMode.FINISHED:
        return (
          <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in duration-700">
            <div className="glass-morphism rounded-[3rem] p-12 shadow-2xl border border-white">
              <div className="relative inline-block mb-10">
                <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative text-7xl text-amber-400 drop-shadow-xl">
                  <i className="fas fa-crown"></i>
                </div>
              </div>
              <h2 className={`text-4xl font-black text-slate-900 mb-4 ${lang === 'km' ? 'font-khmer' : ''}`}>{t.expedition_complete}</h2>
              <p className={`text-slate-500 mb-10 text-lg ${lang === 'km' ? 'font-khmer' : ''}`}>
                {t.expedition_sub.replace('{level}', level.toString())}
              </p>
              
              <div className="bg-slate-50/50 rounded-[2rem] p-8 mb-10 flex justify-between items-center border border-slate-100">
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.final_level}</div>
                  <div className="text-3xl font-black text-slate-800">{level}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.mastery_score}</div>
                  <div className="text-3xl font-black text-blue-600">{lastScore}</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={startChallenge}
                  className={`w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:-translate-y-1 ${lang === 'km' ? 'font-khmer' : ''}`}
                >
                  {t.new_expedition}
                </button>
                <button 
                  onClick={() => setMode(GameMode.MENU)}
                  className={`w-full bg-white text-slate-600 border border-slate-200 font-black py-5 rounded-2xl hover:bg-slate-50 transition-all ${lang === 'km' ? 'font-khmer' : ''}`}
                >
                  {t.return_menu}
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header mode={mode} onNavigate={setMode} level={level} lang={lang} onLanguageChange={setLang} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <footer className="py-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-t glass-morphism mt-auto">
        <p>© {new Date().getFullYear()} Vexillo Trivia • AI Enhanced Experience</p>
      </footer>
    </div>
  );
};

export default App;
