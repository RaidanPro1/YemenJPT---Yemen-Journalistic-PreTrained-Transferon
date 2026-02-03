import React, { useState } from 'react';
import { presentationSlides, toolGuideData } from '../knowledgeBaseData';

const KnowledgeBase: React.FC = () => {
  const [activeView, setActiveView] = useState<'presentation' | 'tools'>('presentation');
  const [selectedSlide, setSelectedSlide] = useState(presentationSlides[0]);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">قاعدة المعرفة السيادية</h2>
        <div className="flex items-center gap-3 mt-2">
            <p className="text-[10px] font-bold text-slate-500 dark:text-brand-cyan/60 uppercase tracking-widest">YemenJPT Doctrine & Tooling Reference</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] p-4 rounded-xl shadow-xl overflow-y-auto custom-scrollbar flex flex-col gap-4">
          <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-lg">
            <button onClick={() => setActiveView('presentation')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${activeView === 'presentation' ? 'bg-brand-cyan text-white dark:text-slate-900 shadow' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'}`}>العرض التقديمي</button>
            <button onClick={() => setActiveView('tools')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${activeView === 'tools' ? 'bg-brand-cyan text-white dark:text-slate-900 shadow' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'}`}>دليل الأدوات</button>
          </div>

          {activeView === 'presentation' && (
            <div className="flex flex-col gap-1">
              {presentationSlides.map(slide => (
                <button 
                  key={slide.id}
                  onClick={() => setSelectedSlide(slide)}
                  className={`p-3 text-right rounded-lg text-xs transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-3 ${selectedSlide.id === slide.id ? 'bg-brand-cyan/10 text-brand-cyan' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                >
                  <span className="bg-slate-200 dark:bg-black/30 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center font-bold">{slide.id}</span>
                  <span className="font-bold">{slide.title}</span>
                </button>
              ))}
            </div>
          )}
          {activeView === 'tools' && (
             <div className="flex flex-col gap-1">
              {toolGuideData.map(category => (
                <a key={category.id} href={`#${category.id}`} className="p-3 text-right rounded-lg text-xs transition-colors text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/5">
                  {category.title}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0f172a] p-8 rounded-xl shadow-xl overflow-y-auto custom-scrollbar">
          {activeView === 'presentation' && selectedSlide && (
            <div className="prose dark:prose-invert max-w-none prose-headings:text-brand-cyan prose-headings:font-black prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-ul:text-slate-600 dark:prose-ul:text-slate-300 animate-in fade-in" dir="rtl">
              <span className="text-6xl">{selectedSlide.image_icon}</span>
              <h1>{selectedSlide.title}</h1>
              {selectedSlide.subtitle && <p className="lead !text-slate-500 italic">{selectedSlide.subtitle}</p>}
              <ul>
                {selectedSlide.points.map((point, index) => <li key={index} dangerouslySetInnerHTML={{__html: point.replace(/\(([^)]+)\)/g, '<span class="text-brand-cyan/80 font-mono text-xs">($1)</span>')}}></li>)}
              </ul>
            </div>
          )}

          {activeView === 'tools' && (
            <div className="space-y-12" dir="rtl">
              {toolGuideData.map(category => (
                <div key={category.id} id={category.id} className="scroll-mt-8 animate-in fade-in">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h2 className="text-xl font-black text-brand-cyan">{category.title}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.tools.map(tool => (
                      <div key={tool.name} className="bg-slate-50 dark:bg-black/20 p-5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-cyan/50 hover:shadow-lg transition-all">
                        <h4 className="font-black text-sm text-slate-800 dark:text-white">{tool.name}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{tool.description}</p>
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400 dark:text-brand-cyan/70">
                          <div className="flex items-center gap-2">
                            <span className="font-sans">👤</span>
                            <span>المستخدم: <span className="font-bold text-slate-500 dark:text-slate-300">{tool.primary_user}</span></span>
                          </div>
                           <div className="flex items-center gap-2">
                            <span className="font-sans">⚙️</span>
                            <span>المرحلة: <span className="font-bold text-slate-500 dark:text-slate-300">{tool.workflow_step}</span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;