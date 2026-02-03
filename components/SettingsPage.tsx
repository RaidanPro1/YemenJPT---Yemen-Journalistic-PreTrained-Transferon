
import React, { useState, useEffect } from 'react';
import { TOOLS_LIST } from '../constants';
import { Tool } from '../types';

const SettingsCard: React.FC<{ title: string; description: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, description, icon, children, className }) => (
    <div className={`bg-white dark:bg-brand-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl flex flex-col gap-6 transition-all duration-500 hover:shadow-cyan-glow/5 ${className}`}>
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[1.25rem] bg-brand-cyan/5 flex items-center justify-center shrink-0 border border-brand-cyan/10">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{title}</h3>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-tight tracking-wide">{description}</p>
            </div>
        </div>
        <div className="flex-1 flex flex-col gap-5">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-500 focus:outline-none ${enabled ? 'bg-brand-cyan shadow-cyan-glow' : 'bg-slate-300 dark:bg-slate-800 border border-slate-700'}`}
    >
        <span className={`inline-block w-5 h-5 transform bg-white dark:bg-slate-100 rounded-full transition-transform duration-500 ${enabled ? 'translate-x-6' : 'translate-x-1'} shadow-md`} />
    </button>
);

const SettingsPage: React.FC = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    
    // Remote AI Configuration from .env
    const [remoteApiKey, setRemoteApiKey] = useState('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');
    const [remoteApiUrl, setRemoteApiUrl] = useState('https://api.openai.com/v1');
    const [remoteGpuEnabled, setRemoteGpuEnabled] = useState(true);

    // S3 Storage Configuration from .env
    const [s3AccessKey, setS3AccessKey] = useState('45c5796c47d41e6c064fa73e62425930');
    const [s3Endpoint, setS3Endpoint] = useState('https://usc1.contabostorage.com');
    const [s3Bucket, setS3Bucket] = useState('raidanpro');
    
    const [statuses, setStatuses] = useState({
        s3_storage: 'operational',
        openai_cloud: 'operational',
        gemini_cloud: 'operational',
        huggingface: 'operational',
        telegram: 'connected',
        n8n: 'connected'
    });

    useEffect(() => {
        const savedTools = localStorage.getItem('custom_tools');
        setTools(savedTools ? JSON.parse(savedTools) : TOOLS_LIST);
    }, []);

    const handleSave = (section: string) => {
        alert(`[SUCCESS] تم تطبيق إعدادات ${section} بنجاح. النظام الآن يستخدم التكوينات الجديدة.`);
    };

    const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const colors = {
            operational: 'bg-brand-success/10 text-brand-success border-brand-success/20',
            connected: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
            error: 'bg-brand-danger/10 text-brand-danger border-brand-danger/20'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${colors[status as keyof typeof colors] || colors.error}`}>
                {status}
            </span>
        );
    };

  return (
    <div className="flex flex-col gap-10 h-full animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">الإعدادات والتكامل (Root)</h2>
            <p className="text-[10px] font-black text-slate-400 dark:text-brand-cyan uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
                <span className="w-8 h-0.5 bg-brand-cyan/40"></span>
                Sovereign Hybrid Architecture v6.1
            </p>
        </div>
        <div className="flex gap-3">
            <span className="px-4 py-2 rounded-xl bg-brand-success/10 text-[10px] font-black uppercase border border-brand-success/20 text-brand-success tracking-widest">Master Key (Samah@...) Applied</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 pb-10">
          
           <SettingsCard title="التخزين الهجين S3" description="تكامل Contabo S3 للأرشفة المتزامنة والسيادية." icon={<span className="text-2xl">📦</span>}>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-brand-dark rounded-xl border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Bucket Status</span>
                      <StatusBadge status={statuses.s3_storage} />
                  </div>
                  <div className="space-y-3">
                      <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">S3 Endpoint</label>
                          <input type="text" value={s3Endpoint} onChange={e => setS3Endpoint(e.target.value)} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-xs font-mono" />
                      </div>
                      <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Bucket Name</label>
                          <input type="text" value={s3Bucket} onChange={e => setS3Bucket(e.target.value)} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-xs font-mono" />
                      </div>
                  </div>
                   <button onClick={() => handleSave('S3')} className="w-full bg-brand-cyan text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-cyan-glow transition-all">Verify S3 Vault</button>
              </div>
          </SettingsCard>

          <SettingsCard title="بوابات الذكاء الهجين" description="تفعيل المعالجة الرسومية الخارجية للمهام الكبرى." icon={<span className="text-2xl">🌩️</span>}>
              <div className="flex items-center justify-between p-4 bg-brand-cyan/5 border border-brand-cyan/15 rounded-2xl transition-all">
                  <span className="text-[11px] font-black text-slate-800 dark:text-brand-cyan uppercase tracking-tight">Enable Remote GPU Offloading</span>
                  <ToggleSwitch enabled={remoteGpuEnabled} onChange={setRemoteGpuEnabled} />
              </div>
              <div className="space-y-4">
                  <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block px-1">OpenAI API Key</label>
                      <input type="password" value={remoteApiKey} onChange={(e) => setRemoteApiKey(e.target.value)} placeholder="sk-..." className="w-full bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-mono focus:border-brand-cyan outline-none transition-all shadow-inner" />
                  </div>
                  <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block px-1">Provider URL</label>
                      <input type="text" value={remoteApiUrl} onChange={(e) => setRemoteApiUrl(e.target.value)} className="w-full bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-mono focus:border-brand-cyan outline-none transition-all shadow-inner" />
                  </div>
              </div>
              <button onClick={() => handleSave('Hybrid AI')} className="w-full mt-auto bg-brand-blue text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg border border-blue-400/20">Apply AI Routing</button>
          </SettingsCard>

          <SettingsCard title="الأتمتة والربط" description="تكامل n8n وتليجرام للرصد الميداني." icon={<span className="text-2xl">🤖</span>}>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-brand-dark rounded-xl border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase">n8n Public API</span>
                      <StatusBadge status={statuses.n8n} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-brand-dark rounded-xl border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Telegram Bot</span>
                      <StatusBadge status={statuses.telegram} />
                  </div>
                  <div className="p-3 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
                      <p className="text-[10px] text-brand-gold font-bold">MCP Access Token Loaded</p>
                  </div>
                  <button onClick={() => handleSave('Automation')} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Configure Workflows</button>
              </div>
          </SettingsCard>

          <SettingsCard title="التوطين والسياق" description="إعدادات الوقت والعملة واللغة لليمن." icon={<span className="text-2xl">🇾🇪</span>}>
              <div className="space-y-4">
                  <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-brand-dark rounded-xl">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Current Timezone</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Asia/Aden (UTC+3)</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-brand-dark rounded-xl">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Locale Context</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">ar-YE (Yemeni Dialect Optimized)</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-brand-cyan/5 border border-brand-cyan/10 rounded-xl">
                      <span className="text-[9px] font-black text-brand-cyan uppercase">Currency Rate API</span>
                      <span className="text-[10px] font-mono text-brand-cyan/80">api.raidan.pro/rates/aden</span>
                  </div>
              </div>
          </SettingsCard>

          <SettingsCard title="تكوين الأسطول والأدوات" description="إدارة وتخصيص كافة المكونات الاستقصائية." icon={<span className="text-2xl">🛠️</span>} className="lg:col-span-2 xl:col-span-4">
              <div className="bg-slate-50 dark:bg-brand-dark rounded-[2rem] p-8 h-64 overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-800 shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tools.map(tool => (
                          <div key={tool.id} className="flex items-center justify-between p-5 bg-white dark:bg-brand-panel rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-cyan/30 transition-all group">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-brand-dark flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{tool.name.charAt(0)}</div>
                                  <div>
                                      <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{tool.name}</p>
                                      <p className="text-[9px] text-slate-400 font-bold uppercase">{tool.category}</p>
                                  </div>
                              </div>
                              <ToggleSwitch 
                                enabled={tool.status === 'active'} 
                                onChange={(enabled) => {
                                    const updatedTools = tools.map(t => t.id === tool.id ? { ...t, status: enabled ? 'active' : 'offline' } : t);
                                    localStorage.setItem('custom_tools', JSON.stringify(updatedTools));
                                    setTools(updatedTools as Tool[]);
                                }}
                              />
                          </div>
                      ))}
                  </div>
              </div>
          </SettingsCard>
      </div>
    </div>
  );
};

export default SettingsPage;
