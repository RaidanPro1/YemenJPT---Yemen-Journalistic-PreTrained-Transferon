
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, User, ShieldCheck, Paperclip, Copy, RotateCcw, ChevronDown, BrainCircuit, BookOpen, FileText, X, Bot, Lock, AlertTriangle, ExternalLink, Scale, EyeOff } from 'lucide-react';
import Tooltip from './Tooltip';

type Citation = {
  doc: string;
  text: string;
  page?: number;
};

type Message = { 
  id: number; 
  text: string; 
  sender: 'user' | 'ai' | 'system'; 
  timestamp: string; 
  model?: string;
  confidence?: 'high' | 'medium' | 'low';
  citations?: Citation[];
  isSensitive?: boolean;
};

interface ChatInterfaceProps {
  isPublic?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isPublic = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState({ id: 'allam:latest', name: 'AllamYe', icon: '🧠' });
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation[] | null>(null);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'allam:latest', name: 'AllamYe', icon: '🧠', desc: 'نموذج علام اليمني المطور' },
    { id: 'YemenJPT', name: 'YemenJPT', icon: '🛡️', desc: 'النواة السيادية (الدستور الأخلاقي)' },
    { id: 'yemenjpt-pro', name: 'YemenJPT Pro', icon: '⚖️', desc: 'التحليل المعمق والاستدلال' },
    { id: 'yemenjpt-flash', name: 'YemenJPT Flash', icon: '⚡', desc: 'السرعة والتلخيص اللحظي' },
  ];

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const onSend = async () => {
    if (!input.trim() || isLoading) return;
    const now = new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now(), text: input, sender: 'user', timestamp: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate Response with Ethical Checks
    setTimeout(() => {
        setIsLoading(false);
        const isSensitive = input.includes("انتخابات") || input.includes("حكومة") || input.includes("فساد");
        const isRAG = !isPublic && (Math.random() > 0.3 || isSensitive);
        
        let responseText = "";
        if (isPublic) {
            responseText = "هذه إجابة تجريبية من النموذج العام. يرجى تسجيل الدخول للحصول على تحليل معمق وموثق بالمصادر.";
        } else if (isSensitive) {
             responseText = "بناءً على بروتوكول النزاهة (Election Integrity)، تم حصر الإجابة في الحقائق الموثقة فقط. تشير البيانات السيادية إلى...";
        } else {
             responseText = "بناءً على الأرشيف السيادي، تشير الوثائق إلى أن...";
        }
        
        const citations = isRAG ? [
            { doc: "الدستور اليمني (المادة 42)", text: "تكفل الدولة حرية الفكر والإعراب عن الرأي...", page: 12 },
            { doc: "تقرير لجنة الانتخابات 2014", text: "إحصائيات التسجيل الانتخابي في المحافظات...", page: 5 }
        ] : [];

        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: responseText, 
            sender: 'ai', 
            model: selectedModel.name,
            timestamp: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
            confidence: isSensitive ? 'medium' : 'high',
            citations: citations,
            isSensitive: isSensitive
        }]);
    }, 1500);
  };

  const getConfidenceColor = (level?: string) => {
    switch(level) {
      case 'high': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  const getConfidenceLabel = (level?: string) => {
    switch(level) {
        case 'high': return 'موثوقية عالية';
        case 'medium': return 'متوسطة - تحقق';
        case 'low': return 'منخفضة - غير مؤكد';
        default: return 'غير محدد';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative font-cairo">
      
      {/* Top Model Selector Bar */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-brand-border bg-white/50 backdrop-blur z-30">
        <div className="relative">
           <Tooltip text={isPublic ? "متاح فقط للأعضاء المسجلين" : "تغيير المحرك الذكي"}>
             <button 
               onClick={() => !isPublic && setShowModelMenu(!showModelMenu)}
               className={`flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 ${isPublic ? 'opacity-70 cursor-not-allowed' : ''}`}
             >
                <span className="text-lg">{selectedModel.icon}</span>
                <div className="text-right">
                   <p className="text-xs font-black text-slate-800 leading-tight">{selectedModel.name}</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{isPublic ? 'Public Mode' : 'Active Sovereign Engine'}</p>
                </div>
                {!isPublic && <ChevronDown size={14} className={`text-slate-400 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />}
             </button>
           </Tooltip>

           {showModelMenu && !isPublic && (
             <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-brand-border rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                {models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m); setShowModelMenu(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right ${selectedModel.id === m.id ? 'bg-brand-primary/5 text-brand-primary' : 'hover:bg-slate-50'}`}
                  >
                     <span className="text-xl">{m.icon}</span>
                     <div>
                        <p className="text-xs font-black">{m.name}</p>
                        <p className="text-[9px] opacity-60 font-medium">{m.desc}</p>
                     </div>
                  </button>
                ))}
             </div>
           )}
        </div>

        <div className="flex items-center gap-4">
           {isPublic && (
               <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-2">
                  <Lock size={12} className="text-slate-400"/>
                  <span className="text-[9px] font-black text-slate-500 uppercase">تجربة محدودة</span>
               </div>
           )}
           <div className="px-3 py-1 bg-brand-primary/5 rounded-full border border-brand-primary/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="text-[9px] font-black text-brand-primary uppercase">Local & Encrypted</span>
           </div>
        </div>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-12 z-10">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center animate-fade">
               <div className="w-20 h-20 bg-brand-bg rounded-3xl flex items-center justify-center mb-8 border border-brand-border group transition-all hover:border-brand-primary/20">
                  <BrainCircuit className="text-brand-primary" size={32} />
               </div>
               <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">مرحباً بك في YemenJPT</h2>
               <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">
                 {isPublic 
                    ? "أنت في الوضع العام. يمكنك طرح أسئلة عامة، لكن أدوات التحقق والأرشيف السيادي متاحة فقط للصحفيين المسجلين." 
                    : `أنت متصل بمحرك ${selectedModel.name}. النظام يلتزم بالدستور الأخلاقي: مكافحة العنف، نزاهة الانتخابات، والسيادة الرقمية.`
                 }
               </p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex gap-6 items-start animate-fade ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-brand-border text-brand-primary shadow-sm'}`}>
                    {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                 </div>
                 
                 <div className="flex flex-col gap-2 max-w-[85%] group">
                    {msg.isSensitive && (
                        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-[10px] font-black mb-1 w-fit">
                            <AlertTriangle size={12} />
                            <span>موضوع حساس/سياسي: تم تفعيل وضع التدقيق الصارم (Strict Mode)</span>
                        </div>
                    )}
                    <div className={`relative p-5 rounded-2xl leading-relaxed text-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white shadow-soft' : 'bg-[#f0f2f5] text-slate-800'}`}>
                       <div className="whitespace-pre-wrap">{msg.text}</div>
                       
                       {msg.sender === 'ai' && !isPublic && (
                         <div className="absolute top-4 right-[-14px] h-[calc(100%-32px)] w-1 rounded-full bg-slate-200 overflow-hidden" title={`مستوى الثقة: ${getConfidenceLabel(msg.confidence)}`}>
                            <div className={`w-full h-full ${getConfidenceColor(msg.confidence)} opacity-80`}></div>
                         </div>
                       )}
                    </div>
                    
                    {msg.sender === 'ai' && !isPublic && (
                       <div className="flex items-center gap-2">
                            {msg.citations && msg.citations.length > 0 && (
                                <button 
                                    onClick={() => setActiveCitation(msg.citations || null)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm"
                                >
                                    <ShieldCheck size={12} /> المصادر المرجعية ({msg.citations.length})
                                </button>
                            )}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-400">
                                <span className={`w-1.5 h-1.5 rounded-full ${getConfidenceColor(msg.confidence)}`}></span>
                                {getConfidenceLabel(msg.confidence)}
                            </div>
                       </div>
                    )}

                    <div className={`flex items-center gap-4 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{msg.timestamp} {msg.model && `• ${msg.model}`}</span>
                       <div className="flex items-center gap-2">
                          <Tooltip text="نسخ النص"><button className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors rounded-lg hover:bg-slate-100"><Copy size={12} /></button></Tooltip>
                          <Tooltip text="إعادة التوليد"><button className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors rounded-lg hover:bg-slate-100"><RotateCcw size={12} /></button></Tooltip>
                       </div>
                    </div>
                 </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* RAG Verification Modal */}
      {activeCitation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setActiveCitation(null)}>
           <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-brand-primary" /> المصادر المرجعية (Citation Widget)
                 </h3>
                 <button onClick={() => setActiveCitation(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"><X size={18} className="text-slate-400" /></button>
              </div>
              <p className="text-[10px] text-slate-500 mb-4 font-medium">تم استناد الإجابة إلى الوثائق التالية من قاعدة المعرفة السيادية (Media Literacy Proof):</p>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                 {activeCitation.map((cite, i) => (
                   <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-primary/30 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-brand-primary uppercase flex items-center gap-1">
                            <FileText size={12} /> {cite.doc}
                         </span>
                         {cite.page && <span className="text-[9px] font-mono text-slate-400">صـ {cite.page}</span>}
                      </div>
                      <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-r-2 border-slate-200 pr-3">"{cite.text}"</p>
                      <button className="mt-3 text-[9px] text-brand-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ExternalLink size={10} /> فتح الوثيقة الأصلية
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Transparency & Liability Modal */}
      {showLiabilityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowLiabilityModal(false)}>
           <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl border border-brand-primary/20 relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-cyan"></div>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-primary border border-slate-100">
                    <Scale size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">الشفافية وإخلاء المسؤولية</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Transparency & Liability Protocol</p>
                 </div>
              </div>

              <div className="space-y-6 text-right">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                       <AlertTriangle size={16} className="text-brand-gold"/> حدود المسؤولية (Radical Clarity)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                       مخرجات الذكاء الاصطناعي في هذا النظام هي <strong>"أدوات مساعدة لاتخاذ القرار"</strong> وليست قرارات أو أحكاماً نهائية. يجب على المستخدم البشري (الصحفي/المحقق) مراجعة كافة النتائج والتحقق منها قبل النشر أو الاعتماد عليها في سياقات قانونية.
                    </p>
                 </div>

                 <div className="p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
                    <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                       <EyeOff size={16} className="text-brand-primary"/> ضمان الخصوصية (Privacy & Sovereignty)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                       نلتزم التزاماً صارماً بعدم مشاركة أي بيانات مدخلة أو مخرجة مع أي طرف ثالث. كافة عمليات المعالجة تتم محلياً، وتخضع لقوانين الخصوصية وحماية البيانات الشخصية النافذة في الجمهورية اليمنية.
                    </p>
                 </div>
              </div>

              <button onClick={() => setShowLiabilityModal(false)} className="mt-8 w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:bg-brand-primary transition-all text-xs uppercase tracking-widest">
                 فهمت والتزم بالبروتوكول
              </button>
           </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 pb-2 pt-2 z-20">
         <div className="max-w-3xl mx-auto">
            <div className={`bg-[#f0f2f5] rounded-3xl p-2 transition-all border border-transparent ${isPublic ? 'opacity-80' : 'focus-within:bg-white focus-within:shadow-2xl focus-within:ring-1 focus-within:ring-brand-primary/10 focus-within:border-brand-border'}`}>
               <textarea 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
                 placeholder={isPublic ? "اسأل سؤالاً عاماً..." : `تحدث مع ${selectedModel.name} (مدعوم بالميثاق الأخلاقي)...`}
                 className="w-full bg-transparent px-4 py-3 text-sm text-slate-800 outline-none resize-none h-14 min-h-[56px] custom-scrollbar"
               />
               
               <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-1">
                     <Tooltip text={isPublic ? "غير متاح للعامة" : "إرفاق ملف"}>
                        <button disabled={isPublic} className={`p-2 rounded-xl transition-all ${isPublic ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-brand-primary hover:bg-white'}`}><Paperclip size={18} /></button>
                     </Tooltip>
                     <Tooltip text={isPublic ? "غير متاح للعامة" : "تسجيل صوتي"}>
                        <button disabled={isPublic} className={`p-2 rounded-xl transition-all ${isPublic ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-brand-primary hover:bg-white'}`}><Mic size={18} /></button>
                     </Tooltip>
                  </div>
                  <button 
                    onClick={onSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2.5 bg-brand-primary text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
                  >
                     <Send size={18} className="rotate-180" />
                  </button>
               </div>
            </div>
            
            {/* Permanent Legal Notice Footer */}
            <div className="mt-3 flex justify-center">
               <button 
                 onClick={() => setShowLiabilityModal(true)}
                 className="flex items-center gap-2 text-[9px] text-slate-400 hover:text-brand-primary transition-colors py-1 px-3 rounded-full hover:bg-slate-50"
               >
                  <Scale size={10} />
                  <span className="font-bold">إخلاء مسؤولية سيادي: النتائج أدوات مساعدة للقرار وليست نهائية. البيانات لا تغادر الخادم.</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;
