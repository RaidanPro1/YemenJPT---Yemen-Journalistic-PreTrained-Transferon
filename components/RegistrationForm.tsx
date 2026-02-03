
import React, { useState } from 'react';
import { Shield, Mail, Lock, Building, User, Github, Twitter, Chrome, ArrowRight, CheckCircle } from 'lucide-react';

interface RegistrationFormProps {
  onLoginSuccess: (role: 'journalist' | 'admin') => void;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onLoginSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', org: '', key: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Check
    setTimeout(() => {
        setLoading(false);
        if (formData.email.includes('admin') || formData.key === 'root') {
            onLoginSuccess('admin');
        } else {
            onLoginSuccess('journalist');
        }
    }, 1500);
  };

  return (
    <div className="h-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
       {/* Background Decoration */}
       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-3xl"></div>

       <div className="bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative z-10">
          
          {/* Left Side: Brand */}
          <div className="bg-slate-900 p-10 md:w-5/12 flex flex-col justify-between text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
             <div>
                <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                   <Shield size={24} />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">النواة السيادية</h2>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   منصة استخبارات صحفية مفتوحة المصدر، مصممة لحماية السردية الوطنية وتمكين الصحفيين بأدوات التحقق الجنائي.
                </p>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
                   <CheckCircle size={14} className="text-brand-success" />
                   <span>تشفير AES-256 محلي (Zero-Knowledge)</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
                   <CheckCircle size={14} className="text-brand-success" />
                   <span>أدوات OSINT مدمجة</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
                   <CheckCircle size={14} className="text-brand-success" />
                   <span>نماذج ذكاء اصطناعي تفهم اللهجات</span>
                </div>
             </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-10 md:w-7/12 flex flex-col justify-center">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800">{isLogin ? 'تسجيل الدخول' : 'طلب عضوية صحفية'}</h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><ArrowRight size={20} className="rotate-180"/></button>
             </div>

             <div className="flex gap-3 mb-8">
                <button className="flex-1 py-2.5 border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                   <Chrome size={18} className="text-slate-600" />
                </button>
                <button className="flex-1 py-2.5 border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                   <Twitter size={18} className="text-blue-400" />
                </button>
                <button className="flex-1 py-2.5 border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                   <Github size={18} className="text-slate-800" />
                </button>
             </div>

             <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">أو عبر البريد الرسمي</span></div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-500 uppercase">الاسم الكامل</label>
                         <div className="relative">
                            <User size={14} className="absolute right-3 top-3 text-slate-400" />
                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-9 pl-3 text-xs focus:border-brand-primary outline-none" required />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-500 uppercase">المؤسسة / الجهة</label>
                         <div className="relative">
                            <Building size={14} className="absolute right-3 top-3 text-slate-400" />
                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-9 pl-3 text-xs focus:border-brand-primary outline-none" required />
                         </div>
                      </div>
                   </div>
                )}

                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase">البريد الإلكتروني</label>
                   <div className="relative">
                      <Mail size={14} className="absolute right-3 top-3 text-slate-400" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-9 pl-3 text-xs focus:border-brand-primary outline-none" 
                        required 
                      />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase">كلمة المرور</label>
                   <div className="relative">
                      <Lock size={14} className="absolute right-3 top-3 text-slate-400" />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-9 pl-3 text-xs focus:border-brand-primary outline-none" 
                        required 
                      />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mt-4"
                >
                   {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isLogin ? 'الدخول للنواة' : 'إرسال طلب العضوية')}
                </button>
             </form>

             <div className="mt-6 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors">
                   {isLogin ? 'ليس لديك حساب؟ طلب عضوية جديدة' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default RegistrationForm;
