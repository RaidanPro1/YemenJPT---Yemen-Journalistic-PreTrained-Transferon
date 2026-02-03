import React, { useState } from 'react';
import { TOOLS_LIST } from '../constants';
import KnowledgeBase from './KnowledgeBase';
import TaskManager from './TaskManager';
import ChatInterface from './ChatInterface';

interface JournalistViewProps {
  onSwitchToAdmin: () => void;
}

const JournalistView: React.FC<JournalistViewProps> = ({ onSwitchToAdmin }) => {
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const journalistTools = TOOLS_LIST.filter(t => t.tier.includes('أساسي'));

  if (showKnowledgeBase) {
      return (
          <div className="h-full w-full bg-slate-50 dark:bg-[#020617] p-8">
              <button onClick={() => setShowKnowledgeBase(false)} className="mb-4 bg-brand-cyan text-white px-4 py-2 rounded-lg text-xs font-bold">
                  &larr; العودة إلى مساحة العمل
              </button>
              <KnowledgeBase />
          </div>
      );
  }

  return (
    <div className="flex h-screen font-cairo bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white" dir="rtl">
      {/* Sidebar: Toolbox & Tasks */}
      <aside className="w-80 bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 flex flex-col p-6 shadow-xl">
        <h2 className="text-base font-black text-slate-800 dark:text-white mb-1">مساحة عمل الصحفي</h2>
        <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">YemenJP V2 Interface</p>
            <button onClick={onSwitchToAdmin} title="Switch to Admin View" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 my-6"></div>

        <div className="flex-1 flex flex-col min-h-0 gap-6">
          <TaskManager />
        </div>


        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
            <button onClick={() => setShowKnowledgeBase(true)} className="w-full text-center bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                قاعدة المعرفة والتوثيق
            </button>
        </div>
      </aside>

      {/* Main Content: Workspace */}
      <main className="flex-1 flex flex-col bg-slate-200 dark:bg-brand-dark">
        <ChatInterface />
      </main>
    </div>
  );
};

export default JournalistView;