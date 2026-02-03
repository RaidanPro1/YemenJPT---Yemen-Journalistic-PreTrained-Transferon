
import React, { useState } from 'react';
import { 
  CreditCard, 
  Landmark, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  FileText, 
  Network, 
  BarChart3, 
  Plus, 
  DollarSign, 
  Users, 
  Globe, 
  ShieldCheck, 
  X, 
  Save,
  Link,
  ChevronRight
} from 'lucide-react';

const FinanceDashboard: React.FC = () => {
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [riskLevel, setRiskLevel] = useState('Low');

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-dark p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter leading-none flex items-center gap-4">
            <Landmark className="text-brand-gold w-10 h-10" /> تتبع الأموال والشركات (The Ledger)
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] mt-3 flex items-center gap-3">
            <span className="w-10 h-0.5 bg-brand-gold/40"></span>
            Financial Investigation & Corporate Tracking Unit
          </p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setShowNewEntryModal(true)}
            className="px-8 py-4 bg-brand-gold text-brand-dark font-black rounded-2xl shadow-gold-glow hover:scale-[1.02] transition-all uppercase tracking-widest text-xs flex items-center gap-3"
           >
              <Plus size={18} /> إدراج قيد مالي جديد
           </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'إجمالي الشركات المرصودة', value: '1,482', icon: <Landmark className="text-brand-cyan" />, change: '+4% MoM', color: 'brand-cyan' },
           { label: 'حوالات مشبوهة نشطة', value: '24', icon: <AlertCircle className="text-brand-red animate-pulse" />, change: 'High Alert', color: 'brand-red' },
           { label: 'سجل الملاك المستفيدين', value: '890', icon: <Users className="text-brand-gold" />, change: 'Verified', color: 'brand-gold' },
           { label: 'سعر الصرف التقديري', value: '1,642', icon: <TrendingUp className="text-brand-success" />, change: 'SND Rate', color: 'brand-success' }
         ].map(stat => (
           <div key={stat.label} className="bg-brand-panel border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-brand-gold/10 to-transparent"></div>
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 group-hover:border-brand-gold/30 transition-all">{stat.icon}</div>
                 <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white/5 text-slate-500`}>{stat.change}</span>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
         {/* Main Analysis Area */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-brand-panel border border-slate-800 rounded-[3rem] p-10 shadow-2xl flex-1 flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Network size={280} />
               </div>
               
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                       <Network className="text-brand-cyan" size={24} /> محرك الروابط السببية والشركات الواجهة
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Beneficial Ownership & Front Company Mapping</p>
                  </div>
                  <div className="flex gap-3">
                     <button className="p-3 bg-black/60 rounded-xl text-slate-400 border border-slate-800 hover:text-brand-cyan transition-all"><BarChart3 size={18} /></button>
                     <button className="p-3 bg-black/60 rounded-xl text-slate-400 border border-slate-800 hover:text-brand-cyan transition-all"><Search size={18} /></button>
                  </div>
               </div>
               
               <div className="flex-1 bg-brand-dark/50 border border-slate-800/50 rounded-[2rem] relative overflow-hidden flex items-center justify-center group/map">
                  <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(var(--tw-brand-gold) 1.5px, transparent 1.5px)', backgroundSize: '50px 50px'}}></div>
                  <div className="text-center relative z-10">
                     <div className="w-24 h-24 bg-brand-gold/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-gold/10 group-hover/map:scale-110 transition-transform">
                        <Network size={48} className="text-brand-gold/30" />
                     </div>
                     <p className="text-brand-gold text-xs font-black uppercase tracking-[0.3em]">جاري رسم شبكة العلاقات المالية...</p>
                     <p className="text-[9px] text-slate-600 mt-2 italic font-mono uppercase tracking-widest">Compiling Transactional Clusters</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Alerts & Tasks */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <FileText className="text-brand-gold" size={16} /> أحدث التقارير الاستقصائية
               </h3>
               <div className="space-y-4">
                  {[
                    { title: "تهريب مشتقات نفطية عبر وسيط إقليمي", date: "2024-05-18", risk: "Critical" },
                    { title: "تحديث سجل الموردين لموانئ الساحل الغربي", date: "2024-05-15", risk: "Medium" },
                    { title: "تحليل تذبذب السيولة في المصارف المحلية", date: "2024-05-12", risk: "Low" }
                  ].map((rep, i) => (
                    <div key={i} className="group p-5 bg-black/20 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer relative overflow-hidden">
                       <div className="flex justify-between items-start mb-3 relative z-10">
                          <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${rep.risk === 'Critical' ? 'bg-brand-red/10 text-brand-red border border-brand-red/20' : 'bg-slate-800 text-slate-500'}`}>{rep.risk}</span>
                          <span className="text-[9px] font-mono text-slate-600 font-bold">{rep.date}</span>
                       </div>
                       <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors relative z-10 flex items-center gap-2">
                          <ChevronRight size={14} className="text-brand-gold" /> {rep.title}
                       </p>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-xl hover:text-brand-gold transition-all">فتح السجل المالي الكامل</button>
            </div>

            <div className="bg-gradient-to-br from-brand-panel to-brand-dark border border-brand-cyan/20 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-brand-cyan shadow-cyan-glow"></div>
               <h3 className="text-xs font-black text-brand-cyan uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                  <ShieldCheck size={20} /> أتمتة الفحص المالي (Audit)
               </h3>
               <p className="text-[11px] text-slate-400 leading-relaxed mb-8">قم برفع كشوفات الحسابات البنكية (CSV/PDF) لتحليل الأنماط المتكررة والكشف عن غسيل الأموال تلقائياً عبر محرك "منصت المالي".</p>
               <button className="w-full py-5 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-brand-cyan hover:text-brand-dark transition-all flex items-center justify-center gap-3">
                  <FileText size={16} /> رفع بيانات الفحص الرقمي
               </button>
            </div>
         </div>
      </div>

      {/* DETAILED FINANCE ENTRY MODAL */}
      {showNewEntryModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowNewEntryModal(false)}>
           <div className="bg-brand-panel border border-brand-gold/20 w-full max-w-5xl rounded-[4rem] p-12 shadow-3xl flex flex-col gap-10 max-h-[95vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
              
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-gold/10 rounded-[2rem] flex items-center justify-center text-brand-gold border border-brand-gold/20">
                       <DollarSign size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white tracking-tighter">إدراج قيد استخباراتي مالي جديد</h3>
                       <p className="text-[10px] text-brand-gold mt-1 uppercase tracking-[0.4em] font-black italic">Financial Intelligence & Asset Tracking Protocol</p>
                    </div>
                 </div>
                 <button onClick={() => setShowNewEntryModal(false)} className="text-slate-500 hover:text-brand-red p-3 bg-white/5 rounded-full transition-all"><X size={28} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 {/* Left: Core Entity Details */}
                 <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Users size={14} className="text-brand-gold" /> اسم الجهة / الشركة المستهدفة
                        </label>
                        <input type="text" placeholder="مثلاً: شركة الاستيراد الوطنية المحدودة..." className="w-full bg-black/40 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 focus:border-brand-gold outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع القيد المالي</label>
                           <select className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 outline-none focus:border-brand-gold">
                               <option>تسجيل شركة جديدة</option>
                               <option>حوالة بنكية خارجية</option>
                               <option>عقد توريد حكومي</option>
                               <option>شحنة تجارية عابرة</option>
                               <option>تحويل أصول عقارية</option>
                           </select>
                       </div>
                       <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">القيمة المالية التقديرية</label>
                           <div className="relative">
                              <input type="number" placeholder="0.00" className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 pl-12 text-xs text-slate-300 outline-none focus:border-brand-gold" />
                              <DollarSign size={16} className="absolute left-4 top-4 text-slate-500" />
                           </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Globe size={14} className="text-brand-cyan" /> المالك المستفيد (Beneficial Owner)
                        </label>
                        <input type="text" placeholder="الاسم الكامل أو الكيان المتحكم النهائي..." className="w-full bg-black/40 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 focus:border-brand-cyan outline-none transition-all" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ملاحظات ونتائج التحقيق الأولي</label>
                        <textarea 
                            rows={4}
                            placeholder="وثق تفاصيل الشبهة المالية، المسارات، والجهات الوسيطة المتورطة..."
                            className="w-full bg-black/40 border border-slate-800 rounded-3xl p-6 text-sm text-slate-200 outline-none focus:border-brand-gold transition-all"
                        ></textarea>
                    </div>
                 </div>

                 {/* Right: Risk & Network Mapping */}
                 <div className="space-y-8">
                    <div className="bg-brand-dark/40 p-8 rounded-[3rem] border border-slate-800 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-brand-red uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={14} /> تقييم مخاطر العملية (Risk Rating)
                            </label>
                            <div className="flex gap-2">
                                {['Low', 'Medium', 'High', 'Critical'].map(r => (
                                    <button 
                                      key={r} 
                                      onClick={() => setRiskLevel(r)}
                                      className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase border transition-all ${riskLevel === r ? 'bg-brand-red text-white border-brand-red shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-brand-red/30'}`}
                                    >
                                       {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                                <Link size={14} /> الكيانات المرتبطة (Network Nodes)
                            </label>
                            <textarea 
                                rows={3}
                                placeholder="أدخل أسماء الشركات أو الأفراد المرتبطين بهذا القيد (افصل بينهم بفاصلة)..."
                                className="w-full bg-black/20 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 outline-none focus:border-brand-cyan"
                            ></textarea>
                            <p className="text-[8px] text-slate-600 italic">سيقوم النظام برسم الروابط في خريطة "The Ledger" تلقائياً.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <FileText size={14} /> الوثائق الثبوتية (Evidence)
                        </label>
                        <div className="border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center hover:border-brand-gold transition-all cursor-pointer group/upload">
                            <Plus size={32} className="mx-auto text-slate-700 mb-4 group-hover/upload:text-brand-gold group-hover/upload:scale-125 transition-all" />
                            <p className="text-[10px] text-slate-500 uppercase font-black">اسحب كشوفات الحسابات أو صور العقود هنا</p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button className="flex-1 py-5 bg-brand-gold text-brand-dark font-black rounded-3xl shadow-gold-glow uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                          <Save size={18} /> حفظ وتوثيق في "اللدجر"
                       </button>
                    </div>
                 </div>
              </div>
              
              <div className="bg-brand-gold/5 border border-brand-gold/20 p-6 rounded-[2rem] flex items-start gap-4">
                 <ShieldCheck size={24} className="text-brand-gold shrink-0" />
                 <div>
                    <p className="text-[11px] font-black text-brand-gold uppercase">ضمان الخصوصية المالية</p>
                    <p className="text-[10px] text-slate-500 italic leading-relaxed">تخضع كافة المدخلات المالية لتشفير AES-256 وتُخزن في "خزنة مسند" السيادية. لن يتم مشاركة هذه البيانات مع أي أطراف خارجية أو نماذج ذكاء اصطناعي غير محلية.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
