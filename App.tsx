
import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  RefreshCcw, 
  ShieldAlert,
  Compass,
  Loader2,
  ArrowRightLeft,
  Calculator,
  BarChart3,
  Globe,
  Activity,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { getMarketAnalysis } from './geminiService';
import { AnalysisResponse } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarketAnalysis();
      if (!data || !data.strategies || data.strategies.length === 0) {
        throw new Error("داده‌های بازار دریافت نشد. لطفاً دکمه تلاش مجدد را بزنید.");
      }
      setAnalysis(data);
    } catch (err: any) {
      console.error("App Fetch Error:", err);
      setError(err.message || "متأسفانه مشکلی در دریافت اطلاعات پیش آمده است.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatConfidence = (val: number) => {
    const percentage = val <= 1 ? Math.round(val * 100) : Math.round(val);
    return `${percentage}%`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pb-10 font-light selection:bg-cyan-500/30 tracking-tight">
      {/* High-End Header */}
      <header className="bg-[#1e293b]/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-1.5 rounded-lg shadow-lg shadow-cyan-500/20">
              <Compass className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">زرین‌بین</h1>
              <p className="text-[8px] text-cyan-400 font-bold tracking-widest uppercase opacity-90">دستیار هوشمند بازار</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className={`p-2 rounded-full transition-all border border-slate-700/50 ${loading ? 'bg-cyan-500/20 text-cyan-400 cursor-not-allowed' : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-400'}`}
            disabled={loading}
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin relative z-10"></div>
              <Zap className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <p className="text-white font-bold text-sm">در حال رصد لحظه‌ای tgju.org...</p>
              <p className="text-[10px] text-slate-500 max-w-[240px] mx-auto uppercase tracking-tighter">محاسبه قیمت‌های طلا، دلار و حباب‌های بازار</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-rose-500/10 p-5 rounded-[2.5rem] border border-rose-500/20 mb-8 shadow-2xl shadow-rose-500/5">
              <AlertTriangle className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-white font-black text-lg mb-3">خطا در دریافت اطلاعات</h3>
            <p className="text-xs text-slate-400 mb-10 max-w-xs leading-6">{error}</p>
            
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              <button 
                onClick={fetchData}
                className="flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-2xl font-black text-xs transition-all shadow-xl shadow-cyan-600/20 active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
                تلاش مجدد
              </button>
              
              {error.includes('429') && (
                <div className="mt-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-start gap-3 text-right">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-5">
                    این خطا به دلیل محدودیت نسخه رایگان هوش مصنوعی رخ داده است. چند لحظه صبر کنید یا صفحه را رفرش نمایید.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Real-time Market Ticker */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {analysis.prices.map((p, i) => (
                <div key={i} className="flex-shrink-0 bg-slate-800/40 border border-slate-700/50 px-5 py-4 rounded-[1.5rem] min-w-[160px] transition-all hover:border-cyan-500/30 hover:bg-slate-800/60 shadow-lg">
                  <div className="text-[10px] text-slate-500 font-bold mb-2 truncate">{p.name}</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-white">{p.price}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${p.isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                      {p.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Overview */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/10 p-6 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">تحلیل اجمالی بازار تهران</h2>
              </div>
              <p className="text-[11px] leading-7 text-slate-300 font-medium">{analysis.marketOverview}</p>
            </div>

            {/* Strategic Swaps Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-5 bg-cyan-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"></div>
                  <h2 className="text-xs font-black text-white uppercase tracking-wider">فرصت‌های استراتژیک جابجایی</h2>
                </div>
              </div>

              {analysis.strategies.map((strat, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-cyan-500/40 group">
                  <div className="bg-slate-900/40 px-6 py-5 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500/20 transition-colors">
                        <Calculator className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h3 className="font-black text-white text-[13px]">{strat.title}</h3>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase ${
                      strat.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      strat.riskLevel === 'MEDIUM' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {strat.riskLevel} RISK
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Visual Trade Path */}
                    <div className="flex items-center justify-center py-2">
                       <div className="flex items-center gap-6 bg-[#0f172a] px-10 py-4 rounded-full border border-slate-800 shadow-2xl group-hover:border-cyan-500/20 transition-all scale-105">
                          <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{strat.pair.split(' به ')[0] || strat.pair.split(' to ')[0]}</span>
                          <div className="bg-cyan-500 p-2.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse">
                            <ArrowRightLeft className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[12px] font-black text-cyan-400 uppercase tracking-widest">{strat.pair.split(' به ')[1] || strat.pair.split(' to ')[1]}</span>
                       </div>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                          <BarChart3 className="w-4 h-4 text-cyan-500/50" /> استدلال هوشمند و حباب‌سنجی
                        </h4>
                        <div className="text-[11px] leading-7 text-slate-300 bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 group-hover:text-slate-200 transition-colors">
                          {strat.logic}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-emerald-500/5 p-5 rounded-3xl border border-emerald-500/10">
                          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">تحلیل تکنیکال</h4>
                          <p className="text-[11px] leading-6 text-slate-400">{strat.technicalAnalysis}</p>
                        </div>
                        <div className="bg-blue-500/5 p-5 rounded-3xl border border-blue-500/10">
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">تحلیل بنیادی</h4>
                          <p className="text-[11px] leading-6 text-slate-400">{strat.fundamentalAnalysis}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden p-[1px]">
                          <div 
                            className="bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                            style={{ width: formatConfidence(strat.confidence) }} 
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 font-black tracking-tighter">اطمینان: {formatConfidence(strat.confidence)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Grounding Sources */}
            {analysis.sources && analysis.sources.length > 0 && (
              <div className="px-2 border-t border-white/5 pt-10">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase mb-5 tracking-[0.2em] flex items-center gap-2">
                  <Globe className="w-3 h-3" /> مراجع استعلام قیمت زنده
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {analysis.sources.map((source, sIdx) => (
                    <a 
                      key={sIdx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/50 px-5 py-2.5 rounded-2xl text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-2.5 group shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                      {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
           <div className="py-20 text-center animate-pulse">
             <p className="text-slate-500 text-sm italic">در انتظار پاسخ از سرور مرکزی...</p>
           </div>
        )}

        {/* Footer Disclaimer */}
        <footer className="pt-24 text-center space-y-8">
          <div className="inline-block h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full"></div>
          <p className="text-[10px] leading-6 text-slate-600 max-w-sm mx-auto italic font-medium px-4">
            سلب مسئولیت: زرین‌بین یک ابزار تحلیل‌گر هوشمند است. بازارهای مالی همواره دارای ریسک هستند. داده‌های این اپلیکیشن با رصد مستقیم سایت tgju.org و تحلیل هوش مصنوعی تولید می‌شود.
          </p>
          <div className="flex flex-col items-center gap-3 opacity-30">
             <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.5em]">ZARRINBIN ENGINE v2.5</div>
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
