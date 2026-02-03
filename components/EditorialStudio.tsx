
import React, { useState, useEffect } from 'react';
import { 
  PenTool, FileText, Sparkles, Scale, Save, Download, 
  Eye, History, MoreVertical, ShieldCheck, AlertCircle, 
  CheckCircle2, Type, Layout, BookOpen, Share2, 
  Languages, Fingerprint, Zap, BrainCircuit, ChevronLeft,
  Settings2, ShieldAlert, Wand2, Lock, Sliders, Globe,
  Briefcase, UserShield, FileWarning
} from 'lucide-react';

const EditorialStudio: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [complianceScore, setComplianceScore] = useState(0);
  const [showAiAssistant, setShowAiAssistant] = useState(true);
  const [showProSettings, setShowProSettings] = useState(false);

  // Pro Config State
  const [aiCreativity, setAiCreativity] = useState(0.3); // 0 to 1
  const [legalStrictness, setLegalStrictness] = useState('Standard');
  const [classification, setClassification] = useState('Confidential');
  const [dialectMode, setDialectMode] = useState('Standard Arabic');

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
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Sovereign Investigative Draft // {classification} mode</p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowProSettings(!showProSettings)}
                className={`p-3 rounded-xl transition-all ${showProSettings ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-brand-primary bg-slate-50'}`}
                title="إعدادات المحرك الاحترافية"
              >
                <Settings2 size={20}/>
              </button>
              <div className="h-6 w-px bg-slate-100 mx-2"></div>
              <button className="px-6 py-3 bg-slate-50 text-slate-600 font-black text-[10px] uppercase rounded-xl border border-slate-100 hover:bg-slate-100 transition-all flex items-center gap-2">
                 <Save size={16} /> حفظ المسودة
              </button>
              <button className="px-8 py-3 bg-brand-primary text-white font-black text-[10px] uppercase rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
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
      <div className={`transition-all duration-500 border-r border-slate-100 bg-[#f8fafc]/50 flex flex-col ${showAiAssistant && !showProSettings ? 'w-96' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
           {/* Legal Meter Widget */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Scale size={18} className="text-brand-gold" /> مقياس القانون (Legal-Meter)
                 </h3>
                 <span className={`text-[10px] font-black ${complianceScore > 80 ? 'text-brand-success' : 'text-brand-gold'}`}>{complianceScore}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                 <div className={`h-full transition-all duration-1000 ${complianceScore > 80 ? 'bg-brand-success' : 'bg-brand-gold'}`} style={{ width: `${complianceScore}%` }}></div>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed mb-6 font-bold">
                 {complianceScore > 0 ? `تحليل لحظي: النص يتوافق مع الدستور الوطني. تم رصد نقاط قوة في فقرات "الحريات الصحفية".` : "بانتظار كتابة محتوى لبدء فحص الامتثال."}
              </p>
              <div className="space-y-2">
                 {['السيادة الوطنية', 'حقوق المواطنة', 'فصل السلطات'].map(tag => (
                   <div key={tag} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-600">{tag}</span>
                      <CheckCircle2 size={12} className="text-brand-success" />
                   </div>
                 ))}
              </div>
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
                 <button className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-right transition-all group opacity-50">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">استخلاص المصادر</span>
                       <Fingerprint size={14} />
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold">ربط النص بالأدلة الرقمية في 'خزنة مسند'.</p>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* PRO SETTINGS SIDEBAR (Professional Configuration) */}
      <div className={`transition-all duration-500 border-r border-slate-200 bg-white flex flex-col shadow-2xl relative z-30 ${showProSettings ? 'w-[400px]' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between border-b border-slate-100 shrink-0 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                 <Sliders size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">الإعدادات الاحترافية</h3>
           </div>
           <button onClick={() => setShowProSettings(false)} className="text-slate-400 hover:text-red-500 transition-colors"><ChevronLeft size={24} className="rotate-180"/></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
           {/* AI Reasoning Section */}
           <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <BrainCircuit size={14} className="text-brand-primary" /> معايرة محرك الاستدلال
              </label>
              <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black">
                       <span className="text-slate-500">درجة الإبداع (Temperature)</span>
                       <span className="text-brand-primary">{aiCreativity}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.1" 
                      value={aiCreativity} 
                      onChange={(e) => setAiCreativity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                    />
                    <p className="text-[8px] text-slate-400 italic">القيم المنخفضة (0.1-0.3) تضمن الالتزام التام بالحقائق الجنائية.</p>
                 </div>
                 <div className="pt-4 border-t border-slate-200">
                    <label className="text-[9px] font-black text-slate-500 uppercase mb-3 block">نمط التدقيق اللغوي</label>
                    <select 
                      value={dialectMode}
                      onChange={(e) => setDialectMode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-primary"
                    >
                       <option>Standard Arabic (فصحى)</option>
                       <option>Yemeni Dialect (تحليل لهجات)</option>
                       <option>Investigative Technical (تقني استقصائي)</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Legal Strictness Section */}
           <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Scale size={14} className="text-brand-gold" /> صرامة الامتثال الدستوري
              </label>
              <div className="grid grid-cols-3 gap-2">
                 {['Flexible', 'Standard', 'Strict'].map(mode => (
                   <button 
                     key={mode}
                     onClick={() => setLegalStrictness(mode)}
                     className={`py-3 rounded-xl text-[9px] font-black uppercase border transition-all ${legalStrictness === mode ? 'bg-brand-gold text-white border-brand-gold shadow-md' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-brand-gold/20'}`}
                   >
                     {mode === 'Flexible' ? 'مرن' : mode === 'Standard' ? 'قياسي' : 'صارم'}
                   </button>
                 ))}
              </div>
              <p className="text-[8px] text-slate-400 italic leading-relaxed">النمط 'الصارم' يمنع توليد أي نص قد يفسر كخرق لمواد السيادة الوطنية في الدستور.</p>
           </div>

           {/* Security & Sovereignty Section */}
           <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={14} className="text-brand-red" /> خصائص السيادة والأمان
              </label>
              <div className="space-y-3">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Lock size={16} className="text-slate-400" />
                       <span className="text-[10px] font-black text-slate-700">تشفير المسودة (End-to-End)</span>
                    </div>
                    <div className="w-10 h-5 bg-brand-primary rounded-full relative">
                       <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                 </div>

                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[9px] font-black text-slate-500 uppercase mb-3 block">تصنيف السرية (Classification)</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Confidential', 'Top Secret'].map(c => (
                         <button 
                           key={c}
                           onClick={() => setClassification(c)}
                           className={`py-2 px-3 rounded-lg text-[8px] font-black uppercase border transition-all ${classification === c ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-slate-400 border-slate-100'}`}
                         >
                           {c === 'Confidential' ? 'سري' : 'سري للغاية'}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button className="w-full py-4 bg-slate-100 text-slate-600 font-black text-[10px] uppercase rounded-2xl border border-slate-200 hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-3">
                    <Fingerprint size={16} /> إضافة ختم البصمة الجنائية
                 </button>
              </div>
           </div>

           {/* Data Sourcing Section */}
           <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Globe size={14} className="text-brand-cyan" /> تكامل المصادر الجيومكانية
              </label>
              <div className="p-5 bg-brand-cyan/5 rounded-3xl border border-brand-cyan/10">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-brand-cyan">تفعيل الرصد اللحظي (OSINT)</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                       <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-[8px] text-slate-500 leading-relaxed">عند التفعيل، سيقوم المساعد بمراجعة أحدث بيانات 'رادار التضليل' أثناء الصياغة لضمان عدم إدراج أخبار كاذبة متداولة.</p>
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md">
           <button className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase rounded-2xl shadow-xl hover:bg-brand-primary transition-all flex items-center justify-center gap-3">
              <ShieldCheck size={18} className="text-brand-gold" /> اعتماد التكوين السيادي
           </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur border border-slate-200 rounded-full shadow-lg pointer-events-none">
         <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse"></div>
         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Encrypted Session YE-Studio-01</span>
      </div>
    </div>
  );
};

export default EditorialStudio;
