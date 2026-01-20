
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COUNTRIES } from '../data/countries';
import { Question, QuestionTier, Country } from '../types';
import { getFunFact } from '../services/geminiService';
import FlagImage from './FlagImage';
import { Language, translations } from '../translations';

interface QuizProps {
  level: number;
  onLevelComplete: () => void;
  onGameOver: (score: number) => void;
  lang: Language;
}

const QUESTIONS_PER_LEVEL = 5;
const AUTO_NEXT_DELAY_CORRECT = 4000;
const AUTO_NEXT_DELAY_WRONG = 2500;

const playSound = (type: 'correct' | 'wrong' | 'levelup') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  
  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'correct') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'levelup') {
    osc.type = 'triangle';
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, now + i * 0.1);
      g.gain.setValueAtTime(0.1, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.2);
    });
  }
};

const Quiz: React.FC<QuizProps> = ({ level, onLevelComplete, onGameOver, lang }) => {
  const t = translations[lang];
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionsAnsweredInLevel, setQuestionsAnsweredInLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isLoadingFact, setIsLoadingFact] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const timerRef = useRef<number | null>(null);

  const generateQuestion = useCallback(() => {
    let tier = QuestionTier.NAME;
    const rand = Math.random();
    
    if (level >= 7) {
      if (rand > 0.6) tier = QuestionTier.CURRENCY;
      else if (rand > 0.3) tier = QuestionTier.CAPITAL;
    } else if (level >= 4) {
      if (rand > 0.5) tier = QuestionTier.CAPITAL;
    }

    const targetIdx = Math.floor(Math.random() * COUNTRIES.length);
    const targetCountry = COUNTRIES[targetIdx];
    
    let correctAnswer = '';
    let distractors: string[] = [];
    const isKm = lang === 'km';
    
    switch (tier) {
      case QuestionTier.CAPITAL:
        correctAnswer = isKm ? targetCountry.capitalKm : targetCountry.capital;
        distractors = COUNTRIES.filter(c => c.code !== targetCountry.code).map(c => isKm ? c.capitalKm : c.capital);
        break;
      case QuestionTier.CURRENCY:
        correctAnswer = isKm ? targetCountry.currencyKm : targetCountry.currency;
        distractors = COUNTRIES.filter(c => c.code !== targetCountry.code).map(c => isKm ? c.currencyKm : c.currency);
        break;
      default:
        correctAnswer = isKm ? targetCountry.nameKm : targetCountry.name;
        distractors = COUNTRIES.filter(c => c.code !== targetCountry.code).map(c => isKm ? c.nameKm : c.name);
    }

    const options = [correctAnswer, ...distractors.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);

    setQuestion({
      country: targetCountry,
      options,
      correctAnswer,
      tier
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFunFact(null);
    setCountdown(null);
  }, [level, lang]);

  useEffect(() => {
    generateQuestion();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [level, generateQuestion]);

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer) return;

    const correct = answer === question?.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    if (correct) {
      playSound('correct');
      setScore(s => s + (10 * level));
      setQuestionsAnsweredInLevel(q => q + 1);
      
      setIsLoadingFact(true);
      const fact = await getFunFact(question?.country.name || "", lang);
      setFunFact(fact);
      setIsLoadingFact(false);
    } else {
      playSound('wrong');
    }

    const delay = correct ? AUTO_NEXT_DELAY_CORRECT : AUTO_NEXT_DELAY_WRONG;
    let secondsLeft = Math.floor(delay / 1000);
    setCountdown(secondsLeft);

    const countdownInterval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft >= 0) setCountdown(secondsLeft);
      else clearInterval(countdownInterval);
    }, 1000);

    timerRef.current = window.setTimeout(() => {
      clearInterval(countdownInterval);
      if (correct && questionsAnsweredInLevel + 1 >= QUESTIONS_PER_LEVEL) {
        playSound('levelup');
        onLevelComplete();
        setQuestionsAnsweredInLevel(0);
      } else {
        generateQuestion();
      }
    }, delay);
  };

  if (!question) return null;

  const tierLabels = {
    [QuestionTier.NAME]: t.q_name,
    [QuestionTier.CAPITAL]: t.q_capital,
    [QuestionTier.CURRENCY]: t.q_currency
  };

  const challengeTypeLabel = {
    [QuestionTier.NAME]: t.name_challenge,
    [QuestionTier.CAPITAL]: t.capital_challenge,
    [QuestionTier.CURRENCY]: t.currency_challenge
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden flex items-center justify-center py-8">
      {/* Immersive Flag Background Effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[60px] opacity-20 transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${question.country.flagUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-slate-50/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="glass-morphism rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white/40 overflow-hidden relative">
          
          {/* Subtle Dynamic Gradient based on Flag (simplified) */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-500/10 blur-[80px] rounded-full"></div>

          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100/50">
            <div 
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" 
              style={{ width: `${(questionsAnsweredInLevel / QUESTIONS_PER_LEVEL) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center mb-8 mt-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                {questionsAnsweredInLevel + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.progress}</span>
                <span className="text-xs font-black text-blue-600">{questionsAnsweredInLevel} / {QUESTIONS_PER_LEVEL}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.score}</div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{score}</div>
            </div>
          </div>

          <div className="flex flex-col items-center mb-10">
            <div className="group relative w-72 h-44 mb-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden border-8 border-white ring-1 ring-slate-100">
              <FlagImage url={question.country.flagUrl} name={lang === 'km' ? question.country.nameKm : question.country.name} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="space-y-2 text-center">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-100">
                {challengeTypeLabel[question.tier]}
              </div>
              <h2 className={`text-2xl md:text-3xl font-black text-slate-800 leading-tight ${lang === 'km' ? 'font-khmer' : ''}`}>
                {tierLabels[question.tier]}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, idx) => {
              let btnClass = "relative w-full p-5 rounded-[1.5rem] border-2 text-left font-bold transition-all duration-300 transform ";
              if (selectedAnswer === option) {
                btnClass += isCorrect 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 scale-[1.03] shadow-xl shadow-emerald-100/50" 
                  : "bg-rose-50 border-rose-500 text-rose-700 scale-[0.97] shadow-xl shadow-rose-100/50";
              } else if (selectedAnswer && option === question.correctAnswer) {
                btnClass += "bg-emerald-50 border-emerald-500 text-emerald-700";
              } else if (selectedAnswer) {
                btnClass += "bg-slate-50 border-transparent text-slate-300 opacity-40 scale-95";
              } else {
                btnClass += "bg-white/80 border-slate-100 text-slate-700 hover:border-blue-400 hover:bg-white hover:shadow-xl hover:-translate-y-1 active:translate-y-0";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span className={lang === 'km' ? 'font-khmer' : ''}>{option}</span>
                    {selectedAnswer === option && (
                      <i className={`fas ${isCorrect ? 'fa-check-circle animate-bounce' : 'fa-times-circle animate-shake'}`}></i>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div className="mt-10 space-y-5 animate-in slide-in-from-top-4 duration-500">
              {isCorrect ? (
                <div className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[1.5rem] shadow-xl shadow-emerald-100 text-white border-t border-white/20">
                  <div className="flex items-center gap-3 font-black mb-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em]">{t.did_you_know}</span>
                  </div>
                  <p className={`text-emerald-50 text-sm leading-relaxed font-medium ${lang === 'km' ? 'font-khmer' : ''}`}>
                    {isLoadingFact ? t.loading_fact : funFact}
                  </p>
                </div>
              ) : (
                <div className="p-5 bg-rose-500 rounded-[1.5rem] text-center shadow-xl shadow-rose-100 text-white">
                  <p className={`font-bold text-sm ${lang === 'km' ? 'font-khmer' : ''}`}>
                    {t.try_again} <span className="underline decoration-2 underline-offset-4">{question.correctAnswer}</span>.
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-3 py-2">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{t.next_in}</span>
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '3s', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                  <span className="relative z-10 text-slate-800 text-xs font-black">
                    {countdown}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
