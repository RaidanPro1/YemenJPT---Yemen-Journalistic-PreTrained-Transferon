
import React, { useState } from 'react';
import { Shield, Search, FileText, AlertTriangle, CheckCircle, Info, Zap, Settings, Sliders, Target, Eye, Maximize2, Download, RefreshCw, Layers } from 'lucide-react';

type Algorithm = 'ELA' | 'CFA' | 'Noise' | 'Ghost' | 'Blocking';

interface AlgoSettings {
  ela: { quality: number; brightness: number; threshold: number };
  cfa: { pattern: string; sensitivity: number; blockSize: number };
  noise: { filter: string; level: number; denoise: boolean };
  ghost: { scanRange: number; qualityStep: number };
  blocking: { gridSize: number; offset: number };
}

interface ForensicFinding {
  algorithm: Algorithm;
  algorithmName: string;
  technicalFinding: string;
  interpretation: string;
  verdict: 'Authentic' | 'Suspicious' | 'Manipulated' | 'Inconclusive';
  probability: number;
  details: { label: string; value: string }[];
}

const ForensicsDashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>('ELA');
  const [report, setReport] = useState<ForensicFinding | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState<AlgoSettings>({
    ela: { quality: 90, brightness: 2.5, threshold: 10 },
    cfa: { pattern: 'RGGB', sensitivity: 0.85, blockSize: 16 },
    noise: { filter: 'Wavelet', level: 0.04, denoise: true },
    ghost: { scanRange: 20, qualityStep: 1 },
    blocking: { gridSize: 8, offset: 0 }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setReport(null);
    }
  };

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const mockReports: Record<Algorithm, ForensicFinding> = {
        'ELA': {
          algorithm: 'ELA',
          algorithmName: 'تحليل مستوى الخطأ (ELA)',
          technicalFinding: `رصد تباين حاد بمستوى ${settings.ela.threshold}% في مستويات الضغط عند جودة إعادة حفظ ${settings.ela.quality}%.`,
          interpretation: "يشير السطوع غير المتساوي في خريطة الحرارة إلى احتمالية دمج جسم غريب (Overlay) بعد عملية الحفظ الأصلية.",
          verdict: 'Suspicious',
          probability: 88.4,
          details: [
            { label: 'جودة المرجع', value: `${settings.ela.quality}%` },
            { label: 'مضاعف السطوع', value: `${settings.ela.brightness}x` }
          ]
        },
        'CFA': {
          algorithm: 'CFA',
          algorithmName: 'تحليل مصفوفة الألوان (CFA)',
          technicalFinding: `انكسار في نمط مصفوفة ${settings.cfa.pattern} عند مستوى حساسية ${settings.cfa.sensitivity}.`,
          interpretation: "تم اكتشاف خلل في بصمة 'باير' الأصلية للمستشعر، مما يؤكد عملية قص ولصق بكسلي (Splicing).",
          verdict: 'Manipulated',
          probability: 94.2,
          details: [
            { label: 'حجم الكتلة', value: `${settings.cfa.blockSize} بكسل` },
            { label: 'نمط المصفوفة', value: settings.cfa.pattern }
          ]
        },
        'Noise': {
          algorithm: 'Noise',
          algorithmName: 'تحليل الضجيج الرقمي',
          technicalFinding: `عدم تجانس في ضجيج المستشعر باستخدام مرشح ${settings.noise.filter}.`,
          interpretation: "المنطقة المختبرة تمتلك بصمة ضوضاء أنعم من بقية الصورة، مما يشير إلى استخدام أدوات معالجة أو تنعيم.",
          verdict: 'Suspicious',
          probability: 72.1,
          details: [
            { label: 'المرشح المستخدم', value: settings.noise.filter },
            { label: 'مستوى الضجيج الخام', value: `${settings.noise.level}` }
          ]
        },
        'Ghost': {
          algorithm: 'Ghost',
          algorithmName: 'كشف الآثار الشبحية',
          technicalFinding: `ظهور آثار تكرار الضغط (الشبح) ضمن نطاق فحص ${settings.ghost.scanRange} بكسل.`,
          interpretation: "تم حفظ الصورة مرتين على الأقل بإعدادات جودة مختلفة، وهو سلوك معتاد عند التعديل وإعادة التصدير.",
          verdict: 'Manipulated',
          probability: 91.0,
          details: [
            { label: 'خطوة الجودة', value: `${settings.ghost.qualityStep}` },
            { label: 'نطاق المسح', value: `${settings.ghost.scanRange} بكسل` }
          ]
        },
        'Blocking': {
          algorithm: 'Blocking',
          algorithmName: 'تحليل كتل البكسل',
          technicalFinding: `إزاحة في شبكة مربعات JPEG (${settings.blocking.gridSize}x${settings.blocking.gridSize}) بمقدار ${settings.blocking.offset} بكسل.`,
          interpretation: "الصورة تعرضت لإعادة محاذاة للشبكة، مما يعني أنها قد تكون جزءاً مقتطعاً أو مُزاحاً من صورة أكبر.",
          verdict: 'Inconclusive',
          probability: 45.0,
          details: [
            { label: 'حجم الشبكة', value: `${settings.blocking.gridSize} بكسل` },
            { label: 'قيمة الإزاحة', value: `${settings.blocking.offset} بكسل` }
          ]
        }
      };
      setReport(mockReports[selectedAlgo]);
      setLoading(false);
    }, 2500);
  };

  const getVerdictStyle = (v: string) => {
    switch(v) {
      case 'Authentic': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50';
      case 'Suspicious': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'Manipulated': return 'bg-red-500/20 text-red-500 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-brand-dark text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Shield className="text-brand-cyan w-8 h-8" /> مختبر الأدلة الجنائية للصور
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
            مصفوفة التحليل الجنائي المتقدم // Sovereign Forensics Matrix
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
           <div className="bg-brand-panel p-1 rounded-xl flex border border-slate-800 mr-4">
              {[
                {id: 'ELA', label: 'تحليل الخطأ'},
                {id: 'CFA', label: 'مصفوفة الألوان'},
                {id: 'Noise', label: 'الضجيج'},
                {id: 'Ghost', label: 'الأثر الشبحي'},
                {id: 'Blocking', label: 'كتل الضغط'}
              ].map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgo(algo.id as Algorithm)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${selectedAlgo === algo.id ? 'bg-brand-cyan text-brand-dark shadow-cyan-glow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {algo.label}
                </button>
              ))}
           </div>
           <button 
             onClick={() => setShowSettings(!showSettings)}
             className={`p-2.5 rounded-xl border transition-all ${showSettings ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-gold-glow' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}
             title="إعدادات المعايرة"
           >
             <Settings size={20} className={showSettings ? 'animate-spin-slow' : ''} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-6">
          {showSettings ? (
            <div className="bg-brand-panel border border-brand-gold/20 rounded-[2.5rem] p-8 animate-in slide-in-from-left duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sliders size={160} />
               </div>
               
               <h3 className="text-lg font-black text-brand-gold flex items-center gap-3 mb-8">
                  <Sliders size={20} /> معايرة محركات الفحص الجنائي
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* إعدادات ELA */}
                  <div className={`space-y-4 p-5 rounded-2xl border transition-all ${selectedAlgo === 'ELA' ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-800 bg-black/20'}`}>
                     <label className="text-[10px] font-black uppercase text-brand-cyan tracking-widest flex items-center gap-2">
                        <Zap size={14} /> معايير تحليل الخطأ (ELA)
                     </label>
                     <div className="space-y-3">
                        <div>
                           <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-500">جودة إعادة الحفظ</span>
                              <span className="text-brand-cyan">{settings.ela.quality}%</span>
                           </div>
                           <input type="range" min="1" max="100" value={settings.ela.quality} onChange={(e) => setSettings({...settings, ela: {...settings.ela, quality: parseInt(e.target.value)}})} className="w-full accent-brand-cyan" />
                        </div>
                        <div>
                           <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-500">سطوع التباين</span>
                              <span className="text-brand-cyan">{settings.ela.brightness}x</span>
                           </div>
                           <input type="range" min="1" max="10" step="0.1" value={settings.ela.brightness} onChange={(e) => setSettings({...settings, ela: {...settings.ela, brightness: parseFloat(e.target.value)}})} className="w-full accent-brand-cyan" />
                        </div>
                     </div>
                  </div>

                  {/* إعدادات CFA */}
                  <div className={`space-y-4 p-5 rounded-2xl border transition-all ${selectedAlgo === 'CFA' ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-800 bg-black/20'}`}>
                     <label className="text-[10px] font-black uppercase text-brand-cyan tracking-widest flex items-center gap-2">
                        <Target size={14} /> مصفوفة مرشح الألوان (CFA)
                     </label>
                     <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                           {['RGGB', 'BGGR', 'GRBG'].map(p => (
                             <button key={p} onClick={() => setSettings({...settings, cfa: {...settings.cfa, pattern: p}})} className={`py-2 rounded-lg text-[9px] font-bold border ${settings.cfa.pattern === p ? 'bg-brand-cyan text-brand-dark border-brand-cyan' : 'border-slate-800 text-slate-500'}`}>
                                نمط {p}
                             </button>
                           ))}
                        </div>
                        <div>
                           <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-500">كتلة الكشف بكسل</span>
                              <span className="text-brand-cyan">{settings.cfa.blockSize}px</span>
                           </div>
                           <input type="range" min="4" max="64" step="4" value={settings.cfa.blockSize} onChange={(e) => setSettings({...settings, cfa: {...settings.cfa, blockSize: parseInt(e.target.value)}})} className="w-full accent-brand-cyan" />
                        </div>
                     </div>
                  </div>

                  {/* إعدادات الضجيج */}
                  <div className={`space-y-4 p-5 rounded-2xl border transition-all ${selectedAlgo === 'Noise' ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-800 bg-black/20'}`}>
                     <label className="text-[10px] font-black uppercase text-brand-cyan tracking-widest flex items-center gap-2">
                        <Maximize2 size={14} /> ملف الضجيج الرقمي
                     </label>
                     <select 
                        value={settings.noise.filter}
                        onChange={(e) => setSettings({...settings, noise: {...settings.noise, filter: e.target.value}})}
                        className="w-full bg-black/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-brand-cyan"
                     >
                        <option value="Wavelet">تحويل المويجات (Wavelet)</option>
                        <option value="Median">مرشح الوسيط (Median)</option>
                        <option value="FastNoise">تحويل فورير السريع (FFT)</option>
                     </select>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">إزالة الضجيج التكيفية</span>
                        <button onClick={() => setSettings({...settings, noise: {...settings.noise, denoise: !settings.noise.denoise}})} className={`w-10 h-5 rounded-full relative transition-all ${settings.noise.denoise ? 'bg-brand-cyan' : 'bg-slate-700'}`}>
                           <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.noise.denoise ? 'right-1' : 'left-1'}`}></div>
                        </button>
                     </div>
                  </div>

                  {/* إعدادات كتل البكسل */}
                  <div className={`space-y-4 p-5 rounded-2xl border transition-all ${selectedAlgo === 'Blocking' ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-800 bg-black/20'}`}>
                     <label className="text-[10px] font-black uppercase text-brand-cyan tracking-widest flex items-center gap-2">
                        <Layers size={14} /> تشوهات شبكة الضغط
                     </label>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[9px] text-slate-500 mb-1 block">حجم الشبكة</label>
                           <input type="number" value={settings.blocking.gridSize} onChange={(e) => setSettings({...settings, blocking: {...settings.blocking, gridSize: parseInt(e.target.value)}})} className="w-full bg-black/40 border border-slate-800 rounded-lg p-2 text-xs text-slate-200" />
                        </div>
                        <div>
                           <label className="text-[9px] text-slate-500 mb-1 block">إزاحة المحاذاة</label>
                           <input type="number" value={settings.blocking.offset} onChange={(e) => setSettings({...settings, blocking: {...settings.blocking, offset: parseInt(e.target.value)}})} className="w-full bg-black/40 border border-slate-800 rounded-lg p-2 text-xs text-slate-200" />
                        </div>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-10 py-4 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                  تطبيق إعدادات المعايرة والعودة للمختبر
               </button>
            </div>
          ) : (
            <div 
              className="group relative border-2 border-dashed border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center bg-brand-panel/40 hover:border-brand-cyan/50 transition-all cursor-pointer overflow-hidden min-h-[400px]"
              onClick={() => document.getElementById('forensic-input')?.click()}
            >
              <input type="file" id="forensic-input" hidden onChange={handleFileChange} accept="image/*" />
              {!preview ? (
                <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-brand-cyan/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Search className="w-10 h-10 text-brand-cyan" />
                  </div>
                  <div className="text-center">
                     <p className="text-sm font-black text-white">ارفع المادة البصرية المراد فحصها</p>
                     <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">يدعم: JPG, PNG, WEBP, TIFF</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden border border-slate-700/50">
                  <img src={preview} className="max-w-full max-h-[500px] object-contain" alt="معاينة جنائية" />
                  {loading && (
                     <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-md flex items-center justify-center z-20">
                        <div className="flex flex-col items-center gap-6">
                           <div className="relative">
                              <div className="w-16 h-16 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
                              <Zap className="absolute inset-0 m-auto text-brand-cyan animate-pulse" size={20} />
                           </div>
                           <div className="text-center">
                              <p className="text-xs font-black text-brand-cyan animate-pulse uppercase tracking-[0.2em]">جاري تنفيذ الخوارزمية: {selectedAlgo}</p>
                              <p className="text-[9px] text-slate-500 mt-1">يتم تطبيق معايير المعايرة السيادية...</p>
                           </div>
                        </div>
                     </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="flex gap-2">
                        <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white pointer-events-auto hover:bg-brand-cyan"><Maximize2 size={16} /></button>
                        <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white pointer-events-auto hover:bg-brand-cyan"><Eye size={16} /></button>
                     </div>
                     <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white pointer-events-auto hover:bg-brand-gold"><Download size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!showSettings && preview && !loading && (
            <button 
              onClick={runAnalysis}
              className="group relative w-full py-5 bg-gradient-to-r from-brand-cyan to-blue-600 text-brand-dark font-black rounded-2xl shadow-xl hover:shadow-cyan-glow transition-all uppercase tracking-[0.2em] text-xs overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                 <Shield size={16} /> بدء التحليل الجنائي السيادي
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 flex-1 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
             <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                   <FileText className="text-brand-gold" size={20} />
                   <h3 className="text-xs font-black uppercase tracking-widest text-brand-gold">تقرير الاستخبارات الجنائية</h3>
                </div>
                <div className="flex items-center gap-2">
                   {report && <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white" title="إعادة تشغيل"><RefreshCw size={14} /></button>}
                   <span className="text-[10px] font-mono text-slate-500">المرجع: YJPT-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
             </div>

             {report ? (
               <div className="flex-1 space-y-8 animate-in slide-in-from-left-4 duration-500">
                  <div>
                    <label className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-3 block opacity-70">1. الكشف التقني المباشر:</label>
                    <div className="bg-brand-dark/40 p-5 rounded-2xl border border-brand-cyan/10">
                       <p className="text-sm font-bold leading-relaxed text-slate-200">{report.technicalFinding}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-3 block opacity-70">2. التفسير الاستقصائي:</label>
                    <p className="text-sm font-medium leading-relaxed text-slate-400 italic">"{report.interpretation}"</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">المقاييس الرقمية المحللة:</label>
                    <div className="grid grid-cols-2 gap-3">
                       {report.details.map((d, i) => (
                         <div key={i} className="bg-black/20 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                           <span className="text-slate-500">{d.label}:</span> {d.value}
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className={`mt-auto p-6 border-2 rounded-[2.5rem] flex items-center justify-between shadow-lg ${getVerdictStyle(report.verdict)}`}>
                    <div>
                       <label className="text-[9px] font-black uppercase block opacity-70 mb-1">الاستنتاج النهائي</label>
                       <span className="text-xl font-black tracking-tighter">
                          {report.verdict === 'Authentic' ? 'موثوق / Authentic' : 
                           report.verdict === 'Suspicious' ? 'مريب / Suspicious' : 
                           report.verdict === 'Manipulated' ? 'متلاعب به / Manipulated' : 'غير حاسم'}
                       </span>
                    </div>
                    <div className="text-right">
                       <label className="text-[9px] font-black uppercase block opacity-70 mb-1">درجة الموثوقية</label>
                       <span className="text-2xl font-mono font-black">{report.probability}%</span>
                    </div>
                  </div>
               </div>
             ) : (
               <div className="h-full flex-1 flex flex-col items-center justify-center opacity-30 py-20">
                 <div className="relative mb-6">
                    <Shield size={64} className="text-slate-600" />
                    <AlertTriangle size={24} className="absolute -bottom-2 -right-2 text-brand-gold animate-pulse" />
                 </div>
                 <p className="text-sm font-bold text-slate-500">في انتظار رفع المادة لبدء البث الجنائي...</p>
                 <p className="text-[10px] mt-2 uppercase tracking-widest font-mono">Awaiting forensic stream</p>
               </div>
             )}

             <div className="mt-8 pt-4 border-t border-slate-800 flex items-start gap-3">
                <Info size={16} className="text-brand-cyan shrink-0 mt-1" />
                <p className="text-[9px] text-slate-500 leading-relaxed italic">
                   إخلاء مسؤولية سيادي: النتائج المستخلصة هي أدلة إحصائية تقنية مبنية على المعايرة الحالية. يوصى دائماً بمطابقة النتائج مع السياق الميداني والتحقق من البيانات الوصفية (Metadata).
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicsDashboard;
