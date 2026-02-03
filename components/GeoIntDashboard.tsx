
import React, { useState } from 'react';
import { Map, Satellite, Layers, Target, Clock, Filter, Plus, Radio, Shield, Zap, Search, Download, Navigation, AlertCircle, UserCheck, FileText, Send } from 'lucide-react';

const GeoIntDashboard: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'osm' | 'terrain' | 'satellite'>('osm');
  const [spectralFilter, setSpectralFilter] = useState('Standard');
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-dark p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-4">
            <Map className="text-brand-cyan w-8 h-8" /> اليمن مابس: الرصد الجيومكاني
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
            Sovereign Geospatial Awareness // Field Intelligence
          </p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setShowReportModal(true)}
            className="px-6 py-3 bg-brand-cyan text-brand-dark border border-brand-cyan rounded-xl text-[10px] font-black uppercase tracking-widest shadow-cyan-glow flex items-center gap-2 hover:scale-105 transition-all"
           >
              <Plus size={16} /> إضافة بلاغ ميداني مفصل
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        {/* Map Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-xs font-black text-brand-cyan uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Layers size={18} /> طبقات العرض والتحكم
              </h3>
              
              <div className="space-y-3">
                 {[
                   { id: 'osm', label: 'الخريطة السيادية (Offline)', icon: <Map size={14}/> },
                   { id: 'terrain', label: 'الممرات والتضاريس', icon: <Target size={14}/> },
                   { id: 'satellite', label: 'صور الأقمار (Sentinel-2)', icon: <Satellite size={14}/> }
                 ].map(layer => (
                   <button 
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as any)}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between group transition-all ${activeLayer === layer.id ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-inner' : 'bg-black/30 border-white/5 text-slate-500 hover:text-slate-300'}`}
                   >
                      <span className="text-[10px] font-black uppercase tracking-widest">{layer.label}</span>
                      {layer.icon}
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                 <Clock size={18} /> التسلسل الزمني للأحداث
              </h3>
              <div className="space-y-6">
                 <input type="range" className="w-full accent-brand-cyan h-1.5" />
              </div>
           </div>
        </div>

        {/* Map Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] flex-1 relative overflow-hidden group shadow-2xl min-h-[500px]">
              <div className="absolute inset-0 bg-[url('https://api.maptiler.com/maps/basic-v2-dark/256/{z}/{x}/{y}.png')] bg-cover opacity-30"></div>
           </div>
        </div>
      </div>

      {/* DETAILED FIELD REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowReportModal(false)}>
           <div className="bg-brand-panel border border-slate-800 w-full max-w-4xl rounded-[3rem] p-10 shadow-3xl flex flex-col gap-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div>
                    <h3 className="text-2xl font-black text-white">إرسال بلاغ استخباراتي ميداني</h3>
                    <p className="text-[10px] text-brand-cyan mt-1 uppercase tracking-widest font-black">Field Intelligence Network (FIN) Entry</p>
                 </div>
                 <button onClick={() => setShowReportModal(false)} className="text-slate-500 hover:text-white p-2 bg-white/5 rounded-full"><Send size={24} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Incident Details */}
                 <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع الحادثة / التصنيف</label>
                        <select className="w-full bg-black/40 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 outline-none">
                            <option>اشتباكات مسلحة / تحركات عسكرية</option>
                            <option>إمدادات ولوجستيات</option>
                            <option>كوارث طبيعية / مناخ</option>
                            <option>نشاط مشبوه / تضليل</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Navigation size={14} className="text-brand-cyan"/> الموقع الجغرافي الدقيق
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="خط العرض (Lat)" className="bg-black/40 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 outline-none focus:border-brand-cyan" />
                            <input type="text" placeholder="خط الطول (Lng)" className="bg-black/40 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 outline-none focus:border-brand-cyan" />
                        </div>
                        <button className="w-full mt-2 py-2 bg-white/5 text-[9px] font-black uppercase text-slate-500 rounded-lg hover:text-brand-cyan transition-all">تحديد موقعي الحالي تلقائياً</button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">وصف تفصيلي للبلاغ</label>
                        <textarea 
                            rows={4}
                            placeholder="صف ما حدث بدقة: التوقيت، الأطراف المشاركة، الأدوات المستخدمة..."
                            className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-brand-cyan"
                        ></textarea>
                    </div>
                 </div>

                 {/* Reliability & Urgency */}
                 <div className="space-y-6">
                    <div className="bg-black/40 p-6 rounded-[2.5rem] border border-slate-800 space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-2">
                                <UserCheck size={14}/> موثوقية المصدر (Source Rating)
                            </label>
                            <div className="flex gap-2">
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(r => (
                                    <button key={r} className="flex-1 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-black text-slate-500 hover:bg-brand-gold hover:text-brand-dark transition-all">{r}</button>
                                ))}
                            </div>
                            <p className="text-[8px] text-slate-500 italic">A: موثوق جداً، F: مصدر مجهول/غير مختبر.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-brand-red uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={14}/> درجة الإلحاح (Urgency Level)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Flash', 'Immediate', 'Routine'].map(u => (
                                    <button key={u} className="py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-slate-500 hover:border-brand-red transition-all">{u}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14}/> إرفاق أدلة بصرية (Media)
                        </label>
                        <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-brand-cyan transition-all cursor-pointer">
                            <p className="text-[10px] text-slate-500">اسحب الصور أو الفيديوهات هنا لربطها بالبلاغ الجغرافي</p>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-brand-cyan text-brand-dark font-black rounded-2xl shadow-cyan-glow uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                        <Shield size={18} /> إرسال البلاغ المشفر إلى غرفة العمليات
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GeoIntDashboard;
