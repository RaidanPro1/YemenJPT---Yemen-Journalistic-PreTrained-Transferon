
import React, { useState } from 'react';
import AdminLayout from '../DashboardLayout';
import SovereignManagement from './SovereignManagement';
import InvestigationsDashboard from './InvestigationsDashboard';
import ArchivePage from './ArchivePage';
import TranscriptionPage from './TranscriptionPage';
import GeoIntDashboard from './GeoIntDashboard';
import DataLab from './DataLab';
import ModelManager from './ModelManager';
import SettingsPage from './SettingsPage';
import LegalDocs from './LegalDocs';
import KnowledgeBase from './KnowledgeBase';
import PredictiveCenter from './PredictiveCenter';
import OpsDashboard from './OpsDashboard';
import ClientOrchestrator from './ClientOrchestrator';
import ForensicsDashboard from './ForensicsDashboard';
import IntegrationsManager from './IntegrationsManager';
import OSINTDashboard from './OSINTDashboard';
import FinanceDashboard from './FinanceDashboard';

type ViewState = 
  | 'orchestrator' 
  | 'investigations' 
  | 'management' 
  | 'archive' 
  | 'transcription' 
  | 'geoint' 
  | 'datalab' 
  | 'models' 
  | 'settings' 
  | 'legal' 
  | 'knowledgebase' 
  | 'insight' 
  | 'ops' 
  | 'forensics' 
  | 'integrations'
  | 'osint'
  | 'finance';

interface NavButtonProps {
  id: ViewState;
  label: string;
  icon: string;
  activeView: ViewState;
  onClick: (id: ViewState) => void;
  badge?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ id, label, icon, activeView, onClick, badge }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
      activeView === id
        ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 shadow-inner'
        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-xl transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-xs font-black whitespace-nowrap overflow-hidden tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className="bg-brand-cyan text-brand-dark text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

const AdminView: React.FC<{ onSwitchToJournalist: () => void }> = ({ onSwitchToJournalist }) => {
  const [activeView, setActiveView] = useState<ViewState>('insight');

  const renderView = () => {
    switch (activeView) {
      case 'management': return <SovereignManagement />;
      case 'investigations': return <InvestigationsDashboard />;
      case 'archive': return <ArchivePage />;
      case 'transcription': return <TranscriptionPage />;
      case 'geoint': return <GeoIntDashboard />;
      case 'datalab': return <DataLab />;
      case 'models': return <ModelManager />;
      case 'settings': return <SettingsPage />;
      case 'legal': return <LegalDocs />;
      case 'knowledgebase': return <KnowledgeBase />;
      case 'insight': return <PredictiveCenter />;
      case 'ops': return <OpsDashboard />;
      case 'orchestrator': return <ClientOrchestrator />;
      case 'forensics': return <ForensicsDashboard />;
      case 'integrations': return <IntegrationsManager />;
      case 'osint': return <OSINTDashboard />;
      case 'finance': return <FinanceDashboard />;
      default: return <PredictiveCenter />;
    }
  };

  return (
    <AdminLayout
      sidebar={
        <nav className="flex flex-col gap-1 pb-10">
          <div className="px-4 mb-6">
             <div className="bg-brand-panel/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">النظام السيادي نشط</span>
             </div>
          </div>

          <h3 className="text-[9px] font-black text-slate-400 dark:text-brand-gold/50 uppercase tracking-[0.2em] px-4 mt-2 mb-1">القيادة والسيطرة</h3>
          <NavButton id="insight" label="مركز الاستبصار" icon="🔮" activeView={activeView} onClick={setActiveView} badge="LIVE" />
          <NavButton id="ops" label="غرفة العمليات" icon="🚦" activeView={activeView} onClick={setActiveView} />
          
          <h3 className="text-[9px] font-black text-slate-400 dark:text-brand-gold/50 uppercase tracking-[0.2em] px-4 mt-6 mb-1">الذكاء المعرفي</h3>
          <NavButton id="models" label="مختبر ALLAM" icon="🧠" activeView={activeView} onClick={setActiveView} />
          <NavButton id="transcription" label="محرك مُنصت" icon="🎙️" activeView={activeView} onClick={setActiveView} />
          <NavButton id="datalab" label="مسرع البيانات" icon="📊" activeView={activeView} onClick={setActiveView} />

          <h3 className="text-[9px] font-black text-slate-400 dark:text-brand-gold/50 uppercase tracking-[0.2em] px-4 mt-6 mb-1">الاستخبارات الفنية</h3>
          <NavButton id="forensics" label="الجنايات الرقمية" icon="🔬" activeView={activeView} onClick={setActiveView} />
          <NavButton id="osint" label="استخبارات OSINT" icon="🕵️" activeView={activeView} onClick={setActiveView} />
          <NavButton id="geoint" label="الرصد الجغرافي" icon="🗺️" activeView={activeView} onClick={setActiveView} />
          <NavButton id="finance" label="تتبع الأموال" icon="💳" activeView={activeView} onClick={setActiveView} />

          <h3 className="text-[9px] font-black text-slate-400 dark:text-brand-gold/50 uppercase tracking-[0.2em] px-4 mt-6 mb-1">الأرشفة والبنية</h3>
          <NavButton id="archive" label="خزنة مسند" icon="📦" activeView={activeView} onClick={setActiveView} />
          <NavButton id="management" label="إدارة الأسطول" icon="🚢" activeView={activeView} onClick={setActiveView} />
          <NavButton id="integrations" label="دليل الأدوات" icon="🛠️" activeView={activeView} onClick={setActiveView} />
          
          <div className="my-6 border-t border-slate-200 dark:border-slate-800"></div>
          
          <NavButton id="settings" label="الإعدادات" icon="⚙️" activeView={activeView} onClick={setActiveView} />
          <NavButton id="legal" label="البروتوكول القانوني" icon="⚖️" activeView={activeView} onClick={setActiveView} />
          
          <button 
            onClick={onSwitchToJournalist}
            className="mt-8 w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 transition-all border border-brand-gold/10 hover:border-brand-gold/30 shadow-lg"
          >
            <span className="text-xl">🔄</span>
            <span className="text-xs font-black uppercase tracking-tight">العودة لواجهة الصحفي</span>
          </button>
        </nav>
      }
      header={
        <div className="flex items-center gap-4">
          <div className="bg-brand-cyan/10 px-4 py-1.5 rounded-full border border-brand-cyan/20">
            <h2 className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.2em]">
              {activeView === 'insight' ? 'Predictive Intelligence Center' : activeView.replace('_', ' ').toUpperCase()}
            </h2>
          </div>
        </div>
      }
    >
      <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderView()}
      </div>
    </AdminLayout>
  );
};

export default AdminView;
