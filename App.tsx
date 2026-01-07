
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
import { getMarketAnalysis } from './services/geminiService';
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
    // Handle both 0.92 and 92 formats
    const percentage = val <= 1 ? Math.round(val * 100) : Math.round(val);
    return `${percentage}%`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pb-10 font-light selection:bg-cyan-500/30">
      {/* High-End Header */}
      <header className="bg-[#1e293b]/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-1.5 rounded-lg shadow-lg shadow-cyan-500/20">
              <Compass className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">استراتژی‌های معاملاتی</h1>
              <p className="text-[9px] text-cyan-500 font-bold tracking-widest uppercase opacity-90">Precision Intelligence v2.5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchData}
              className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-cyan-400"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-500' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6">
        {loading && !analysis ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
              <Activity className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-slate-500 font-medium animate-pulse text-[11px] tracking-tight">در حال استخراج الگوریتم‌های بازار و تحلیل عمیق...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            
            {/* Real-time Market Ticker */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {analysis?.prices.map((p, i) => (
                <div key={i} className="flex-shrink-0 bg-slate-800/40 border border-slate-700/50 px-3 py-2.5 rounded-xl min-w-[120px] transition-colors hover:border-cyan-500/30">
                  <div className="text-[9px] text-slate-500 font-bold mb-0.5 truncate">{p.name}</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white tracking-wide">{p.price}</span>
                    <span className={`text-[9px] font-bold ${p.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {p.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Swaps Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">نقشه راه جابجایی هوشمند</h2>
              </div>

              {analysis?.strategies.map((strat, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl transition-all hover:bg-slate-800/90 hover:border-cyan-500/20 group">
                  <div className="bg-slate-700/30 px-5 py-3 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-3.5 h-3.5 text-cyan-500 opacity-80" />
                      <h3 className="font-bold text-cyan-400 text-[11px]">{strat.title}</h3>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border tracking-tighter ${
                      strat.riskLevel === 'LOW' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
                      strat.riskLevel === 'MEDIUM' ? 'bg-cyan-500/5 text-cyan-500 border-cyan-500/20' :
                      'bg-rose-500/5 text-rose-500 border-rose-500/20'
                    }`}>
                      RISK: {strat.riskLevel}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Improved Trade Path Section */}
                    <div className="flex items-center justify-between bg-slate-900 px-4 py-3 rounded-xl border border-cyan-500/10 transition-colors group-hover:border-cyan-500/30 shadow-inner">
                      <span className="text-[10px] text-cyan-500/70 font-bold uppercase tracking-tighter">مسیر پیشنهادی معامله</span>
                      <span className="text-[11px] font-bold text-cyan-50 flex items-center gap-2">
                        {strat.pair.split(' to ')[0]} 
                        <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
                        {strat.pair.split(' to ')[1]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <BarChart3 className="w-3 h-3 text-cyan-500/50" /> منطق و محاسبات بازار
                        </h4>
                        <p className="text-[11px] leading-6 text-slate-300 text-justify bg-slate-900/40 p-3 rounded-lg border border-white/5 group-hover:text-slate-200 transition-colors">
                          {strat.logic}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Technical Section - Green Theme */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Technical</h4>
                          <p className="text-[10px] leading-5 text-emerald-400/90 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10 h-full">
                            {strat.technicalAnalysis}
                          </p>
                        </div>
                        {/* Fundamental Section - Blue Theme */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Fundamental</h4>
                          <p className="text-[10px] leading-5 text-blue-400/90 bg-blue-500/5 p-2.5 rounded-lg border border-blue-500/10 h-full">
                            {strat.fundamentalAnalysis}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: formatConfidence(strat.confidence) }} />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{formatConfidence(strat.confidence)}</span>
                      </div>
                      <button className="text-[9px] font-bold text-cyan-500/80 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                        تحلیل دقیق <Compass className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Bottom Info */}
            <footer className="pt-8 border-t border-slate-800/50 text-center">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 inline-block max-w-xs shadow-inner">
                <p className="text-[9px] leading-4 text-slate-500 font-medium">
                  سلب مسئولیت: این تحلیل‌ها بر اساس مدل‌های آماری و ریاضی استخراج شده است. بازارهای مالی همواره دارای ریسک هستند.
                </p>
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
