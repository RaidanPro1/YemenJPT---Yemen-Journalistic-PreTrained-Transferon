
import React, { useState, useMemo } from 'react';
import { TOOLS_LIST } from '../constants';
import { Tool, ToolCategory } from '../types';
import ToolCard from './ToolCard';
import { Search, Filter, Cpu, Globe, Target, BarChart3, Settings2 } from 'lucide-react';

const IntegrationsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'الكل'>('الكل');

  const categories: (ToolCategory | 'الكل')[] = [
    'الكل',
    'AI وذكاء معرفي',
    'أبحاث المصادر المفتوحة',
    'التحقق والتدقيق الرقمي',
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

  const getStatusLabel = (status: Tool['status']) => {
    switch (status) {
      case 'active': return 'متصل';
      case 'offline': return 'غير متصل';
      case 'deploying': return 'قيد التجهيز';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">مستكشف الأدوات السيادية</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
            <Settings2 size={12} className="text-brand-primary" /> Sovereign Tool-Registry & Integration Hub
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute right-4 top-3 text-slate-300 group-focus-within:text-brand-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="ابحث عن أداة أو وظيفة..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-white border border-slate-200 rounded-xl pr-12 pl-4 py-2.5 text-xs font-bold focus:border-brand-primary outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute right-4 top-3 text-slate-300 pointer-events-none" size={16} />
             <select 
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value as any)}
               className="bg-white border border-slate-200 rounded-xl pr-12 pl-10 py-2.5 text-xs font-black text-slate-700 outline-none cursor-pointer hover:border-brand-primary transition-all appearance-none shadow-sm"
             >
               {categories.map(cat => (
                 <option key={cat} value={cat}>{cat}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {filteredTools.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 grayscale opacity-30">
            <Globe size={64} className="text-slate-200" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">لا توجد نتائج تطابق معايير البحث...</p>
          </div>
        ) : (
          filteredTools.map(tool => (
            <div key={tool.id} className="group bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-soft transition-all flex flex-col gap-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner border border-brand-primary/5">
                      {tool.category === 'أبحاث المصادر المفتوحة' ? '🕵️' : 
                       tool.category === 'AI وذكاء معرفي' ? '🧠' : 
                       tool.category === 'الرصد الجيومكاني' ? '🗺️' : 
                       tool.category === 'علم البيانات والتحليل' ? '📊' : '🛠️'}
                   </div>
                   <div>
                      <h4 className="font-black text-slate-800 text-sm group-hover:text-brand-primary transition-colors">{tool.name}</h4>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{tool.category}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className={`w-2 h-2 rounded-full ${tool.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : tool.status === 'deploying' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                   <span className="text-[8px] font-black text-slate-400 uppercase">{getStatusLabel(tool.status)}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-bold leading-relaxed min-h-[44px] italic">
                "{tool.description}"
              </p>

              <div className="flex flex-wrap gap-2">
                {tool.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-400 text-[8px] font-black rounded-lg uppercase tracking-widest border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <span className="text-xl" title={tool.installationType}>{getInstallIcon(tool.installationType)}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic">نمط {tool.installationType}</span>
                 </div>
                 <div className="flex gap-2">
                    {tool.tier.map(t => (
                      <span key={t} className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase shadow-sm border ${t === 'متقدم' ? 'bg-brand-gold text-white border-brand-gold' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {t}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-brand-primary h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IntegrationsManager;
