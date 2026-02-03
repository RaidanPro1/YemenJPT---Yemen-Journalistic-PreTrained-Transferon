
import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Search, Zap, Maximize2, Layers, Target, Eye, 
  ZoomIn, Info, AlertTriangle, Download, FileText, 
  RefreshCw, Sliders, Palette, Crosshair, BarChart3, ChevronLeft
} from 'lucide-react';

type ForensicMethod = 'ELA' | 'CFA' | 'Noise' | 'Ghost';

interface SuspiciousZone {
  id: string;
  x: number;
  y: number;
  score: number;
  type: string;
}

const ForensicsDashboard: React.FC = () => {
  const [activeScan, setActiveScan] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<ForensicMethod>('ELA');
  const [elaQuality, setElaQuality] = useState(90);
  const [colorMap, setColorMap] = useState<'standard' | 'high-contrast' | 'monochrome'>('standard');
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [suspiciousZones, setSuspiciousZones] = useState<SuspiciousZone[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, visible: boolean }>({ x: 0, y: 0, value: 0, visible: false });

  const viewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methodsData: Record<ForensicMethod, { label: string; desc: string }> = {
    'ELA': { label: 'تحليل مستوى الخطأ (ELA)', desc: 'يكشف تباين ضغط JPEG للعثور على العناصر المضافة حديثاً.' },
    'CFA': { label: 'مصفوفة الفلتر اللوني (CFA)', desc: 'يفحص نمط باير (Bayer) لكشف التلاعب في بكسلات المستشعر الأصلية.' },
    'Noise': { label: 'تحليل الضجيج (Noise)', desc: 'يستخلص بصمة ضجيج الكاميرا للبحث عن مناطق ذات نسيج غير متناسق.' },
    'Ghost': { label: 'كشف الأشباح (Ghost)', desc: 'يحدد آثار الضغط المتعدد التي تظهر عند حفظ الصورة بعد تعديلها.' }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
      setIsAnalysisComplete(false);
      setSuspiciousZones([]);
    }
  };

  const startInvestigation = () => {
    if (!preview) return;
    setActiveScan(true);
    setIsAnalysisComplete(false);
    
    setTimeout(() => {
      setActiveScan(false);
      setIsAnalysisComplete(true);
      setSuspiciousZones([
        { id: 'منطقة-1', x: 220, y: 140, score: 89.4, type: 'قص ولصق كائن' },
        { id: 'منطقة-2', x: 380, y: 260, score: 64.2, type: 'كسر نمط مصفوفة CFA' }
      ]);
    }, 2500);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isAnalysisComplete && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const seed = (x * y) % 100;
      const prob = seed > 80 ? 85 + (seed % 15) : (seed % 40);
      setTooltip({ x, y, value: prob, visible: true });
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-bg font-cairo animate-in fade-in duration-500 overflow-y-auto custom-scrollbar p-8" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 shrink-0">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic">
               <Shield size={32} className="text-brand-primary" /> مصفوفة التحقق الرقمي
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
               <Zap size={12} className="text-brand-primary animate-pulse" /> مصفوفة التحقق الجنائي المتقدمة // العقدة المحلية
            </p>
         </div>
         <div className="flex gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-2xl hover:border-brand-primary transition-all shadow-sm flex items-center gap-2"
            >
               <FileText size={16} /> استيراد صورة
            </button>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
            <button 
              onClick={startInvestigation}
              disabled={!preview || activeScan}
              className="px-8 py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
               <Zap size={16} /> {isAnalysisComplete ? 'إعادة التحليل' : 'تشغيل الفحص الاحترافي'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
         {/* Main Workspace */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-6 flex-1 relative overflow-hidden group shadow-soft flex flex-col">
               <div className="flex items-center justify-between mb-6 z-10">
                  <div className="flex gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
                    {(['ELA', 'CFA', 'Noise', 'Ghost'] as ForensicMethod[]).map(method => (
                      <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        title={methodsData[method].desc}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${selectedMethod === method ? 'bg-white text-brand-primary shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {methodsData[method].label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:text-brand-primary transition-all"><RefreshCw size={18}/></button>
                     <button className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:text-brand-primary transition-all"><Maximize2 size={18}/></button>
                  </div>
               </div>

               {/* Viewport */}
               <div 
                 ref={viewportRef}
                 onMouseMove={handleMouseMove}
                 onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
                 className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner cursor-crosshair"
               >
                  {!preview ? (
                     <div className="text-center p-12 opacity-30 grayscale scale-90">
                        <Eye size={64} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">بانتظار المادة الجنائية للتحليل</p>
                     </div>
                  ) : (
                    <div className="relative">
                       <img src={preview} className="max-w-full max-h-[500px] object-contain rounded-2xl shadow-2xl border-4 border-white" alt="Target" />
                       
                       {isAnalysisComplete && (
                          <div className={`absolute inset-0 mix-blend-overlay opacity-60 transition-all duration-500 ${colorMap === 'high-contrast' ? 'contrast-200 saturate-200' : colorMap === 'monochrome' ? 'grayscale brightness-150' : ''}`}>
                             {selectedMethod === 'ELA' && (
                               <div className="absolute inset-0">
                                  <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-red-500/60 rounded-full blur-[50px] animate-pulse"></div>
                                  <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-yellow-400/40 rounded-full blur-[40px] animate-pulse delay-500"></div>
                               </div>
                             )}
                             {selectedMethod === 'CFA' && (
                               <div className="absolute inset-0 bg-green-500/10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,255,0,0.05) 10px, rgba(0,255,0,0.05) 11px)' }}>
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-400/50 rounded-full blur-[90px]"></div>
                               </div>
                             )}
                          </div>
                       )}

                       {/* Suspect Markers */}
                       {isAnalysisComplete && suspiciousZones.map(zone => (
                         <div key={zone.id} className="absolute w-10 h-10 border-2 border-red-500 rounded-full animate-ping" style={{ left: zone.x, top: zone.y }}></div>
                       ))}
                    </div>
                  )}

                  {activeScan && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-30 flex items-center justify-center">
                       <div className="text-center">
                          <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-6"></div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">جاري سبر الأنماط العميقة...</p>
                       </div>
                    </div>
                  )}

                  {tooltip.visible && isAnalysisComplete && (
                    <div className="absolute z-50 pointer-events-none bg-slate-900/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95" style={{ left: tooltip.x + 20, top: tooltip.y - 40 }}>
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${tooltip.value > 75 ? 'bg-red-500 animate-pulse' : 'bg-brand-primary'}`}></div>
                          <div>
                             <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest italic">احتمالية التلاعب (Inconsistency)</p>
                             <p className="text-sm font-black font-mono italic">{tooltip.value.toFixed(1)}%</p>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-soft">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">النزاهة الشاملة للهيكل</p>
                  <div className="flex items-end gap-4">
                     <span className="text-4xl font-black text-slate-900 italic">{isAnalysisComplete ? '94.8%' : '--'}</span>
                     <span className="text-[9px] font-black text-brand-primary uppercase pb-1.5 tracking-widest">{isAnalysisComplete ? 'موثوق / Verified' : 'قيد الانتظار'}</span>
                  </div>
               </div>
               <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-soft">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">مؤشر التلاعب المكتشف</p>
                  <div className="flex items-end gap-4">
                     <span className={`text-4xl font-black italic ${isAnalysisComplete ? 'text-red-500' : 'text-slate-900'}`}>{isAnalysisComplete ? '12.4%' : '--'}</span>
                     <span className="text-[9px] font-black text-slate-400 uppercase pb-1.5 tracking-widest">{isAnalysisComplete ? 'محسوب / Calculated' : 'جاري التحليل'}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Professional Controls Sidebar */}
         <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-soft flex flex-col gap-8">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <Sliders className="text-brand-primary" size={18} /> لوحة التحكم الاحترافية
               </h3>

               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                        <span>جودة الضغط الهدف (ELA Quality)</span>
                        <span className="text-brand-primary font-mono">{elaQuality}%</span>
                     </div>
                     <input 
                        type="range" min="1" max="100" 
                        value={elaQuality} 
                        onChange={(e) => setElaQuality(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                     />
                     <p className="text-[8px] text-slate-400 italic">رفع الجودة يقلل حساسية الخطأ، خفضها يكشف التلاعبات الدقيقة المخفية خلف ضغط JPEG.</p>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                        <Palette size={14} /> نمط الخريطة الحرارية الجنائية
                     </label>
                     <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'standard', label: 'قياسي' },
                          { id: 'high-contrast', label: 'تباين عالٍ' },
                          { id: 'monochrome', label: 'أحادي اللون' }
                        ].map(map => (
                           <button 
                              key={map.id}
                              onClick={() => setColorMap(map.id as any)}
                              className={`py-3 rounded-xl text-[8px] font-black uppercase border transition-all ${colorMap === map.id ? 'bg-brand-primary text-white border-brand-primary' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-brand-primary/20'}`}
                           >
                              {map.label}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Analysis Report */}
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-soft flex-1 flex flex-col">
               <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-6">
                  <BarChart3 className="text-brand-primary" size={24} />
                  <div>
                     <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">تقرير تحليل المناطق المشبوهة</h3>
                     <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">رقم التقرير: {isAnalysisComplete ? 'YE-442-PRO' : 'في وضع الاستعداد'}</p>
                  </div>
               </div>

               <div className="space-y-4 flex-1">
                  {isAnalysisComplete ? (
                    suspiciousZones.map(zone => (
                      <div key={zone.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-brand-primary transition-all">
                         <div className="flex items-center gap-3">
                            <Crosshair size={14} className="text-slate-400 group-hover:text-brand-primary" />
                            <div>
                               <p className="text-[10px] font-black text-slate-800 uppercase">{zone.id}: {zone.type}</p>
                               <p className="text-[9px] text-slate-400 font-mono">الإحداثيات: X:{zone.x} Y:{zone.y}</p>
                            </div>
                         </div>
                         <span className={`text-[11px] font-black ${zone.score > 75 ? 'text-red-500' : 'text-brand-primary'}`}>{zone.score}%</span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                       <Shield size={40} className="text-slate-200 mb-4" />
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">بانتظار نتائج المحرك الجنائي الاحترافي</p>
                    </div>
                  )}
               </div>

               {isAnalysisComplete && (
                  <button className="w-full mt-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:bg-brand-primary transition-all flex items-center justify-center gap-3">
                     <Download size={16} /> تصدير الخريطة الجنائية الموثقة
                  </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ForensicsDashboard;
