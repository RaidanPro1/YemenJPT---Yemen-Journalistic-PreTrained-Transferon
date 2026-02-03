
import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'system';
  tool_used?: string;
  tool_output?: any;
  model?: string;
};

const DEFAULT_MODEL_ID = 'allam:latest';

const LOCAL_MODELS = [
  { id: 'allam:latest', name: 'نواة ALLAM', icon: '🇸🇦', task: 'ذكاء عربي متقدم', color: 'border-brand-success' },
  { id: 'llama3:8b', name: 'Llama 3 Pro', icon: '🦙', task: 'الاستدلال المنطقي', color: 'border-brand-gold' },
  { id: 'mistral:latest', name: 'Mistral Fast', icon: '🌪️', task: 'التلخيص والتقارير', color: 'border-brand-cyan' },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [systemStatus, setSystemStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setSystemStatus("جاري التفكير...");

    try {
      const response = await fetch('/api/ai/agent_chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, model_name: selectedModel })
      });
      const data = await response.json();
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai',
        model: data.model_used || selectedModel,
        tool_used: data.tool_used,
        tool_output: data.tool_output
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now(), text: "خطأ في الاتصال بالنواة السيادية.", sender: 'system' }]);
    } finally {
      setIsLoading(false);
      setSystemStatus(null);
    }
  };

  const activeModelData = LOCAL_MODELS.find(m => m.id === selectedModel);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-brand-dark transition-colors duration-500 overflow-hidden">
      <div className="px-8 py-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between glass-panel z-20 sticky top-0">
          <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-cyber animate-pulse"></div>
              <div>
                <h1 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.25em]">محطة التحكم في الذكاء السيادي</h1>
                <p className="text-[9px] font-bold text-brand-cyan/80 mt-0.5">النموذج النشط: <span className="text-brand-cyan">{activeModelData?.name}</span></p>
              </div>
          </div>
          <div className="flex gap-2 bg-slate-100 dark:bg-black/30 p-1 rounded-2xl border border-slate-200 dark:border-slate-800/50">
              {LOCAL_MODELS.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${selectedModel === m.id ? 'bg-brand-cyan text-white shadow-cyber' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {m.icon} {m.name}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-transparent">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-3xl flex items-center justify-center shadow-cyber-bold mb-10 text-4xl">🇾🇪</div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-50 tracking-tighter">مرحباً بك في غرفة العمليات الذكية</h2>
                <p className="text-sm text-slate-500 mt-4 max-w-lg mx-auto leading-relaxed">أنا مساعدك الذكي المعتمد على نواة ALLAM السيادية. كيف يمكنني مساعدتك في تحقيقاتك اليوم؟</p>
                <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-2xl px-4">
                    {[
                      { t: "ابحث عن الحسابات المرتبطة بـ @اسم_المستخدم", i: "🕵️" },
                      { t: "لخص لي آخر التقارير من الأرشيف السيادي", i: "📄" },
                      { t: "حلل التغيرات في خريطة مأرب خلال الشهر الماضي", i: "🗺️" },
                      { t: "ترجم هذا الملف إلى اللهجة الصنعانية", i: "🎤" }
                    ].map((btn, idx) => (
                      <button key={idx} onClick={() => handleSendMessage(btn.t)} className="p-5 bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800/80 rounded-3xl text-right hover:border-brand-cyan transition-all flex items-center justify-between group shadow-sm">
                        <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">{btn.t}</span>
                        <span className="text-xl opacity-20 group-hover:opacity-100">{btn.i}</span>
                      </button>
                    ))}
                </div>
            </div>
          ) : (
            <div className="space-y-8 pb-10">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-4 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                       <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-white shadow-lg ${msg.sender === 'user' ? 'bg-slate-400' : 'bg-brand-cyan'}`}>
                          {msg.sender === 'user' ? 'أنت' : 'ي'}
                       </div>
                       <div className={`p-6 rounded-[2rem] max-w-[85%] border shadow-md ${msg.sender === 'user' ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-white dark:bg-brand-panel text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                          <p className="text-[14px] leading-[1.8] font-medium whitespace-pre-wrap">{msg.text}</p>
                          {msg.tool_used && (
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] font-black text-brand-cyan uppercase">تم استخدام أداة: {msg.tool_used}</span>
                            </div>
                          )}
                       </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 border-t border-slate-200 dark:border-slate-800/80 glass-panel">
        <div className="max-w-4xl mx-auto">
            {systemStatus && <div className="text-[10px] font-black text-brand-cyan mb-2 animate-pulse">{systemStatus}</div>}
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    placeholder={`اسأل ${activeModelData?.name}...`}
                    className="w-full bg-slate-100 dark:bg-brand-dark rounded-[2rem] p-6 pr-12 text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all resize-none min-h-[80px]"
                    dir="rtl"
                />
                <button onClick={() => handleSendMessage()} className="absolute left-4 bottom-4 p-4 rounded-2xl bg-brand-cyan text-white shadow-cyber hover:scale-105 active:scale-95 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
