
import React from 'react';
import { presentationSlides } from '../knowledgeBaseData';
import { Shield, BrainCircuit, Users, Lock, ChevronDown } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-20 animate-in fade-in">
      
      {/* Hero Section */}
      <div className="text-center py-10 border-b border-slate-200">
         <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
            <Shield className="text-white" size={40} />
         </div>
         <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">قاعدة المعرفة السيادية</h2>
         <p className="text-lg font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed">
            المنصة الأولى من نوعها للصحافة الاستقصائية اليمنية، المدعومة بذكاء اصطناعي محلي، آمن، ومتوافق مع الدستور.
         </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all text-center">
            <div className="w-14 h-14 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-cyan"><Lock size={28}/></div>
            <h3 className="font-black text-slate-900 mb-2">السيادة المطلقة</h3>
            <p className="text-sm text-slate-500 leading-relaxed">بياناتك لا تغادر اليمن. كافة عمليات المعالجة تتم على خوادم محلية مشفرة بتقنية AES-256.</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all text-center">
            <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-gold"><BrainCircuit size={28}/></div>
            <h3 className="font-black text-slate-900 mb-2">ذكاء يفهمنا</h3>
            <p className="text-sm text-slate-500 leading-relaxed">نماذج لغوية (LLMs) تم تدريبها خصيصاً لفهم اللهجات اليمنية والسياق السياسي والاجتماعي المعقد.</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all text-center">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-primary"><Users size={28}/></div>
            <h3 className="font-black text-slate-900 mb-2">للصحفيين فقط</h3>
            <p className="text-sm text-slate-500 leading-relaxed">أدوات تحقق جنائي، وتتبع OSINT، ومصادر مفتوحة محجوزة حصرياً للمحققين المعتمدين.</p>
         </div>
      </div>

      {/* Doctrine Slides (Flattened) */}
      <div className="space-y-8">
         <h3 className="text-2xl font-black text-slate-900 text-center uppercase tracking-widest mt-10">عقيدة المنصة</h3>
         
         <div className="grid grid-cols-1 gap-6">
            {presentationSlides.map((slide, index) => (
               <div key={slide.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] flex gap-6 hover:border-brand-primary/30 transition-all">
                  <div className="text-4xl shrink-0 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl">{slide.image_icon}</div>
                  <div>
                     <h4 className="text-lg font-black text-slate-800 mb-1">{slide.title}</h4>
                     {slide.subtitle && <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-3">{slide.subtitle}</p>}
                     <ul className="space-y-2">
                        {slide.points.map((p, i) => (
                           <li key={i} className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
                              {p}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden mt-10">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-primary/20 to-transparent"></div>
         <h3 className="text-3xl font-black mb-4 relative z-10">انضم إلى مجتمع الحقيقة</h3>
         <p className="text-slate-400 max-w-xl mx-auto mb-8 relative z-10">
            إذا كنت صحفياً أو باحثاً يمنياً، يمكنك طلب الانضمام الآن للحصول على وصول كامل لكافة الأدوات.
         </p>
         <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all relative z-10">
            تقديم طلب عضوية
         </button>
      </div>

    </div>
  );
};

export default KnowledgeBase;
