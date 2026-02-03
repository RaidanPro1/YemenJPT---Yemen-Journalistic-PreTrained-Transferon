
import React, { useState } from 'react';
import { 
  MessageSquare, Shield, Globe, Map, Settings, 
  PanelLeftClose, PanelLeftOpen, Terminal,
  Search, Plus, Bell, Command, BrainCircuit, Database
} from 'lucide-react';
import Tooltip from './Tooltip';
import Logo from './Logo';

interface LobeLayoutProps {
  activeId: string;
  onNavigate: (id: any) => void;
  children: React.ReactNode;
  navTitle: string;
  navList?: React.ReactNode;
}

const AdminLayout: React.FC<LobeLayoutProps> = ({ activeId, onNavigate, children, navTitle, navList }) => {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);

  const sidebarItems = [
    { id: 'insight', icon: <MessageSquare size={20} />, label: 'الدردشة' },
    { id: 'models', icon: <BrainCircuit size={20} />, label: 'الموديلات' },
    { id: 'training', icon: <Database size={20} />, label: 'تدريب AI' },
    { id: 'forensics', icon: <Shield size={20} />, label: 'التحقق' },
    { id: 'osint', icon: <Globe size={20} />, label: 'المصادر المفتوحة' },
    { id: 'geoint', icon: <Map size={20} />, label: 'الخرائط' },
    { id: 'settings', icon: <Settings size={20} />, label: 'الإعدادات' },
  ];

  return (
    <div className="flex h-screen w-full bg-brand-bg overflow-hidden font-cairo" dir="rtl">
      
      {/* Side Rail (Far Right in RTL) */}
      <aside className="w-16 flex flex-col items-center py-6 bg-[#f0f2f5] border-l border-brand-border z-50">
        <div className="w-10 h-10 mb-8 hover:scale-110 transition-transform cursor-pointer shadow-lg rounded-xl overflow-hidden bg-white">
          <Logo className="w-full h-full" />
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          {sidebarItems.map(item => (
            <Tooltip key={item.id} text={item.label}>
                <button
                onClick={() => onNavigate(item.id)}
                className={`p-3 rounded-xl transition-all relative group ${activeId === item.id ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                >
                {item.icon}
                {activeId === item.id && <div className="active-tab-indicator" />}
                </button>
            </Tooltip>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <button className="p-3 text-slate-400 hover:text-brand-primary transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-300 border border-white shadow-sm cursor-pointer overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin&background=007aff&color=fff" alt="User" />
          </div>
        </div>
      </aside>

      {/* Navigation List Panel */}
      <nav className={`transition-all duration-300 border-l border-brand-border bg-white flex flex-col ${leftPanelVisible ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-brand-border">
          <span className="font-black text-slate-800 tracking-tight">{navTitle}</span>
          <button onClick={() => setLeftPanelVisible(false)} className="text-slate-400 hover:text-slate-600">
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-slate-300" size={14} />
            <input 
              type="text" 
              placeholder="بحث سريع..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pr-9 pl-3 text-xs focus:bg-white focus:border-brand-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
          {navList || (
            <div className="py-20 text-center opacity-20 flex flex-col items-center gap-2 grayscale">
              <span className="text-3xl">📂</span>
              <span className="text-[10px] font-black uppercase tracking-widest">لا يوجد سجل حالي</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-brand-border">
          <button className="w-full py-3 bg-brand-primary/5 text-brand-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/10 transition-all">
            <Plus size={16} /> مهمة جديدة
          </button>
        </div>
      </nav>

      {/* Main Workspace Stage */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-white">
        {!leftPanelVisible && (
          <button 
            onClick={() => setLeftPanelVisible(true)}
            className="absolute right-4 top-4 z-50 p-2 bg-white/80 backdrop-blur rounded-lg border border-brand-border text-slate-400 hover:text-slate-600 shadow-sm"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        
        <header className="h-16 flex items-center justify-between px-8 border-b border-brand-border bg-white/50 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sovereign Node: Connected</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-[10px] font-mono text-slate-500">
                <Command size={10} /> + K
             </div>
             <button className="text-slate-400 hover:text-slate-600">
                <Terminal size={18} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]/50">
           {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
