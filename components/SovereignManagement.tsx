
import React, { useState, useEffect, useRef } from 'react';
import RootAuthGuard from './RootAuthGuard';
import ToolCard from './ToolCard';
import { TOOLS_LIST } from '../constants';
import { Tool, ToolCategory } from '../types';
import { ShieldCheck, activity, LayoutGrid, Terminal as TerminalIcon, Info, Server, Activity as ActivityIcon } from 'lucide-react';

interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: string[];
}

interface HealthStatus {
  id: number;
  status: 'loading' | 'success' | 'error';
  message: string;
}

const SovereignManagementContent: React.FC<{ authToken: string }> = ({ authToken }) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [containerLogs, setContainerLogs] = useState<string[]>([]);
  const [modalTab, setModalTab] = useState<'logs' | 'details'>('logs');
  const [healthStatuses, setHealthStatuses] = useState<HealthStatus[]>([]);
  const [hestiaStats, setHestiaStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'tools'>('infrastructure');
  const logIntervalRef = useRef<number | null>(null);

  const controlPanels = [
      { name: 'Traefik Gateway', description: 'إدارة توجيه الشبكة والشهادات.', icon: '🌐', containerName: 'YJPT_gateway', url: 'http://localhost:8081' },
      { name: 'PostgreSQL Database', description: 'تتم الإدارة عبر CLI أو أداة خارجية.', icon: '🗃️', containerName: 'YJPT_db', url: null }
  ];

  const addHealthStatus = (status: 'loading' | 'success' | 'error', message: string) => {
    const newStatus = { id: Date.now(), status, message };
    setHealthStatuses(prev => [newStatus, ...prev.slice(0, 4)]);
  };
  
  const dismissHealthStatus = (id: number) => {
    setHealthStatuses(prev => prev.filter(s => s.id !== id));
  };
  
  const fetchSystemData = async () => {
      if (!authToken) return;
      try {
        const res = await fetch('/api/system/health', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (res.ok) setContainers((await res.json()).containers);
        else if (res.status === 401) addHealthStatus('error', 'Session expired. Please refresh.');
      } catch (e) { addHealthStatus('error', 'Failed to fetch container stats'); }
      try {
        const res = await fetch('/api/integrations/hestia/stats', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (res.ok) setHestiaStats(await res.json());
      } catch (e) { console.error("Could not fetch Hestia stats"); }
  };

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 10000);
    return () => clearInterval(interval);
  }, [authToken]);
  
  useEffect(() => {
    if (selectedContainer && authToken && modalTab === 'logs') {
        const fetchLogs = async () => {
            try {
                const res = await fetch(`/api/system/logs/${selectedContainer.name}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
                if (res.ok) setContainerLogs((await res.json()).logs);
            } catch (e) { console.error("Log fetch failed"); }
        };
        fetchLogs();
        logIntervalRef.current = setInterval(fetchLogs, 2000);
    }
    return () => { if (logIntervalRef.current) clearInterval(logIntervalRef.current); };
  }, [selectedContainer, authToken, modalTab]);

  const handleContainerControl = async (action: 'start' | 'stop' | 'restart', containerName: string) => {
    if (!authToken) { addHealthStatus('error', 'Authentication token is missing.'); return; }
    addHealthStatus('loading', `Sending '${action}' command to ${containerName}...`);
    try {
        const res = await fetch(`/api/system/control`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, container_name: containerName })
        });
        const data = await res.json();
        if (res.ok) {
            addHealthStatus('success', data.message || `Successfully executed '${action}'.`);
            setTimeout(fetchSystemData, 1000); 
        } else {
            addHealthStatus('error', data.detail || `Command '${action}' failed.`);
        }
    } catch (e) { 
        addHealthStatus('error', 'Network Error: Could not reach backend API.'); 
    }
  };

  const getStatusColor = (status: string) => {
    if (status.startsWith('running') || status.startsWith('Up')) return 'bg-green-500';
    if (status.startsWith('exited') || status.startsWith('Created')) return 'bg-red-500';
    if (status.includes('restarting')) return 'bg-yellow-500 animate-pulse';
    return 'bg-slate-400';
  };

  const groupedTools = TOOLS_LIST.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<ToolCategory, Tool[]>);

  const getStatusInArabic = (status: 'active' | 'offline' | 'deploying') => {
    switch (status) {
      case 'active': return 'نشط';
      case 'offline': return 'غير متصل';
      case 'deploying': return 'جاري التجهيز';
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full relative font-cairo">
      {/* Notifications */}
      <div className="fixed top-24 left-10 z-50 flex flex-col gap-2">
        {healthStatuses.map(status => (
          <div key={status.id} className={`flex items-center justify-between gap-4 w-96 px-4 py-3 rounded-lg shadow-2xl border font-bold text-xs uppercase tracking-wider animate-in fade-in slide-in-from-top-4 ${status.status === 'success' ? 'bg-green-900/90 border-green-500 text-green-300' : status.status === 'loading' ? 'bg-blue-900/90 border-blue-500 text-blue-300' : 'bg-red-900/90 border-red-500 text-red-300'}`}>
             <div className='flex items-center gap-2'>
              {status.status === 'loading' && <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>}
              <span>{status.message}</span>
             </div>
             <button onClick={() => dismissHealthStatus(status.id)} className="font-sans text-lg leading-none">&times;</button>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none italic flex items-center gap-3">
          <Server className="text-brand-primary" size={28} /> حوكمة النواة السيادية
        </h2>
        <div className="flex items-center gap-3 mt-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sovereign Node Orchestration & Resource Health</p>
            <span className="px-2 py-0.5 rounded bg-brand-primary/5 text-brand-primary text-[8px] font-black border border-brand-primary/10 uppercase italic">Root Protocol Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-8">
        <button 
          onClick={() => setActiveTab('infrastructure')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'infrastructure' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          البنية التحتية
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'tools' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          حوكمة الأدوات
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {activeTab === 'infrastructure' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {controlPanels.map(panel => {
                    const container = containers.find(c => c.name === panel.containerName);
                    const isRunning = container && (container.status.includes('running') || container.status.startsWith('Up'));
                    return (
                        <ToolCard
                            key={panel.containerName}
                            name={panel.name}
                            description={panel.description}
                            icon={panel.icon}
                            status={isRunning ? 'active' : 'offline'}
                            isSelected={false}
                            onClick={() => {}}
                        />
                    );
                })}
            </div>
            
            {hestiaStats && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-soft flex items-center gap-8">
                 <div className="w-16 h-16 bg-brand-primary/5 rounded-3xl flex items-center justify-center text-3xl shadow-inner">🎛️</div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800">تكامل HestiaCP</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Integrated Management Stats</p>
                 </div>
                 <div className="ml-auto flex gap-10">
                    <div className="text-center">
                      <div className="text-2xl font-black text-brand-primary">{hestiaStats.users_count}</div>
                      <div className="text-[8px] uppercase font-black text-slate-400">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-brand-primary">{hestiaStats.web_domains_count}</div>
                      <div className="text-[8px] uppercase font-black text-slate-400">Domains</div>
                    </div>
                 </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-soft">
                <table className="w-full text-right">
                  <thead> 
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Container Name</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Image</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {containers.map(container => (
                      <tr key={container.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6"><div className="flex items-center gap-3"><span className={`w-2 h-2 rounded-full ${getStatusColor(container.status)}`}></span><span className="text-[10px] font-black text-slate-700 uppercase">{container.status}</span></div></td>
                        <td className="p-6 font-mono text-xs text-slate-500 text-left">{container.name.replace('/', '')}</td>
                        <td className="p-6 text-[10px] text-slate-400 font-mono text-left">{container.image}</td>
                        <td className="p-6">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleContainerControl(container.status.includes('running') || container.status.startsWith('Up') ? 'stop' : 'start', container.name)} className={`px-4 py-2 rounded-xl text-[9px] font-black text-white uppercase transition-all shadow-sm ${container.status.includes('running') || container.status.startsWith('Up') ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                               {container.status.includes('running') || container.status.startsWith('Up') ? 'Stop' : 'Start'}
                            </button>
                            <button onClick={() => { setSelectedContainer(container); setModalTab('logs'); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase hover:bg-brand-primary hover:text-white transition-all">Logs</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-300">
            {Object.entries(groupedTools).map(([category, tools]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 border-r-4 border-brand-primary pr-4 mb-6">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tools.map(tool => (
                    <div key={tool.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-soft transition-all group">
                       <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-brand-primary/5 transition-colors">
                                {tool.id.includes('yemenjpt') ? '🧠' : tool.category === 'OSINT واستخبارات' ? '🕵️' : '🛠️'}
                             </div>
                             <div>
                                <h4 className="text-xs font-black text-slate-800">{tool.name}</h4>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{tool.installationType}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${tool.status === 'active' ? 'bg-green-500' : tool.status === 'deploying' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                             <span className="text-[8px] font-black uppercase text-slate-400">{getStatusInArabic(tool.status)}</span>
                          </div>
                       </div>
                       
                       <p className="text-[10px] text-slate-500 leading-relaxed font-bold mb-6 italic h-8 overflow-hidden">
                          "{tool.description}"
                       </p>

                       <div className="flex gap-2">
                          <button 
                            className="flex-1 py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2"
                            onClick={() => addHealthStatus('loading', `جاري استدعاء سجلات ${tool.name}...`)}
                          >
                             <TerminalIcon size={12} /> السجلات
                          </button>
                          <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:text-brand-primary transition-all">
                             <Info size={14} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Logs */}
      {selectedContainer && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-10" onClick={() => setSelectedContainer(null)}> 
          <div className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}> 
            <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50"> 
              <div className="flex items-center gap-4"> 
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">{selectedContainer.name}</h3> 
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase text-white ${selectedContainer.status.includes('running') || selectedContainer.status.startsWith('Up') ? 'bg-green-500' : 'bg-red-500'}`}> {selectedContainer.status} </span> 
              </div> 
              <button onClick={() => setSelectedContainer(null)} className="text-slate-300 hover:text-red-500 transition-colors"> <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> </button> 
            </div> 
            <div className="flex border-b border-slate-100"> 
              <button onClick={() => setModalTab('logs')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${modalTab === 'logs' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:bg-slate-50'}`}> Live Logs </button> 
              <button onClick={() => setModalTab('details')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${modalTab === 'details' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:bg-slate-50'}`}> Details </button> 
            </div> 
            <div className="flex-1 overflow-auto p-8 bg-slate-900 text-brand-cyan relative"> 
              {modalTab === 'logs' ? ( 
                <div className="font-mono text-xs space-y-1.5 whitespace-pre-wrap leading-relaxed"> 
                  {containerLogs.length > 0 ? containerLogs.map((l,i) => <div key={i}><span className="opacity-40 select-none mr-4">[{i+1}]</span> {l}</div>) : "Fetching live stream..."} 
                  <div className="animate-pulse bg-brand-cyan/20 w-2 h-4 inline-block ml-1"></div> 
                </div> 
              ) : ( 
                <pre className="font-mono text-xs whitespace-pre-wrap text-white/70">{JSON.stringify({ name: selectedContainer.name, id: selectedContainer.id, image: selectedContainer.image, ports: selectedContainer.ports }, null, 2)}</pre> 
              )} 
            </div> 
          </div> 
        </div> 
      )}
    </div>
  );
};

const SovereignManagement: React.FC = () => (
  <div className="h-full relative">
    <RootAuthGuard>
      {(token) => <SovereignManagementContent authToken={token} />}
    </RootAuthGuard>
  </div>
);

export default SovereignManagement;
