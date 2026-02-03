
import React, { useState, useEffect } from 'react';
import { TOOLS_LIST } from '../constants';
import { Tool } from '../types';
// Fixed missing BrainCircuit import from lucide-react
import { Shield, Key, Database, Globe, Sliders, ToggleRight, Layout, CheckCircle, Lock, BrainCircuit } from 'lucide-react';
import RootAuthGuard from './RootAuthGuard';

const SettingsPageContent: React.FC<{ authToken: string }> = ({ authToken }) => {
    const [tools, setTools] = useState<Tool[]>([]);
    
    useEffect(() => {
        const savedTools = localStorage.getItem('custom_tools');
        setTools(savedTools ? JSON.parse(savedTools) : TOOLS_LIST);
    }, []);

    const toggleToolVisibility = (id: string) => {
        const updated = tools.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'offline' : 'active' } : t);
        setTools(updated as Tool[]);
        localStorage.setItem('custom_tools', JSON.stringify(updated));
    };

    return (
        <div className="flex flex-col gap-10 h-full font-cairo animate-fade">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-soft relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-cyan"></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">مركز التحكم والسيادة (Root Command)</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 italic flex items-center gap-2">
                    <Shield size={14} className="text-brand-primary" /> Sovereign Node Administrator Panel
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: System Config */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-soft">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Key size={16} className="text-brand-gold" /> مفاتيح الوصول السيادي
                        </h3>
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase px-1">Gemini Cloud API (Failover)</label>
                              <input type="password" value="AIzaSy...XXXX" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-mono" readOnly />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase px-1">S3 Bucket Endpoint</label>
                              <input type="text" value="https://vault.raidan.pro" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-mono" readOnly />
                           </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-white/10 rounded-xl text-brand-gold"><Database size={20}/></div>
                           <div>
                              <p className="text-xs font-black">حالة التخزين السيادي</p>
                              <p className="text-[9px] text-slate-500 uppercase">Musnad Vault: Online</p>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px]"><span className="text-slate-500">سعة الأرشيف</span><span className="font-bold">2.4 TB</span></div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="w-1/3 h-full bg-brand-gold"></div>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tool Factory */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-soft flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                       <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                             <Layout className="text-brand-primary" size={24} /> مصنع الأدوات (Tool Provisioning)
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">حدد الأدوات التي يمكن للصحفيين الوصول إليها</p>
                       </div>
                       <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 border border-slate-100 flex items-center gap-2">
                          <CheckCircle size={14} className="text-brand-success" /> تم الحفظ تلقائياً
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {tools.map(tool => (
                            <div key={tool.id} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${tool.status === 'active' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 opacity-60 grayscale'}`}>
                               <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-xl transition-all ${tool.status === 'active' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                     {tool.id.includes('yemenjpt') ? <BrainCircuit size={18}/> : <Sliders size={18}/>}
                                  </div>
                                  <div>
                                     <h4 className="text-xs font-black text-slate-800">{tool.name}</h4>
                                     <p className="text-[9px] text-slate-400 font-bold uppercase">{tool.category}</p>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => toggleToolVisibility(tool.id)}
                                 className={`p-2 rounded-lg transition-all ${tool.status === 'active' ? 'text-brand-primary hover:bg-brand-primary/10' : 'text-slate-300 hover:text-slate-500'}`}
                               >
                                  {tool.status === 'active' ? <ToggleRight size={32} /> : <Sliders size={24} />}
                               </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-6 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10 flex items-start gap-4">
                        <Lock className="text-brand-primary shrink-0" size={20} />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold italic">
                           بصفتك مستخدم Root، أنت المتحكم الوحيد في "منطق الأعمال". المستخدمون العاديون (Journalists) لن يشاهدوا سوى الأدوات التي قمت بتبديلها إلى الحالة "Active" هنا. لا توجد لديهم لوحة إعدادات أو خيارات تكوين.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => (
    <div className="h-full relative">
        <RootAuthGuard>
            {(token) => <SettingsPageContent authToken={token} />}
        </RootAuthGuard>
    </div>
);

export default SettingsPage;
