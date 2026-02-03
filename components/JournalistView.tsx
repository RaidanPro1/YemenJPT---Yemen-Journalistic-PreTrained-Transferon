
import React, { useState } from 'react';
import { TOOLS_LIST } from '../constants';
import KnowledgeBase from './KnowledgeBase';
import TaskManager from './TaskManager';
import ChatInterface from './ChatInterface';
import TranscriptionPage from './TranscriptionPage';
import ForensicsDashboard from './ForensicsDashboard';
import PredictiveCenter from './PredictiveCenter';
import OpsDashboard from './OpsDashboard';
import GeoIntDashboard from './GeoIntDashboard';
import EditorialStudio from './EditorialStudio';
import { 
  MessageSquare, Mic, Shield, Map, BookOpen, 
  Settings, User, PanelLeftClose, PanelLeftOpen, Search, Plus, Star,
  Zap, Radar, Eye, PenTool
} from 'lucide-react';

interface JournalistViewProps {
  onSwitchToAdmin: () => void;
}

const JournalistView: React.FC<JournalistViewProps> = ({ onSwitchToAdmin }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'audio' | 'forensics' | 'insight' | 'news' | 'knowledge' | 'geoint' | 'editorial'>('chat');
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);

  const sidebarItems = [
    { id: 'chat', icon: <MessageSquare size={20} />, label: 'الدردشة السيادية' },
    { id: 'editorial', icon: <PenTool size={20} />, label: 'الإنتاج التحريري' },
    { id: 'forensics', icon: <Eye size={20} />, label: 'التحقق الجنائي' },
    { id: 'geoint', icon: <Map size={20} />, label: 'الاستقصاء الجغرافي' },
    { id: 'audio', icon: <Mic size={20} />, label: 'مُنصت الصوتي' },
    { id: 'insight', icon: <Zap size={20} />, label: 'الاستبصار' },
    { id: 'news', icon: <Radar size={20} />, label: 'رادار الأخبار' },
    { id: 'knowledge', icon: <BookOpen size={20} />, label: 'المعرفة' },
  ];

  const getNavTitle = () => {
    switch (activeTab) {
      case 'chat': return 'المحادثات';
      case 'editorial': return 'ستوديو التحرير';
      case 'forensics': return 'مختبر الأدلة';
      case 'geoint': return 'الرصد الجغرافي';
      case 'audio': return 'مُنصت الصوتي';
      case 'insight': return 'مركز الاستبصار';
      case 'news': return 'رادار التضليل';
      case 'knowledge': return 'قاعدة المعرفة';
      default: return 'YemenJPT';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <ChatInterface />;
      case 'editorial': return <EditorialStudio />;
      case 'audio': return <TranscriptionPage />;
      case 'forensics': return <ForensicsDashboard />;
      case 'geoint': return <GeoIntDashboard />;
      case 'insight': return <PredictiveCenter />;
      case 'news': return <OpsDashboard />;
      case 'knowledge': return <KnowledgeBase />;
      default: return <ChatInterface />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-brand-bg overflow-hidden font-cairo" dir="rtl">
      
      {/* Side Rail - Lobe Style */}
      <aside className="w-16 flex flex-col items-center py-6 bg-[#f0f2f5] border-l border-brand-border z-50">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/20">
          <Shield size={22} />
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`p-3 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
              title={item.label}
            >
              {item.icon}
              {activeTab === item.id && <div className="active-tab-indicator" />}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <button onClick={onSwitchToAdmin} className="p-3 text-slate-400 hover:text-brand-primary transition-colors" title="إدارة النظام (Root)">
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-300 border border-white shadow-sm cursor-pointer overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Journalist&background=007aff&color=fff" alt="User" />
          </div>
        </div>
      </aside>

      {/* Context Panel */}
      <nav className={`transition-all duration-300 border-l border-brand-border bg-white flex flex-col ${leftPanelVisible ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-brand-border">
          <span className="font-black text-slate-800 tracking-tight">{getNavTitle()}</span>
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

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
           <TaskManager />
        </div>

        <div className="p-4 border-t border-brand-border">
          <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
             <p className="text-[10px] font-black text-brand-primary uppercase mb-2">حالة المحرك السيادي</p>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-bold text-slate-600">Ollama Cluster: Online</span>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-white">
        {!leftPanelVisible && (
          <button 
            onClick={() => setLeftPanelVisible(true)}
            className="absolute right-4 top-4 z-50 p-2 bg-white/80 backdrop-blur rounded-lg border border-brand-border text-slate-400 hover:text-slate-600 shadow-sm"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        
        <div className="flex-1 overflow-hidden">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default JournalistView;
