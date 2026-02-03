
import React, { useState, useEffect } from 'react';
import { 
  Activity, Zap, Shield, Satellite, Radar, Plus, 
  Target, Radio, Cpu, Network, BarChart3, TrendingUp, 
  AlertTriangle, Globe, Lock, Cpu as CpuIcon, 
  Waves, MapPin, ChevronRight, Terminal as TerminalIcon,
  ShieldAlert, Database, Settings2, X, Fingerprint, Search,
  Eye, BrainCircuit, Share2, Layers, BellRing, Gavel
} from 'lucide-react';

interface InsightMission {
  id: string;
  title: string;
  type: 'Security' | 'Economic' | 'Disinfo' | 'Infrastructure';
  status: 'Processing' | 'Completed' | 'Alert';
  probability: number;
}

interface GovernanceAlert {
  id: string;
  level: 'Critical' | 'Warning' | 'Info';
  rule: string;
  message: string;
  timestamp: string;
}

const PredictiveCenter: React.FC = () => {
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [threatScore, setThreatScore] = useState(42);
  const [nationalRiskScore, setNationalRiskScore] = useState(84); // Simulated high risk
  const [missions, setMissions] = useState<InsightMission[]>([
    { id: 'MS-881', title: 'رصد تذبذب مسارات BGP - عدن', type: 'Security', status: 'Alert', probability: 89 },
    { id: 'MS-882', title: 'تحليل ظلال حاويات ميناء الصليف', type: 'Infrastructure', status: 'Processing', probability: 64 }
  ]);

  const [governanceAlerts, setGovernanceAlerts] = useState<GovernanceAlert[]>([]);

  // Automated Rule Checking Logic
  useEffect(() => {
    const checkRules = () => {
      const activeAlerts: GovernanceAlert[] = [];
      const now = new Date().toLocaleTimeString('ar-YE');

      // Rule 1: National Risk Threshold
      if (nationalRiskScore > 80) {
        activeAlerts.push({
          id: 'GOV-001',
          level: 'Critical',
          rule: 'تجاوز عتبة الخطر',
          message: 'تجاوز مؤشر الخطر الوطني حاجز الـ 80%. يتطلب بروتوكول السيادة مراجعة فورية لكافة المسودات قيد التحرير.',
          timestamp: now
        });
      }

      // Rule 2: Connectivity Integrity
      const bgpMission = missions.find(m => m.id === 'MS-881');
      if (bgpMission && bgpMission.probability > 85) {
        activeAlerts.push({
          id: 'GOV-002',
          level: 'Warning',
          rule: 'عزل شبكي محتمل',
          message: 'احتمالية عالية لعزل شبكة الإنترنت في مناطق حيوية. يوصى بتفعيل وضع الأوفلاين السيادي.',
          timestamp: now
        });
      }

      setGovernanceAlerts(activeAlerts);
    };

    checkRules();
    const interval = setInterval(checkRules, 5000);
    return () => clearInterval(interval);
  }, [nationalRiskScore, missions]);

  const [missionTarget, setMissionTarget] = useState('Security');
  const [sensitivity, setSensitivity] = useState(75);
  const [dataSources, setDataSources] = useState(['SAT', 'OSINT']);

  const toggleSource = (src: string) => {
    setDataSources(prev => prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]);
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-brand-bg p-8 overflow-hidden relative font-cairo animate-in fade-in duration-1000" dir="rtl">
      
      {/* Header Command Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-200 z-20 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/10">
              <Radar size={32} className="animate-pulse" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic">محطة الاستبصار السيادي</h2>
              <div className="flex items-center gap-4 mt-1">
                 <span className="text-[9px] font-black text-brand-gold uppercase tracking-[0.4em] flex items-center gap-2">
                    <Radio size={12} className="animate-pulse" /> PREDICTIVE HUB ACTIVE
                 </span>
                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                 <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">Node: Raidan_Primary_01</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden lg:flex flex-col items-end px-6 border-l border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي الإشارات المرصودة</span>
              <p className="text-xl font-black text-slate-800">1,284 <span className="text-[10px] text-green-500 font-bold">▲ 12%</span></p>
           </div>
           <button 
             onClick={() => setShowMissionModal(true)}
             className="px-8 py-4 bg-brand-primary text-white font-black rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest"
           >
              <Plus size={18} /> إنشاء مهمة استبصار
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden min-h-0 relative z-10">
        
        {/* Radar & Missions Feed */}
        <div className="lg:col-span-8 flex flex-col gap-8 overflow-hidden">
           
           {/* Radar Display Card */}
           <div className="bg-white border border-slate-200 rounded-[3.5rem] p-10 flex-1 relative overflow-hidden group shadow-soft flex flex-col">
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                 <div className="absolute inset-0 bg-[radial-gradient(#007aff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              </div>

              <div className="relative z-10 flex justify-between items-start mb-8">
                 <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-3">
                       <Target size={18} className="text-brand-primary" /> مصفوفة الرصد الاستباقي
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Real-time Causal Intelligence Matrix</p>
                 </div>
                 <div className="flex gap-2">
                    <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 flex items-center gap-2">
                       <Activity size={14} className="text-green-500" /> المحرك نشط
                    </div>
                 </div>
              </div>

              <div className="flex-1 relative bg-slate-50/50 rounded-[3rem] border border-slate-100 overflow-hidden flex items-center justify-center">
                 {/* Visual Indicators on Map Simulation */}
                 <div className="absolute inset-0 opacity-[0.07] grayscale contrast-125 bg-[url('https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png')]"></div>
                 
                 <div className="absolute top-1/3 left-1/4">
                    <div className="w-4 h-4 bg-brand-red rounded-full animate-ping opacity-40"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-brand-red rounded-full border-2 border-white shadow-lg"></div>
                 </div>

                 <div className="text-center relative z-10 p-12 bg-white/80 backdrop-blur-xl rounded-[4rem] border border-white shadow-xl max-w-md">
                    <div className="w-16 h-16 bg-brand-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                       <BrainCircuit size={40} className="text-brand-primary/40" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed mb-6">
                       جاري تحليل الارتباطات السببية بين الإشارات المكتشفة في ميناء الحديدة ومركز بيانات صنعاء.
                    </p>
                    <div className="flex justify-center gap-12 border-t border-slate-100 pt-6">
                       <div><p className="text-3xl font-black text-slate-900">8</p><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">عقود نشطة</p></div>
                       <div className="w-px h-10 bg-slate-100"></div>
                       <div><p className="text-3xl font-black text-brand-primary">94%</p><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">دقة الربط</p></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Active Missions List */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.map(mission => (
                <div key={mission.id} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:border-brand-primary transition-all shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                   <div className={`absolute top-0 right-0 w-2 h-full ${mission.status === 'Alert' ? 'bg-red-500' : 'bg-brand-primary'}`}></div>
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{mission.id} // {mission.type}</span>
                      <span className={`text-[10px] font-black uppercase ${mission.status === 'Alert' ? 'text-red-500' : 'text-brand-primary'}`}>{mission.status}</span>
                   </div>
                   <h4 className="text-sm font-black text-slate-800">{mission.title}</h4>
                   <div className="mt-2 flex items-center justify-between">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden ml-4">
                         <div className={`h-full transition-all duration-1000 ${mission.probability > 80 ? 'bg-red-500' : 'bg-brand-primary'}`} style={{ width: `${mission.probability}%` }}></div>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-500">{mission.probability}%</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar Controls & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-2">
           
           {/* Automated Governance Alerts - Light Theme */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20"></div>
              <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                 <BellRing size={16} className="text-red-500" /> تنبيهات الحوكمة الآلية
              </h3>
              
              <div className="space-y-4">
                {governanceAlerts.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-bold italic text-center py-6 border-2 border-dashed border-slate-50 rounded-2xl">لا توجد خروقات حالية للضوابط الأمنية.</p>
                ) : (
                  governanceAlerts.map(alert => (
                    <div key={alert.id} className={`p-5 rounded-2xl border transition-all animate-in slide-in-from-right-4 duration-500 ${alert.level === 'Critical' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                       <div className="flex justify-between items-start mb-3">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${alert.level === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>{alert.rule}</span>
                          <span className="text-[8px] font-mono text-slate-400">{alert.timestamp}</span>
                       </div>
                       <p className={`text-[11px] font-bold leading-relaxed mb-4 ${alert.level === 'Critical' ? 'text-red-700' : 'text-amber-700'}`}>{alert.message}</p>
                       <div className="flex gap-2">
                          <button className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${alert.level === 'Critical' ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'}`}>تأكيد الاستلام</button>
                          <button className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${alert.level === 'Critical' ? 'text-red-600 border-red-200 hover:bg-red-100' : 'text-amber-600 border-amber-200 hover:bg-amber-100'}`}>تحليل السبب</button>
                       </div>
                    </div>
                  ))
                )}
              </div>
              
              {nationalRiskScore > 80 && (
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3">
                   <Gavel size={16} className="text-red-500" />
                   <p className="text-[9px] text-slate-400 font-bold leading-tight italic">
                      نظام "الحارس الصامت" قيد التنفيذ التلقائي لتقييد الوصول النماذج الخارجية حفاظاً على السيادة.
                   </p>
                </div>
              )}
           </div>

           {/* Threat Gauge */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                 <AlertTriangle size={16} className="text-red-500" /> مصفوفة التهديدات الاستراتيجية
              </h3>

              <div className="relative w-44 h-44 flex items-center justify-center mb-8">
                 <svg className="w-full h-full transform -rotate-90 scale-110">
                    <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                    <circle 
                      cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={502}
                      strokeDashoffset={502 - (502 * threatScore) / 100}
                      className={`transition-all duration-1000 ${threatScore > 75 ? 'text-red-500' : 'text-brand-primary'}`}
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute text-center">
                    <span className="text-5xl font-black text-slate-800 italic tracking-tighter">{threatScore}%</span>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Risk Index</p>
                 </div>
              </div>

              <div className="w-full space-y-4 px-4">
                 {[
                   { label: 'الأمن السيبراني', val: 82, color: 'bg-red-500' },
                   { label: 'الاستقرار الاقتصادي', val: 45, color: 'bg-amber-500' },
                   { label: 'الحملات الإعلامية', val: 68, color: 'bg-brand-primary' }
                 ].map(item => (
                   <div key={item.label} className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest">
                         <span>{item.label}</span>
                         <span>{item.val}%</span>
                      </div>
                      <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                         <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Early Warning Feed */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm flex-1 flex flex-col overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-3">
                 <ShieldAlert size={18} className="text-amber-500" /> موجز الإنذار المبكر
              </h3>
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                 {[
                   { type: 'BGP', msg: 'تحول مفاجئ في مسارات الإنترنت الدولية بمحافظة الحديدة.', time: 'منذ 5 د' },
                   { type: 'SAT', msg: 'رصد انبعاثات حرارية غير طبيعية في المنطقة الصناعية شمال تعز.', time: 'منذ 12 د' },
                   { type: 'OSINT', msg: 'تصاعد حملة تضليل منسقة تستهدف البنك المركزي.', time: 'منذ 40 د' }
                 ].map((alert, i) => (
                   <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-primary/20 transition-all group cursor-pointer">
                      <div className="flex justify-between mb-2">
                         <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">{alert.type} PROTOCOL</span>
                         <span className="text-[8px] font-bold text-slate-400">{alert.time}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">"{alert.msg}"</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white hover:border-brand-primary transition-all">فتح سجل التنبيهات الكامل</button>
           </div>
        </div>
      </div>

      {/* MISSION MODAL - Light Themed */}
      {showMissionModal && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setShowMissionModal(false)}>
           <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-[3.5rem] p-12 shadow-2xl flex flex-col gap-10 max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-primary rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                       <Zap size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-800 tracking-tighter">إعداد مهمة استبصار جديدة</h3>
                       <p className="text-[10px] text-brand-primary mt-1 uppercase tracking-[0.4em] font-black italic">Sovereign Intelligence Protocol v2.0</p>
                    </div>
                 </div>
                 <button onClick={() => setShowMissionModal(false)} className="text-slate-300 hover:text-red-500 p-3 bg-slate-50 rounded-full transition-all"><X size={28} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 {/* Mission Scope & Target */}
                 <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Target size={14} className="text-brand-primary" /> هدف التحقيق الاستباقي
                        </label>
                        <select 
                          value={missionTarget}
                          onChange={(e) => setMissionTarget(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-800 focus:border-brand-primary outline-none transition-all appearance-none shadow-sm"
                        >
                            <option value="Security">الأمن القومي والتحركات الميدانية</option>
                            <option value="Economic">الاستقرار الاقتصادي وسعر الصرف</option>
                            <option value="Disinfo">حملات التضليل والتلاعب بالرأي العام</option>
                            <option value="Infrastructure">أمن البنية التحتية والمنشآت الحيوية</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مصادر البيانات (Data Fusion)</label>
                        <div className="grid grid-cols-2 gap-3">
                           {[
                             { id: 'SAT', label: 'Sentinel-2 Satellite', icon: <Satellite size={14}/> },
                             { id: 'BGP', label: 'BGP Stream Monitor', icon: <Network size={14}/> },
                             { id: 'OSINT', label: 'OSINT Crawler', icon: <Search size={14}/> },
                             { id: 'HIST', label: 'Historical Archives', icon: <Database size={14}/> }
                           ].map(src => (
                             <button 
                               key={src.id}
                               onClick={() => toggleSource(src.id)}
                               className={`p-4 rounded-xl border text-[10px] font-black uppercase flex items-center gap-3 transition-all ${dataSources.includes(src.id) ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-brand-primary/20'}`}
                             >
                                {src.icon} {src.label}
                             </button>
                           ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">توصيف نطاق المهمة</label>
                        <textarea 
                          rows={4} 
                          placeholder="تتبع العلاقة بين انقطاع الألياف البصرية في الحديدة وحركة الطيران المجهول..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all leading-relaxed shadow-inner"
                        ></textarea>
                    </div>
                 </div>

                 {/* Reasoning Engine & Security */}
                 <div className="space-y-8 flex flex-col">
                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-8 flex-1 shadow-sm">
                       <div className="space-y-4">
                           <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <span>حساسية الإنذار (Sensitivity)</span>
                              <span className="text-brand-primary font-mono">{sensitivity}%</span>
                           </div>
                           <input 
                             type="range" min="1" max="100" 
                             value={sensitivity} 
                             onChange={(e) => setSensitivity(parseInt(e.target.value))}
                             className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                           />
                       </div>

                       <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <BrainCircuit size={16} className="text-brand-primary" /> محرك الاستدلال (Reasoning Mode)
                           </label>
                           <div className="grid grid-cols-2 gap-2">
                              {['تحليل احتمالي', 'ترابط سببي', 'نمذجة تاريخية', 'تحليل تنبؤي'].map(mode => (
                                <button key={mode} className="py-3 px-4 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm">
                                   {mode}
                                </button>
                              ))}
                           </div>
                       </div>

                       <div className="pt-6 border-t border-slate-200 space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Lock size={16} className="text-brand-gold" /> بروتوكول الأمان
                           </label>
                           <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">عزل البيانات السيادي</span>
                              <div className="w-10 h-5 bg-brand-primary rounded-full relative">
                                 <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                              </div>
                           </div>
                       </div>
                    </div>

                    <button className="w-full py-6 bg-slate-800 text-white font-black rounded-[2rem] shadow-xl hover:bg-brand-primary transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3">
                       <Zap size={20} className="text-brand-gold fill-brand-gold" /> إطلاق المهمة في النواة
                    </button>
                 </div>
              </div>

              <div className="p-6 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10 flex items-start gap-4">
                 <Shield className="text-brand-primary shrink-0" size={24} />
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                    ملاحظة: سيقوم محرك الاستبصار بدمج كافة المصادر المختارة وبناء نموذج استدلال سببي محمي. النتائج ستظهر في السجل بمجرد اكتمال دورة المعالجة.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveCenter;
