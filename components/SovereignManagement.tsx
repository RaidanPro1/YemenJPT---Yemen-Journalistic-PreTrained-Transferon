
import React, { useState, useEffect, useRef } from 'react';
import RootAuthGuard from './RootAuthGuard';
import ToolCard from './ToolCard';

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
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const logIntervalRef = useRef<number | null>(null);

  // تم إزالة Open WebUI من هنا
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
    if (!containerName) { addHealthStatus('error', 'Invalid container name provided.'); return; }
    const containerExists = containers.some(c => c.name === containerName);
    if (!containerExists) { addHealthStatus('error', `Container '${containerName}' not found.`); return; }

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

  return (
    <div className="flex flex-col gap-8 h-full relative">
      <div className="fixed top-24 right-10 z-50 flex flex-col gap-2">
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
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">إدارة البنية التحتية</h2>
        <div className="flex items-center gap-3 mt-2">
            <p className="text-[10px] font-bold text-slate-500 dark:text-brand-cyan/60 uppercase tracking-widest">Live Container Fleet Status (Root Access)</p>
            <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[8px] font-black border border-green-500/20 uppercase">Authenticated</span>
        </div>
      </div>
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        isSelected={selectedCard === panel.containerName}
                        onClick={() => setSelectedCard(current => (current === panel.containerName ? null : panel.containerName))}
                    />
                );
            })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {hestiaStats ? (
              <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex items-center gap-6">
                 <span className="text-4xl">🎛️</span>
                 <div>
                    <h4 className="font-black text-slate-800 dark:text-white">HestiaCP Integration</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Live stats from integrated control panel.</p>
                 </div>
                 <div className="ml-auto flex gap-6 text-center">
                    <div><div className="text-2xl font-black text-brand-cyan">{hestiaStats.users_count}</div><div className="text-[9px] uppercase font-bold text-slate-400">Users</div></div>
                    <div><div className="text-2xl font-black text-brand-cyan">{hestiaStats.web_domains_count}</div><div className="text-[9px] uppercase font-bold text-slate-400">Websites</div></div>
                    <div><div className="text-2xl font-black text-brand-cyan">{hestiaStats.mail_domains_count}</div><div className="text-[9px] uppercase font-bold text-slate-400">Mail Domains</div></div>
                 </div>
              </div>
            ) : ( <div className="lg:col-span-2 bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 text-center text-xs text-slate-400"> HestiaCP API not configured. Go to Settings to enable integration. </div> )}
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-xl flex-1">
            <table className="w-full text-left min-w-[800px]">
              <thead> <tr className="bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 text-[10px] font-black text-slate-500 dark:text-brand-cyan uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 dark:text-brand-cyan uppercase tracking-widest">Container Name</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 dark:text-brand-cyan uppercase tracking-widest">Image</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 dark:text-brand-cyan uppercase tracking-widest">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {containers.map(container => (
                  <tr key={container.id} className="hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors">
                    <td className="p-4"><div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(container.status)}`}></span><span className="text-xs font-bold text-slate-700 dark:text-white uppercase">{container.status}</span></div></td>
                    <td className="p-4 font-mono text-sm text-slate-700 dark:text-white">{container.name.replace('/', '')}</td>
                    <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{container.image}</td>
                    <td className="p-4"><div className="flex gap-2 items-center">
                        <button onClick={() => handleContainerControl(container.status.includes('running') || container.status.startsWith('Up') ? 'stop' : 'start', container.name)} className={`px-3 py-1.5 border rounded text-[9px] font-black text-white uppercase tracking-wider transition-all active:scale-95 ${container.status.includes('running') || container.status.startsWith('Up') ? 'bg-red-500/80 hover:bg-red-600 border-red-500/50' : 'bg-green-500/80 hover:bg-green-600 border-green-500/50'}`}> {container.status.includes('running') || container.status.startsWith('Up') ? 'Stop' : 'Start'} </button>
                        <button onClick={() => handleContainerControl('restart', container.name)} className="px-3 py-1.5 bg-brand-blue hover:bg-blue-800 border border-blue-500/30 rounded text-[9px] font-black text-white uppercase tracking-wider active:scale-95"> Restart </button>
                        <button onClick={() => { setSelectedContainer(container); setModalTab('logs'); }} className="px-3 py-1.5 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-300 dark:border-white/20 rounded text-[9px] font-black text-slate-700 dark:text-brand-gold uppercase tracking-wider"> Logs </button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </>
      {selectedContainer && ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-10" onClick={() => setSelectedContainer(null)}> <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}> <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617]"> <div className="flex items-center gap-4"> <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{selectedContainer.name}</h3> <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${selectedContainer.status.includes('running') || selectedContainer.status.startsWith('Up') ? 'bg-green-500' : 'bg-red-500'}`}> {selectedContainer.status} </span> </div> <button onClick={() => setSelectedContainer(null)} className="text-slate-400 hover:text-red-500"> <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> </button> </div> <div className="flex border-b border-slate-200 dark:border-slate-800"> <button onClick={() => setModalTab('logs')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${modalTab === 'logs' ? 'bg-brand-cyan text-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}> Live Logs </button> <button onClick={() => setModalTab('details')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${modalTab === 'details' ? 'bg-brand-cyan text-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}> Details </button> </div> <div className="flex-1 overflow-auto p-6 bg-slate-100 dark:bg-black/40"> {modalTab === 'logs' ? ( <div className="font-mono text-xs text-slate-800 dark:text-green-400 space-y-1 whitespace-pre-wrap"> {containerLogs.length > 0 ? containerLogs.join('\n') : "Fetching logs..."} <div className="animate-pulse">_</div> </div> ) : ( <pre className="font-mono text-xs whitespace-pre-wrap">{JSON.stringify({ name: selectedContainer.name, id: selectedContainer.id, image: selectedContainer.image, ports: selectedContainer.ports }, null, 2)}</pre> )} </div> </div> </div> )}
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
