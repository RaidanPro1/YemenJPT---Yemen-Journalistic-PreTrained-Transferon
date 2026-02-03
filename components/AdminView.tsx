
import React, { useState } from 'react';
import AdminLayout from '../DashboardLayout';
import ChatInterface from './ChatInterface';
import ForensicsDashboard from './ForensicsDashboard';
import OSINTDashboard from './OSINTDashboard';
import GeoIntDashboard from './GeoIntDashboard';
import SettingsPage from './SettingsPage';
import ModelManager from './ModelManager';
import ModelTraining from './ModelTraining';
import { MessageSquare, Star, Clock, BrainCircuit, Shield, Database } from 'lucide-react';

type ViewState = 'insight' | 'models' | 'training' | 'forensics' | 'osint' | 'geoint' | 'settings';

const AdminView: React.FC<{ onSwitchToJournalist: () => void }> = ({ onSwitchToJournalist }) => {
  const [activeView, setActiveView] = useState<ViewState>('insight');

  // getNavTitle removed as it's handled inside renderView logic or we can adapt AdminLayout.
  // Assuming AdminLayout takes navTitle as prop.

  const getNavTitle = () => {
      switch (activeView) {
        case 'insight': return 'المحادثات الاستقصائية';
        case 'models': return 'نواة YemenJPT';
        case 'training': return 'تدريب النماذج';
        case 'forensics': return 'مختبر الأدلة';
        case 'osint': return 'المصادر المفتوحة';
        case 'settings': return 'لوحة التحكم الجذرية';
        default: return 'YemenJPT Command';
      }
  };

  const renderNavList = () => {
    return (
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 mt-4">العمليات الحالية</p>
        <button className="w-full text-right p-4 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold border border-slate-100 flex items-center justify-between group hover:border-brand-primary/20 transition-all">
          تحقيق ميناء الحديدة
          <Star size={12} className="text-brand-gold fill-brand-gold" />
        </button>
      </div>
    );
  };

  const renderView = () => {
    switch (activeView) {
      case 'insight': return <ChatInterface />;
      case 'models': return <ModelManager />;
      case 'training': return <ModelTraining />;
      case 'forensics': return <ForensicsDashboard />;
      case 'osint': return <OSINTDashboard />;
      case 'geoint': return <GeoIntDashboard />;
      case 'settings': return <SettingsPage />;
      default: return <ChatInterface />;
    }
  };

  return (
    <AdminLayout 
      activeId={activeView} 
      onNavigate={setActiveView} 
      navTitle={getNavTitle()}
      navList={renderNavList()}
    >
      {renderView()}
    </AdminLayout>
  );
};

export default AdminView;
