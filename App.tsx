
import React, { useState, useEffect } from 'react';
import { 
  RefreshCcw, 
  ArrowRightLeft,
  Activity,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Clock,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  PieChart,
  Calculator
} from 'lucide-react';
// اصلاح مسیر ایمپورت برای رفع خطای Vercel
import { getMarketAnalysis } from './geminiService';
import { AnalysisResponse } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarketAnalysis();
      setAnalysis(data);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
      setLastUpdateTime(`${dateStr} | ${timeStr}`);
    } catch (err: any) {
      setError(err.message || "خطای غیرمنتظره");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-400 font-light text-right select-none pb-12" dir="rtl">
      {/* هدر بهینه‌شده برای موبایل و دسکتاپ */}
      <header className="bg-[#0f172a]/95 backdrop-blur-3xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="bg-gold-premium p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-white/20 flex-shrink-0">
              <Cpu className="text-slate-900 w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col min-w-0">
              {/* نمایش کامل برند با اندازه مناسب */}
              <h1 className="text-3xl sm:text-5xl font-black font-brand tracking-tight text-gold-premium italic leading-tight truncate py-1">
                ZarrinBin
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${analysis ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 animate-pulse'}`}></span>
                <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] truncate">Institutional AI Core</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end flex-shrink-0">
            <button 
              onClick={fetchData} 
              disabled={loading}
              className="p-2.5 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all active:scale-90 border border-white/10 shadow-xl"
            >
              <RefreshCcw className={`w-5 h-5 sm:w-6 sm:h-6 text-[#C5A059] ${loading ? 'animate-spin' : ''}`} />
            </button>
            {lastUpdateTime && (
              <span className="text-[7px] sm:text-[10px] text-slate-500 font-bold mt-2 tabular-nums">
                {lastUpdateTime}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {loading && !analysis ? (
          <div className="flex flex-col items-center justify-center py-32 sm:py-56">
            <div className="relative">
              <div className="w-16 h-16 sm:w-24 sm:h-24 border-2 border-[#C5A059]/20 rounded-full animate-ping absolute"></div>
              <div className="w-16 h-16 sm:w-24 sm:h-24 border-t-2 border-[#C5A059] rounded-full animate-spin relative z-10"></div>
              <Cpu className="w-6 h-6 sm:w-10 sm:h-10 text-[#C5A059] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm mt-12 text-slate-500 font-bold tracking-[0.2em] uppercase animate-pulse">در حال تحلیل داده‌ها...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-[2rem] p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
            <div className="flex items-center gap-4 sm:gap-8 mb-8 sm:mb-12">
              <div className="bg-rose-500/20 p-4 rounded-2xl">
                <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-rose-500" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-white">خطای سیستمی</h2>
                <p className="text-[10px] sm:text-sm text-rose-400 font-bold mt-1 uppercase tracking-widest">Connection Interrupted</p>
              </div>
            </div>
            <p className="text-sm sm:text-lg text-slate-300 leading-7 sm:leading-10 bg-black/50 p-6 sm:p-8 rounded-2xl border border-white/5 mb-8 italic">{error}</p>
            <button 
              onClick={fetchData}
              className="w-full bg-white text-slate-900 font-black py-4 sm:py-6 rounded-2xl shadow-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 text-base sm:text-xl"
            >
              <RefreshCcw className="w-5 h-5" />
              تلاش مجدد
            </button>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-16 animate-in fade-in duration-1000">
            {/* قیمت‌های لحظه‌ای */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {analysis?.prices.map((p, i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-4 sm:p-7 rounded-2xl sm:rounded-[2.5rem] hover:border-[#C5A059]/40 transition-all group overflow-hidden">
                  <span className="text-[10px] sm:text-[12px] text-slate-500 font-black block mb-2 sm:mb-4 uppercase tracking-[0.1em]">{p.name}</span>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <span className="text-lg sm:text-2xl font-black text-white group-hover:text-gold-premium transition-colors tabular-nums tracking-tighter leading-none">{p.price}</span>
                    <span className={`text-[8px] sm:text-[10px] font-black px-2 py-1 rounded-lg sm:rounded-2xl flex items-center gap-1 border self-start ${p.isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      <span className="tabular-nums">{p.change}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* استراتژی‌ها */}
            <section className="space-y-6 sm:space-y-10">
              <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3 sm:gap-5 px-1 sm:px-4">
                <Target className="w-6 h-6 sm:w-10 sm:h-10 text-[#C5A059]" />
                استراتژی‌های جابجایی هوشمند
              </h2>
              <div className="grid gap-6 sm:gap-12">
                {analysis?.strategies.map((strat, idx) => (
                  <div key={idx} className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl sm:rounded-[3.5rem] p-6 sm:p-12 border-r-4 sm:border-r-8 border-[#C5A059] shadow-2xl">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 sm:mb-14">
                        <div className="space-y-2 sm:space-y-4">
                          <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">{strat.title}</h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-[13px] text-slate-400 font-bold bg-white/5 px-2.5 py-1 rounded-xl">
                               <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#C5A059]" />
                               اطمینان: <span className="text-white">{strat.confidence}%</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-[12px] font-black border ${
                               strat.riskLevel === 'LOW' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                               strat.riskLevel === 'MEDIUM' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                            }`}>ریسک: {strat.riskLevel === 'LOW' ? 'پایین' : strat.riskLevel === 'MEDIUM' ? 'متوسط' : 'بالا'}</span>
                          </div>
                        </div>
                        <div className="bg-gold-premium text-slate-950 text-[12px] sm:text-[16px] font-black px-4 py-2 sm:px-8 sm:py-4 rounded-xl shadow-2xl flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
                          سود تخمینی: {strat.potentialProfit}
                        </div>
                      </div>

                      <div className="bg-black/40 border border-white/5 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] mb-8 sm:mb-14 flex items-center gap-4">
                          <div className="bg-gold-premium p-3 sm:p-5 rounded-xl sm:rounded-3xl shrink-0">
                            <ArrowRightLeft className="w-5 h-5 sm:w-8 sm:h-8 text-slate-900" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-[9px] sm:text-[12px] text-slate-500 font-black block mb-1 uppercase tracking-widest italic opacity-70">پیشنهاد تبدیل:</span>
                            <span className="text-base sm:text-3xl font-black text-white tracking-tight break-words">{strat.pair}</span>
                          </div>
                      </div>

                      <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
                        <div className="bg-[#0c1322]/80 p-5 sm:p-8 rounded-2xl border-t-2 sm:border-t-4 border-sky-400/40 shadow-xl">
                          <h4 className="text-sky-300 text-[12px] sm:text-[14px] font-black mb-3 sm:mb-5 flex items-center gap-2">
                            <PieChart className="w-4 h-4 sm:w-5 sm:h-5" /> تحلیل تکنیکال
                          </h4>
                          <p className="text-[11px] sm:text-[14px] leading-6 sm:leading-8 text-sky-50 text-justify">
                            {strat.technicalAnalysis}
                          </p>
                        </div>
                        
                        <div className="bg-[#0c1322]/80 p-5 sm:p-8 rounded-2xl border-t-2 sm:border-t-4 border-emerald-400/40 shadow-xl">
                          <h4 className="text-emerald-300 text-[12px] sm:text-[14px] font-black mb-3 sm:mb-5 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> تحلیل فاندامنتال
                          </h4>
                          <p className="text-[11px] sm:text-[14px] leading-6 sm:leading-8 text-emerald-50 text-justify">
                            {strat.fundamentalAnalysis}
                          </p>
                        </div>

                        <div className="bg-[#0c1322]/80 p-5 sm:p-8 rounded-2xl border-t-2 sm:border-t-4 border-amber-400/40 shadow-xl">
                          <h4 className="text-[#C5A059] text-[12px] sm:text-[14px] font-black mb-3 sm:mb-5 flex items-center gap-2">
                            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" /> منطق محاسباتی
                          </h4>
                          <p className="text-[11px] sm:text-[14px] leading-6 sm:leading-8 text-amber-50 text-justify italic">
                            {strat.logic}
                          </p>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative group">
               <div className="absolute -inset-1 bg-gold-premium rounded-[2.5rem] blur-2xl opacity-10"></div>
               <div className="relative bg-[#0f172a]/90 backdrop-blur-3xl border border-gold-subtle rounded-[2.5rem] p-8 sm:p-16 shadow-2xl">
                 <h2 className="text-[10px] sm:text-[14px] font-black text-gold-premium mb-6 sm:mb-12 flex items-center gap-4 uppercase tracking-[0.3em] border-b border-gold-subtle pb-4">
                   <Activity className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" /> دورنمای استراتژیک بازار ایران
                 </h2>
                 <p className="text-sm sm:text-xl leading-8 sm:leading-[2.8] text-slate-100 text-justify font-medium">
                   {analysis?.marketOverview}
                 </p>
               </div>
            </section>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-950/90 border border-white/10 rounded-[2rem] p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <ShieldCheck className={`w-6 h-6 transition-colors duration-1000 ${analysis ? 'text-emerald-500' : 'text-slate-800'}`} />
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-wider">Zarrin Secure Node</p>
              <p className="text-[8px] sm:text-xs text-slate-600 mt-1.5 uppercase font-bold tracking-[0.2em]">
                {analysis ? "Node Integrity: Verified | Sync: Active" : "Initializing handshake..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[8px] sm:text-xs font-black text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5 tabular-nums uppercase">
              NODE: ZB-X407
            </div>
            <div className={`w-2 h-2 rounded-full ${analysis ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-slate-900'}`}></div>
          </div>
        </div>
        <div className="text-center mt-12">
           <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.4em] opacity-30 italic">ZarrinBin Intelligence &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
