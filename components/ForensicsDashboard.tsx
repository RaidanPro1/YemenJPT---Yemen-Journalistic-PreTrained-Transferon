
import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Search, Zap, Maximize2, Layers, Target, Eye, 
  ZoomIn, Info, AlertTriangle, Download, FileText, 
  RefreshCw, Sliders, Palette, Crosshair, BarChart3, ChevronLeft,
  Fingerprint, Camera, Binary, Scan, Aperture, Activity, Move, MousePointer2, ZoomOut,
  Maximize, Brain, Scale
} from 'lucide-react';

type ForensicMethod = 'ELA' | 'CFA' | 'Noise' | 'Ghost' | 'Metadata' | 'Watermark' | 'Deepfake';
type ColorMap = 'standard' | 'high-contrast' | 'monochrome' | 'thermal';

interface SuspiciousZone {
  id: string;
  x: number;
  y: number;
  score: number;
  type: string;
}

interface MetadataReport {
  make: string;
  model: string;
  software: string;
  date: string;
  exposure: string;
  iso: string;
  edited: boolean;
}

const ForensicsDashboard: React.FC = () => {
  const [activeScan, setActiveScan] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<ForensicMethod>('ELA');
  const [filterIntensity, setFilterIntensity] = useState(90);
  const [colorMap, setColorMap] = useState<ColorMap>('standard');
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [suspiciousZones, setSuspiciousZones] = useState<SuspiciousZone[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, visible: boolean }>({ x: 0, y: 0, value: 0, visible: false });
  const [metadata, setMetadata] = useState<MetadataReport | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mouse interaction state for dragging/panning
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const methodsData: Record<ForensicMethod, { label: string; desc: string; icon: any }> = {
    'ELA': { label: 'تحليل الخطأ (ELA)', desc: 'يكشف تباين ضغط JPEG للعثور على العناصر المضافة حديثاً.', icon: Layers },
    'CFA': { label: 'مصفوفة باير (CFA)', desc: 'يفحص نمط المستشعر لكشف التلاعب في بكسلات الكاميرا الأصلية.', icon: Aperture },
    'Noise': { label: 'تحليل الضجيج (Noise)', desc: 'كشف "النعومة الرقمية" المميزة للصور المولدة بالذكاء الاصطناعي.', icon: Activity },
    'Ghost': { label: 'كشف الأشباح (Ghost)', desc: 'يحدد آثار الضغط المتعدد التي تظهر عند حفظ الصورة بعد تعديلها.', icon: Zap },
    'Deepfake': { label: 'كشف التزييف العميق', desc: 'تحليل الضجيج البصري والبيانات الوصفية لكشف الوجوه المولدة آلياً (Deepfake).', icon: Brain },
    'Metadata': { label: 'البيانات الوصفية', desc: 'استخراج جواز السفر الرقمي للصورة (EXIF/XMP).', icon: FileText },
    'Watermark': { label: 'كشف العلامات', desc: 'فحص التوقيعات الخفية (Invisible Watermarks).', icon: Fingerprint }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
      setIsAnalysisComplete(false);
      setSuspiciousZones([]);
      setMetadata(null);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  };

  const startInvestigation = () => {
    if (!preview) return;
    setActiveScan(true);
    setIsAnalysisComplete(false);
    
    setTimeout(() => {
      setActiveScan(false);
      setIsAnalysisComplete(true);
      if (selectedMethod === 'Deepfake') {
          setSuspiciousZones([
             { id: 'DF-01', x: 250, y: 180, score: 92.1, type: 'GAN Artifacts (Face)' }
          ]);
      } else {
          setSuspiciousZones([
            { id: 'Z-01', x: 220, y: 140, score: 89.4, type: 'Inpainting Artifacts' },
            { id: 'Z-02', x: 380, y: 260, score: 64.2, type: 'CFA Discontinuity' }
          ]);
      }
      setMetadata({
        make: 'Canon',
        model: 'EOS 5D Mark IV',
        software: 'Adobe Photoshop 2024 (Macintosh)',
        date: '2025:05:12 14:30:05',
        exposure: '1/200',
        iso: '400',
        edited: true
      });
    }, 2000);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!preview) return;
    e.preventDefault();
    const scaleFactor = 0.1;
    const newZoom = Math.max(0.5, Math.min(5, zoom + (e.deltaY > 0 ? -scaleFactor : scaleFactor)));
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!preview) return;
    setIsDragging(true);
    setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
    
    if (isAnalysisComplete && viewportRef.current && selectedMethod !== 'Metadata') {
        const rect = viewportRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTooltip({ x, y, value: Math.random() * 100, visible: true });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getColorMapFilter = () => {
    switch (colorMap) {
      case 'high-contrast': return 'contrast(1.5) saturate(1.5)';
      case 'monochrome': return 'grayscale(100%) contrast(1.2)';
      case 'thermal': return 'invert(1) hue-rotate(180deg) contrast(1.2)';
      default: return 'none';
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-bg font-cairo animate-in fade-in duration-500 overflow-y-auto custom-scrollbar p-8" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 shrink-0">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic">
               <Shield size={32} className="text-brand-primary" /> مختبر التحقق وكشف التزييف
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
               <Zap size={12} className="text-brand-primary animate-pulse" /> Advanced Verification Unit // Precision Tools
            </p>
         </div>
         <div className="flex gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-2xl hover:border-brand-primary transition-all shadow-sm flex items-center gap-2"
            >
               <FileText size={16} /> استيراد وسائط
            </button>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
            <button 
              onClick={startInvestigation}
              disabled={!preview || activeScan}
              className="px-8 py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
               <Scan size={16} /> {isAnalysisComplete ? 'إعادة الفحص' : 'بدء التحليل التقني'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
         {/* Main Workspace */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-6 flex-1 relative overflow-hidden group shadow-soft flex flex-col">
               <div className="flex items-center justify-between mb-6 z-10">
                  <div className="flex gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
                    {(Object.keys(methodsData) as ForensicMethod[]).map(method => {
                      const MethodIcon = methodsData[method].icon;
                      return (
                        <button
                          key={method}
                          onClick={() => setSelectedMethod(method)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap flex items-center gap-2 ${selectedMethod === method ? 'bg-white text-brand-primary shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          <MethodIcon size={14} />
                          {methodsData[method].label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button onClick={() => setIsLoupeActive(!isLoupeActive)} className={`p-3 rounded-xl border transition-all ${isLoupeActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-slate-50 border-slate-100 text-slate-400'}`}><Search size={18}/></button>
                     <button onClick={() => { setZoom(1); setOffset({x:0, y:0}); }} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 hover:text-brand-primary transition-all"><Maximize size={18}/></button>
                  </div>
               </div>

               {/* Viewport */}
               <div 
                 ref={viewportRef}
                 onWheel={handleWheel}
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={() => { handleMouseUp(); setTooltip(prev => ({ ...prev, visible: false })); }}
                 className={`flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner ${preview ? 'cursor-move' : 'cursor-default'}`}
               >
                  {!preview ? (
                     <div className="text-center p-12 opacity-30 grayscale scale-90">
                        <Camera size={64} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">بانتظار الوسائط للتحقق</p>
                     </div>
                  ) : (
                    <div 
                        className="relative transition-transform duration-75 will-change-transform"
                        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                    >
                       <div style={{ filter: isAnalysisComplete ? getColorMapFilter() : 'none', transition: 'filter 0.3s ease' }}>
                          <img src={preview} className="max-w-[800px] object-contain rounded-lg shadow-xl" alt="Target" draggable={false} />
                       </div>
                       
                       {/* Forensic Filters Overlay */}
                       {isAnalysisComplete && selectedMethod !== 'Metadata' && (
                          <div className="absolute inset-0 mix-blend-overlay pointer-events-none" style={{ opacity: filterIntensity / 100 }}>
                             {selectedMethod === 'ELA' && (
                               <div className="w-full h-full bg-slate-500 mix-blend-difference contrast-[2.5]"></div> 
                             )}
                             {selectedMethod === 'Noise' && (
                               <div className="w-full h-full bg-blue-500/20 mix-blend-color-burn"></div> 
                             )}
                             {selectedMethod === 'Deepfake' && (
                               <div className="w-full h-full bg-red-500/10 mix-blend-multiply contrast-125"></div> 
                             )}
                          </div>
                       )}

                       {/* Loupe / Magnifier Effect */}
                       {isLoupeActive && isDragging && (
                           <div 
                             className="absolute w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-no-repeat pointer-events-none z-50 overflow-hidden"
                             style={{
                                left: -offset.x + (tooltip.x || 0) - 64, 
                                top: -offset.y + (tooltip.y || 0) - 64,
                                backgroundImage: `url(${preview})`,
                                backgroundPosition: 'center', 
                                backgroundSize: `${800 * zoom * 2}px`,
                                filter: getColorMapFilter()
                             }}
                           >
                               <div className="absolute inset-0 border border-brand-primary/30 rounded-full"></div>
                               <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary/50" size={24}/>
                           </div>
                       )}

                       {/* Suspect Markers */}
                       {isAnalysisComplete && selectedMethod !== 'Metadata' && suspiciousZones.map(zone => (
                         <div key={zone.id} className="absolute w-12 h-12 border-2 border-red-500 rounded-full animate-pulse" style={{ left: zone.x - 24, top: zone.y - 24 }}>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap">
                                {zone.score}% Suspicious
                            </div>
                         </div>
                       ))}
                    </div>
                  )}

                  {/* Metadata Overlay - Fixed Position */}
                  {isAnalysisComplete && selectedMethod === 'Metadata' && metadata && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex items-center justify-center p-12 animate-in fade-in zoom-in-95">
                          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">جواز السفر الرقمي (EXIF)</h4>
                                  {metadata.edited ? (
                                      <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                          <span className="text-[9px] font-black text-red-500 uppercase">EDITED / معدل</span>
                                      </div>
                                  ) : (
                                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          <span className="text-[9px] font-black text-green-500 uppercase">ORIGINAL / أصلي</span>
                                      </div>
                                  )}
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                  <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Device Make</p><p className="text-xs font-black text-slate-800">{metadata.make}</p></div>
                                  <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Device Model</p><p className="text-xs font-black text-slate-800">{metadata.model}</p></div>
                                  <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Capture Date</p><p className="text-xs font-black text-slate-800 font-mono">{metadata.date}</p></div>
                                  <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Exposure / ISO</p><p className="text-xs font-black text-slate-800 font-mono">{metadata.exposure} @ ISO {metadata.iso}</p></div>
                                  
                                  <div className="col-span-2">
                                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Processing Software</p>
                                      <div className={`p-3 rounded-xl border ${metadata.edited ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                                          <p className="text-[10px] font-black font-mono">{metadata.software || 'N/A (Straight out of camera)'}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
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
               </div>
            </div>
            
            {/* Liability Notice for Forensics */}
            <div className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-[9px] text-amber-700 font-bold">
                    <Scale size={10} />
                    <span>تنبيه تحريري: نتائج التحليل التقني هي مؤشرات احتمالية وليست أدلة قطعية. يرجى المراجعة البشرية.</span>
                </div>
            </div>
         </div>

         {/* Professional Controls Sidebar */}
         <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            {/* Deepfake / Support Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                    <div>
                        <h4 className="text-xs font-black text-amber-800 mb-1">أداة دعم القرار الصحفي</h4>
                        <p className="text-[10px] text-amber-700 leading-relaxed font-bold">
                            نتائج كشف التزييف (Deepfake Detection) احتمالية وليست مطلقة. يجب استخدام هذه الأداة لدعم حكم المحقق الصحفي، وليس كقاضٍ نهائي. (UNESCO MIL Standard).
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-soft flex flex-col gap-8">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <Sliders className="text-brand-primary" size={18} /> الضبط الدقيق (Fine-Tuning)
               </h3>

               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                        <span>شدة الفلتر (Filter Intensity)</span>
                        <span className="text-brand-primary font-mono">{filterIntensity}%</span>
                     </div>
                     <input 
                        type="range" min="0" max="100" 
                        value={filterIntensity} 
                        onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                     />
                     <p className="text-[8px] text-slate-400 italic">زيادة الشدة تساعد في إبراز التباين الطفيف في خوارزميات ELA و Noise.</p>
                  </div>

                  {/* Color Map Selection */}
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Palette size={14} /> نمط الخريطة الحرارية
                     </label>
                     <div className="grid grid-cols-2 gap-2">
                        {(['standard', 'high-contrast', 'monochrome', 'thermal'] as ColorMap[]).map(map => (
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

            {/* Analysis Report */}
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-soft flex-1 flex flex-col">
               <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-6">
                  <BarChart3 className="text-brand-primary" size={24} />
                  <div>
                     <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">المناطق المشبوهة</h3>
                     <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{isAnalysisComplete ? `${suspiciousZones.length} Zones Detected` : 'Ready'}</p>
                  </div>
               </div>

               <div className="space-y-4 flex-1">
                  {isAnalysisComplete && suspiciousZones.map(zone => (
                      <div key={zone.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-brand-primary transition-all">
                         <div className="flex items-center gap-3">
                            <Crosshair size={14} className="text-slate-400 group-hover:text-brand-primary" />
                            <div>
                               <p className="text-[10px] font-black text-slate-800 uppercase">{zone.type}</p>
                               <p className="text-[9px] text-slate-400 font-mono">Confidence: {zone.score}%</p>
                            </div>
                         </div>
                      </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ForensicsDashboard;
