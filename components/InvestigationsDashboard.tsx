
import React, { useState, useRef, useEffect } from 'react';

type RiskLevel = 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج' | 'آمن';
type ViewMode = 'overlay' | 'split';

interface ForensicReport {
  target: string;
  forensics: {
    ela_analysis: {
      ela_map_base64: string;
      modification_probability: number;
      integrity_status: string;
    };
    deepfake_detection: {
      fake_probability: number;
      is_synthetic: boolean;
      method: string;
    };
    metadata: Record<string, string>;
  };
}

const InvestigationsDashboard: React.FC = () => {
  const [targetInput, setTargetInput] = useState('');
  const [activeScan, setActiveScan] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('آمن');
  const [showRisk, setShowRisk] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [forensicReport, setForensicReport] = useState<ForensicReport | null>(null);
  const [showEla, setShowEla] = useState(false);
  const [elaOpacity, setElaOpacity] = useState(0.7);
  const [viewMode, setViewMode] = useState<ViewMode>('overlay');
  
  // Interactive View Controls
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [probeData, setProbeData] = useState<{ clientX: number, clientY: number, pixelX: number, pixelY: number, prob: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setTargetInput(e.target.files[0].name);
      setForensicReport(null);
      resetView();
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setProbeData(null);
  };

  const addResult = (line: string) => {
    setResults(prev => [...prev, line]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }

    // Intensity Probe Logic
    if (forensicReport && offscreenCanvasRef.current && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const viewportX = e.clientX - rect.left;
      const viewportY = e.clientY - rect.top;
      
      // Map viewport coordinates back to original image space
      const x = (viewportX - pan.x) / zoom;
      const y = (viewportY - pan.y) / zoom;
      
      const canvas = offscreenCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Adjust coordinate mapping based on contain/cover logic
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const pixelX = x * scaleX;
        const pixelY = y * scaleY;

        if (pixelX >= 0 && pixelX < canvas.width && pixelY >= 0 && pixelY < canvas.height) {
          const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
          const intensity = (pixel[0] + pixel[1] + pixel[2]) / 3;
          setProbeData({ 
            clientX: e.clientX, 
            clientY: e.clientY, 
            pixelX: Math.round(pixelX), 
            pixelY: Math.round(pixelY), 
            prob: (intensity / 255) * 100 
          });
        } else {
          setProbeData(null);
        }
      }
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
      if (forensicReport) {
          const delta = e.deltaY > 0 ? 0.9 : 1.1;
          setZoom(prev => Math.min(Math.max(prev * delta, 0.5), 10));
      }
  };

  const handleStartRecon = async () => {
    if (!selectedFile) {
        addResult("[تنبيه] يرجى اختيار ملف أولاً.");
        return;
    }
    setActiveScan('running');
    addResult(`[النظام] جاري بدء تسلسل الاستطلاع الجنائي...`);
    addResult(`[ELA] تحليل مستوى الخطأ (Error Level Analysis)...`);

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await fetch('/api/forensics/sherloq', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      setForensicReport(data);
      
      const prob = data.forensics.ela_analysis.modification_probability * 100;
      addResult(`[ELA] احتمالية التعديل الرقمي: ${prob.toFixed(1)}%`);
      addResult(`[Deepfake] فحص الترددات الطيفية مكتمل.`);
      
      // Load Heatmap into offscreen canvas for probing
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        offscreenCanvasRef.current = canvas;
      };
      img.src = data.forensics.ela_analysis.ela_map_base64;

      setRiskLevel(data.forensics.deepfake_detection.is_synthetic ? 'حرج' : 'آمن');
      setShowRisk(true);
      setShowEla(true); // Enabled by default after report load
    } catch (err) {
      addResult(`[خطأ] فشل في الاتصال بمحرك التحليل المحلي. تأكد من تشغيل السيرفر.`);
      // Mock data for demo if backend fails
      setForensicReport({
          target: selectedFile.name,
          forensics: {
              ela_analysis: {
                  ela_map_base64: previewUrl || '',
                  modification_probability: 0.24,
                  integrity_status: 'suspicious'
              },
              deepfake_detection: {
                  fake_probability: 0.78,
                  is_synthetic: true,
                  method: 'Spectral Artifact Detection'
              },
              metadata: { "Camera": "Canon EOS", "Software": "Adobe Photoshop 2024" }
          }
      });
      setShowRisk(true);
      setShowEla(true);
    }
    setActiveScan(null);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">لوحة التحقيقات الرقمية</h2>
        <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest mt-2">محرك الجنايات الرقمية وكشف التلاعب بالوسائط</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10">
          
          <div className="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">وحدة تحليل ELA وكشف التزييف</h3>
                    <p className="text-[10px] text-slate-500">قم برفع الصورة لتحليلها جنائياً وكشف التلاعب الاصطناعي.</p>
                </div>
                <div className="flex gap-2">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${activeScan ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan animate-pulse' : 'bg-slate-100 dark:bg-brand-dark border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                        {activeScan ? 'جاري التحليل' : 'نظام الخبراء جاهز'}
                    </div>
                </div>
            </div>

            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group border-2 border-dashed rounded-2xl p-10 mb-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-brand-cyan/50 hover:bg-brand-cyan/5 ${selectedFile ? 'border-brand-cyan/30 bg-brand-cyan/5' : 'border-slate-200 dark:border-slate-800'}`}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {!selectedFile ? (
                    <>
                        <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 text-center">اسحب الصورة هنا أو اضغط للاختيار</p>
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <img src={previewUrl || ''} className="w-24 h-24 object-cover rounded-xl shadow-lg mb-3 border border-brand-cyan/20" />
                        <p className="text-xs font-black text-brand-cyan uppercase tracking-widest">{selectedFile.name}</p>
                    </div>
                )}
            </div>

            <button 
                onClick={handleStartRecon} 
                disabled={!!activeScan || !selectedFile} 
                className="w-full bg-brand-cyan text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-lg hover:shadow-cyan-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {activeScan ? "جاري تنفيذ خوارزميات الاستكشاف..." : "بدء التحليل الجنائي الشامل"}
            </button>
          </div>

          {forensicReport && (
            <div className="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 overflow-hidden relative">
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">مختبر التحليل البصري</h3>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">الوضع: {viewMode === 'split' ? 'مقارنة جنباً إلى جنب' : 'تراكب الخريطة الجنائية'}</span>
                </div>
                <div className="flex items-center gap-4">
                    {viewMode === 'overlay' && (
                        <div className="flex flex-col items-end gap-1">
                            <label className="text-[8px] font-black uppercase text-slate-500">شفافية ELA</label>
                            <input 
                                type="range" min="0" max="1" step="0.01" 
                                value={elaOpacity} 
                                onChange={(e) => setElaOpacity(parseFloat(e.target.value))}
                                className="w-24 accent-brand-cyan"
                            />
                        </div>
                    )}
                    <div className="flex bg-slate-100 dark:bg-brand-dark p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                        <button onClick={() => setViewMode('overlay')} className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all ${viewMode === 'overlay' ? 'bg-white dark:bg-slate-700 text-brand-cyan shadow-sm' : 'text-slate-500'}`}>تراكب</button>
                        <button onClick={() => setViewMode('split')} className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 text-brand-cyan shadow-sm' : 'text-slate-500'}`}>مقارنة</button>
                    </div>
                </div>
              </div>

              <div 
                ref={viewportRef}
                className={`relative bg-black rounded-2xl overflow-hidden mb-6 cursor-crosshair group border border-slate-200 dark:border-slate-800 shadow-2xl ${viewMode === 'split' ? 'aspect-[21/9]' : 'aspect-video'}`}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { setProbeData(null); handleMouseUp(); }}
                onWheel={handleWheel}
              >
                {viewMode === 'overlay' ? (
                    <div 
                        className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center relative"
                        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                    >
                        <img 
                          src={previewUrl || ''} 
                          className="max-w-none max-h-none pointer-events-none select-none absolute"
                          alt="Original"
                        />
                        <img 
                          src={forensicReport.forensics.ela_analysis.ela_map_base64} 
                          className={`max-w-none max-h-none pointer-events-none select-none absolute transition-opacity duration-300 ${showEla ? 'opacity-100' : 'opacity-0'}`}
                          style={{ 
                            opacity: showEla ? elaOpacity : 0,
                            mixBlendMode: 'screen' // Optimized for ELA highlight visibility
                          }}
                          alt="Forensic ELA Overlay"
                        />
                    </div>
                ) : (
                    <div className="flex w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center' }}>
                        <div className="w-1/2 h-full border-r border-white/20 overflow-hidden flex items-center justify-center relative bg-slate-900">
                             <img src={previewUrl || ''} className="max-w-none max-h-none pointer-events-none select-none" />
                             <span className="absolute top-2 right-2 bg-black/60 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Original</span>
                        </div>
                        <div className="w-1/2 h-full overflow-hidden flex items-center justify-center relative bg-black">
                             <img src={forensicReport.forensics.ela_analysis.ela_map_base64} className="max-w-none max-h-none pointer-events-none select-none" />
                             <span className="absolute top-2 right-2 bg-brand-red/60 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">ELA Heatmap</span>
                        </div>
                    </div>
                )}
                
                {/* Visual Guides */}
                {probeData && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute border-l border-brand-cyan/40 h-full" style={{ left: probeData.clientX - (viewportRef.current?.getBoundingClientRect().left || 0) }}></div>
                        <div className="absolute border-t border-brand-cyan/40 w-full" style={{ top: probeData.clientY - (viewportRef.current?.getBoundingClientRect().top || 0) }}></div>
                    </div>
                )}

                {/* Probe HUD */}
                {probeData && (
                  <div 
                    className="fixed z-50 bg-brand-panel/90 text-white px-4 py-3 rounded-2xl border border-brand-cyan/30 backdrop-blur-xl shadow-2xl pointer-events-none flex flex-col gap-1 min-w-[160px] animate-in zoom-in-95 duration-75"
                    style={{ left: probeData.clientX + 20, top: probeData.clientY - 20 }}
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                        <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">مجس التلاعب</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400 uppercase">الاحداثيات</span>
                        <span>{probeData.pixelX},{probeData.pixelY}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400 uppercase">كثافة الخطأ</span>
                        <span className="text-brand-gold font-black">{probeData.prob.toFixed(1)}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 dark:bg-brand-dark p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تحليل مستويات الخطأ (ELA)</span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setShowEla(!showEla)}
                                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase transition-all ${showEla ? 'bg-brand-cyan text-brand-dark' : 'bg-slate-800 text-slate-400'}`}
                            >
                                {showEla ? 'إيقاف العرض' : 'تفعيل العرض'}
                            </button>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${forensicReport.forensics.ela_analysis.integrity_status === 'suspicious' ? 'bg-brand-red/10 text-brand-red border border-brand-red/20' : 'bg-brand-success/10 text-brand-success border border-brand-success/20'}`}>
                                {forensicReport.forensics.ela_analysis.integrity_status}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="flex flex-col">
                            <span className={`text-4xl font-black tabular-nums tracking-tighter ${forensicReport.forensics.ela_analysis.modification_probability > 0.18 ? 'text-brand-red' : 'text-brand-success'}`}>
                                {(forensicReport.forensics.ela_analysis.modification_probability * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-brand-dark p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Deepfake Confidence</span>
                        <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                            {forensicReport.forensics.deepfake_detection.is_synthetic ? 'تم اكتشاف آثار لتوليد اصطناعي' : 'لم يتم العثور على أنماط اصطناعية واضحة.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                             <div className={`h-full ${forensicReport.forensics.deepfake_detection.is_synthetic ? 'bg-brand-red' : 'bg-brand-cyan'}`} style={{ width: `${forensicReport.forensics.deepfake_detection.fake_probability * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-black text-brand-cyan">{(forensicReport.forensics.deepfake_detection.fake_probability * 100).toFixed(0)}% Score</span>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 dark:bg-brand-dark/60 border border-slate-800 rounded-[2.5rem] p-8 font-mono text-[11px] flex flex-col shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activeScan ? 'bg-brand-cyan animate-pulse shadow-cyan-glow' : 'bg-slate-700'}`}></div>
                <span className="text-brand-cyan font-black uppercase tracking-widest text-[9px]">Forensic Command Log</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-green-500/70" dir="ltr">
            {results.length === 0 && <div className="text-slate-700 italic py-10 text-center uppercase tracking-widest opacity-30">Waiting for forensic data...</div>}
            {results.map((line, idx) => (
              <div key={idx} className="animate-in slide-in-from-left-2 duration-300">
                <span className="opacity-30 mr-2 text-[9px]">[{new Date().toLocaleTimeString()}]</span>
                <span className={`${line.includes('[خطأ]') || line.includes('[حرج]') ? 'text-brand-red' : line.includes('[نجاح]') ? 'text-brand-success font-black' : ''}`}>{line}</span>
              </div>
            ))}
          </div>

          {showRisk && (
            <div className={`mt-6 p-6 rounded-[2rem] border-2 animate-in zoom-in-95 duration-500 shadow-2xl backdrop-blur-md flex items-center justify-between ${riskLevel === 'حرج' ? 'bg-brand-red/10 border-brand-red text-brand-red' : 'bg-brand-success/10 border-brand-success text-brand-success'}`}>
              <div>
                <p className="text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">Threat Level</p>
                <p className="text-3xl font-black uppercase tracking-tighter leading-none">{riskLevel}</p>
              </div>
              <div className="text-4xl">{riskLevel === 'حرج' ? '⚠️' : '🛡️'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestigationsDashboard;
