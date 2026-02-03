
import React, { useState } from 'react';
import { Database, Cpu, Zap, Maximize2, Layers, BarChart3, Binary, HardDrive, Share2, Plus, FileCode, Server, Play, ShieldAlert, Settings } from 'lucide-react';

const DataLab: React.FC = () => {
  const [gpuActive, setGpuActive] = useState(true);
  const [hardwareUsage, setHardwareUsage] = useState(64);
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-dark p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-4">
            <Cpu className="text-brand-cyan w-8 h-8" /> مسرع البيانات والذكاء الطرفي
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
            Local Tensor Engine // High-Priority Data Processing
          </p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setShowTaskModal(true)}
            className="px-6 py-3 bg-brand-cyan text-brand-dark rounded-xl text-[10px] font-black uppercase tracking-widest shadow-cyan-glow hover:scale-105 transition-all flex items-center gap-2"
           >
              <Plus size={16} /> جدولة مهمة معالجة كبرى
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        {/* Hardware Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <h3 className="text-xs font-black text-brand-gold uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Binary size={18} /> معايرة أداء العتاد المحلي
              </h3>
              
              <div className="space-y-8">
                 <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                       <Zap className={gpuActive ? 'text-brand-cyan animate-pulse' : 'text-slate-600'} size={20} />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase">مسرع GPU (WebGL)</span>
                          <span className="text-[9px] text-slate-500">Acceleration Layer Active</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => setGpuActive(!gpuActive)}
                      className={`w-12 h-6 rounded-full relative transition-all ${gpuActive ? 'bg-brand-cyan' : 'bg-slate-700'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${gpuActive ? 'right-1' : 'left-1'}`}></div>
                    </button>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                       <span>تخصيص الذاكرة (VRAM Allocation)</span>
                       <span className="text-brand-gold">{hardwareUsage}%</span>
                    </div>
                    <input 
                      type="range" value={hardwareUsage} 
                      onChange={(e) => setHardwareUsage(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-brand-gold cursor-pointer"
                    />
                 </div>
              </div>
           </div>

           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">قواعد البيانات المرتبطة</h3>
              <div className="space-y-3">
                 {[
                   { name: 'PostgreSQL Core', status: 'Connected', icon: <Database size={14}/> },
                   { name: 'Qdrant Vector DB', status: 'Synced', icon: <Layers size={14}/> }
                 ].map(db => (
                   <div key={db.name} className="p-4 bg-black/30 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <span className="text-brand-cyan">{db.icon}</span>
                         <span className="text-[10px] font-black text-slate-300 uppercase">{db.name}</span>
                      </div>
                      <span className="text-[8px] font-black text-brand-success uppercase">{db.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Workspace & Visualization */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 flex-1 flex flex-col shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
                 <div className="flex items-center gap-3">
                    <BarChart3 className="text-brand-cyan" size={18} />
                    <span className="text-xs font-black text-white uppercase tracking-widest">محلل البيانات الحية (Real-time Analytics)</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><Maximize2 size={14}/></button>
                 </div>
              </div>

              <div className="flex-1 min-h-[300px] flex items-end gap-3 px-10 relative">
                 <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(var(--tw-brand-cyan) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                 {[40, 65, 30, 85, 50, 95, 40, 75, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-brand-blue to-brand-cyan rounded-t-lg transition-all duration-1000 group-hover:brightness-125" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* DETAILED TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300" onClick={() => setShowTaskModal(false)}>
           <div className="bg-brand-panel border border-brand-cyan/20 w-full max-w-4xl rounded-[3rem] p-10 shadow-3xl flex flex-col gap-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div>
                    <h3 className="text-2xl font-black text-white">إطلاق مهمة معالجة استخباراتية</h3>
                    <p className="text-[10px] text-brand-gold mt-1 uppercase tracking-widest font-black">Advanced Data Mining & AI Accelerator</p>
                 </div>
                 <button onClick={() => setShowTaskModal(false)} className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full"><Settings size={22} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عنوان المهمة</label>
                        <input type="text" placeholder="مثلاً: تحليل كتل البيانات الاقتصادية Q2..." className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:border-brand-cyan outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مصدر البيانات (Source)</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['ملف CSV/Excel', 'قاعدة بيانات SQL', 'رابط API', 'أرشيف مسند'].map(s => (
                                <button key={s} className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:border-brand-cyan transition-all">{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">خوارزمية المعالجة</label>
                        <select className="w-full bg-black/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none">
                            <option>تحليل عنقودي (Clustering)</option>
                            <option>استخراج الكيانات (NER)</option>
                            <option>تلخيص فائق (Super Summarization)</option>
                            <option>كشف الأنماط الشاذة (Anomaly Detection)</option>
                        </select>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-6 rounded-[2rem] space-y-4">
                        <h4 className="text-[10px] font-black text-brand-cyan uppercase flex items-center gap-2"><Cpu size={14}/> تخصيص موارد العتاد</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-500">أولوية GPU</span>
                                <span className="text-brand-cyan">عالية جداً (Turbo)</span>
                            </div>
                            <input type="range" className="w-full accent-brand-cyan h-1.5" />
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                           <ShieldAlert size={16} className="text-brand-gold" />
                           <p className="text-[9px] text-slate-500 italic">سيؤدي هذا إلى تسريع المهمة بنسبة 40% مقابل استهلاك طاقة أكبر.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">قاعدة المعرفة المستهدفة (Target KB)</label>
                        <select className="w-full bg-black/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none">
                            <option>مخزن التحقيقات المفتوحة</option>
                            <option>الأرشيف السري السيادي</option>
                            <option>مركز الرصد الاقتصادي</option>
                        </select>
                    </div>

                    <button className="w-full py-5 bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-black rounded-2xl shadow-cyan-glow uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                        <Play size={18} /> تشغيل محرك المعالجة العملاقة
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataLab;
