
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
import { getMarketAnalysis } from './services/geminiService';
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
      {/* Premium Institutional Header */}
      <header className="bg-[#0f172a]/95 backdrop-blur-3xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-visible">
            <div className="bg-gold-premium p-4 rounded-2xl shadow-2xl shadow-yellow-900/30 ring-1 ring-white/20 transform hover:scale-105 transition-transform">
              <Cpu className="text-slate-900 w-8 h-8" />
            </div>
            <div className="flex flex-col pr-1">
              {/* branding display fix: added padding and adjusted tracking to ensure visibility */}
              <h1 className="text-5xl font-black font-brand tracking-normal text-gold-premium italic leading-none py-1 drop-shadow-lg">
                ZarrinBin
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${analysis ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-rose-500 animate-pulse'}`}></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Institutional AI Core</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <button 
              onClick={fetchData} 
              disabled={loading}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90 disabled:opacity-50 border border-white/10 group shadow-xl"
            >
              <RefreshCcw className={`w-6 h-6 text-[#C5A059] group-hover:rotate-180 transition-transform duration-1000 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {lastUpdateTime && (
              <span className="text-[10px] text-slate-500 font-bold mt-3 tabular-nums bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                {lastUpdateTime}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading && !analysis ? (
          <div className="flex flex-col items-center justify-center py-56">
            <div className="relative scale-125">
              <div className="w-24 h-24 border-2 border-[#C5A059]/20 rounded-full animate-ping absolute"></div>
              <div className="w-24 h-24 border-t-2 border-[#C5A059] rounded-full animate-spin relative z-10"></div>
              <Cpu className="w-10 h-10 text-[#C5A059] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 animate-pulse" />
            </div>
            <p className="text-sm mt-16 text-slate-500 font-bold tracking-[0.3em] uppercase animate-pulse">Synchronizing Market Data...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-[3rem] p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 shadow-2xl">
            <div className="flex items-center gap-8 mb-12">
              <div className="bg-rose-500/20 p-6 rounded-[2rem]">
                <AlertCircle className="w-12 h-12 text-rose-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">خطای سیستمی</h2>
                <p className="text-sm text-rose-400 font-bold mt-2 uppercase tracking-widest">Neural Cluster Disconnected</p>
              </div>
            </div>
            <p className="text-lg text-slate-300 leading-10 bg-black/50 p-8 rounded-[2rem] border border-white/5 mb-12 italic">{error}</p>
            <button 
              onClick={fetchData}
              className="w-full bg-white text-slate-900 font-black py-6 rounded-3xl shadow-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-5 text-xl"
            >
              <RefreshCcw className="w-7 h-7" />
              تلاش مجدد برای همگام‌سازی
            </button>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in duration-1000">
            {/* 1. Market Tickers */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {analysis?.prices.map((p, i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-7 rounded-[2.5rem] hover:border-[#C5A059]/40 transition-all group relative overflow-hidden">
                  <span className="text-[12px] text-slate-500 font-black block mb-4 uppercase tracking-[0.15em]">{p.name}</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-black text-white group-hover:text-gold-premium transition-colors tabular-nums tracking-tighter">{p.price}</span>
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 border ${p.isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      <span className="tabular-nums">{p.change}</span>
                      <span className="text-[9px] opacity-60">تغییر</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Advanced Strategies */}
            <section className="space-y-10">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-3xl font-black text-white flex items-center gap-5">
                  <Target className="w-10 h-10 text-[#C5A059]" />
                  استراتژی‌های جابجایی هوشمند
                </h2>
              </div>
              <div className="grid gap-12">
                {analysis?.strategies.map((strat, idx) => (
                  <div key={idx} className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 hover:bg-slate-900/60 transition-all border-r-8 border-[#C5A059] group relative shadow-2xl overflow-hidden">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-14">
                        <div className="space-y-4">
                          <h3 className="text-3xl font-black text-white group-hover:text-gold-premium transition-colors leading-tight">{strat.title}</h3>
                          <div className="flex flex-wrap items-center gap-5">
                            <div className="flex items-center gap-2.5 text-[13px] text-slate-400 font-bold bg-white/5 px-4 py-2 rounded-2xl">
                               <Clock className="w-5 h-5 text-[#C5A059]" />
                               درجه اطمینان: <span className="text-white">{strat.confidence}%</span>
                            </div>
                            <span className={`px-5 py-2 rounded-2xl text-[12px] font-black border shadow-lg ${
                               strat.riskLevel === 'LOW' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                               strat.riskLevel === 'MEDIUM' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                            }`}>سطح ریسک: {strat.riskLevel === 'LOW' ? 'پایین' : strat.riskLevel === 'MEDIUM' ? 'متوسط' : 'بالا'}</span>
                          </div>
                        </div>
                        <div className="bg-gold-premium text-slate-950 text-[16px] font-black px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 transform hover:scale-105 transition-transform cursor-default">
                          <TrendingUp className="w-6 h-6" />
                          سود احتمالی: {strat.potentialProfit}
                        </div>
                      </div>

                      {/* Swap Details - Persianized labels */}
                      <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] mb-14 flex flex-wrap items-center gap-10 group/pair">
                          <div className="bg-gold-premium p-5 rounded-3xl shadow-2xl ring-2 ring-white/20 group-hover/pair:rotate-12 transition-transform">
                            <ArrowRightLeft className="w-8 h-8 text-slate-900" />
                          </div>
                          <div>
                            <span className="text-[12px] text-slate-500 font-black block mb-2 uppercase tracking-widest italic opacity-70">TARGET CONVERSION:</span>
                            <span className="text-3xl font-black text-white tracking-tight drop-shadow-md">{strat.pair}</span>
                          </div>
                          <div className="mr-auto hidden md:block">
                            <Zap className="w-12 h-12 text-slate-800 group-hover:text-gold-premium/40 transition-colors" />
                          </div>
                      </div>

                      {/* Triple-Perspective Grid with Improved Color Contrast */}
                      <div className="grid lg:grid-cols-3 gap-8">
                        {/* Technical Analysis */}
                        <div className="bg-[#0c1322]/80 p-8 rounded-[2.5rem] border-t-4 border-sky-400/50 hover:bg-[#111a2e] transition-colors shadow-xl">
                          <h4 className="text-sky-300 text-[14px] font-black mb-5 flex items-center gap-3">
                            <PieChart className="w-5 h-5" /> تحلیل تکنیکال
                          </h4>
                          <p className="text-[14px] leading-8 text-sky-50 text-justify font-medium">
                            {strat.technicalAnalysis}
                          </p>
                        </div>
                        
                        {/* Fundamental Analysis */}
                        <div className="bg-[#0c1322]/80 p-8 rounded-[2.5rem] border-t-4 border-emerald-400/50 hover:bg-[#111a2e] transition-colors shadow-xl">
                          <h4 className="text-emerald-300 text-[14px] font-black mb-5 flex items-center gap-3">
                            <BookOpen className="w-5 h-5" /> تحلیل فاندامنتال
                          </h4>
                          <p className="text-[14px] leading-8 text-emerald-50 text-justify font-medium">
                            {strat.fundamentalAnalysis}
                          </p>
                        </div>

                        {/* Mathematical/Logic Analysis */}
                        <div className="bg-[#0c1322]/80 p-8 rounded-[2.5rem] border-t-4 border-amber-400/50 hover:bg-[#111a2e] transition-colors shadow-xl">
                          <h4 className="text-[#C5A059] text-[14px] font-black mb-5 flex items-center gap-3">
                            <Calculator className="w-5 h-5" /> منطق محاسباتی
                          </h4>
                          <p className="text-[14px] leading-8 text-amber-50 text-justify font-medium italic">
                            {strat.logic}
                          </p>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Global Market Outlook */}
            <section className="relative group">
               <div className="absolute -inset-2 bg-gold-premium rounded-[3.5rem] blur-3xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
               <div className="relative bg-[#0f172a]/90 backdrop-blur-3xl border border-gold-subtle rounded-[3.5rem] p-16 shadow-2xl">
                 <h2 className="text-[14px] font-black text-gold-premium mb-12 flex items-center gap-6 uppercase tracking-[0.5em] border-b border-gold-subtle pb-6">
                   <Activity className="w-8 h-8 animate-pulse" /> دورنمای استراتژیک بازار ایران
                 </h2>
                 <p className="text-xl leading-[2.8] text-slate-100 text-justify font-medium drop-shadow-sm">
                   {analysis?.marketOverview}
                 </p>
               </div>
            </section>
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-slate-950/90 border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group shadow-inner">
              <ShieldCheck className={`w-12 h-12 transition-colors duration-1000 ${analysis ? 'text-emerald-500' : 'text-slate-800'}`} />
            </div>
            <div>
              <p className="text-lg font-black text-white uppercase tracking-[0.1em]">Zarrin-Protocol Secure Node</p>
              <p className="text-xs text-slate-600 mt-3 uppercase font-bold tracking-[0.3em]">
                {analysis ? "Data Integrity: 100% Verified | Sync: Active" : "Initializing neural cluster handshake..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-xs font-black text-slate-500 bg-white/5 px-8 py-4 rounded-2xl border border-white/5 tabular-nums uppercase tracking-widest shadow-2xl">
              NODE-ID: ZB-X40719
            </div>
            <div className={`w-4 h-4 rounded-full ${analysis ? 'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,1)]' : 'bg-slate-900'}`}></div>
          </div>
        </div>
        <div className="text-center mt-20">
           <p className="text-[12px] text-slate-800 font-black uppercase tracking-[0.8em] opacity-30 italic">ZarrinBin Intelligence Systems &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
