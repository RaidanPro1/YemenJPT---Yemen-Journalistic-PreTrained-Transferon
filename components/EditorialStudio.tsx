
import React, { useState, useEffect } from 'react';
import { 
  PenTool, FileText, Sparkles, Scale, Save, Download, 
  Eye, History, MoreVertical, ShieldCheck, AlertCircle, 
  CheckCircle2, Type, Layout, BookOpen, Share2, 
  Languages, Fingerprint, Zap, BrainCircuit, ChevronLeft,
  Settings2, ShieldAlert, Wand2, Lock, Sliders, Globe,
  Briefcase, FileWarning, Search, Quote
} from 'lucide-react';

const EditorialStudio: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [complianceScore, setComplianceScore] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState<'none' | 'ai' | 'settings' | 'sources'>('ai');

  // Pro Config State
  const [aiConfig, setAiConfig] = useState({
    creativity: 0.3,
    objectivity: 0.8, // New: Fact vs Narrative
    depth: 'Deep', // Summary vs Deep
    dialect: 'Standard Arabic'
  });
  
  const [sources, setSources] = useState([
    { id: 1, name: 'تقرير الأمم المتحدة 2023', verified: true },
    { id: 2, name: 'مقابلة ميدانية - تعز', verified: false }
  ]);

  // Simulate Legal-Meter Analysis
  useEffect(() => {
    if (content.length > 50) {
      const score = Math.min(100, 70 + (content.length % 30));
      setComplianceScore(score);
    } else {
      setComplianceScore(0);
    }
  }, [content]);

  const handleAiImprove = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setContent(prev => prev + "\n\n[إضافة سيادية]: تم مطابقة المعطيات مع الأرشيف الوطني الموحد، نوصي بتعزيز الفقرة السابقة بشهادة ميدانية لرفع موثوقية التقرير.");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="flex h-full bg-brand-bg font-cairo overflow-hidden" dir="rtl">
      {/* Main Drafting Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-soft relative z-10 transition-all duration-500">
        {/* Editor Toolbar */}
        <header className="h-20 border-b border-slate-100 px-8 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/10">
                 <PenTool size={24} />
              </div>
              <div>
                 <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان التحقيق الاستقصائي..." 
                    className="text-xl font-black text-slate-800 bg-transparent outline-none placeholder:text-slate-300 w-96"
                 />
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Sovereign Investigative Draft // Confidential</p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveSidebar(activeSidebar === 'settings' ? 'none' : 'settings')}
                className={`p-3 rounded-xl transition-all ${activeSidebar === 'settings' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-brand-primary bg-slate-50'}`}
                title="إعدادات المحرك الاحترافية"
              >
                <Sliders size={20}/>
              </button>
              <button 
                onClick={() => setActiveSidebar(activeSidebar === 'sources' ? 'none' : 'sources')}
                className={`p-3 rounded-xl transition-all ${activeSidebar === 'sources' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-brand-primary bg-slate-50'}`}
                title="إدارة المصادر والاقتباسات"
              >
                <Quote size={20}/>
              </button>
              <button 
                onClick={() => setActiveSidebar(activeSidebar === 'ai' ? 'none' : 'ai')}
                className={`p-3 rounded-xl transition-all ${activeSidebar === 'ai' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-brand-primary bg-slate-50'}`}
                title="مساعد الذكاء الاصطناعي"
              >
                <BrainCircuit size={20}/>
              </button>
              
              <div className="h-6 w-px bg-slate-100 mx-2"></div>
              
              <button className="px-6 py-3 bg-brand-primary text-white font-black text-[10px] uppercase rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
                 <Download size={16} /> تصدير مختوم
              </button>
           </div>
        </header>

        {/* Text Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-20 relative">
           {/* Sovereignty Watermark (Subtle) */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none rotate-[-45deg]">
              <span className="text-[12rem] font-black tracking-tighter">YEMENJPT</span>
           </div>

           <div className="max-w-3xl mx-auto w-full relative z-10">
              <div className="flex gap-4 mb-10 opacity-30">
                 <button className="p-2 hover:bg-slate-50 rounded"><Type size={18}/></button>
                 <button className="p-2 hover:bg-slate-50 rounded font-bold">B</button>
                 <button className="p-2 hover:bg-slate-50 rounded italic">I</button>
                 <button className="p-2 hover:bg-slate-50 rounded underline">U</button>
                 <div className="w-px h-6 bg-slate-200 mx-2"></div>
                 <button className="p-2 hover:bg-slate-50 rounded"><Layout size={18}/></button>
              </div>
              
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="ابدأ صياغة الحقيقة هنا... (النظام يقوم بالمطابقة الجنائية والقانونية لحظياً)"
                className="w-full min-h-[60vh] text-lg text-slate-700 leading-relaxed bg-transparent outline-none resize-none placeholder:text-slate-200 placeholder:italic font-medium"
              ></textarea>

              <div className="mt-20 pt-10 border-t border-slate-50 flex items-center gap-6">
                 <div className="flex -space-x-3 rtl:space-x-reverse">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-primary text-[8px] text-white flex items-center justify-center font-bold">PRO</div>
                 </div>
                 <p className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest">
                    وثيقة محمية بتشفير AES-256 وموثقة عبر العقدة السيادية المحلية.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <div className={`transition-all duration-500 border-r border-slate-100 bg-[#f8fafc]/50 flex flex-col ${activeSidebar === 'ai' ? 'w-96' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
           {/* Legal Meter Widget */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Scale size={18} className="text-brand-gold" /> مقياس القانون
                 </h3>
                 <span className={`text-[10px] font-black ${complianceScore > 80 ? 'text-brand-success' : 'text-brand-gold'}`}>{complianceScore}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                 <div className={`h-full transition-all duration-1000 ${complianceScore > 80 ? 'bg-brand-success' : 'bg-brand-gold'}`} style={{ width: `${complianceScore}%` }}></div>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed mb-6 font-bold">
                 {complianceScore > 0 ? `تحليل لحظي: النص يتوافق مع الدستور الوطني.` : "بانتظار كتابة محتوى لبدء فحص الامتثال."}
              </p>
           </div>

           {/* AI Drafting Assistant */}
           <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden group">
              <h3 className="text-xs font-black text-brand-cyan uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                 <BrainCircuit size={18} /> مساعد الصياغة الذكي
              </h3>
              <div className="space-y-4 relative z-10">
                 <button onClick={handleAiImprove} disabled={isAnalyzing || !content} className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-right transition-all group disabled:opacity-30">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">التحسين السيادي</span>
                       {isAnalyzing ? <Zap size={14} className="animate-pulse text-brand-gold" /> : <ChevronLeft size={14} />}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold">تحسين الرصانة ورفع مستوى الموضوعية الجنائية.</p>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* PRO SETTINGS SIDEBAR */}
      <div className={`transition-all duration-500 border-r border-slate-200 bg-white flex flex-col shadow-2xl relative z-30 ${activeSidebar === 'settings' ? 'w-[400px]' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between border-b border-slate-100 shrink-0 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                 <Sliders size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">الإعدادات الاحترافية</h3>
           </div>
           <button onClick={() => setActiveSidebar('none')} className="text-slate-400 hover:text-red-500 transition-colors"><ChevronLeft size={24} className="rotate-180"/></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
           <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <BrainCircuit size={14} className="text-brand-primary" /> معايرة الأسلوب
              </label>
              <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 
                 {/* Creativity Slider */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black">
                       <span className="text-slate-500">درجة الإبداع (Temperature)</span>
                       <span className="text-brand-primary">{aiConfig.creativity}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" value={aiConfig.creativity} onChange={(e) => setAiConfig({...aiConfig, creativity: parseFloat(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-brand-primary cursor-pointer" />
                 </div>

                 {/* Objectivity Slider */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black">
                       <span className="text-slate-500">مستوى الموضوعية (Objectivity)</span>
                       <span className="text-brand-primary">{aiConfig.objectivity * 100}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" value={aiConfig.objectivity} onChange={(e) => setAiConfig({...aiConfig, objectivity: parseFloat(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-brand-primary cursor-pointer" />
                    <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase">
                        <span>سردي/أدبي</span>
                        <span>جنائي/صارم</span>
                    </div>
                 </div>

                 {/* Depth Selector */}
                 <div className="grid grid-cols-2 gap-2 mt-4">
                    {['Summary', 'Deep'].map(d => (
                        <button key={d} onClick={() => setAiConfig({...aiConfig, depth: d})} className={`py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${aiConfig.depth === d ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-slate-500 border-slate-200'}`}>{d} Mode</button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SOURCES SIDEBAR */}
      <div className={`transition-all duration-500 border-r border-slate-200 bg-white flex flex-col shadow-2xl relative z-30 ${activeSidebar === 'sources' ? 'w-[400px]' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between border-b border-slate-100 shrink-0 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-gold/10 rounded-xl text-brand-gold">
                 <Quote size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">إدارة المصادر</h3>
           </div>
           <button onClick={() => setActiveSidebar('none')} className="text-slate-400 hover:text-red-500 transition-colors"><ChevronLeft size={24} className="rotate-180"/></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div className="flex gap-2">
                <input type="text" placeholder="إضافة مصدر جديد..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-brand-gold" />
                <button className="p-2 bg-brand-gold text-white rounded-xl hover:bg-yellow-600 transition-all">+</button>
            </div>

            <div className="space-y-3">
                {sources.map(source => (
                    <div key={source.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-gold/50 transition-all">
                        <div className="flex items-center gap-3">
                            <FileText size={16} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">{source.name}</span>
                        </div>
                        {source.verified ? (
                            <div title="مصدر موثوق"><ShieldCheck size={16} className="text-brand-success" /></div>
                        ) : (
                            <div title="غير مؤكد"><AlertCircle size={16} className="text-slate-300" /></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default EditorialStudio;
