
import React, { useState, useEffect } from 'react';
import { 
  RefreshCcw, 
  Loader2,
  ArrowRightLeft,
  Activity,
  Zap,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  ExternalLink
} from 'lucide-react';
import { getMarketAnalysis } from './geminiService';
import { AnalysisResponse } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarketAnalysis();
      setAnalysis(data);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.message || "خطای ناشناخته در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 pb-10 font-light text-right" dir="rtl">
      {/* Header */}
      <header className="bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-xl shadow-lg">
              <Cpu className="text-slate-900 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">زرین‌بین</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase">AI Market Advisor</p>
            </div>
          </div>
          <button onClick={fetchData} disabled={loading} className="p-2 bg-slate-800 rounded-xl">
            <RefreshCcw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6">
        {loading && !analysis ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <p className="text-sm">در حال تحلیل داده‌های بازار ایران...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 text-center animate-in zoom-in duration-300">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-white font-bold mb-4">خطا در اتصال به هوش مصنوعی</h2>
            
            <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 mb-6 text-right">
              <p className="text-xs text-rose-400 leading-7 mb-2 font-bold">جزئیات خطا:</p>
              <p className="text-[13px] text-slate-300 leading-7">{error}</p>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 mb-4">اگر خطا مربوط به کلید (Key) است، تصویر زیر را در پنل Vercel چک کنید:</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <div className="bg-slate-800 p-3 rounded-lg border border-white/5">
                  <span className="block text-slate-500 mb-1">کادر سمت چپ (Key)</span>
                  <span className="text-amber-400">API_KEY</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-white/5">
                  <span className="block text-slate-500 mb-1">کادر سمت راست (Value)</span>
                  <span className="text-emerald-400">AIzaSy...t1bGg</span>
                </div>
              </div>
              <button 
                onClick={fetchData}
                className="w-full bg-amber-500 text-slate-900 font-black py-4 rounded-2xl mt-6 shadow-xl"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Prices */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {analysis?.prices.map((p, i) => (
                <div key={i} className="flex-shrink-0 bg-slate-800/50 border border-white/5 p-4 rounded-2xl min-w-[140px]">
                  <span className="text-[10px] text-slate-500 block mb-1">{p.name}</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-white">{p.price}</span>
                    <span className={`text-[10px] ${p.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>{p.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div className="bg-slate-800/30 border border-white/5 rounded-3xl p-6">
               <h2 className="text-[11px] font-black text-amber-500 mb-4 flex items-center gap-2">
                 <Activity className="w-4 h-4" /> وضعیت کلی بازار
               </h2>
               <p className="text-sm leading-8 text-slate-300">{analysis?.marketOverview}</p>
            </div>

            {/* Strategies */}
            <div className="space-y-6">
              {analysis?.strategies.map((strat, idx) => (
                <div key={idx} className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-base font-black text-white">{strat.title}</h3>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">سود: {strat.potentialProfit}</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-4">
                      <div className="flex items-center gap-2 text-amber-400 mb-1">
                        <ArrowRightLeft className="w-4 h-4" />
                        <span className="text-[10px] font-black">پیشنهاد جابجایی:</span>
                      </div>
                      <p className="text-sm font-bold text-white">{strat.pair}</p>
                    </div>
                    <p className="text-xs leading-6 text-slate-400">{strat.logic}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Verification Footer */}
      <footer className="max-w-4xl mx-auto px-5 mt-10">
        <div className="bg-slate-900/80 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {analysis ? <ShieldCheck className="w-5 h-5 text-emerald-500" /> : <ShieldAlert className="w-5 h-5 text-rose-500" />}
            <div>
              <p className="text-[10px] font-bold text-white">اتصال به پروژه ۴۰۷۱۹۳۹۳۶۶۶۰</p>
              <p className="text-[9px] text-slate-500">{analysis ? "کلید فعال و معتبر است" : "در انتظار تایید کلید از ورسل..."}</p>
            </div>
          </div>
          <a href="https://ai.google.dev" target="_blank" className="text-slate-600 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
