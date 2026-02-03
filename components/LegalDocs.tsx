
import React, { useState } from 'react';
import { Shield, Lock, Scale, Book, Globe, UserCheck } from 'lucide-react';

const LegalDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'sovereignty' | 'constitution'>('privacy');

  return (
    <div className="flex flex-col gap-8 h-full bg-brand-dark p-6">
      <div className="flex flex-col">
        <h2 className="text-4xl font-black text-white tracking-tighter leading-none flex items-center gap-3">
           <Scale className="text-brand-gold" size={32} /> بروتوكولات التشغيل السيادي
        </h2>
        <div className="flex gap-6 mt-8 border-b border-slate-800">
            {[
              { id: 'privacy', label: 'الخصوصية المطلقة', icon: <Lock size={14} /> },
              { id: 'sovereignty', label: 'السيادة الرقمية', icon: <Globe size={14} /> },
              { id: 'constitution', label: 'الامتثال الدستوري', icon: <Book size={14} /> }
            ].map(tab => (
              <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  {tab.icon} {tab.label}
              </button>
            ))}
        </div>
      </div>

      <div className="bg-brand-panel p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-y-auto custom-scrollbar flex-1 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-8 opacity-5">
           <Shield size={200} />
        </div>
        
        <div className="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-brand-cyan prose-p:text-slate-300 prose-p:leading-relaxed relative z-10" dir="rtl">
            {activeTab === 'privacy' ? (
                <div className="animate-in fade-in duration-500">
                    <h2 className="flex items-center gap-3">سياسة الخصوصية "الصفرية" (Zero-Knowledge)</h2>
                    <p>تم تصميم اليمن جي بي تي (YemenJPT) ليكون حصناً رقمياً للصحفيين والمحققين. فلسفتنا هي أن **"البيانات التي لا نملكها لا يمكننا الكشف عنها"**.</p>
                    
                    <h3>1. معالجة البيانات المحلية (Local-First)</h3>
                    <p>كافة عمليات الاستدعاء والتحليل اللغوي تتم داخل خوادمك السيادية. لا يتم إرسال نصوص تحقيقاتك أو ملفاتك الجنائية إلى أي خادم خارجي (مثل OpenAI أو Google) إلا إذا قمت بتفعيل "الوضع الهجين" يدوياً.</p>
                    
                    <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-6 rounded-2xl my-6">
                       <h4 className="text-brand-cyan mt-0">مبدأ السيادة على الأسرار:</h4>
                       <p className="mb-0 text-sm">نحن نستخدم تشفير AES-256 للبيانات المخزنة في "خزنة مسند" (Musnad Vault)، ويتم عزل الحاويات البرمجية لضمان عدم تسرب أي "بصمة رقمية" للمستخدم الميداني.</p>
                    </div>

                    <h3>2. بروتوكول حماية المصادر</h3>
                    <p>لا يقوم النظام بتسجيل عناوين الـ IP الخاصة بالمستخدمين في السجلات الدائمة. يتم حذف السجلات التشغيلية تلقائياً كل 24 ساعة لضمان أقصى درجات الأمان في مناطق النزاع.</p>
                </div>
            ) : activeTab === 'sovereignty' ? (
                <div className="animate-in fade-in duration-500">
                    <h2>إعلان السيادة الرقمية اليمنية</h2>
                    <p>تلتزم RaidanPro ببناء بنية تحتية للذكاء الاصطناعي لا تخضع للتحيز الثقافي أو الجغرافي الغربي.</p>
                    
                    <ul>
                        <li><strong>استقلال النماذج:</strong> نستخدم نماذج مفتوحة المصدر (Allam, Llama, Qwen) يتم استضافتها وتشغيلها محلياً لضمان عدم خضوع المحتوى للرقابة الدولية أو "الفلاتر" الثقافية غير المناسبة.</li>
                        <li><strong>توطين البيانات:</strong> يتم تخزين الأرشيف الوطني للانتهاكات في وحدات تخزين هجينة (S3 Hybrid) تحت سيطرة المؤسسة، مما يمنع "الحظر الرقمي" أو مسح المحتوى من قبل المنصات العالمية.</li>
                        <li><strong>الهوية اللغوية:</strong> تحسين محركات الذكاء لفهم اللهجات اليمنية (صنعاني، تعزي، عدني، حضرمي) لضمان دقة التوثيق الميداني.</li>
                    </ul>
                </div>
            ) : (
                <div className="animate-in fade-in duration-500">
                    <h2>مقياس القانون (Legal-Meter Protocol)</h2>
                    <p>يعمل نظام YemenJPT وفقاً لمرجعيات دستورية وطنية واضحة لضمان سلامة الطرح الصحفي والالتزام بالحقوق والحريات.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                       <div className="bg-black/40 p-6 rounded-2xl border border-slate-800">
                          <UserCheck className="text-brand-gold mb-4" />
                          <h4 className="mt-0 text-brand-gold">مرجعية الدستور</h4>
                          <p className="text-xs">يتم تقييم استجابات النظام والتقارير المولدة آلياً مقابل نصوص الدستور اليمني لضمان عدم انتهاك سيادة الدولة أو حقوق المواطنة.</p>
                       </div>
                       <div className="bg-black/40 p-6 rounded-2xl border border-slate-800">
                          <Shield className="text-brand-cyan mb-4" />
                          <h4 className="mt-0 text-brand-cyan">مخرجات الحوار الوطني</h4>
                          <p className="text-xs">تعتمد قاعدة بيانات "Legal-Meter" على مخرجات الحوار الوطني الشامل كمرجع أساسي في تحليل القضايا السياسية والاجتماعية المعقدة.</p>
                       </div>
                    </div>

                    <h3>آلية الفحص التلقائي:</h3>
                    <p>عند طلب توليد تقرير استراتيجي، يقوم محرك "Legal-Meter" بمقارنة المسودة مع أكثر من 500 مادة قانونية ودستورية مرقمة، ويصدر "مؤشر امتثال" يوضح مدى توافق النص مع القوانين الوطنية النافذة.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LegalDocs;
