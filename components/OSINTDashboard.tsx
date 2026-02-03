
import React, { useState } from 'react';
import { Search, User, Globe, Share2, Zap, Shield, Target, ExternalLink } from 'lucide-react';

const OSINTDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'person' | 'domain' | 'keyword'>('person');
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const startScan = () => {
    if (!query) return;
    setIsScanning(true);
    setLogs([]);
    const steps = [
      `[SEARCH] Initializing SearXNG Meta-Search for: ${query}...`,
      `[SHERLOCK] Scanning 400+ social platforms for username patterns...`,
      `[SPIDERFOOT] Correlating DNS and WHOIS records...`,
      `[MAIGRET] Extracting metadata from secondary profiles...`,
      `[SUCCESS] 14 Potential matches found in Telegram/X/Facebook archives.`
    ];
    
    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (i === steps.length - 1) setIsScanning(false);
      }, i * 1500);
    });
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-white tracking-tight">مركز استخبارات المصادر المفتوحة (OSINT)</h2>
        <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest mt-2">البحث، التتبع، والتحليل الميداني الرقمي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Target className="text-brand-gold" size={16} /> مدخلات التتبع (Target)
              </h3>
              
              <div className="space-y-6">
                 <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-slate-800">
                    {[
                      { id: 'person', label: 'اسم مستخدم', icon: <User size={14} /> },
                      { id: 'domain', label: 'نطاق/موقع', icon: <Globe size={14} /> },
                      { id: 'keyword', label: 'كلمة مفتاحية', icon: <Search size={14} /> }
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setType(t.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${type === t.id ? 'bg-brand-cyan text-brand-dark shadow-cyan-glow' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                         {t.icon} {t.label}
                      </button>
                    ))}
                 </div>

                 <div className="relative">
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={type === 'person' ? "@username..." : "example.com..."}
                      className="w-full bg-black/40 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 focus:border-brand-cyan outline-none"
                    />
                    <Zap className="absolute left-4 top-5 text-slate-600" size={18} />
                 </div>

                 <button 
                  onClick={startScan}
                  disabled={isScanning}
                  className="w-full py-5 bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-black rounded-2xl shadow-xl hover:shadow-cyan-glow transition-all uppercase tracking-widest disabled:opacity-50"
                 >
                    {isScanning ? 'جاري الاستطلاع...' : 'بدء عملية التقصي الرقمي'}
                 </button>
              </div>
           </div>

           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">الأدوات المفعلة في هذا المسار</h3>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { name: 'SearXNG', status: 'Active', color: 'text-brand-cyan' },
                   { name: 'Sherlock', status: 'Active', color: 'text-brand-cyan' },
                   { name: 'SpiderFoot', status: 'Ready', color: 'text-slate-500' },
                   { name: 'Maigret', status: 'Ready', color: 'text-slate-500' },
                 ].map(tool => (
                   <div key={tool.name} className="p-3 bg-black/30 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-300">{tool.name}</span>
                      <span className={`text-[8px] font-black uppercase ${tool.color}`}>{tool.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
           <div className="bg-black/90 border border-slate-800 rounded-[2.5rem] p-8 font-mono text-[11px] flex-1 flex flex-col shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                 <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-brand-gold animate-pulse shadow-gold-glow' : 'bg-slate-700'}`}></div>
                    <span className="text-brand-gold font-black uppercase tracking-widest text-[9px]">OSINT Deployment Log</span>
                 </div>
                 <button className="text-slate-500 hover:text-white"><ExternalLink size={14} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-brand-cyan/80" dir="ltr">
                 {logs.length === 0 && <div className="text-slate-700 italic py-20 text-center uppercase tracking-[0.3em] opacity-30">Awaiting target initialization...</div>}
                 {logs.map((log, i) => (
                   <div key={i} className="animate-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-600 mr-2">#</span>{log}
                   </div>
                 ))}
                 {isScanning && <div className="w-2 h-4 bg-brand-cyan animate-pulse inline-block"></div>}
              </div>

              {logs.length > 0 && !isScanning && (
                <div className="mt-8 p-6 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 animate-in zoom-in-95">
                   <p className="text-[10px] font-black text-brand-cyan uppercase mb-3">ملخص الكشف الاستخباراتي:</p>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                         <span className="text-[9px] text-slate-500 uppercase">الحسابات المكتشفة</span>
                         <span className="text-xl font-black text-white">12</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] text-slate-500 uppercase">نطاق البصمة</span>
                         <span className="text-xl font-black text-brand-gold">متوسط / Wide</span>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OSINTDashboard;
