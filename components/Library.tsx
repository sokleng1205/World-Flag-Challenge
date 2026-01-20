
import React, { useState, useMemo } from 'react';
import { COUNTRIES } from '../data/countries';
import FlagImage from './FlagImage';
import { Language, translations } from '../translations';

interface LibraryProps {
  lang: Language;
}

const Library: React.FC<LibraryProps> = ({ lang }) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');

  const continents = ['All', ...new Set(COUNTRIES.map(c => c.continent))];

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(country => {
      const nameMatch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        country.nameKm.includes(searchQuery);
      const capitalMatch = country.capital.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            country.capitalKm.includes(searchQuery);
      const matchesSearch = nameMatch || capitalMatch;
      const matchesContinent = selectedContinent === 'All' || country.continent === selectedContinent;
      return matchesSearch && matchesContinent;
    });
  }, [searchQuery, selectedContinent]);

  const isKm = lang === 'km';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className={`text-5xl font-black text-slate-900 tracking-tight ${isKm ? 'font-khmer' : ''}`}>
            {t.flag_library}
          </h1>
          <p className={`text-slate-500 text-lg font-medium ${isKm ? 'font-khmer' : ''}`}>
            {t.flag_library_sub}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:w-80">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder={t.search_placeholder}
              className={`w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-xl shadow-slate-100/50 ${isKm ? 'font-khmer text-sm' : ''}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className={`px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-xl shadow-slate-100/50 font-bold text-slate-700 cursor-pointer ${isKm ? 'font-khmer text-sm' : ''}`}
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
          >
            <option value="All">{t.all_continents}</option>
            {continents.filter(c => c !== 'All').map(continent => (
              <option key={continent} value={continent}>{continent}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredCountries.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 text-5xl">
            <i className="fas fa-globe-americas"></i>
          </div>
          <p className={`text-slate-400 font-bold text-xl ${isKm ? 'font-khmer' : ''}`}>{t.no_results}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCountries.map(country => (
            <div key={country.code} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="aspect-[4/3] overflow-hidden">
                <FlagImage url={country.flagUrl} name={isKm ? country.nameKm : country.name} className="h-full w-full" />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-black text-slate-800 text-xl group-hover:text-blue-600 transition-colors truncate ${isKm ? 'font-khmer' : ''}`}>
                    {isKm ? country.nameKm : country.name}
                  </h3>
                  <span className="text-[10px] font-black bg-blue-50 text-blue-500 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {country.code}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <i className="fas fa-landmark text-xs"></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t.capital}</span>
                      <span className={`text-slate-700 font-bold ${isKm ? 'font-khmer' : ''}`}>{isKm ? country.capitalKm : country.capital}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <i className="fas fa-coins text-xs"></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t.currency}</span>
                      <span className={`text-slate-700 font-bold ${isKm ? 'font-khmer' : ''}`}>{isKm ? country.currencyKm : country.currency} ({country.currencySymbol})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                      <i className="fas fa-map text-xs"></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{t.region}</span>
                      <span className={`text-slate-700 font-bold ${isKm ? 'font-khmer' : ''}`}>{country.continent}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
