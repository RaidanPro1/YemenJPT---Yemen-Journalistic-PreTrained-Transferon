
import React, { useState } from 'react';
import { Database, Cpu, Zap, Maximize2, Layers, BarChart3, Binary, HardDrive, Share2, Plus, FileCode, Server, Play, ShieldAlert, Settings, Lock } from 'lucide-react';

const DataLab: React.FC = () => {
  // Default to CPU mode (GPU Inactive) as per sovereign requirement
  const [gpuActive, setGpuActive] = useState(false);
  const [hardwareUsage, setHardwareUsage] = useState(85); // High allocation for CPU
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
            Local Tensor Engine // CPU Optimized for Sovereignty
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
                 <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-brand-red/20 relative group">
                    <div className="flex items-center gap-4">
                       <Zap className={gpuActive ? 'text-brand-cyan animate-pulse' : 'text-slate-600'} size={20} />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase">مسرع GPU (WebGL/Cloud)</span>
                          <span className="text-[9px] text-brand-red/60 flex items-center gap-1 font-bold">
                             <Lock size={10} /> مقفل للمسؤول فقط
                          </span>
                       </div>
                    </div>
                    {/* Only the root context can toggle this, UI shows locked state */}
                    <button 
                      disabled={true}
                      className={`w-12 h-6 rounded-full relative transition-all opacity-40 cursor-not-allowed ${gpuActive ? 'bg-brand-cyan' : 'bg-slate-700'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${gpuActive ? 'right-1' : 'left-1'}`}></div>
                    </button>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                       <span>تخصيص المعالج (CPU Threads)</span>
                       <span className="text-brand-cyan">{hardwareUsage}%</span>
                    </div>
                    <input 
                      type="range" value={hardwareUsage} 
                      onChange={(e) => setHardwareUsage(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-brand-cyan cursor-pointer"
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
    </div>
  );
};

export default DataLab;
