
import React, { useState } from 'react';
import { Cpu, Settings2, Sliders, Save, RefreshCw, ShieldCheck, Zap, MessageSquare, BrainCircuit } from 'lucide-react';
import RootAuthGuard from './RootAuthGuard';

const ModelManagerContent: React.FC<{ authToken: string }> = ({ authToken }) => {
  const [selectedModel, setSelectedModel] = useState('yemenjpt-pro');
  const [config, setConfig] = useState({
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: 'أنت YemenJPT Pro، ذكاء اصطناعي سيادي متخصص للصحفيين اليمنيين...',
    topP: 0.9,
    thinkingBudget: 1024
  });

  const models = [
    { id: 'yemenjpt-pro', name: 'YemenJPT Pro', type: 'Reasoning', status: 'Optimized' },
    { id: 'yemenjpt-flash', name: 'YemenJPT Flash', type: 'Speed', status: 'Online' },
    { id: 'yemenjpt-vision', name: 'YemenJPT Vision', type: 'Multimedia', status: 'Ready' },
    { id: 'yemenjpt-map', name: 'YemenJPT Map', type: 'Geospatial', status: 'Standby' },
  ];

  return (
    <div className="flex flex-col gap-8 h-full font-cairo animate-fade">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-200 shadow-soft">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <BrainCircuit className="text-brand-primary" size={28} /> تخصيص النماذج السيادية (YemenJPT Core)
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Advanced Neural Architecture Control</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-brand-primary transition-all">
            <Save size={16} /> حفظ التكوين الشامل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Model Selection Rail */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {models.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`p-6 rounded-[1.5rem] border text-right transition-all group relative overflow-hidden ${selectedModel === m.id ? 'bg-brand-primary/5 border-brand-primary shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${selectedModel === m.id ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {m.type}
                </span>
                <span className="text-[9px] font-mono text-slate-400">{m.status}</span>
              </div>
              <h3 className={`text-sm font-black transition-colors ${selectedModel === m.id ? 'text-brand-primary' : 'text-slate-700'}`}>{m.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">إعدادات الاستدلال والمعالجة اللحظية</p>
            </button>
          ))}
        </div>

        {/* Configuration Stage */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-soft flex flex-col gap-8 overflow-y-auto custom-scrollbar">
           <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                    <Settings2 size={20} />
                 </div>
                 <h3 className="text-lg font-black text-slate-800">تكوين محرك {selectedModel}</h3>
              </div>
              <button className="text-slate-400 hover:text-brand-primary transition-colors">
                <RefreshCw size={18} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span>درجة العشوائية (Temperature)</span>
                       <span className="text-brand-primary">{config.temperature}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.1" 
                      value={config.temperature} 
                      onChange={e => setConfig({...config, temperature: parseFloat(e.target.value)})}
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                    />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span>ميزانية التفكير (Thinking Budget)</span>
                       <span className="text-brand-primary">{config.thinkingBudget} Tokens</span>
                    </div>
                    <input 
                      type="range" min="0" max="4096" step="128" 
                      value={config.thinkingBudget} 
                      onChange={e => setConfig({...config, thinkingBudget: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                    />
                 </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2 italic">
                      <ShieldCheck size={14} className="text-brand-primary" /> ميزات الموديل النشطة
                   </h4>
                   <div className="space-y-3">
                      {[
                        { id: 'search', label: 'البحث الميداني (Search Grounding)', active: true },
                        { id: 'rag', label: 'الذاكرة السيادية (RAG Context)', active: true },
                        { id: 'tools', label: 'استدعاء الأدوات (Function Calling)', active: false },
                      ].map(feature => (
                        <div key={feature.id} className="flex items-center justify-between">
                           <span className="text-[11px] font-bold text-slate-600">{feature.label}</span>
                           <div className={`w-8 h-4 rounded-full relative transition-all ${feature.active ? 'bg-brand-primary' : 'bg-slate-300'}`}>
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${feature.active ? 'right-4.5' : 'right-0.5'}`}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">التعليمات النظامية (System Instructions):</label>
              <textarea 
                value={config.systemPrompt}
                onChange={e => setConfig({...config, systemPrompt: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm text-slate-700 outline-none focus:border-brand-primary/30 transition-all min-h-[200px] leading-relaxed"
                placeholder="أدخل بروتوكول التشغيل الأساسي هنا..."
              />
           </div>

           <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Zap className="text-brand-gold" size={18} />
                 <p className="text-[10px] text-slate-400 font-bold max-w-sm italic">سيتم تطبيق التعديلات فوراً على كافة واجهات الصحفيين المرتبطين بهذه العقدة السيادية.</p>
              </div>
              <button className="px-10 py-4 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-black uppercase hover:bg-brand-primary hover:text-white transition-all">تحديث الموديل</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ModelManager: React.FC = () => (
  <div className="h-full relative">
    <RootAuthGuard>
        {(token) => <ModelManagerContent authToken={token} />}
    </RootAuthGuard>
  </div>
);

export default ModelManager;
