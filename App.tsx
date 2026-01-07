
import React, { useState, useEffect } from 'react';
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
  Activity
} from 'lucide-react';
import { getMarketAnalysis } from './geminiService';
import { AnalysisResponse, PriceData } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getMarketAnalysis();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              <p className="text-[8px] text-cyan-400 font-bold tracking-widest uppercase opacity-90">Market Intelligence</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-cyan-400 border border-slate-700/50"
            disabled={loading}
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-500' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading && !analysis ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
              <Loader2 className="w-12 h-12 text-cyan-500 animate-spin relative z-10" />
              <Activity className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
            </div>
            <p className="text-slate-400 font-medium text-xs">در حال رصد بازارهای جهانی و داخلی...</p>
            <p className="text-[10px] text-slate-500 mt-2">استخراج داده‌های لحظه‌ای از مراجع قیمت‌گذاری</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            
            {/* Real-time Market Ticker */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {analysis?.prices.map((p, i) => (
                <div key={i} className="flex-shrink-0 bg-slate-800/40 border border-slate-700/50 px-4 py-3 rounded-2xl min-w-[140px] transition-all hover:border-cyan-500/30 hover:bg-slate-800/60">
                  <div className="text-[10px] text-slate-500 font-bold mb-1 truncate">{p.name}</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-white">{p.price}</span>
                    <span className={`text-[9px] font-black px-1 rounded ${p.isPositive ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
                      {p.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Swaps Section */}
            <section className="space-y-5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">فرصت‌های آربیتراژ و تبدیل</h2>
                </div>
                {analysis?.sources && analysis.sources.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50">
                    <Globe className="w-3 h-3 text-cyan-500/70" />
                    <span>بر اساس داده‌های زنده</span>
                  </div>
                )}
              </div>

              {analysis?.strategies.map((strat, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:bg-slate-800/80 hover:border-cyan-500/30 group">
                  <div className="bg-slate-900/40 px-6 py-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                        <Calculator className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h3 className="font-black text-white text-[13px]">{strat.title}</h3>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-tighter ${
                      strat.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      strat.riskLevel === 'MEDIUM' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {strat.riskLevel} Risk
                    </span>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Visual Trade Path */}
                    <div className="relative flex items-center justify-center py-4 px-2">
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                       </div>
                       <div className="relative flex items-center gap-6 bg-[#0f172a] px-6 py-2 rounded-full border border-slate-800 shadow-inner group-hover:border-cyan-500/20 transition-colors">
                          <span className="text-[12px] font-black text-slate-200">{strat.pair.split(' to ')[0]}</span>
                          <div className="bg-cyan-500 p-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <ArrowRightLeft className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[12px] font-black text-cyan-400">{strat.pair.split(' to ')[1]}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                          <BarChart3 className="w-3.5 h-3.5 text-cyan-500/50" /> منطق محاسباتی معامله
                        </h4>
                        <div className="text-[11px] leading-relaxed text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-white/5 group-hover:text-slate-200 transition-colors">
                          {strat.logic}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                          <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Technical View</h4>
                          <p className="text-[10px] leading-normal text-emerald-400/90">{strat.technicalAnalysis}</p>
                        </div>
                        <div className="space-y-2 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Fundamental View</h4>
                          <p className="text-[10px] leading-normal text-blue-400/90">{strat.fundamentalAnalysis}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden p-[1px]">
                          <div 
                            className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
                            style={{ width: formatConfidence(strat.confidence) }} 
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-black tracking-tighter">اطمینان: {formatConfidence(strat.confidence)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Grounding Sources */}
            {analysis?.sources && analysis.sources.length > 0 && (
              <div className="px-1">
                <h4 className="text-[9px] font-bold text-slate-600 uppercase mb-3 tracking-widest">منابع و مراجع داده‌ها</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.sources.map((source, sIdx) => (
                    <a 
                      key={sIdx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[9px] bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-1.5"
                    >
                      <Globe className="w-2.5 h-2.5" />
                      {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Disclaimer */}
            <footer className="pt-10 text-center space-y-4">
              <div className="inline-block p-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full mb-4"></div>
              <p className="text-[9px] leading-5 text-slate-500 max-w-xs mx-auto italic">
                سلب مسئولیت: تحلیل‌های ارائه شده توسط هوش مصنوعی بر اساس الگوهای ریاضی است. بازارهای مالی ایران دارای نوسانات غیرقابل پیش‌بینی هستند. همیشه با مدیریت سرمایه معامله کنید.
              </p>
              <div className="text-[8px] text-slate-700 font-bold uppercase tracking-[0.3em]">
                ZarrinBin Intelligence Systems Engine
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
