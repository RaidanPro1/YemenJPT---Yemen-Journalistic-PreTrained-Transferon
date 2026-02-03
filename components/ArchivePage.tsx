import React, { useState, useRef, useEffect } from 'react';

interface ArchiveFile {
  name: string;
  s3_vault: boolean;
  timestamp: string;
}

const ArchivePage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ArchiveFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    const token = localStorage.getItem('yjpt_token'); // Mocking token retrieval

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/archive/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedFiles(prev => [{
            name: data.filename,
            s3_vault: data.s3_vault,
            timestamp: data.timestamp
          }, ...prev]);
        }
      } catch (e) {
        console.error("Upload failed", e);
      }
    }
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFileUpload(e.target.files);
  };

  return (
    <div className="flex flex-col gap-8 h-full animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">خزنة "مُسند" السيادية</h2>
          <p className="text-[10px] font-bold text-slate-500 dark:text-brand-cyan/60 uppercase tracking-widest mt-2">Hybrid S3 & Local Archive System</p>
        </div>
        <div className="flex gap-2">
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-green-600 uppercase">S3 Storage: Online</span>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div 
          className={`
            border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 transition-all cursor-pointer relative group overflow-hidden
            ${isDragging ? 'border-brand-gold bg-brand-gold/5' : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-brand-panel hover:border-brand-cyan/50 hover:shadow-cyan-glow/5'}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
          
          <div className="w-20 h-20 rounded-[2rem] bg-brand-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
            {isUploading ? (
                <span className="w-10 h-10 border-4 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin"></span>
            ) : (
                <svg className="w-10 h-10 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            )}
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">إيداع الوثائق والملفات</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md font-medium">
            قم بسحب الملفات هنا أو اضغط للاستعراض. يتم التشفير تلقائياً والرفع المتزامن إلى <span className="text-brand-cyan">S3 Vault</span>.
          </p>
        </div>

        <div className="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex-1 overflow-hidden flex flex-col shadow-xl">
           <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                 الأرشيف السحابي والمحلي
               </h4>
               <span className="text-[10px] font-bold text-slate-400">Total Files: {uploadedFiles.length}</span>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
             {uploadedFiles.length === 0 && (
               <div className="text-center text-slate-300 dark:text-slate-600 py-20 italic text-sm font-medium">لا توجد ملفات في الأرشيف حالياً...</div>
             )}
             {uploadedFiles.map((file, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-cyan/30 transition-all">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-brand-cyan/5 rounded-xl flex items-center justify-center text-brand-cyan font-black text-sm">
                      {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                   </div>
                   <div>
                     <span className="text-xs font-black text-slate-800 dark:text-white block truncate max-w-[200px]">{file.name}</span>
                     <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(file.timestamp).toLocaleString()}</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                    {file.s3_vault ? (
                        <span className="px-2 py-1 bg-brand-cyan/10 text-brand-cyan text-[9px] font-black rounded border border-brand-cyan/20">HYBRID CLOUD</span>
                    ) : (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-400 text-[9px] font-black rounded border border-slate-200 dark:border-white/5">LOCAL ONLY</span>
                    )}
                    <button className="p-2 text-slate-400 hover:text-brand-danger transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;