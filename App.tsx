
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
      if (!data || !data.prices || data.prices.length === 0) {
        throw new Error("داده‌های معتبری یافت نشد. لطفاً دوباره تلاش کنید.");
      }
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "مشکلی در دریافت اطلاعات پیش آمده است.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatConfidence = (val: number) => {
    return val <= 1 ? `${Math.round(val * 100)}%` : `${Math.round(val)}%`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pb-10 font-light selection:bg-cyan-500/30 tracking-tight" dir="rtl">
      {/* Header */}
      <header className="bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-1.5 rounded-lg shadow-lg">
              <Compass className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-tight">زرین‌بین</h1>
              <p className="text-[9px] text-cyan-400 font-bold uppercase opacity-80">تحلیل هوشمند بازار</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className={`p-2 rounded-full transition-all border border-slate-700/50 ${loading ? 'animate-spin bg-cyan-500/10 text-cyan-400' : 'bg-slate-800/50 text-slate-400 hover:text-cyan-400'}`}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="w-14 h-14 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin relative z-10"></div>
              <Activity className="w-5 h-5 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
            </div>
            <p className="text-white text-xs font-bold">در حال دریافت قیمت‌های لحظه‌ای از TGJU...</p>
            <p className="text-[10px] text-slate-500 mt-2 uppercase">Connecting to Intelligence Engine</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="bg-rose-500/10 p-5 rounded-3xl border border-rose-500/20 mb-6">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-white font-bold mb-2">خطا در پردازش</h3>
            <p className="text-xs text-slate-400 mb-8 max-w-xs leading-6">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-2xl font-bold text-xs transition-all shadow-xl shadow-cyan-600/20"
            >
              تلاش دوباره
            </button>
          </div>
        ) : analysis ? (
          <div className="space-y-8">
            {/* Prices Ticker */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {analysis.prices.map((p, i) => (
                <div key={i} className="flex-shrink-0 bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl min-w-[150px] shadow-lg">
                  <div className="text-[10px] text-slate-500 font-bold mb-1">{p.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{p.price}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${p.isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                      {p.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Overview */}
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-[2rem]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 bg-cyan-500 rounded-full"></div>
                <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">تحلیل اجمالی بازار</h2>
              </div>
              <p className="text-[11px] leading-7 text-slate-300">{analysis.marketOverview}</p>
            </div>

            {/* Strategies */}
            <section className="space-y-6">
              <h2 className="text-xs font-black text-white px-2">فرصت‌های استراتژیک جابجایی</h2>
              {analysis.strategies.map((strat, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-cyan-500/30 transition-all">
                  <div className="bg-slate-900/40 px-6 py-5 flex items-center justify-between border-b border-white/5">
                    <h3 className="font-black text-white text-[13px]">{strat.title}</h3>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${
                      strat.riskLevel === 'LOW' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                      strat.riskLevel === 'MEDIUM' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' :
                      'text-rose-400 border-rose-500/20 bg-rose-500/5'
                    }`}>
                      RISK: {strat.riskLevel}
                    </span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-center gap-4 bg-[#0f172a] py-3 rounded-full border border-slate-800">
                      <span className="text-[11px] font-black text-slate-400">{strat.pair.split('به')[0]}</span>
                      <ArrowRightLeft className="w-4 h-4 text-cyan-500" />
                      <span className="text-[11px] font-black text-cyan-400">{strat.pair.split('به')[1]}</span>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5" /> منطق و استدلال ریاضی
                      </h4>
                      <p className="text-[11px] leading-6 text-slate-300 bg-slate-900/30 p-4 rounded-2xl border border-white/5">{strat.logic}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Technical Analysis</span>
                        <p className="text-[10px] mt-1 text-slate-400">{strat.technicalAnalysis}</p>
                      </div>
                      <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                        <span className="text-[9px] font-black text-blue-500 uppercase">Fundamental Analysis</span>
                        <p className="text-[10px] mt-1 text-slate-400">{strat.fundamentalAnalysis}</p>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center gap-4 border-t border-white/5">
                      <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: formatConfidence(strat.confidence) }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500">اطمینان: {formatConfidence(strat.confidence)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Sources */}
            {analysis.sources.length > 0 && (
              <div className="pt-10 px-2">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase mb-4 tracking-widest">منابع داده‌های زنده</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.sources.map((src, i) => (
                    <a key={i} href={src.uri} target="_blank" className="text-[10px] bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 text-slate-500 hover:text-cyan-400 transition-colors">
                      {src.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <footer className="pt-20 text-center space-y-4">
          <p className="text-[9px] leading-5 text-slate-600 max-w-xs mx-auto italic">
            سلب مسئولیت: زرین‌بین یک دستیار هوشمند است و پیشنهادات آن بر اساس تحلیل داده‌های آماری است. مسئولیت نهایی معاملات با شخص کاربر است.
          </p>
          <div className="text-[8px] text-slate-700 font-bold tracking-[0.3em] uppercase">ZarrinBin Intelligence Engine</div>
        </footer>
      </main>
    </div>
  );
};

export default App;
