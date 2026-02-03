
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, Cpu, Bot, User, ShieldCheck, Paperclip, MoreHorizontal, Copy, RotateCcw, ChevronDown, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

type Message = { id: number; text: string; sender: 'user' | 'ai' | 'system'; timestamp: string; model?: string };

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState({ id: 'yemenjpt-pro', name: 'YemenJPT Pro', icon: '🧠' });
  const [showModelMenu, setShowModelMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'yemenjpt-pro', name: 'YemenJPT Pro', icon: '🧠', desc: 'التحليل المعمق والاستدلال' },
    { id: 'yemenjpt-flash', name: 'YemenJPT Flash', icon: '⚡', desc: 'السرعة والتلخيص اللحظي' },
    { id: 'yemenjpt-vision', name: 'YemenJPT Vision', icon: '👁️', desc: 'تحليل الصور والوسائط' },
    { id: 'yemenjpt-map', name: 'YemenJPT Map', icon: '🗺️', desc: 'البيانات الجغرافية' },
  ];

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const onSend = async () => {
    if (!input.trim() || isLoading) return;
    const now = new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now(), text: input, sender: 'user', timestamp: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: { systemInstruction: `أنت ${selectedModel.name}، ذكاء اصطناعي سيادي متخصص للصحفيين اليمنيين. قدم المعلومات بدقة جنائية وهدوء احترافي.` }
      });
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: response.text || "حدث خطأ فني.", 
        sender: 'ai', 
        model: selectedModel.name,
        timestamp: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "فشل الاتصال بالنواة السيادية.", sender: 'system', timestamp: now }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative font-cairo">
      
      {/* Top Model Selector Bar */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-brand-border bg-white/50 backdrop-blur z-30">
        <div className="relative">
           <button 
             onClick={() => setShowModelMenu(!showModelMenu)}
             className="flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100"
           >
              <span className="text-lg">{selectedModel.icon}</span>
              <div className="text-right">
                 <p className="text-xs font-black text-slate-800 leading-tight">{selectedModel.name}</p>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Active Engine</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
           </button>

           {showModelMenu && (
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
           <div className="px-3 py-1 bg-brand-primary/5 rounded-full border border-brand-primary/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="text-[9px] font-black text-brand-primary uppercase">Encrypted</span>
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
                 أنت متصل بمحرك <span className="text-brand-primary font-bold">{selectedModel.name}</span>. اسأل عن أي وثيقة أو اطلب تحليل بيانات استقصائية.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-12 w-full max-w-xl">
                  {[
                    "لخص مخرجات الحوار الوطني", "رصد تحركات السفن في الحديدة",
                    "تحليل صورة مشبوهة جنائياً", "كشف تلاعب في فيديو ميداني"
                  ].map(q => (
                    <button key={q} onClick={() => setInput(q)} className="p-4 bg-white rounded-2xl border border-brand-border hover:border-brand-primary/30 text-right group transition-all text-xs font-bold text-slate-600 hover:text-brand-primary">
                       {q}
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex gap-6 items-start animate-fade ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-brand-border text-brand-primary shadow-sm'}`}>
                    {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                 </div>
                 
                 <div className="flex flex-col gap-2 max-w-[85%] group">
                    <div className={`p-5 rounded-2xl leading-relaxed text-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white shadow-soft' : 'bg-[#f0f2f5] text-slate-800'}`}>
                       <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    
                    <div className={`flex items-center gap-4 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{msg.timestamp} {msg.model && `• ${msg.model}`}</span>
                       <div className="flex items-center gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors rounded-lg hover:bg-slate-100"><Copy size={12} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors rounded-lg hover:bg-slate-100"><RotateCcw size={12} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors rounded-lg hover:bg-slate-100"><MoreHorizontal size={12} /></button>
                       </div>
                    </div>
                 </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 pb-8 pt-2 z-20">
         <div className="max-w-3xl mx-auto">
            <div className="bg-[#f0f2f5] rounded-3xl p-2 focus-within:bg-white focus-within:shadow-2xl focus-within:ring-1 focus-within:ring-brand-primary/10 transition-all border border-transparent focus-within:border-brand-border">
               <textarea 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
                 placeholder={`تحدث مع ${selectedModel.name}...`}
                 className="w-full bg-transparent px-4 py-3 text-sm text-slate-800 outline-none resize-none h-14 min-h-[56px] custom-scrollbar"
               />
               
               <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-1">
                     <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-xl transition-all"><Paperclip size={18} /></button>
                     <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-xl transition-all"><Mic size={18} /></button>
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
            <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest italic">YemenJPT Sovereignty Node • Local & Encrypted</p>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;
