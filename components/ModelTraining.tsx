
import React, { useState } from 'react';
import { Database, Upload, Play, Activity, Terminal, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

const ModelTraining: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [datasetName, setDatasetName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setDatasetName(e.target.files[0].name);
      addLog(`[SYSTEM] Dataset loaded: ${e.target.files[0].name} (14.2 MB)`);
    }
  };

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startFineTuning = () => {
    if (!datasetName) return;
    setIsTraining(true);
    setProgress(0);
    setLogs([]);
    addLog(`[INIT] Initializing LoRA Adapter training on YemenJPT-Pro...`);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(p => Math.min(p + (100/12), 100));
      
      if (step === 2) addLog(`[EPOCH 1/3] Loss: 2.412 - Tokens/sec: 450`);
      if (step === 5) addLog(`[EPOCH 2/3] Loss: 1.850 - Gradient clipping active`);
      if (step === 9) addLog(`[EPOCH 3/3] Loss: 0.923 - Convergence reached`);
      
      if (step >= 12) {
        clearInterval(interval);
        setIsTraining(false);
        addLog(`[SUCCESS] New weights saved to /models/lora/v8.2`);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 h-full font-cairo p-8 animate-in fade-in">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-200 shadow-soft">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Cpu className="text-brand-primary" size={28} /> مشغل التدريب السيادي (Fine-Tuning)
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
             تحديث ذاكرة الذكاء الاصطناعي بوثائق ومعلومات محلية جديدة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
         {/* Configuration Panel */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Database size={16} className="text-brand-gold"/> مجموعة البيانات (Dataset)
               </h3>
               
               <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".jsonl,.txt,.pdf" />
                  <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-600">{datasetName || "اضغط لرفع ملف (JSONL / TXT)"}</p>
                  <p className="text-[9px] text-slate-400 mt-1">يجب تنظيف البيانات الحساسة قبل الرفع</p>
               </div>

               <div className="mt-6 space-y-4">
                  <div>
                     <label className="text-[10px] font-black text-slate-500 uppercase">عدد الدورات (Epochs)</label>
                     <input type="range" min="1" max="10" defaultValue="3" className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-500 uppercase">معدل التعلم (Learning Rate)</label>
                     <input type="range" min="1" max="100" defaultValue="20" className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary" />
                  </div>
               </div>

               <button 
                 onClick={startFineTuning}
                 disabled={isTraining || !datasetName}
                 className="w-full mt-8 py-4 bg-slate-900 text-white font-black rounded-xl shadow-lg hover:bg-brand-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  {isTraining ? <Activity size={16} className="animate-spin"/> : <Play size={16} />}
                  {isTraining ? 'جاري التدريب...' : 'بدء عملية التحديث'}
               </button>
            </div>
         </div>

         {/* Terminal Output */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl flex-1 flex flex-col font-mono text-xs relative overflow-hidden border border-slate-800">
               <div className="flex items-center gap-2 text-slate-500 mb-4 pb-4 border-b border-white/5">
                  <Terminal size={14} />
                  <span className="uppercase tracking-widest font-black">Training Logs</span>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-2 text-brand-cyan/80 custom-scrollbar">
                  {logs.length === 0 && <span className="text-slate-700 italic">Ready for input...</span>}
                  {logs.map((log, i) => (
                     <div key={i} className="animate-in slide-in-from-left-2">{log}</div>
                  ))}
                  {isTraining && <span className="animate-pulse">_</span>}
               </div>

               {isTraining && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                     <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                     </div>
                     <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-cyan transition-all duration-300" style={{ width: `${progress}%` }}></div>
                     </div>
                  </div>
               )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl flex items-start gap-4">
               <AlertTriangle size={20} className="text-yellow-600 shrink-0" />
               <div>
                  <h4 className="text-xs font-black text-yellow-800 mb-1">تنبيه سيادي</h4>
                  <p className="text-[10px] text-yellow-700 leading-relaxed font-medium">
                     عملية إعادة التدريب تستهلك موارد عالية (GPU/CPU). تأكد من عدم وجود عمليات تحقق جنائي حرجة قيد التشغيل حالياً. النموذج المحدث لن يصبح نشطاً إلا بعد المراجعة اليدوية.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ModelTraining;
