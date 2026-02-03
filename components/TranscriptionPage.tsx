
import React, { useState, useRef } from 'react';
import { 
  Mic, Music, Volume2, Wind, Shield, Settings, Sliders, 
  Play, Download, Trash2, CheckCircle, Database, Headphones, 
  Upload, Sparkles, Wand2, History 
} from 'lucide-react';

const TranscriptionPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [denoiseLevel, setDenoiseLevel] = useState(70);
  const [activeDialect, setActiveDialect] = useState('صنعاني');
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-full bg-white font-cairo">
      {/* Header Info */}
      <div className="px-8 py-6 border-b border-slate-100 bg-[#f8fafc]/30">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Mic className="text-brand-primary" size={24} /> محرك "مُنصت" الصوتي
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">YemenJPT Audio Forensics & Dialect Engine</p>
          </div>
          <div className="flex gap-2">
             <div className="px-3 py-1 bg-brand-primary/5 rounded-full border border-brand-primary/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                <span className="text-[9px] font-black text-brand-primary uppercase">Ollama Audio Cluster: Online</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Interaction Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upload/Drop Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer group relative overflow-hidden"
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="audio/*,video/*" />
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="text-slate-400 group-hover:text-brand-primary" size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-800">ارفع التسجيل الميداني</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">يدعم ملفات MP3, WAV, MP4. يتم التشفير والمعالجة محلياً بالكامل.</p>
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                 <span className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-bold text-slate-400 uppercase tracking-widest">Whisper Large v3</span>
              </div>
            </div>

            {/* Output Editor Simulation */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-[2.5rem] p-8 min-h-[300px] flex flex-col relative group">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <Sparkles className="text-brand-gold" size={18} />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">محرر التفريغ الذكي</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg transition-all"><Download size={16} /></button>
                     <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg transition-all"><Settings size={16} /></button>
                  </div>
               </div>
               
               <div className="flex-1 flex items-center justify-center">
                  {isProcessing ? (
                    <div className="text-center animate-fade">
                       <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                       <p className="text-xs font-bold text-slate-500 italic">جاري معالجة اللهجة وعزل الضجيج...</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300 italic font-medium">بانتظار رفع الملف لبدء التفريغ الجنائي...</p>
                  )}
               </div>

               <div className="mt-6 flex gap-4">
                  <button 
                    onClick={() => setIsProcessing(!isProcessing)}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                     بدء معالجة YemenJPT
                  </button>
               </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Purification Lab */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Wand2 className="text-brand-primary" size={18} /> مختبر تنقية الصوت
              </h3>
              
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                       <span className="flex items-center gap-2"><Wind size={14}/> عزل الضجيج (Denoise)</span>
                       <span className="text-brand-primary">{denoiseLevel}%</span>
                    </div>
                    <input 
                      type="range" value={denoiseLevel} 
                      onChange={(e) => setDenoiseLevel(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-brand-primary cursor-pointer" 
                    />
                 </div>

                 <div className="space-y-3">
                    <button className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-brand-primary transition-all">
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-brand-primary uppercase">تحسين وضوح الكلام</span>
                       <Volume2 size={16} className="text-slate-400 group-hover:text-brand-primary" />
                    </button>
                    <button className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-brand-primary transition-all">
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-brand-primary uppercase">عزل المتحدثين</span>
                       <Headphones size={16} className="text-slate-400 group-hover:text-brand-primary" />
                    </button>
                 </div>
              </div>
            </div>

            {/* Dialect Selection */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">تخصيص اللهجة اليمنية</h3>
              <div className="grid grid-cols-2 gap-2">
                 {['صنعاني', 'عدني', 'تعزي', 'حضرمي', 'تهامي', 'فصحى'].map(dialect => (
                    <button 
                      key={dialect}
                      onClick={() => setActiveDialect(dialect)}
                      className={`py-3 border rounded-xl text-[10px] font-black transition-all uppercase ${activeDialect === dialect ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-brand-primary/30'}`}
                    >
                       {dialect}
                    </button>
                 ))}
              </div>
            </div>

            {/* Recent History */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <History size={16} /> السجل
                  </h3>
               </div>
               <div className="space-y-3">
                  {[
                    { id: '1', name: 'مقابلة تعز 01', time: '12:40' },
                    { id: '2', name: 'تسجيل ميداني عدن', time: 'أمس' }
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer hover:border-brand-primary transition-all">
                       <span className="text-[10px] font-bold text-slate-600">{item.name}</span>
                       <span className="text-[9px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
