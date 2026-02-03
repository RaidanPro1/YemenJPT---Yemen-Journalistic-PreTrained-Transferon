
import React, { useState, useMemo } from 'react';
import { TOOLS_LIST } from '../constants';
import { Tool, ToolCategory } from '../types';
import ToolCard from './ToolCard';

const IntegrationsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'الكل'>('الكل');

  const categories: (ToolCategory | 'الكل')[] = [
    'الكل',
    'AI وذكاء معرفي',
    'OSINT واستخبارات',
    'التحقق والجنايات الرقمية',
    'تتبع الأموال والشركات',
    'الرصد الجيومكاني',
    'علم البيانات والتحليل',
    'الأمن والعمليات السيادية',
    'إدارة البنية التحتية'
  ];

  const filteredTools = useMemo(() => {
    return TOOLS_LIST.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const getInstallIcon = (type: Tool['installationType']) => {
    switch(type) {
      case 'docker': return '🐳';
      case 'python': return '🐍';
      case 'npm': return '📦';
      case 'binary': return '⚙️';
      default: return '📄';
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">مستكشف الأدوات والتكاملات</h2>
          <p className="text-[10px] font-bold text-slate-500 dark:text-brand-cyan/60 uppercase tracking-widest mt-2">Sovereign Software Suite & Integration Registry</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="بحث في الأدوات..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-cyan transition-all"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {filteredTools.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold opacity-50 italic">
            لم يتم العثور على أدوات تطابق البحث...
          </div>
        ) : (
          filteredTools.map(tool => (
            <div key={tool.id} className="group bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-cyan-glow/5 transition-all flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-brand-cyan/5 flex items-center justify-center text-xl shadow-inner border border-brand-cyan/10">
                      {tool.category === 'OSINT واستخبارات' ? '🕵️' : 
                       tool.category === 'AI وذكاء معرفي' ? '🧠' : 
                       tool.category === 'الرصد الجيومكاني' ? '🗺️' : 
                       tool.category === 'علم البيانات والتحليل' ? '📊' : '🛠️'}
                   </div>
                   <div>
                      <h4 className="font-black text-slate-800 dark:text-white text-sm group-hover:text-brand-cyan transition-colors">{tool.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{tool.category}</span>
                   </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${tool.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px]">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-black/30 text-slate-500 dark:text-slate-400 text-[8px] font-black rounded uppercase tracking-widest border border-slate-200 dark:border-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <span className="text-lg" title={tool.installationType}>{getInstallIcon(tool.installationType)}</span>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">{tool.installationType} Deployment</span>
                 </div>
                 <div className="flex gap-2">
                    {tool.tier.map(t => (
                      <span key={t} className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t === 'متقدم' ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' : 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20'}`}>
                        {t}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Action Overlay on Hover */}
              <div className="absolute inset-x-0 bottom-0 bg-brand-cyan h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IntegrationsManager;
