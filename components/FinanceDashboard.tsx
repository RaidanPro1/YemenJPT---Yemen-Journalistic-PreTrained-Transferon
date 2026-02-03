
import React from 'react';
import { CreditCard, Landmark, TrendingUp, AlertCircle, Search, FileText, Network, BarChart3 } from 'lucide-react';

const FinanceDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-white tracking-tight">تتبع الأموال والشركات (The Ledger)</h2>
        <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mt-2">تحليل الشبكات المالية والتدفقات العابرة للحدود</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'إجمالي الشركات المرصودة', value: '1,482', icon: <Landmark className="text-brand-cyan" />, change: '+4% MoM' },
           { label: 'حوالات مشبوهة', value: '24', icon: <AlertCircle className="text-brand-red" />, change: 'High Alert' },
           { label: 'سجل الملاك المستفيدين', value: '890', icon: <FileText className="text-brand-gold" />, change: 'Verified' },
           { label: 'تغير سعر الصرف (SND)', value: '1,642', icon: <TrendingUp className="text-brand-success" />, change: '-1.2%' }
         ].map(stat => (
           <div key={stat.label} className="bg-brand-panel border border-slate-800 p-6 rounded-[2rem] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">{stat.icon}</div>
                 <span className="text-[9px] font-black text-slate-500 uppercase">{stat.change}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white tracking-tighter">{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-0">
         <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex-1 flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Network className="text-brand-cyan" size={16} /> خارطة العلاقات والشركات الواجهة
                  </h3>
                  <div className="flex gap-2">
                     <button className="p-2 bg-black/40 rounded-lg text-slate-400 border border-slate-800 hover:text-white"><BarChart3 size={14} /></button>
                     <button className="p-2 bg-black/40 rounded-lg text-slate-400 border border-slate-800 hover:text-white"><Search size={14} /></button>
                  </div>
               </div>
               
               <div className="flex-1 bg-black/40 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(var(--tw-brand-gold) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                  <div className="text-center animate-pulse">
                     <Network size={64} className="text-brand-gold/20 mx-auto mb-4" />
                     <p className="text-brand-gold text-[10px] font-black uppercase tracking-widest">تحميل محرك الروابط السببية المالية...</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex flex-col gap-6">
            <div className="bg-brand-panel border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">آخر التقارير المالية</h3>
               <div className="space-y-4">
                  {[
                    { title: "تهريب مشتقات نفطية عبر وسيط إقليمي", date: "2024-05-18", risk: "Critical" },
                    { title: "تحديث سجل الموردين لموانئ الساحل الغربي", date: "2024-05-15", risk: "Medium" },
                    { title: "تحليل تذبذب السيولة في المصارف المحلية", date: "2024-05-12", risk: "Low" }
                  ].map((rep, i) => (
                    <div key={i} className="group p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${rep.risk === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-slate-700 text-slate-400'}`}>{rep.risk}</span>
                          <span className="text-[8px] font-mono text-slate-500">{rep.date}</span>
                       </div>
                       <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{rep.title}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-brand-panel to-brand-dark border border-brand-cyan/20 p-8 rounded-[2.5rem] shadow-xl">
               <h3 className="text-xs font-black text-brand-cyan uppercase tracking-widest mb-4">أتمتة الفحص المالي</h3>
               <p className="text-[10px] text-slate-500 leading-relaxed mb-6">قم برفع كشوفات الحسابات البنكية (CSV/PDF) لتحليل الأنماط المتكررة والكشف عن غسيل الأموال تلقائياً.</p>
               <button className="w-full py-4 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-brand-cyan hover:text-brand-dark transition-all">ارفع بيانات الفحص</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
