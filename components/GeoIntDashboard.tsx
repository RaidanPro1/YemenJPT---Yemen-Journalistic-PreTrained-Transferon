
import React, { useState } from 'react';
import { 
  Map, Satellite, Layers, Target, Clock, Filter, Plus, 
  Radio, Shield, Zap, Search, Download, Navigation, 
  AlertCircle, UserCheck, FileText, Send, MapPin, 
  Crosshair, Activity, Eye, Globe
} from 'lucide-react';

const GeoIntDashboard: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'osm' | 'terrain' | 'satellite' | 'spectral'>('osm');
  const [showReportModal, setShowReportModal] = useState(false);
  const [timelineValue, setTimelineValue] = useState(100);

  const layersData = [
    { id: 'osm', label: 'الخريطة السيادية (أوفلاين)', icon: <Map size={14}/>, desc: 'بيانات OpenStreetMap مستضافة محلياً لعزل النشاط.' },
    { id: 'terrain', label: 'التضاريس والممرات الجبلية', icon: <Target size={14}/>, desc: 'تحليل الارتفاعات والمنافذ الميدانية الوعرة.' },
    { id: 'satellite', label: 'الأقمار الصناعية (Sentinel-2)', icon: <Satellite size={14}/>, desc: 'صور فضائية حديثة لرصد المتغيرات الميدانية.' },
    { id: 'spectral', label: 'التحليل الطيفي (NDVI)', icon: <Globe size={14}/>, desc: 'كشف الغطاء النباتي والمباني المنشأة حديثاً.' }
  ];

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-bg p-8 overflow-hidden font-cairo" dir="rtl">
      {/* Header Command Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic">
            <Map className="text-brand-primary w-8 h-8" /> محطة الاستقصاء الجغرافي السيادية
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
            <Activity size={12} className="text-brand-primary animate-pulse" /> Sovereign Geospatial Reconnaissance // Node-Map-YE
          </p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setShowReportModal(true)}
            className="px-8 py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
           >
              <Plus size={18} /> إضافة بلاغ استخباراتي ميداني
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Map Intelligence Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pl-2">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-soft">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Layers size={18} className="text-brand-primary" /> مصفوفة طبقات الرصد
              </h3>
              
              <div className="space-y-3">
                 {layersData.map(layer => (
                   <button 
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as any)}
                    className={`w-full p-5 rounded-2xl border text-right transition-all group ${activeLayer === layer.id ? 'bg-brand-primary/5 border-brand-primary shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-brand-primary/20'}`}
                   >
                      <div className="flex items-center justify-between mb-2">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${activeLayer === layer.id ? 'text-brand-primary' : 'text-slate-400'}`}>
                           {layer.label}
                         </span>
                         <div className={`${activeLayer === layer.id ? 'text-brand-primary' : 'text-slate-300'}`}>
                           {layer.icon}
                         </div>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold leading-relaxed">{layer.desc}</p>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-soft">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Clock size={18} className="text-brand-gold" /> المتغير الزمني (Time Machine)
                 </h3>
                 <span className="text-[10px] font-mono font-black text-brand-gold">{timelineValue}%</span>
              </div>
              <input 
                type="range" 
                min="1" max="100" 
                value={timelineValue}
                onChange={(e) => setTimelineValue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-gold cursor-pointer" 
              />
              <div className="flex justify-between mt-3 text-[8px] font-black text-slate-400 uppercase tracking-tighter italic">
                 <span>أرشيف 2015</span>
                 <span>المزامنة الحالية</span>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-1 bg-brand-primary animate-pulse"></div>
              <h3 className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-6 flex items-center gap-3">
                 <Radio size={16} className="text-brand-cyan" /> البلاغات النشطة بالمنطقة
              </h3>
              <div className="space-y-4">
                 {[
                   { loc: 'ميناء الصليف', type: 'تحركات بحرية', status: 'تحت التحقق', color: 'text-brand-gold' },
                   { loc: 'شمال صعدة', type: 'إشعاع حراري', status: 'مؤكد', color: 'text-brand-red' }
                 ].map((alert, i) => (
                   <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-cyan/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black text-white">{alert.loc}</span>
                         <span className={`text-[8px] font-black uppercase tracking-widest ${alert.color}`}>{alert.status}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-bold">{alert.type}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Map Viewport Area */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
           <div className="bg-white border border-slate-200 rounded-[3rem] flex-1 relative overflow-hidden group shadow-prof flex flex-col">
              {/* Map UI Overlays */}
              <div className="absolute top-8 left-8 z-30 flex flex-col gap-3">
                 <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-3">
                    <button className="p-3 bg-slate-50 hover:bg-brand-primary hover:text-white rounded-xl transition-all shadow-sm"><Crosshair size={18}/></button>
                    <button className="p-3 bg-slate-50 hover:bg-brand-primary hover:text-white rounded-xl transition-all shadow-sm"><Navigation size={18}/></button>
                 </div>
                 <div className="p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-3">
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-black text-brand-cyan uppercase mb-1">Scale</span>
                       <span className="text-[10px] font-mono text-white">1:25k</span>
                    </div>
                 </div>
              </div>

              {/* Coordinates Indicator */}
              <div className="absolute bottom-8 right-8 z-30 px-6 py-3 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إحداثيات المؤشر</span>
                 </div>
                 <div className="flex gap-4 font-mono text-xs text-white italic">
                    <span>LAT: 15.3524</span>
                    <span className="text-white/20">|</span>
                    <span>LNG: 44.2075</span>
                 </div>
              </div>

              {/* Map Content Simulation */}
              <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                 <div className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${activeLayer === 'satellite' ? 'brightness-110 saturate-125' : 'grayscale opacity-40'}`} style={{backgroundImage: "url('https://api.maptiler.com/maps/basic-v2-dark/256/{z}/{x}/{y}.png')"}}></div>
                 
                 {/* Visual Markers Simulation */}
                 <div className="relative z-10 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       <div className="w-16 h-16 border-2 border-brand-cyan rounded-full animate-ping opacity-30"></div>
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <MapPin size={32} className="text-brand-red fill-brand-red" />
                       </div>
                    </div>
                 </div>

                 {activeLayer === 'spectral' && (
                    <div className="absolute inset-0 bg-green-500/20 mix-blend-multiply pointer-events-none"></div>
                 )}
              </div>

              {/* Search Bar on Map */}
              <div className="absolute top-8 right-8 z-30 w-72">
                 <div className="relative group">
                    <Search className="absolute right-4 top-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="ابحث عن إحداثيات أو مدينة..." 
                      className="w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl py-4 pr-12 pl-6 text-xs font-bold shadow-xl outline-none focus:border-brand-primary transition-all"
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* DETAILED FIELD REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowReportModal(false)}>
           <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-[3.5rem] p-12 shadow-3xl flex flex-col gap-10 max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-primary rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                       <Send size={28} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter">إرسال بلاغ استخباراتي ميداني</h3>
                       <p className="text-[10px] text-brand-primary mt-1 uppercase tracking-[0.4em] font-black italic">Field Intelligence Network (FIN) Protocol</p>
                    </div>
                 </div>
                 <button onClick={() => setShowReportModal(false)} className="text-slate-300 hover:text-brand-red p-3 bg-slate-50 rounded-full transition-all"><Plus size={28} className="rotate-45" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {/* Incident Details */}
                 <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع الحادثة / التصنيف الميداني</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-800 outline-none focus:border-brand-primary appearance-none transition-all">
                            <option>اشتباكات مسلحة / تحركات عسكرية</option>
                            <option>إمدادات ولوجستيات واشتباه تهريب</option>
                            <option>تغيير في البنية التحتية / مباني مستحدثة</option>
                            <option>نشاط مشبوه / حملات تضليل جغرافية</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Navigation size={14} className="text-brand-primary"/> الموقع الجغرافي الدقيق
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="خط العرض (Lat)" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-800 focus:border-brand-primary outline-none transition-all" />
                            <input type="text" placeholder="خط الطول (Lng)" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-800 focus:border-brand-primary outline-none transition-all" />
                        </div>
                        <button className="w-full mt-2 py-3 bg-brand-primary/5 text-[9px] font-black uppercase text-brand-primary rounded-xl border border-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all">تحديد موقعي الحالي تلقائياً</button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">وصف تفصيلي للبلاغ (المعاينة البصرية)</label>
                        <textarea 
                            rows={4}
                            placeholder="صف ما حدث بدقة: التوقيت، الأطراف المشاركة، الأدوات المستخدمة..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all leading-relaxed"
                        ></textarea>
                    </div>
                 </div>

                 {/* Reliability & Urgency */}
                 <div className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-2">
                                <UserCheck size={16}/> تقييم موثوقية المصدر (Source Rating)
                            </label>
                            <div className="flex gap-2">
                                {['A', 'B', 'C', 'D', 'E'].map(r => (
                                    <button key={r} className="flex-1 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-400 hover:bg-brand-gold hover:text-white transition-all shadow-sm">{r}</button>
                                ))}
                            </div>
                            <p className="text-[8px] text-slate-400 italic font-bold">A: موثوق جداً (عين الميدان)، E: مصدر مجهول تماماً.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-brand-red uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={16}/> درجة الإلحاح (Urgency Level)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Flash', 'Immediate', 'Routine'].map(u => (
                                    <button key={u} className="py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 hover:border-brand-red hover:text-brand-red transition-all shadow-sm">{u}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={16} className="text-brand-primary"/> إرفاق أدلة بصرية (Media)
                        </label>
                        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center hover:border-brand-primary transition-all cursor-pointer group bg-slate-50/50">
                            <Plus size={32} className="mx-auto text-slate-300 mb-4 group-hover:text-brand-primary group-hover:scale-125 transition-all" />
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">اسحب الصور أو الفيديوهات لربطها بالبلاغ الجغرافي</p>
                        </div>
                    </div>

                    <button className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl hover:bg-brand-primary transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3">
                        <Shield size={20} className="text-brand-gold fill-brand-gold" /> إرسال البلاغ المشفر إلى العقدة المركزية
                    </button>
                 </div>
              </div>

              <div className="p-6 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10 flex items-start gap-4">
                 <Shield className="text-brand-primary shrink-0" size={24} />
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                    ملاحظة سيادية: سيتم تشفير إحداثيات موقعك الحالي قبل الإرسال. البلاغ سيخضع لمطابقة آلية مع صور الأقمار الصناعية (Sentinel-2) للتأكد من صحة التغييرات الميدانية المذكورة.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GeoIntDashboard;
