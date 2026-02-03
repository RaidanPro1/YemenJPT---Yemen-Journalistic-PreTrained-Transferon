import React, { useState, useEffect } from 'react';

interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  latency: string;
}

interface NewsAlert {
  id: number;
  text: string;
  type: 'rumor' | 'verified' | 'disinfo';
  intensity: number;
  location: string;
}

const OpsDashboard: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { id: 'gw', name: 'Sovereign Gateway (Traefik)', status: 'online', uptime: '14d 2h', latency: '4ms' },
    { id: 'core', name: 'ALLAM Core Engine', status: 'online', uptime: '3d 18h', latency: '850ms' },
    { id: 'radar', name: 'Misinfo-Radar Processor', status: 'online', uptime: '14d 2h', latency: '42ms' },
    { id: 'legal', name: 'Legal-Meter (Qdrant)', status: 'warning', uptime: '1d 4h', latency: '120ms' },
  ]);

  const [newsSignals, setNewsSignals] = useState<NewsAlert[]>([
    { id: 1, text: "إشاعات حول إغلاق منفذ الوديعة تثير موجة من التضليل", type: 'disinfo', intensity: 85, location: 'حضرموت' },
    { id: 2, text: "تداول أخبار كاذبة عن سعر الصرف في صنعاء", type: 'rumor', intensity: 40, location: 'صنعاء' },
    { id: 3, text: "تقرير محقق: توضيح حول شحنة المساعدات في ميناء عدن", type: 'verified', intensity: 10, location: 'عدن' },
  ]);

  const [complianceData] = useState([82, 85, 88, 87, 91, 89, 93, 90]);

  return (
    <div className="flex flex-col gap-8 h-full animate-in fade-in duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">غرفة العمليات الذكية (AI Ops)</h2>
          <p className="text-[10px] font-bold text-slate-500 dark:text-brand-cyan/70 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-brand-cyan/30"></span>
            Real-time Sovereign System Health & Compliance
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Local Mode Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Status Card */}
        <div className="bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-slate-400 dark:text-brand-gold uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="text-lg">🚥</span> حالة الخدمات النشطة
          </h3>
          <div className="space-y-4">
            {services.map((svc) => (
              <div key={svc.id} className="group p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-cyan/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${svc.status === 'online' ? 'bg-green-500 shadow-cyber' : svc.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{svc.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{svc.latency}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                  <span>Uptime: {svc.uptime}</span>
                  <span className="text-brand-cyan/50 group-hover:text-brand-cyan transition-colors">Operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misinfo-Radar Signals Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-400 dark:text-brand-gold uppercase tracking-widest flex items-center gap-2">
              <span className="text-lg">📡</span> رادار التضليل (Misinfo-Radar)
            </h3>
            <span className="text-[9px] font-bold text-slate-500 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded">Live Signals</span>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
            {newsSignals.map((signal) => (
              <div key={signal.id} className="relative p-5 bg-slate-50 dark:bg-brand-dark/40 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden group">
                {signal.type === 'disinfo' && (
                  <div className="absolute top-0 right-0 w-1 h-full bg-red-500"></div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    signal.type === 'disinfo' ? 'bg-red-500/10 text-red-500' : 
                    signal.type === 'rumor' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {signal.type}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500">{signal.location}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{signal.text}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-cyan transition-all duration-1000" style={{ width: `${signal.intensity}%` }}></div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{signal.intensity}% Intensity</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constitution Compliance Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-brand-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xs font-black text-slate-400 dark:text-brand-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="text-lg">⚖️</span> مؤشر الامتثال للدستور اليمني (Legal-Meter)
              </h3>
              <p className="text-[10px] text-slate-500 leading-tight">Historical analysis of model response alignment with the National Constitution and National Dialogue outcomes.</p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-brand-cyan tracking-tighter">90%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase block">Current Score</span>
            </div>
          </div>

          <div className="h-48 flex items-end gap-3 group px-4">
            {complianceData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 transition-opacity duration-300 group-hover:opacity-40 hover:!opacity-100">
                <div 
                  className={`w-full rounded-t-xl transition-all duration-700 shadow-lg ${val > 90 ? 'bg-brand-cyan shadow-cyan-glow' : 'bg-brand-gold shadow-gold-glow'}`}
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[8px] font-bold text-slate-500 uppercase font-mono">T-{7-i}h</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Violations Detected', val: '0', color: 'text-green-500' },
              { label: 'Policy Overrides', val: '12', color: 'text-brand-cyan' },
              { label: 'Context Hits', val: '842', color: 'text-brand-gold' },
              { label: 'System Bias', val: '2.4%', color: 'text-slate-400' },
            ].map(metric => (
              <div key={metric.label} className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="text-[8px] font-black uppercase text-slate-500 mb-1">{metric.label}</p>
                <p className={`text-lg font-black ${metric.color}`}>{metric.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpsDashboard;
