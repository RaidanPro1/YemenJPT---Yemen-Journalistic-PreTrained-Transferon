
import React, { useState } from 'react';
import { Activity, Zap, Shield, Satellite, Radar, Plus, Settings2, Sliders, Bell, Target, Radio, Cpu, Clock, AlertTriangle, Network } from 'lucide-react';

interface NationalSignal {
  id: string;
  source: 'BGP' | 'SATELLITE' | 'SOCIAL' | 'ECON' | 'BORDERS';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  location: string;
  timestamp: string;
}

const PredictiveCenter: React.FC = () => {
  const [defcon, setDefcon] = useState(3);
  const [showNewScenario, setShowNewScenario] = useState(false);
  const [sensitivity, setSensitivity] = useState({ bgp: 80, sat: 65, social: 90 });
  
  // New Scenario Form State
  const [scenarioForm, setScenarioForm] = useState({
    title: '',
    sector: 'Security',
    threatLevel: 'Medium',
    sensors: ['BGP'],
    causalLink: '',
    duration: '72h'
  });

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-dark p-6 overflow-y-auto custom-scrollbar">
      {/* Header & Global Controls */}
      <div className="bg-brand-panel border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Radar size={200} />
         </div>
         <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-8">
               <div className={`w-32 h-32 rounded-full border-[12px] flex items-center justify-center transition-all duration-1000 ${defcon <= 2 ? 'border-red-600 animate-pulse shadow-[0_0_60px_rgba(220,38,38,0.4)]' : 'border-brand-gold shadow-gold-glow'}`}>
                  <div className="text-center">
                    <span className="text-5xl font-black text-white">{defcon}</span>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Defcon</span>
                  </div>
               </div>
               <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter italic">مركز الاستبصار السيادي</h2>
                  <p className="text-xs font-bold text-brand-gold mt-2 uppercase tracking-[0.4em] flex items-center gap-2">
                     <Zap size={14} className="animate-pulse" /> National Early Warning Protocol
                  </p>
               </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full lg:w-72">
               <button 
                onClick={() => setShowNewScenario(true)}
                className="w-full py-4 bg-brand-cyan text-brand-dark font-black rounded-2xl flex items-center justify-center gap-3 shadow-cyan-glow hover:scale-[1.02] transition-all uppercase tracking-widest text-xs"
               >
                  <Plus size={18} /> تخطيط مهمة استبصار مفصلة
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Sensitivity Panel */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-brand-panel border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
               <h3 className="text-xs font-black text-brand-cyan uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Settings2 size={18} /> معايرة حساسية المجسات
               </h3>
               <div className="space-y-8">
                  {[
                    { id: 'bgp', label: 'رادار الإنترنت (BGP)', val: sensitivity.bgp, icon: <Radio size={14}/> },
                    { id: 'sat', label: 'تحليل الصور (SAT)', val: sensitivity.sat, icon: <Satellite size={14}/> },
                    { id: 'social', label: 'النبض الاجتماعي (OSINT)', val: sensitivity.social, icon: <Activity size={14}/> }
                  ].map(s => (
                    <div key={s.id} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">{s.icon} {s.label}</span>
                          <span className="text-xs font-mono text-brand-cyan">{s.val}%</span>
                       </div>
                       <input 
                        type="range" 
                        value={s.val} 
                        onChange={(e) => setSensitivity({...sensitivity, [s.id]: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-brand-cyan cursor-pointer"
                       />
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-brand-panel to-brand-dark border border-brand-red/20 p-8 rounded-[2.5rem] shadow-xl">
               <h3 className="text-xs font-black text-brand-red uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Shield size={20} /> بروتوكولات الردع التلقائي
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-bold text-slate-300">عزل البيانات عند DEFCON 2</span>
                     <div className="w-10 h-5 bg-brand-red rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Monitoring Stream */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <Activity size={18} className="text-brand-cyan animate-pulse" /> بث الإشارات الحية (Live Stream)
               </h3>
               <span className="text-[9px] font-mono text-slate-500 uppercase">Buffer Status: Optimal</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {[
                 { source: 'BGP', severity: 'Critical', loc: 'صنعاء / عدن', msg: 'انحراف في مسارات Gateway 4. رصد محاولات إعادة توجيه (Hijacking).' },
                 { source: 'SAT', severity: 'High', loc: 'ميناء الحديدة', msg: 'ارتفاع وتيرة الشحن الليلي بنسبة 22%. رصد أوعية تخزين جديدة عبر تحليل الظلال.' },
               ].map((sig, i) => (
                 <div key={i} className="group bg-brand-panel border border-slate-800 p-6 rounded-[2rem] hover:border-brand-cyan/30 transition-all flex items-start gap-6 relative overflow-hidden">
                    <div className={`w-1.5 h-full absolute right-0 top-0 ${sig.severity === 'Critical' ? 'bg-brand-red' : sig.severity === 'High' ? 'bg-orange-500' : 'bg-brand-cyan'}`}></div>
                    <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 shrink-0">
                       {sig.source === 'BGP' ? <Radio className="text-brand-red" size={20}/> : <Satellite className="text-brand-gold" size={20}/>}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sig.loc}</span>
                          <span className="text-[8px] font-mono text-slate-600 uppercase">T-14M ago</span>
                       </div>
                       <p className="text-sm font-bold text-slate-200 leading-relaxed">{sig.msg}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* DETAILED MODAL */}
      {showNewScenario && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowNewScenario(false)}>
           <div className="bg-brand-panel border border-slate-800 w-full max-w-4xl rounded-[3rem] p-10 shadow-3xl flex flex-col gap-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter">إعداد سيناريو استخباراتي مفصل</h3>
                    <p className="text-[10px] text-brand-cyan mt-1 uppercase tracking-[0.3em] font-black">Strategic Insight Deployment Planner</p>
                 </div>
                 <button onClick={() => setShowNewScenario(false)} className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><Zap size={24} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Left Column: Basic Info */}
                 <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Target size={14} className="text-brand-gold"/> عنوان المهمة / الهدف
                        </label>
                        <input 
                            type="text" 
                            placeholder="مثلاً: مراقبة التحركات في الساحل الغربي..." 
                            className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-brand-gold transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">قطاع التحليل</label>
                            <select className="w-full bg-black/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none">
                                <option>أمني عسكري</option>
                                <option>اقتصادي / معيشي</option>
                                <option>بنية تحتية</option>
                                <option>تضليل إعلامي</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مستوى التهديد المتوقع</label>
                            <select className="w-full bg-black/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none">
                                <option className="text-green-500">Low (اعتيادي)</option>
                                <option className="text-yellow-500">Elevated (مرتفع)</option>
                                <option className="text-red-500">Critical (حرج)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Network size={14} className="text-brand-cyan"/> الارتباط السببي (Causal Logic)
                        </label>
                        <textarea 
                            rows={3}
                            placeholder="اربط بين المتغيرات: مثلاً إذا انخفضت حركة الميناء بنسبة 20% تزامناً مع ارتفاع BGP..."
                            className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-brand-cyan transition-all"
                        ></textarea>
                    </div>
                 </div>

                 {/* Right Column: Sensors & Automation */}
                 <div className="space-y-6">
                    <div className="bg-black/40 p-6 rounded-3xl border border-slate-800">
                        <label className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-4 block">تفعيل المجسات السيادية</label>
                        <div className="grid grid-cols-2 gap-3">
                           {[
                             { id: 'bgp', label: 'رصد BGP', icon: <Radio size={12}/> },
                             { id: 'sat', label: 'أقمار Sentinel', icon: <Satellite size={12}/> },
                             { id: 'osint', label: 'تتبع هاشتجات', icon: <Activity size={12}/> },
                             { id: 'econ', label: 'مؤشر الأسعار', icon: <AlertTriangle size={12}/> }
                           ].map(t => (
                             <label key={t.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:border-brand-cyan/30 transition-all">
                                <input type="checkbox" className="accent-brand-cyan" />
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">{t.icon} {t.label}</span>
                             </label>
                           ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عتبة التنبيه (Threshold)</label>
                            <span className="text-xs font-mono text-brand-gold">75% Accuracy</span>
                        </div>
                        <input type="range" className="w-full accent-brand-gold h-1.5 bg-slate-800 rounded-full appearance-none" />
                    </div>

                    <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-6 rounded-3xl flex items-center gap-4">
                        <Clock size={24} className="text-brand-cyan" />
                        <div>
                            <p className="text-[10px] font-black text-brand-cyan uppercase">الجدول الزمني للمهمة</p>
                            <p className="text-[9px] text-slate-500 font-bold">سيتم تشغيل المحرك التنبئي لمدة 7 أيام متواصلة.</p>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-brand-cyan text-brand-dark font-black rounded-2xl shadow-cyan-glow uppercase tracking-widest text-xs hover:scale-[1.02] transition-all">
                        تفعيل المهمة في الرادار السيادي
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveCenter;
