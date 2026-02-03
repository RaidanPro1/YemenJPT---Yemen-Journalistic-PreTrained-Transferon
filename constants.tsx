
import { Tool } from './types';

export const TOOLS_LIST: Tool[] = [
  // Module 1: AI & Cognitive Core (The Brain)
  { id: 'allam-core', name: 'ALLAM Core', description: 'المحرك السيادي للذكاء الاصطناعي العربي المتقدم.', url: '#', category: 'AI وذكاء معرفي', tags: ['Arabic-LLM', 'Sovereign'], installationType: 'docker', status: 'active', tier: ['أساسي', 'متقدم'] },
  { id: 'lobe-chat', name: 'Lobe Chat', description: 'منصة محادثة متطورة تدعم الوكلاء (Agents) والملحقات.', url: 'https://github.com/lobehub/lobe-chat', category: 'AI وذكاء معرفي', tags: ['Agents', 'Modern-UI'], installationType: 'docker', status: 'active', tier: ['متقدم'] },

  // Module: The Forensics (The Labs) - NEW
  { id: 'mklab-forensics', name: 'MKLab Forensic Suite', description: 'خوارزميات ELA و CFA و Noise لكشف التلاعب بالصور.', url: '#', category: 'التحقق والجنايات الرقمية', tags: ['Forensics', 'Verification'], installationType: 'docker', status: 'active', tier: ['متقدم'] },
  { id: 'demucs-audio', name: 'Demucs Stem Splitter', description: 'فصل طبقات الصوت (خلفية، كلام) للتحقيق في التسجيلات الميدانية.', url: '#', category: 'التحقق والجنايات الرقمية', tags: ['Audio-Forensics', 'AI'], installationType: 'python', status: 'active', tier: ['متقدم'] },
  { id: 'visil-video', name: 'ViSiL Video Hash', description: 'كشف تكرار الفيديوهات والمحتوى المعاد تدويره.', url: '#', category: 'التحقق والجنايات الرقمية', tags: ['Video-Check', 'Hash'], installationType: 'python', status: 'active', tier: ['متقدم'] },

  // Module: The Idrisi (GeoINT)
  { id: 'tileserver-gl', name: 'Sovereign TileServer', description: 'خادم خرائط محلي يعتمد على OpenStreetMap لضمان الخصوصية.', url: 'https://github.com/maptiler/tileserver-gl', category: 'الرصد الجيومكاني', tags: ['Maps', 'Sovereign', 'OSM'], installationType: 'docker', status: 'active', tier: ['متقدم'] },
  { id: 'osmnx', name: 'OSMnx Analyst', description: 'تحليل شبكات الطرق والبنية التحتية وكشف خطوط الإمداد.', url: 'https://github.com/gboeing/osmnx', category: 'الرصد الجيومكاني', tags: ['Python', 'Analysis', 'Routes'], installationType: 'python', status: 'active', tier: ['متقدم'] },

  // Module: Intelligence & OSINT
  { id: 'searxng', name: 'SearXNG', description: 'محرك بحث فوقي (Meta) مجهول الهوية وقابل للتخصيص.', url: 'https://github.com/searxng/searxng-docker', category: 'OSINT واستخبارات', tags: ['Search', 'Privacy'], installationType: 'docker', status: 'active', tier: ['أساسي'] },
  { id: 'spiderfoot', name: 'SpiderFoot', description: 'أداة أتمتة لجمع المعلومات الاستخباراتية.', url: 'https://github.com/smicallef/spiderfoot', category: 'OSINT واستخبارات', tags: ['Automation', 'Reconnaissance'], installationType: 'docker', status: 'active', tier: ['متقدم'] },
  { id: 'maigret', name: 'Maigret', description: 'جمع ملفات استخباراتية شاملة عن الحسابات (Dossiers).', url: 'https://github.com/soxoj/maigret', category: 'OSINT واستخبارات', tags: ['Deep-Recon', 'Dossier'], installationType: 'python', status: 'active', tier: ['متقدم'] }
];
