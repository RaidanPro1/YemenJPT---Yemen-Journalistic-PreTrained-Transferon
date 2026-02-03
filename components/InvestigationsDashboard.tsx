
import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Search, Zap, Maximize2, Layers, Target, Eye, 
  ZoomIn, Info, AlertTriangle, Download, FileText, 
  Move, MousePointer2, RefreshCw, ZoomOut, Sliders, Palette, Crosshair
} from 'lucide-react';

type ForensicMethod = 'ELA' | 'CFA' | 'Noise' | 'Ghost';

interface SuspiciousZone {
  id: string;
  x: number;
  y: number;
  score: number;
  type: string;
}

const InvestigationsDashboard: React.FC = () => {
  const [activeScan, setActiveScan] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, visible: boolean }>({ x: 0, y: 0, value: 0, visible: false });
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Forensic Controls
  const [selectedMethod, setSelectedMethod] = useState<ForensicMethod>('ELA');
  const [elaQuality, setElaQuality] = useState(90);
  const [colorMap, setColorMap] = useState<'standard' | 'high-contrast' | 'monochrome'>('standard');
  const [suspiciousZones, setSuspiciousZones] = useState<SuspiciousZone[]>([]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (!preview) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 10));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!preview) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }

    if (preview && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / zoom;
      const y = (e.clientY - rect.top - offset.y) / zoom;
      
      // Simulated probability calculation based on coordinates
      const seed = Math.abs(Math.floor(x * y)) % 100;
      const sensitivity = (100 - elaQuality) / 10;
      const probability = seed > (80 - sensitivity) ? (85 + (seed % 15)) : (seed % 30);
      
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, value: isAnalysisComplete ? probability : 0, visible: isAnalysisComplete });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
      setIsAnalysisComplete(false);
      setSuspiciousZones([]);
      resetView();
    }
  };

  const startInvestigation = () => {
    if (!preview) return;
    setActiveScan(true);
    setIsAnalysisComplete(false);
    setSuspiciousZones([]);
    
    setTimeout(() => {
      setActiveScan(false);
      setIsAnalysisComplete(true);
      
      // Generate simulated suspicious zones for the report
      setSuspiciousZones([
        { id: 'Z-1', x: 240, y: 150, score: 87.4, type: 'Object Insertion' },
        { id: 'Z-2', x: 410, y: 280, score: 62.1, type: 'Bayer Inconsistency (CFA)' },
        { id: 'Z-3', x: 120, y: 320, score: 45.8, type: 'Noise Discrepancy' }
      ]);
    }, 2500);
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-10 h-full bg-brand-bg font-cairo animate-in fade-in duration-500 overflow-y-auto custom-scrollbar p-10" dir="rtl">
      {/* Header View */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 shrink-0">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic flex items-center gap-4">
               <Shield size={32} className="text-brand-primary" /> مختبر الجنايات والتحقق البصري المتقدم
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic">YemenJPT Sovereign Forensic Lab // Node-7</p>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-2xl hover:border-brand-primary transition-all shadow-sm flex items-center gap-2"
            >
               <FileText size={16} /> استيراد مادة
            </button>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
            <button 
              onClick={startInvestigation}
              disabled={!preview || activeScan}
              className="px-8 py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
               <Zap size={16} /> {isAnalysisComplete ? 'إعادة التحليل' : 'بدء فحص شامل'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
         {/* Main Analysis Area */}
         <div className="lg:col-span-8 flex flex-col gap-8 min-h-0">
            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-8 flex-1 relative overflow-hidden group shadow-soft flex flex-col">
               <div className="flex items-center justify-between mb-8 z-10">
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                    {(['ELA', 'CFA', 'Noise', 'Ghost'] as ForensicMethod[]).map(method => (
                      <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${selectedMethod === method ? 'bg-white text-brand-primary shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                     <button onClick={resetView} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:text-brand-primary transition-all" title="إعادة ضبط">
                        <RefreshCw size={18}/>
                     </button>
                     <button className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:text-brand-primary transition-all" title="تحميل الخريطة الجنائية">
                        <Download size={18}/>
                     </button>
                  </div>
               </div>

               {/* Viewport Simulation */}
               <div 
                 ref={viewportRef}
                 onWheel={handleWheel}
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={() => { handleMouseUp(); setTooltip(prev => ({ ...prev, visible: false })); }}
                 className={`flex-1 bg-slate-50 rounded-[3rem] border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner transition-all duration-300 ${preview ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
               >
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#007aff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                  
                  <div 
                    className="relative transition-transform duration-150 ease-out will-change-transform"
                    style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                  >
                    {!preview ? (
                       <div className="text-center z-10 p-16 bg-white/60 backdrop-blur-xl rounded-[4rem] border border-white shadow-soft">
                          <div className="w-20 h-20 bg-brand-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                             <Eye size={36} className="text-brand-primary/40" />
                          </div>
                          <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em]">أدرج المادة لبدء السبر الجنائي</p>
                       </div>
                    ) : (
                       <div className="relative">
                          <div className="w-[640px] h-[400px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative">
                             <img 
                               src={preview} 
                               className="w-full h-full object-cover select-none pointer-events-none"
                               alt="Forensic Target"
                             />
                             {/* Forensic Heatmap Layers */}
                             {isAnalysisComplete && (
                               <div className={`absolute inset-0 mix-blend-overlay opacity-70 transition-all duration-500 pointer-events-none ${colorMap === 'high-contrast' ? 'contrast-200 saturate-200' : colorMap === 'monochrome' ? 'grayscale brightness-150' : ''}`}>
                                  {/* ELA Heatmap Simulation */}
                                  {selectedMethod === 'ELA' && (
                                    <div className="absolute inset-0 bg-brand-primary/10">
                                      <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-red-500/50 rounded-full blur-[60px] animate-pulse"></div>
                                      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-yellow-400/30 rounded-full blur-[50px] animate-pulse delay-500"></div>
                                    </div>
                                  )}
                                  {/* CFA Heatmap Simulation */}
                                  {selectedMethod === 'CFA' && (
                                    <div className="absolute inset-0 bg-green-500/10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,255,0,0.05) 10px, rgba(0,255,0,0.05) 11px)' }}>
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/40 rounded-3xl blur-[80px]"></div>
                                    </div>
                                  )}
                               </div>
                             )}
                          </div>
                          
                          {/* Visual Markers for Suspicious Zones */}
                          {isAnalysisComplete && suspiciousZones.map(zone => (
                            <div 
                              key={zone.id}
                              className="absolute w-12 h-12 border-2 border-red-500 rounded-full animate-ping pointer-events-none"
                              style={{ left: zone.x - 24, top: zone.y - 24, opacity: zone.score / 100 }}
                            ></div>
                          ))}
                       </div>
                    )}
                  </div>

                  {activeScan && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-30 flex items-center justify-center">
                       <div className="text-center">
                          <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-6"></div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">جاري تحليل التباين والأنماط...</p>
                       </div>
                    </div>
                  )}

                  {/* Dynamic Tooltip */}
                  {tooltip.visible && isAnalysisComplete && (
                    <div 
                      className="absolute z-50 pointer-events-none bg-slate-900/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95"
                      style={{ left: tooltip.x + 20, top: tooltip.y - 40 }}
                    >
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${tooltip.value > 75 ? 'bg-red-500 animate-pulse' : 'bg-brand-primary'}`}></div>
                          <div>
                             <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Modification Prob.</p>
                             <p className="text-sm font-black font-mono italic">{tooltip.value.toFixed(1)}%</p>
                          </div>
                       </div>
                    </div>
                  )}
                  
                  {/* Stats Overlay */}
                  <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                     <div className="px-5 py-2.5 bg-brand-primary text-white text-[9px] font-black uppercase rounded-2xl shadow-lg shadow-blue-500/20 border border-brand-primary/20 flex items-center gap-2">
                        <Sliders size={12}/> {selectedMethod} Engine: Active
                     </div>
                     <div className="px-5 py-2.5 bg-white text-slate-500 text-[9px] font-black uppercase rounded-2xl border border-slate-200 shadow-soft flex items-center gap-2">
                        <Maximize2 size={12}/> Zoom: x{zoom.toFixed(1)}
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-soft hover:border-brand-primary transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نزاهة البكسلات (Pixel Integrity)</span>
                     <Layers size={18} className={`${isAnalysisComplete ? 'text-brand-primary' : 'text-slate-300'}`} />
                  </div>
                  <div className="flex items-end gap-6">
                     <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{isAnalysisComplete ? '96.2%' : '--'}</span>
                     <span className={`text-[9px] font-bold uppercase pb-1.5 tracking-widest font-black ${isAnalysisComplete ? 'text-brand-primary' : 'text-slate-300'}`}>
                        {isAnalysisComplete ? 'Verified / موثوق' : 'بانتظار التحميل'}
                     </span>
                  </div>
               </div>
               <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-soft hover:border-red-500 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تجزئة المحتوى (Deepfake Splicing)</span>
                     <Zap size={18} className={`${isAnalysisComplete ? 'text-red-500 animate-pulse' : 'text-slate-300'}`} />
                  </div>
                  <div className="flex items-end gap-6">
                     <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{isAnalysisComplete ? '0.4%' : '--'}</span>
                     <span className={`text-[9px] font-bold uppercase pb-1.5 tracking-widest font-black ${isAnalysisComplete ? 'text-brand-success' : 'text-slate-300'}`}>
                        {isAnalysisComplete ? 'Safe / آمن' : 'بانتظار التحليل'}
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar: Forensic Controls & Report */}
         <div className="lg:col-span-4 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
            {/* Forensic Configuration */}
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-soft flex flex-col gap-6">
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <Sliders className="text-brand-primary" size={18} /> معايرة التحليل الجنائي
               </h3>
               
               <div className="space-y-6">
                  {/* ELA Quality Slider */}
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">جودة الضغط (ELA Quality)</label>
                        <span className="text-[10px] font-black text-brand-primary font-mono">{elaQuality}%</span>
                     </div>
                     <input 
                        type="range" min="1" max="100" 
                        value={elaQuality}
                        onChange={(e) => setElaQuality(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                     />
                     <p className="text-[8px] text-slate-400 italic">قم بتغيير الجودة لرؤية تباين مستويات الخطأ.</p>
                  </div>

                  {/* Color Mapping Selection */}
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Palette size={14} /> نمط الخريطة الحرارية
                     </label>
                     <div className="grid grid-cols-3 gap-2">
                        {(['standard', 'high-contrast', 'monochrome'] as const).map(map => (
                           <button 
                              key={map}
                              onClick={() => setColorMap(map)}
                              className={`py-3 rounded-xl text-[8px] font-black uppercase border transition-all ${colorMap === map ? 'bg-brand-primary text-white border-brand-primary shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-brand-primary/20'}`}
                           >
                              {map.replace('-', ' ')}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Tactical Report Sidebar */}
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-soft flex flex-col relative overflow-hidden flex-1">
               <div className="absolute top-0 right-0 w-full h-1 bg-brand-primary shadow-lg shadow-blue-500/10"></div>
               
               <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
                  <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center border border-brand-primary/10">
                     <FileText size={24} className="text-brand-primary" />
                  </div>
                  <div>
                     <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">تحليل المناطق المشبوهة</h3>
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">Report: {isAnalysisComplete ? 'YE-921-V8' : 'Awaiting Data'}</p>
                  </div>
               </div>

               <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                  {isAnalysisComplete ? (
                    <>
                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">المناطق المكتشفة (Suspicious Zones):</label>
                         {suspiciousZones.map(zone => (
                           <div key={zone.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-primary transition-all group cursor-pointer">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all">
                                    <Crosshair size={14} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-800 uppercase">{zone.id}: {zone.type}</p>
                                    <p className="text-[9px] text-slate-400 font-mono">COORD: {zone.x}, {zone.y}</p>
                                 </div>
                              </div>
                              <span className={`text-[10px] font-black ${zone.score > 75 ? 'text-red-500' : 'text-brand-primary'}`}>{zone.score}%</span>
                           </div>
                         ))}
                      </div>

                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <label className="text-[9px] font-black text-slate-400 uppercase mb-3 block">الاستنتاج السيادي:</label>
                         <p className="text-xs font-bold leading-relaxed italic text-slate-700">
                            تم اكتشاف تباين غير طبيعي في مستويات الضغط عند الإحداثيات المركزية. تشير خوارزمية ELA بجودة {elaQuality}% إلى احتمالية تلاعب في حواف الكائنات بنسبة عالية. يوصى بمطابقة بصمة الـ CFA للتحقق من سلامة نمط باير.
                         </p>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                       <Crosshair size={48} className="text-slate-200 mb-4" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">بانتظار نتائج المحرك...</p>
                    </div>
                  )}
               </div>

               {isAnalysisComplete && (
                  <button className="w-full mt-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:bg-brand-primary transition-all flex items-center justify-center gap-3">
                     <Download size={16} /> تصدير التقرير الفني المختوم
                  </button>
               )}

               <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
                  <AlertTriangle size={20} className="text-brand-gold shrink-0 animate-pulse" />
                  <p className="text-[9px] text-slate-400 italic leading-relaxed font-bold">
                     تنبيه: يتم تشغيل كافة الخوارزميات محلياً لضمان سيادة البيانات. النتائج تتطلب مطابقة جنائية قانونية.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InvestigationsDashboard;
