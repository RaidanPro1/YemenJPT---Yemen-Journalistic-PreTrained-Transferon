import React, { useState } from 'react';
import { TOOLS_LIST } from '../constants';
import { Tool } from '../types';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}

interface AutomationRecipe {
    id: string;
    name: string;
    description: string;
    triggers: string[];
    actions: string[];
}

const initialPackages: ServicePackage[] = [
    { id: 'pkg_basic', name: 'باقة الصحفي الميداني', description: 'أدوات أساسية للتحقق وجمع المعلومات السريع.', tools: TOOLS_LIST.filter(t => t.tier.includes('أساسي')) },
    { id: 'pkg_advanced', name: 'باقة فريق التحقيقات', description: 'مجموعة متكاملة من أدوات OSINT والتحليل المتقدم.', tools: TOOLS_LIST.filter(t => t.tier.includes('متقدم')) },
];

const automationRecipes: AutomationRecipe[] = [
    { id: 'auto_wordpress', name: 'نشر تلقائي إلى WordPress', description: 'عند حفظ تحقيق في الأرشيف، يتم نشره كمسودة في موقع WordPress الخاص بالعميل.', triggers: ['Archive Save'], actions: ['Hestia API', 'WordPress Post'] },
    { id: 'auto_twitter', name: 'رصد تويتر للأرشيف', description: 'مراقبة الكلمات المفتاحية في تويتر وحفظ التغريدات الهامة تلقائياً في أرشيف العميل.', triggers: ['Twitter Keyword'], actions: ['n8n Workflow', 'Archive Save'] },
];

const ClientOrchestrator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'packages' | 'automation'>('packages');
    const [servicePackages, setServicePackages] = useState<ServicePackage[]>(initialPackages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPackageName, setNewPackageName] = useState('');
    const [newPackageDesc, setNewPackageDesc] = useState('');
    const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

    const handleToolToggle = (toolId: string) => {
        setSelectedTools(prev => {
            const newSet = new Set(prev);
            if (newSet.has(toolId)) {
                newSet.delete(toolId);
            } else {
                newSet.add(toolId);
            }
            return newSet;
        });
    };

    const handleCreatePackage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPackageName || !newPackageDesc || selectedTools.size === 0) {
            alert("Please provide a name, description, and select at least one tool.");
            return;
        }
        const newPackage: ServicePackage = {
            id: `pkg_${Date.now()}`,
            name: newPackageName,
            description: newPackageDesc,
            tools: TOOLS_LIST.filter(tool => selectedTools.has(tool.id))
        };
        setServicePackages(prev => [...prev, newPackage]);
        setIsModalOpen(false);
        setNewPackageName('');
        setNewPackageDesc('');
        setSelectedTools(new Set());
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setIsModalOpen(false)}>
                     <div className="bg-white dark:bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                         <div className="p-6 border-b border-slate-800">
                             <h3 className="text-lg font-black text-slate-800 dark:text-white">إنشاء باقة خدمة جديدة</h3>
                             <p className="text-xs text-slate-500 dark:text-slate-400">قم بتجميع الأدوات لإنشاء عرض مخصص للعملاء.</p>
                         </div>
                         <form onSubmit={handleCreatePackage} className="flex flex-col overflow-hidden flex-1">
                            <div className="p-6 space-y-4 overflow-y-auto">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">اسم الباقة</label>
                                    <input type="text" value={newPackageName} onChange={e => setNewPackageName(e.target.value)} placeholder="e.g., Baqat Al Tahaqiq" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-700 rounded-lg p-2.5 text-sm" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">وصف الباقة</label>
                                    <input type="text" value={newPackageDesc} onChange={e => setNewPackageDesc(e.target.value)} placeholder="A short description of the package" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-700 rounded-lg p-2.5 text-sm" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">اختر الأدوات</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-black/20 rounded-lg max-h-64 overflow-y-auto">
                                        {TOOLS_LIST.map(tool => (
                                            <label key={tool.id} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-xs ${selectedTools.has(tool.id) ? 'bg-brand-cyan text-white' : 'bg-white dark:bg-slate-800'}`}>
                                                <input type="checkbox" checked={selectedTools.has(tool.id)} onChange={() => handleToolToggle(tool.id)} className="form-checkbox h-4 w-4 rounded bg-slate-300 dark:bg-slate-900 border-slate-600 text-brand-cyan focus:ring-brand-cyan"/>
                                                {tool.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-800 mt-auto bg-slate-50 dark:bg-[#020617] flex justify-end gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-700">إلغاء</button>
                                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-blue text-white">إنشاء الباقة</button>
                            </div>
                         </form>
                     </div>
                 </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">منظم العملاء والخدمات</h2>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-brand-cyan/60 uppercase tracking-widest mt-2">
                        Define Service Tiers, Manage Client Automations, and Provision Resources
                    </p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 bg-brand-cyan text-white dark:text-slate-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    إنشاء باقة جديدة
                </button>
            </div>

            <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => setActiveTab('packages')} className={`px-6 py-3 text-sm font-bold transition-all ${activeTab === 'packages' ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-slate-500'}`}>حزم الخدمات</button>
                <button onClick={() => setActiveTab('automation')} className={`px-6 py-3 text-sm font-bold transition-all ${activeTab === 'automation' ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-slate-500'}`}>مركز الأتمتة</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {activeTab === 'packages' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                        {servicePackages.map(pkg => (
                            <div key={pkg.id} className="bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col">
                                <h3 className="text-base font-black text-brand-cyan mb-1">{pkg.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 h-8">{pkg.description}</p>
                                <div className="space-y-2 mb-4">
                                    <h4 className="text-[10px] font-bold uppercase text-slate-400">الأدوات المضمنة:</h4>
                                    <div className="flex flex-wrap gap-2 min-h-[44px]">
                                        {pkg.tools.slice(0, 5).map(tool => ( <span key={tool.id} className="px-2 py-1 bg-slate-100 dark:bg-black/20 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded">{tool.name}</span> ))}
                                        {pkg.tools.length > 5 && <span className="text-xs text-slate-400">...والمزيد</span>}
                                    </div>
                                </div>
                                <button className="mt-auto w-full bg-brand-blue text-white py-2.5 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-colors">إدارة الباقة</button>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'automation' && (
                     <div className="space-y-4 animate-in fade-in">
                        {automationRecipes.map(recipe => (
                           <div key={recipe.id} className="bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-6">
                               <div className="w-12 h-12 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold text-2xl">⚡️</div>
                               <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-white">{recipe.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{recipe.description}</p>
                                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono">
                                        <span className="text-blue-500">Trigger: {recipe.triggers.join(', ')}</span>
                                        <span className="text-slate-400">➔</span>
                                        <span className="text-green-500">Action: {recipe.actions.join(', ')}</span>
                                    </div>
                               </div>
                               <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-brand-cyan hover:text-white transition-colors">تفعيل للعميل</button>
                           </div>
                        ))}
                     </div>
                )}
            </div>
        </div>
    );
};

export default ClientOrchestrator;