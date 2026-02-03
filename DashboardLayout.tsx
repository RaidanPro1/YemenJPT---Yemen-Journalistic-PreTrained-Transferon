import React, { useState, useEffect } from 'react';

interface AdminLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ sidebar, header, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check local storage or system preference in a real app
    // Default to dark for that "Sovereign" feel
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="flex h-screen font-cairo overflow-hidden selection:bg-brand-cyan/30 selection:text-brand-dark transition-colors duration-500 bg-slate-50 dark:bg-[#020617]" dir="rtl">
      {/* Sidebar */}
      <aside 
        className={`
          ${isCollapsed ? 'w-20' : 'w-76'} 
          bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 flex flex-col z-40 
          shadow-xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) relative
        `}
      >
        {/* Toggle Collapse */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-3 top-24 bg-brand-cyan text-white w-6 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border-2 border-white dark:border-[#0f172a]"
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Brand Header */}
          <div className={`p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-500 ${isCollapsed ? 'items-center px-2' : ''}`}>
             <div className="w-14 h-14 bg-brand-cyan rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-brand-cyan/20 mb-4 mx-auto relative group">
                <span className="text-xl">Y</span>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             {!isCollapsed && (
               <div className="text-center animate-in fade-in zoom-in duration-500">
                 <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-widest leading-none">YEMEN<span className="text-brand-cyan">JPT</span></h2>
                 <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Sovereign Intelligence</p>
               </div>
             )}
          </div>

          <div className={`flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-2' : 'px-5'} py-8`}>
             {sidebar}
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-[#1e293b] dark:via-[#020617] dark:to-[#020617]">
        
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-[#0f172a]/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 z-30 shadow-sm dark:shadow-none transition-colors duration-500">
          <div className="flex items-center gap-10">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse"></div>
                   <div className="absolute inset-0 w-3 h-3 rounded-full bg-brand-cyan animate-ping opacity-75"></div>
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">System Active</h3>
             </div>
             {header}
          </div>
          
          <div className="flex items-center gap-6">
             {/* Theme Toggle Button */}
             <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-brand-gold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
             >
                {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
             </button>

             <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

             <div className="flex items-center gap-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:border-brand-cyan/50 transition-colors group">
                <div className="text-left hidden md:block">
                  <p className="text-[9px] text-slate-400 dark:text-brand-cyan font-black uppercase leading-none mb-1">Root Admin</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">RaidanPro</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center font-black text-white shadow-lg group-hover:scale-105 transition-transform">R</div>
             </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-hidden relative">
          <div className="h-full w-full overflow-y-auto custom-scrollbar pb-10">
            {children}
          </div>
        </main>
        
        {/* Footer Status */}
        <footer className="h-10 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 text-[10px] text-slate-400 dark:text-slate-500 font-bold z-20">
             <span className="uppercase tracking-widest">© 2026 RaidanPro | Partner: YemenJPT</span>
             <div className="flex gap-4">
                 <span>CPU: 12%</span>
                 <span>RAM: 4.2GB</span>
             </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
