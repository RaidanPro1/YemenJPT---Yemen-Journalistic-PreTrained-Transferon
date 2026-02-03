
import React, { useState } from 'react';
import { Mic, Music, Volume2, Wind, Shield, Settings, Sliders, Play, Download, Trash2, CheckCircle, Database, Headphones } from 'lucide-react';

const TranscriptionPage: React.FC = () => {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [denoiseLevel, setDenoiseLevel] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-dark p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-4">
            <Mic className="text-brand-cyan w-8 h-8" /> محرك "مُنصت" للتفريع والمعالجة
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
            Sovereign Audio Forensics & Dialect Engine
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-brand-panel px-5 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
             <Database className="text-brand-gold" size={16} />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ollama Cluster: Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        {/* Audio Lab Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <h3 className="text-xs font-black text-brand-cyan uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Sliders size={18} /> مختبر معالجة الصوت (Demucs)
              </h3>
              
              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                       <span className="flex items-center gap-2"><Wind size={14}/> عزل ضجيج الخلفية</span>
                       <span className="text-brand-cyan">{denoiseLevel}%</span>
                    </div>
                    <input 
                      type="range" value={denoiseLevel} 
                      onChange={(e) => setDenoiseLevel(parseInt(e.target.value))}
                      className="w-full accent-brand-cyan" 
                    />
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                    <button className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-brand-gold/40 flex items-center justify-between group transition-all">
                       <span className="text-[10px] font-black text-slate-400 group-hover:text-brand-gold uppercase">تفعيل فصل المسارات (Stem Split)</span>
                       <Music size={16} className="text-slate-600 group-hover:text-brand-gold" />
                    </button>
                    <button className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-brand-cyan/40 flex items-center justify-between group transition-all">
                       <span className="text-[10px] font-black text-slate-400 group-hover:text-brand-cyan uppercase">تمييز المتحدثين (Diarization)</span>
                       <Headphones size={16} className="text-slate-600 group-hover:text-brand-cyan" />
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-brand-panel border border-brand-gold/10 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-xs font-black text-brand-gold uppercase tracking-widest mb-6">إعدادات اللهجة المستهدفة</h3>
              <div className="grid grid-cols-2 gap-2">
                 {['صنعاني', 'عدني', 'تعزي', 'حضرمي', 'تهامي', 'فصحى'].map(dialect => (
                    <button key={dialect} className="py-3 bg-black/30 border border-white/5 rounded-xl text-[10px] font-black text-slate-500 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all uppercase">
                       {dialect}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Output & Task Manager */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="bg-black/80 border border-slate-800 rounded-[2.5rem] p-8 flex-1 flex flex-col shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                 <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-brand-cyan animate-pulse shadow-cyan-glow' : 'bg-green-500 shadow-emerald- glow'}`}></div>
                    <span className="text-xs font-black text-white uppercase tracking-widest">محرر التفريغ الذكي</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Download SRT"><Download size={14}/></button>
                    <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Settings"><Settings size={14}/></button>
                 </div>
              </div>

              <div className="flex-1 bg-transparent border-none text-slate-300 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar italic opacity-50" dir="rtl">
                 {isProcessing ? "جاري المعالجة الرقمية وفصل المسارات..." : "في انتظار رفع الملف أو بدء المهمة..."}
              </div>

              <div className="mt-8 flex gap-4">
                 <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                       <Volume2 size={18} className="text-slate-600" />
                    </div>
                    <input 
                      type="text" placeholder="اسم المهمة: مثلاً تسجيل ميداني تعز - 04" 
                      className="w-full bg-black/40 border border-slate-800 rounded-[2rem] p-5 pl-14 text-sm text-slate-200 focus:border-brand-cyan outline-none transition-all"
                    />
                 </div>
                 <button 
                  onClick={() => setIsProcessing(!isProcessing)}
                  className="px-10 bg-brand-cyan text-brand-dark font-black rounded-[2rem] shadow-cyan-glow hover:scale-[1.02] transition-all uppercase tracking-widest text-xs"
                 >
                    {isProcessing ? 'إيقاف' : 'بدء التفريغ'}
                 </button>
              </div>
           </div>

           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-6 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">أحدث المهام (Recent Tasks)</h3>
              <div className="space-y-2">
                 {[
                   { id: 'T-982', name: 'مقابلة الحديدة - مسار B', status: 'Completed', date: '2024-05-20' },
                   { id: 'T-981', name: 'رصد إذاعات FM - المهرة', status: 'Processing', date: '2024-05-19' }
                 ].map(task => (
                   <div key={task.id} className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-brand-cyan/20 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : 'bg-brand-gold animate-pulse'}`}></div>
                         <span className="text-[11px] font-black text-slate-300">{task.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[9px] font-mono text-slate-500 uppercase">{task.date}</span>
                         <button className="text-slate-600 hover:text-brand-cyan"><Trash2 size={14}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
