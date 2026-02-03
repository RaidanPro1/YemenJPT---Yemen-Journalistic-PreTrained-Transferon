
import React, { useState, useMemo } from 'react';
import { 
  Search, User, Globe, Share2, Zap, Shield, Target, 
  ExternalLink, Fingerprint, Database, Radio, 
  ChevronRight, AlertCircle, CheckCircle2, History,
  Filter, Download, LayoutGrid, Terminal as TerminalIcon,
  Link2, Eye, ShieldCheck, Activity, Map as MapIcon, List,
  Calendar, MapPin, XCircle, FileSearch, ArrowRightLeft
} from 'lucide-react';

interface IntelligenceLead {
  id: string;
  source: string;
  type: string; // e.g., 'Handle Match', 'Archive', 'DNS Record'
  activityType: 'Suspicious' | 'Neutral' | 'Hostile';
  content: string;
  reliability: 'High' | 'Medium' | 'Low';
  timestamp: string;
  date: string; // YYYY-MM-DD
  locationName: string;
  coordinates: { x: number; y: number }; // Percentages for the mock map
  mediaUrl?: string; // URL for forensics
  feedback?: 'verified' | 'rejected' | 'pending';
}

const OSINTDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'person' | 'domain' | 'keyword'>('person');
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [leads, setLeads] = useState<IntelligenceLead[]>([]);
  
  // View State
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter State
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    activityType: 'All',
    location: ''
  });

  const startScan = () => {
    if (!query) return;
    setIsScanning(true);
    setLogs([]);
    setLeads([]);

    const steps = [
      `[PROTOCOL] تهيئة العقدة السيادية للجلسة المشفرة...`,
      `[SEARCH] استدعاء SearXNG: جاري التوزيع عبر 70 محرك بحث...`,
      `[SHERLOCK] مطابقة الأنماط الرقمية في أرشيفات تليجرام ومنصة X...`,
      `[MAIGRET] استخلاص البيانات الوصفية من الحسابات العامة...`,
      `[ANALYSIS] ربط البيانات المكتشفة مع السياق الوطني اليمني...`,
      `[SUCCESS] اكتمل المسح. تم تحديد أصول رقمية مرتبطة.`
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (i === steps.length - 1) {
          setIsScanning(false);
          setLeads([
            { 
                id: '1', 
                source: 'Telegram', 
                type: 'Handle Match', 
                activityType: 'Hostile',
                content: 'نشاط مرتبط في قنوات محلية يمنية (صنعاء/عدن) يدعو للتجمهر.', 
                reliability: 'High', 
                timestamp: 'منذ دقيقة',
                date: '2024-05-20',
                locationName: 'Sana\'a',
                coordinates: { x: 45, y: 40 },
                mediaUrl: 'profile_image_01.jpg',
                feedback: 'pending'
            },
            { 
                id: '2', 
                source: 'X (Twitter)', 
                type: 'Archive', 
                activityType: 'Suspicious',
                content: 'تغريدات مؤرشفة تعود لعام 2021 بخصوص تحركات ميدانية.', 
                reliability: 'Medium', 
                timestamp: 'منذ دقيقة',
                date: '2021-11-15',
                locationName: 'Marib',
                coordinates: { x: 55, y: 35 },
                mediaUrl: 'tweet_media_44.png',
                feedback: 'pending'
            },
            { 
                id: '3', 
                source: 'Whois', 
                type: 'DNS Record', 
                activityType: 'Neutral',
                content: 'اسم النطاق مسجل عبر وسيط محلي في محافظة حضرموت.', 
                reliability: 'High', 
                timestamp: 'الآن',
                date: '2024-01-10',
                locationName: 'Hadramout',
                coordinates: { x: 70, y: 50 },
                feedback: 'pending'
            },
            { 
                id: '4', 
                source: 'DarkWeb', 
                type: 'Leak', 
                activityType: 'Hostile',
                content: 'تسريب قاعدة بيانات تحتوي على أرقام هواتف مرتبطة بالهدف.', 
                reliability: 'Low', 
                timestamp: 'منذ 5 دقائق',
                date: '2024-05-18',
                locationName: 'Aden',
                coordinates: { x: 30, y: 80 },
                feedback: 'pending'
            }
          ]);
        }
      }, i * 1000);
    });
  };

  const handleFeedback = (id: string, status: 'verified' | 'rejected') => {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, feedback: status } : l));
  };

  const sendToForensics = (lead: IntelligenceLead) => {
      alert(`[SYSTEM] Linked Media from Lead #${lead.id} sent to Verification Lab for deep ELA analysis.`);
  };

  const filteredLeads = useMemo(() => {
      return leads.filter(lead => {
          const matchLoc = filters.location ? lead.locationName.toLowerCase().includes(filters.location.toLowerCase()) : true;
          const matchType = filters.activityType !== 'All' ? lead.activityType === filters.activityType : true;
          const matchDateStart = filters.dateStart ? new Date(lead.date) >= new Date(filters.dateStart) : true;
          const matchDateEnd = filters.dateEnd ? new Date(lead.date) <= new Date(filters.dateEnd) : true;
          return matchLoc && matchType && matchDateStart && matchDateEnd;
      });
  }, [leads, filters]);

  return (
    <div className="flex flex-col gap-8 h-full font-cairo animate-in fade-in duration-500" dir="rtl">
      {/* Dynamic Command Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-brand-cyan via-brand-gold to-transparent opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic">
            <Fingerprint className="text-brand-cyan w-9 h-9" /> مركز صحافة المصادر المفتوحة
          </h2>
          <div className="flex items-center gap-4 mt-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></div>
                Sovereign Research Unit // Active Recon
             </span>
             <div className="w-1 h-1 rounded-full bg-slate-200"></div>
             <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest italic">Encrypted Session: RA-992-YE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
           <div className="text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">قواعد البيانات المتاحة</p>
              <p className="text-xl font-black text-slate-900">42 <span className="text-[10px] text-slate-400">Node</span></p>
           </div>
           <div className="w-px h-10 bg-slate-100"></div>
           <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 hover:text-brand-cyan transition-all">
              <History size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* RIGHT COL: Targeting Hub */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-prof flex flex-col gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-brand-cyan"></div>
              
              <div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Target className="text-brand-cyan" size={18} /> تحديد موضوع البحث
                 </h3>
                 <p className="text-[10px] text-slate-400 font-bold mt-1">قم باختيار نمط البحث لبدء استخلاص الخيوط.</p>
              </div>

              <div className="space-y-6">
                 {/* Targeting Mode Selector */}
                 <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {[
                      { id: 'person', label: 'أشخاص', icon: <User size={14} /> },
                      { id: 'domain', label: 'نطاقات', icon: <Globe size={14} /> },
                      { id: 'keyword', label: 'كلمات', icon: <Search size={14} /> }
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setSearchType(t.id as any)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${searchType === t.id ? 'bg-white text-brand-cyan shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         {t.icon}
                         <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                      </button>
                    ))}
                 </div>

                 {/* High Intensity Input */}
                 <div className="relative group">
                    <div className="absolute right-5 top-5 text-slate-400 group-focus-within:text-brand-cyan transition-colors">
                       {searchType === 'person' ? <User size={20}/> : searchType === 'domain' ? <Globe size={20}/> : <Search size={20}/>}
                    </div>
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={searchType === 'person' ? "@username or full name..." : searchType === 'domain' ? "example.com..." : "بحث استقصائي عميق..."}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pr-14 pl-6 text-sm text-slate-900 outline-none focus:border-brand-cyan/50 focus:bg-white transition-all shadow-inner font-bold"
                    />
                 </div>

                 <button 
                  onClick={startScan}
                  disabled={isScanning || !query}
                  className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl shadow-prof hover:bg-brand-cyan transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-4 disabled:opacity-40"
                 >
                    {isScanning ? (
                       <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          جاري استنفار المحركات...
                       </>
                    ) : (
                       <>
                          <Zap size={18} className="text-brand-gold fill-brand-gold" /> إطلاق عملية التقصي
                       </>
                    )}
                 </button>
              </div>
           </div>

           {/* Terminal Monitor */}
           <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 font-mono text-[11px] flex-1 flex flex-col shadow-2xl relative overflow-hidden shrink-0 min-h-[300px]">
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 relative z-10">
                 <div className="flex items-center gap-3">
                    <TerminalIcon size={14} className="text-brand-gold" />
                    <span className="text-brand-gold font-black uppercase tracking-widest text-[9px]">Sovereign Deployment Monitor</span>
                 </div>
                 <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-brand-cyan/80 leading-relaxed relative z-10" dir="ltr">
                 {logs.length === 0 && <div className="text-slate-700 italic py-12 text-center uppercase tracking-[0.4em] opacity-30">Awaiting Search Protocol...</div>}
                 {logs.map((log, i) => (
                   <div key={i} className="animate-in slide-in-from-left-2 duration-300 flex gap-4">
                      <span className="text-slate-600 font-bold shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log}</span>
                   </div>
                 ))}
                 {isScanning && <div className="w-2 h-4 bg-brand-cyan animate-pulse inline-block ml-1"></div>}
              </div>
           </div>
        </div>

        {/* LEFT COL: Live Intelligence Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden min-h-0">
           
           {/* Filters & Controls */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-soft flex flex-col xl:flex-row gap-4 justify-between items-center shrink-0">
                <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Filters</span>
                    </div>
                    
                    <div className="h-8 w-px bg-slate-100"></div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <input type="date" className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold text-slate-600 outline-none" onChange={(e) => setFilters({...filters, dateStart: e.target.value})} />
                        <span className="text-slate-300">-</span>
                        <input type="date" className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold text-slate-600 outline-none" onChange={(e) => setFilters({...filters, dateEnd: e.target.value})} />
                    </div>

                    {/* Activity Type */}
                    <select 
                        className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold text-slate-600 outline-none cursor-pointer"
                        onChange={(e) => setFilters({...filters, activityType: e.target.value})}
                    >
                        <option value="All">All Activities</option>
                        <option value="Suspicious">Suspicious</option>
                        <option value="Hostile">Hostile</option>
                        <option value="Neutral">Neutral</option>
                    </select>

                    {/* Location */}
                    <div className="relative group">
                        <MapPin size={12} className="absolute right-3 top-2.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Location..." 
                            className="bg-slate-50 border border-slate-100 rounded-lg p-2 pr-8 pl-2 text-[10px] font-bold text-slate-600 outline-none w-28 focus:w-40 transition-all"
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                    >
                        <List size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('map')}
                        className={`p-3 rounded-xl transition-all ${viewMode === 'map' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                    >
                        <MapIcon size={18} />
                    </button>
                </div>
           </div>

           {/* Extracted Leads Content */}
           <div className="flex-1 bg-white border border-slate-200 rounded-[3.5rem] p-10 shadow-prof flex flex-col min-h-0 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 shrink-0">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                       <LayoutGrid className="text-brand-gold" size={22} /> الخيوط الصحفية المكتشفة
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Journalistic Leads Repository ({filteredLeads.length})</p>
                 </div>
                 <div className="flex gap-3">
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-brand-cyan border border-slate-100 transition-all shadow-sm"><Download size={18}/></button>
                 </div>
              </div>

              {filteredLeads.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center opacity-30 py-20 grayscale scale-90">
                    <Shield size={100} className="text-slate-200 mb-6" />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] text-center">لا توجد خيوط مستخلصة حالياً.<br/>ابدأ عملية المسح للتحقق.</p>
                 </div>
              ) : viewMode === 'list' ? (
                 <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                    {filteredLeads.map(lead => (
                       <div key={lead.id} className={`group p-8 bg-slate-50 rounded-[2.5rem] border hover:border-brand-cyan/30 transition-all relative overflow-hidden shadow-sm hover:shadow-prof ${lead.feedback === 'verified' ? 'border-brand-success/50 bg-green-50/30' : lead.feedback === 'rejected' ? 'border-brand-red/50 bg-red-50/30 opacity-60' : 'border-slate-100'}`}>
                          <div className={`absolute top-0 right-0 w-2 h-full ${lead.reliability === 'High' ? 'bg-brand-success' : lead.reliability === 'Medium' ? 'bg-brand-gold' : 'bg-red-400'}`}></div>
                          
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                             <div className="flex items-center gap-4">
                                <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-brand-cyan uppercase tracking-widest shadow-sm">
                                   {lead.source}
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">النوع:</span>
                                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{lead.type}</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100">
                                    <MapPin size={10} className="text-slate-400"/>
                                    <span className="text-[9px] font-bold text-slate-600">{lead.locationName}</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <span className="text-[9px] font-mono text-slate-400">{lead.date} • {lead.timestamp}</span>
                                {lead.feedback === 'verified' && <span className="text-[9px] font-black text-brand-success flex items-center gap-1"><CheckCircle2 size={12}/> تم التحقق</span>}
                                {lead.feedback === 'rejected' && <span className="text-[9px] font-black text-brand-red flex items-center gap-1"><XCircle size={12}/> مرفوض</span>}
                             </div>
                          </div>
                          
                          <p className="text-base font-bold text-slate-800 leading-relaxed mb-6 italic">"{lead.content}"</p>
                          
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200/50">
                             <div className="flex gap-3">
                                 <button onClick={() => sendToForensics(lead)} className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-black hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                    <FileSearch size={14} /> إرسال للمختبر التقني
                                 </button>
                                 <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:text-brand-gold hover:border-brand-gold transition-all flex items-center gap-2">
                                    <Link2 size={14} /> ربط بالملف
                                 </button>
                             </div>
                             
                             <div className="flex gap-2">
                                 <button 
                                    onClick={() => handleFeedback(lead.id, 'verified')}
                                    className={`p-2 rounded-xl border transition-all ${lead.feedback === 'verified' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-400 border-slate-200 hover:text-green-500 hover:border-green-500'}`}
                                    title="تأكيد المعلومة"
                                 >
                                     <CheckCircle2 size={16} />
                                 </button>
                                 <button 
                                    onClick={() => handleFeedback(lead.id, 'rejected')}
                                    className={`p-2 rounded-xl border transition-all ${lead.feedback === 'rejected' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-400 border-slate-200 hover:text-red-500 hover:border-red-500'}`}
                                    title="رفض / غير ذي صلة"
                                 >
                                     <XCircle size={16} />
                                 </button>
                             </div>
                          </div>
                       </div>
                    ))
                 }
                 </div>
              ) : (
                 <div className="flex-1 bg-slate-100 rounded-[2.5rem] relative overflow-hidden shadow-inner flex items-center justify-center">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("https://api.maptiler.com/maps/basic-v2-dark/256/5/18/12.png")', backgroundSize: 'cover'}}></div>
                    <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
                    
                    {/* Map Markers */}
                    {filteredLeads.map(lead => (
                        <div 
                            key={lead.id} 
                            className="absolute group cursor-pointer"
                            style={{ top: `${lead.coordinates.y}%`, left: `${lead.coordinates.x}%` }}
                        >
                            <div className="relative">
                                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${lead.activityType === 'Hostile' ? 'bg-red-500' : lead.activityType === 'Suspicious' ? 'bg-brand-gold' : 'bg-slate-400'} animate-pulse`}></div>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-xl text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                    <p className="text-slate-800">{lead.locationName}</p>
                                    <p className="text-slate-500">{lead.type}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg text-[9px] font-black text-slate-500">
                        <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Hostile</div>
                        <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-brand-gold"></div> Suspicious</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Neutral</div>
                    </div>
                 </div>
              )}

              {filteredLeads.length > 0 && viewMode === 'list' && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                   <div className="flex items-start gap-4">
                      <ShieldCheck size={24} className="text-brand-success shrink-0" />
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed max-w-xl italic">
                         تنبيه سيادي: تم استخلاص هذه البيانات عبر أتمتة المصادر المفتوحة. يوصى دائماً بمطابقتها مهنياً مع "خزنة مسند" والبصمة الرقمية للصور قبل اعتمادها في أي تحقيق نهائي.
                      </p>
                   </div>
                   <button className="px-10 py-4 bg-brand-cyan/10 text-brand-cyan text-[11px] font-black uppercase rounded-2xl border border-brand-cyan/20 hover:bg-brand-cyan hover:text-white transition-all shadow-sm">
                      تصدير تقرير OSINT المختوم
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OSINTDashboard;
