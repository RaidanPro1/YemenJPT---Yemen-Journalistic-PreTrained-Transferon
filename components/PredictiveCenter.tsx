
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Zap, Shield, Satellite, Radar, Plus, 
  Target, Radio, Cpu, Network, BarChart3, TrendingUp, 
  AlertTriangle, Globe, Lock, Play, StopCircle,
  ShieldAlert, Database, Settings2, X, Fingerprint, Search,
  Eye, BrainCircuit, Share2, Layers, BellRing, Gavel,
  Sliders, Check, Terminal, MessageSquare, Briefcase,
  Wifi, Hash, FileText, Map, Sparkles
} from 'lucide-react';

interface SimulationEvent {
  time: string;
  event: string;
  probability: number;
  impact: 'High' | 'Medium' | 'Low';
  source: string;
}

interface ActiveModule {
  id: string;
  name: string;
  status: 'idle' | 'scanning' | 'analyzing' | 'complete';
  dataPoints: number;
}

const PredictiveCenter: React.FC = () => {
  // Mode: AI Prompt vs Manual Config
  const [mode, setMode] = useState<'ai_architect' | 'manual'>('ai_architect');
  
  // Inputs
  const [scenarioPrompt, setScenarioPrompt] = useState('');
  const [targetUrls, setTargetUrls] = useState('');
  
  // Simulation State
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Analysis Data
  const [hateSpeechLevel, setHateSpeechLevel] = useState(12);
  const [internetConnectivity, setInternetConnectivity] = useState(98);
  const [activeModules, setActiveModules] = useState<ActiveModule[]>([
    { id: 'osint', name: 'Web Scrapers & News', status: 'idle', dataPoints: 0 },
    { id: 'social', name: 'Social Listening (X/Telegram)', status: 'idle', dataPoints: 0 },
    { id: 'sat', name: 'Satellite Imagery (Sentinel-2)', status: 'idle', dataPoints: 0 },
    { id: 'bgp', name: 'NetBlocks & BGP Protocols', status: 'idle', dataPoints: 0 }
  ]);

  const [predictions, setPredictions] = useState<SimulationEvent[]>([]);

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12:false})}] ${msg}`]);

  const startSimulation = () => {
    if (!scenarioPrompt && mode === 'ai_architect') return;
    
    setIsRunning(true);
    setProgress(0);
    setLogs([]);
    setPredictions([]);
    setHateSpeechLevel(12);
    setInternetConnectivity(98);
    
    // Reset Modules
    setActiveModules(prev => prev.map(m => ({ ...m, status: 'scanning', dataPoints: 0 })));

    addLog(`INITIATING SOVEREIGN PREDICTIVE CORE v9.2...`);
    addLog(`Parsing Scenario: "${scenarioPrompt.substring(0, 40)}..."`);

    // SIMULATION SEQUENCE
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(p => Math.min(p + 5, 100));

      // 1. Web Scraping Phase
      if (step === 3) {
        addLog("🚀 Deploying SpiderFoot Scrapers on target URLs...");
        updateModule('osint', 'analyzing', 142);
      }

      // 2. Social Listening Phase
      if (step === 6) {
        addLog("🐦 Ingesting X (Twitter) & Telegram localized channels...");
        addLog("⚠️ Detecting spike in polarized narratives...");
        updateModule('social', 'analyzing', 850);
        setHateSpeechLevel(65); // Simulated spike
      }

      // 3. Network & Satellite Phase
      if (step === 10) {
        addLog("🛰️ Requesting Sentinel-2 Pass over Coordinates: 15.3694° N, 44.1910° E");
        addLog("🌐 Analyzing BGP Routes for AS30873 (YemenNet)...");
        updateModule('sat', 'complete', 4);
        updateModule('bgp', 'complete', 1);
        setInternetConnectivity(82); // Simulated drop
      }

      // 4. Generate Predictions
      if (step === 15) {
        addLog("🧠 Synthesizing Causal Links & Generating Timeline...");
        setActiveModules(prev => prev.map(m => ({ ...m, status: 'complete' })));
        setPredictions([
          { time: 'T+4 Hours', event: 'تصاعد هاشتاجات التحريض في محيط العاصمة', probability: 89, impact: 'High', source: 'Social Logic' },
          { time: 'T+12 Hours', event: 'احتمالية انقطاع جزئي للإنترنت (تشبع المسارات)', probability: 64, impact: 'Medium', source: 'BGP Analysis' },
          { time: 'T+24 Hours', event: 'تجمعات بشرية مرصودة بالأقمار (التحرير)', probability: 75, impact: 'High', source: 'Satellite AI' },
          { time: 'T+48 Hours', event: 'ارتفاع أسعار السلع الأساسية بنسبة 5%', probability: 92, impact: 'Medium', source: 'Econ Scraper' },
        ]);
      }

      if (step === 18) {
        setIsRunning(false);
        addLog("✅ Simulation Complete. Strategy Report Generated.");
        clearInterval(interval);
      }

    }, 800);
  };

  const updateModule = (id: string, status: ActiveModule['status'], points: number) => {
    setActiveModules(prev => prev.map(m => m.id === id ? { ...m, status, dataPoints: points } : m));
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-brand-bg p-6 overflow-hidden font-cairo" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm shrink-0">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Radar className="text-brand-primary" size={28} /> غرفة عمليات الاستبصار الاستراتيجي
           </h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
             Advanced Scenario Simulation & Multi-Source Intelligence
           </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setMode('ai_architect')}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mode === 'ai_architect' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
           >
              <Sparkles size={14} /> مهندس السيناريو (AI)
           </button>
           <button 
             onClick={() => setMode('manual')}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
           >
              <Sliders size={14} /> التحكم اليدوي
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT COLUMN: Input & Configuration */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
           
           {/* Scenario Builder */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-800 mb-2">
                 <BrainCircuit className="text-brand-primary" size={20} />
                 <h3 className="text-xs font-black uppercase tracking-widest">
                    {mode === 'ai_architect' ? 'وصف التجربة الاستبصارية' : 'تكوين المدخلات يدوياً'}
                 </h3>
              </div>

              {mode === 'ai_architect' ? (
                <>
                  <textarea 
                    value={scenarioPrompt}
                    onChange={(e) => setScenarioPrompt(e.target.value)}
                    placeholder="مثال: قم بمحاكاة تأثير انقطاع كابل بحري على خدمة الإنترنت في اليمن، وتتبع ردود الفعل في تويتر، مع رصد أي تحركات ميدانية عبر الأقمار الصناعية..."
                    className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-700 outline-none focus:border-brand-primary resize-none leading-relaxed"
                  />
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase">نطاق البحث:</span>
                     <select className="bg-slate-100 border-none rounded-lg text-[10px] font-bold px-2 py-1 outline-none text-slate-600">
                        <option>محلي (اليمن)</option>
                        <option>إقليمي</option>
                        <option>دولي</option>
                     </select>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">روابط المصادر (URLs) للكشط:</label>
                      <input 
                        type="text" 
                        value={targetUrls}
                        onChange={(e) => setTargetUrls(e.target.value)}
                        placeholder="https://news-site.com, https://..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">الكلمات المفتاحية للرصد:</label>
                      <input type="text" placeholder="#هاشتاج، كلمة_مفتاحية" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">إحداثيات الأقمار الصناعية:</label>
                      <div className="flex gap-2">
                         <input type="text" placeholder="Lat" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none" />
                         <input type="text" placeholder="Long" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none" />
                      </div>
                   </div>
                </div>
              )}

              <button 
                onClick={startSimulation}
                disabled={isRunning}
                className="mt-2 w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg hover:bg-blue-600 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
              >
                 {isRunning ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
                 {isRunning ? 'جاري تنفيذ السيناريو...' : 'بدء المحاكاة والتحليل'}
              </button>
           </div>

           {/* Active Modules Monitor */}
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl text-white">
              <h3 className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Cpu size={14} /> الوحدات النشطة (Modules)
              </h3>
              <div className="space-y-3">
                 {activeModules.map(mod => (
                    <div key={mod.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${mod.status === 'scanning' || mod.status === 'analyzing' ? 'bg-yellow-400 animate-pulse' : mod.status === 'complete' ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-200">{mod.name}</p>
                             <p className="text-[8px] text-slate-500 uppercase">{mod.status}</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-mono text-brand-gold">{mod.dataPoints > 0 ? `${mod.dataPoints} hit` : '-'}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* CENTER/RIGHT: Visualization & War Room */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
           
           {/* Top Stats Grid */}
           <div className="grid grid-cols-3 gap-4 h-32 shrink-0">
              {/* Hate Speech Meter */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                 <div className="flex justify-between items-start z-10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><ShieldAlert size={12}/> Toxicity Index</span>
                    <span className={`text-lg font-black ${hateSpeechLevel > 50 ? 'text-red-500' : 'text-green-500'}`}>{hateSpeechLevel}%</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden z-10">
                    <div className={`h-full transition-all duration-1000 ${hateSpeechLevel > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${hateSpeechLevel}%`}}></div>
                 </div>
                 <p className="text-[8px] text-slate-400 font-bold z-10">{hateSpeechLevel > 50 ? 'تحذير: خطاب كراهية مرتفع' : 'المستوى طبيعي'}</p>
                 {/* Background Chart Effect */}
                 <div className="absolute bottom-0 left-0 w-full h-12 opacity-10">
                    <div className="flex items-end h-full gap-1 px-2">
                       {[...Array(20)].map((_,i) => <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{height: `${Math.random() * hateSpeechLevel}%`}}></div>)}
                    </div>
                 </div>
              </div>

              {/* Internet Connectivity */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                 <div className="flex justify-between items-start z-10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Wifi size={12}/> Connectivity</span>
                    <span className={`text-lg font-black ${internetConnectivity < 90 ? 'text-yellow-500' : 'text-brand-cyan'}`}>{internetConnectivity}%</span>
                 </div>
                 <div className="flex gap-1 items-end h-8 z-10">
                    {[98,99,97,internetConnectivity,internetConnectivity-2,internetConnectivity+1,98].map((v, i) => (
                       <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${v < 90 ? 'bg-yellow-400' : 'bg-brand-cyan'}`} style={{height: `${(v/100)*100}%`}}></div>
                    ))}
                 </div>
                 <p className="text-[8px] text-slate-400 font-bold z-10">BGP Routes: {internetConnectivity < 90 ? 'Unstable' : 'Stable'}</p>
              </div>

              {/* Live Scraped Items */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Hash size={12}/> Ingested Data</span>
                    <span className="text-lg font-black text-slate-800">{activeModules.reduce((a,b) => a + b.dataPoints, 0)}</span>
                 </div>
                 <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] border-2 border-white">🐦</div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] border-2 border-white text-white">✈️</div>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-[10px] border-2 border-white text-white">📰</div>
                 </div>
              </div>
           </div>

           {/* Main Visualization Panel (Tabs) */}
           <div className="flex-1 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-prof flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-purple-500 to-brand-gold"></div>
              
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Target className="text-brand-primary" size={20} /> مسرح العمليات الافتراضي
                 </h3>
                 <div className="flex gap-2">
                    <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
                       {isRunning ? 'Simulation Live' : 'Standby'}
                    </div>
                 </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                 {/* Live Logs Terminal */}
                 <div className="bg-slate-900 rounded-3xl p-6 font-mono text-[10px] flex flex-col shadow-inner relative overflow-hidden">
                    <div className="absolute top-2 right-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">System Logs</div>
                    <div ref={logRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mt-4 text-slate-300">
                       {logs.length === 0 && <span className="opacity-30 italic">Ready for input...</span>}
                       {logs.map((l, i) => (
                          <div key={i} className="animate-in slide-in-from-left-2 fade-in duration-300 border-l-2 border-brand-primary/30 pl-2">
                             {l}
                          </div>
                       ))}
                       {isRunning && <span className="animate-pulse">_</span>}
                    </div>
                 </div>

                 {/* Predictions Timeline */}
                 <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline المتوقع</span>
                       <TrendingUp size={14} className="text-slate-400" />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                       {predictions.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center opacity-30">
                             <ClockIcon />
                             <p className="text-[9px] font-bold mt-2">No predictions yet</p>
                          </div>
                       ) : (
                          predictions.map((ev, i) => (
                             <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-3 items-start animate-in zoom-in-95 duration-500" style={{animationDelay: `${i*100}ms`}}>
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${ev.impact === 'High' ? 'bg-red-500' : ev.impact === 'Medium' ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                                <div>
                                   <div className="flex justify-between items-center w-full gap-4">
                                      <span className="text-[9px] font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded">{ev.time}</span>
                                      <span className="text-[8px] font-bold text-slate-400 uppercase">{ev.probability}% Prob.</span>
                                   </div>
                                   <p className="text-[10px] font-bold text-slate-700 mt-1 leading-relaxed">{ev.event}</p>
                                   <p className="text-[8px] text-slate-400 mt-1">Source: {ev.source}</p>
                                </div>
                             </div>
                          ))
                       )}
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default PredictiveCenter;
