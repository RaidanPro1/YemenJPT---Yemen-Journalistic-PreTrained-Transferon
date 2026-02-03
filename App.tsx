
import React, { useState } from 'react';
import AdminView from './components/AdminView';
import JournalistView from './components/JournalistView';
import ChatInterface from './components/ChatInterface';
import RegistrationForm from './components/RegistrationForm';
import { LogIn } from 'lucide-react';
import KnowledgeBase from './components/KnowledgeBase';
import Logo from './components/Logo';

type AppState = 'public' | 'register' | 'journalist' | 'admin' | 'about';

const App: React.FC = () => {
  // PREVIEW MODE: Defaulting to 'admin' to unlock all panels immediately
  const [viewState, setViewState] = useState<AppState>('admin');

  const handleLoginSuccess = (role: 'journalist' | 'admin') => {
    setViewState(role);
  };

  return (
    <div className="h-screen w-screen bg-brand-bg font-cairo overflow-hidden flex flex-col">
      {/* Global Public Header */}
      {viewState === 'public' || viewState === 'about' || viewState === 'register' ? (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-8 z-50 shadow-sm">
           <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setViewState('public')}>
              {/* Official Logo Integration */}
              <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                 <Logo className="w-full h-full" />
              </div>
              
              <div className="flex flex-col">
                 <h1 className="text-xl font-black text-slate-900 leading-none tracking-tighter group-hover:text-brand-primary transition-colors">YemenJPT</h1>
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sovereign Journalism</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewState('about')}
                className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${viewState === 'about' ? 'text-brand-primary bg-brand-primary/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                 عن المنصة
              </button>
              <div className="h-4 w-px bg-slate-200"></div>
              <button 
                onClick={() => setViewState('register')}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-brand-primary transition-all shadow-lg hover:shadow-brand-primary/30 flex items-center gap-2 transform active:scale-95"
              >
                 <LogIn size={14} /> تسجيل دخول الصحفيين
              </button>
           </div>
        </header>
      ) : null}

      {/* Main Content Router */}
      <div className="flex-1 overflow-hidden relative">
        {viewState === 'public' && (
           <div className="h-full flex flex-col animate-in fade-in duration-500">
              <div className="bg-gradient-to-r from-brand-primary/5 via-brand-cyan/5 to-brand-primary/5 border-b border-brand-primary/10 p-2 text-center">
                 <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center justify-center gap-2">
                    <Logo className="w-3 h-3" /> نسخة عامة محدودة • سجل الدخول للوصول إلى أدوات التحقق الصحفي والمصادر المفتوحة
                 </p>
              </div>
              <ChatInterface isPublic={true} />
           </div>
        )}

        {viewState === 'register' && (
           <RegistrationForm onLoginSuccess={handleLoginSuccess} onCancel={() => setViewState('public')} />
        )}

        {viewState === 'about' && (
           <div className="h-full overflow-y-auto custom-scrollbar p-8">
              <KnowledgeBase />
           </div>
        )}

        {viewState === 'journalist' && (
           <JournalistView onSwitchToAdmin={() => setViewState('admin')} />
        )}

        {viewState === 'admin' && (
           <AdminView onSwitchToJournalist={() => setViewState('journalist')} />
        )}
      </div>
    </div>
  );
};

export default App;
