
import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Music, Volume2, Wind, Shield, Settings, Sliders, 
  Play, Download, Trash2, CheckCircle, Database, Headphones, 
  Upload, Sparkles, Wand2, History, User, Pause, AlertTriangle,
  FileText, FileAudio, RefreshCw, Languages
} from 'lucide-react';

interface TranscriptSegment {
    id: number;
    speaker: string;
    text: string;
    start: number;
    end: number;
    confidence: number;
}

const TranscriptionPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<string>('');
  const [denoiseLevel, setDenoiseLevel] = useState(70);
  const [activeDialect, setActiveDialect] = useState('صنعاني');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false); // To track if audio was modified

  const [segments, setSegments] = useState<TranscriptSegment[]>([
      { id: 1, speaker: 'المتحدث 1', text: 'يا خبير، كيف الحال؟ الأمور في الميناء ماشية تمام؟', start: 0, end: 5, confidence: 0.9 },
      { id: 2, speaker: 'المتحدث 2', text: 'والله في شوية تأخير في الإجراءات، بس البضاعة وصلت.', start: 5, end: 12, confidence: 0.7 },
      { id: 3, speaker: 'المتحدث 1', text: 'تمام، خليك متابع وإذا صار شي كلمني.', start: 12, end: 16, confidence: 0.95 }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setIsProcessed(false);
      // Simulate initial transcription loading
      setIsProcessing(true);
      setProcessingType('جاري التحليل الأولي...');
      setTimeout(() => {
          setIsProcessing(false);
          setProcessingType('');
      }, 1500);
    }
  };

  // Simulate Audio Processing (Denoise, Diarization, etc.)
  const applyProcessing = (type: string) => {
      if (!audioFile) return;
      setIsProcessing(true);
      setProcessingType(type);
      
      // Simulate server-side processing delay
      setTimeout(() => {
          setIsProcessing(false);
          setProcessingType('');
          setIsProcessed(true); // Mark as processed so user can download the "new" version
          alert(`تم تطبيق عملية "${type}" بنجاح.`);
      }, 2000);
  };

  // Auto-Detect Dialect Simulation
  const detectDialect = () => {
      setIsProcessing(true);
      setProcessingType('جاري تحليل البصمة الصوتية...');
      setTimeout(() => {
          setIsProcessing(false);
          setProcessingType('');
          const randomDialect = ['صنعاني', 'عدني', 'حضرمي'][Math.floor(Math.random() * 3)];
          setActiveDialect(randomDialect);
          alert(`تم اكتشاف اللهجة الأقرب: ${randomDialect} (بنسبة تطابق 94%)`);
      }, 1500);
  };

  // Helper to download text content
  const downloadText = (content: string, filename: string, type: string) => {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleDownloadSRT = () => {
      const srtContent = segments.map((seg, index) => {
          const start = new Date(seg.start * 1000).toISOString().substr(11, 12).replace('.', ',');
          const end = new Date(seg.end * 1000).toISOString().substr(11, 12).replace('.', ',');
          return `${index + 1}\n${start} --> ${end}\n${seg.speaker}: ${seg.text}\n`;
      }).join('\n');
      downloadText(srtContent, 'transcript.srt', 'text/plain');
  };

  const handleDownloadTXT = () => {
      const txtContent = segments.map(seg => `[${seg.speaker}] (${seg.start}s): ${seg.text}`).join('\n\n');
      downloadText(txtContent, 'transcript.txt', 'text/plain');
  };

  // Fake download of the "processed" audio
  const handleDownloadAudio = () => {
      if (!audioUrl) return;
      const link = document.createElement('a');
      link.href = audioUrl; // In a real app, this would be the URL of the processed file from backend
      link.download = `processed_${audioFile?.name || 'audio.wav'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

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
                <span className="text-[9px] font-black text-brand-primary uppercase">Whisper-YE Cluster: Online</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Interaction Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Upload & Waveform Area */}
            <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                {!audioUrl ? (
                    <div 
                        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl hover:border-brand-primary/50 transition-all cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="audio/*" />
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={24} className="text-slate-400 group-hover:text-brand-primary" />
                        </div>
                        <p className="text-slate-300 text-sm font-bold">اضغط لرفع ملف صوتي (WAV, MP3, M4A)</p>
                        <p className="text-slate-500 text-[10px] mt-1">يتم المعالجة محلياً داخل النواة السيادية</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                                </button>
                                <div>
                                    <p className="text-white text-xs font-bold truncate max-w-[200px]">{audioFile?.name}</p>
                                    <p className="text-slate-400 font-mono text-[10px]">00:12 / 03:45</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setAudioFile(null); setAudioUrl(null); }} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-red-400 hover:bg-slate-700 transition-all" title="حذف الملف"><Trash2 size={16} /></button>
                                {isProcessed && (
                                    <button 
                                        onClick={handleDownloadAudio}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-2 hover:bg-green-500 transition-all animate-in fade-in"
                                    >
                                        <Download size={14} /> تحميل المعالج
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="h-24 flex items-center gap-1 relative z-10">
                            {[...Array(60)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-1 rounded-full transition-all duration-300 ${i < 20 ? 'bg-brand-primary' : 'bg-slate-700'}`} 
                                    style={{ height: `${20 + Math.random() * 80}%`, opacity: isPlaying ? 1 : (i < 20 ? 1 : 0.5) }}
                                ></div>
                            ))}
                        </div>

                        {/* Processing Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-brand-primary text-xs font-bold animate-pulse">{processingType}</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Transcript Editor */}
            <div className={`bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm transition-opacity ${!audioUrl ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={16} className="text-brand-primary"/> نص التفريغ (Editable)
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={handleDownloadSRT} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 hover:text-brand-primary border border-slate-100 hover:border-brand-primary flex items-center gap-2 transition-all">
                            <Download size={14} /> تصدير SRT
                        </button>
                        <button onClick={handleDownloadTXT} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 hover:text-brand-primary border border-slate-100 hover:border-brand-primary flex items-center gap-2 transition-all">
                            <Download size={14} /> تصدير TXT
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {segments.map(seg => (
                        <div key={seg.id} className="group flex gap-4 items-start p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                <User size={18} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <input 
                                        defaultValue={seg.speaker} 
                                        className="bg-transparent text-[10px] font-black text-brand-primary uppercase outline-none w-32" 
                                    />
                                    <span className="text-[9px] font-mono text-slate-300">{seg.start}s - {seg.end}s</span>
                                </div>
                                <p className={`text-sm font-medium leading-relaxed outline-none ${seg.confidence < 0.8 ? 'text-amber-700 bg-amber-50/50 p-1 rounded' : 'text-slate-700'}`} contentEditable suppressContentEditableWarning>
                                    {seg.text}
                                </p>
                                {seg.confidence < 0.8 && (
                                    <div className="flex items-center gap-1 text-[9px] text-amber-500 mt-1">
                                        <AlertTriangle size={10} /> <span>ثقة منخفضة (تحقق يدوياً)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Purification Lab */}
            <div className={`bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm transition-opacity ${!audioUrl ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
                    <button 
                        onClick={() => applyProcessing('تحسين وضوح الكلام (Speech Enhancement)')}
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-brand-primary transition-all active:scale-95"
                    >
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-brand-primary uppercase">تحسين وضوح الكلام</span>
                       <Volume2 size={16} className="text-slate-400 group-hover:text-brand-primary" />
                    </button>
                    <button 
                        onClick={() => applyProcessing('عزل المتحدثين (Speaker Diarization)')}
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-brand-primary transition-all active:scale-95"
                    >
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-brand-primary uppercase">عزل المتحدثين (Diarization)</span>
                       <Headphones size={16} className="text-slate-400 group-hover:text-brand-primary" />
                    </button>
                 </div>
              </div>
            </div>

            {/* Dialect Selection */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">تخصيص اللهجة اليمنية</h3>
                  <button onClick={detectDialect} className="text-[9px] font-bold text-brand-primary flex items-center gap-1 hover:underline disabled:opacity-50" disabled={!audioUrl}>
                      <Sparkles size={10} /> كشف تلقائي
                  </button>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
