
import { Tool } from './types';

export const TOOLS_LIST: Tool[] = [
  // Module 1: YemenJPT Models (The Brains)
  { id: 'yemenjpt-pro', name: 'YemenJPT Pro', description: 'النموذج الاستقصائي الأقوى للتحليل المعمق والاستدلال القانوني.', url: '#', category: 'AI وذكاء معرفي', tags: ['Investigative', 'Legal'], installationType: 'docker', status: 'active', tier: ['متقدم'] },
  { id: 'yemenjpt-flash', name: 'YemenJPT Flash', description: 'نموذج سريع جداً للتلخيص والدردشة التفاعلية اللحظية.', url: '#', category: 'AI وذكاء معرفي', tags: ['Fast', 'Summary'], installationType: 'docker', status: 'active', tier: ['أساسي'] },
  { id: 'yemenjpt-vision', name: 'YemenJPT Vision', description: 'محرك تحليل الوسائط المتعددة وكشف التلاعب البصري.', url: '#', category: 'التحقق والجنايات الرقمية', tags: ['Forensics', 'Vision'], installationType: 'docker', status: 'active', tier: ['متقدم'] },
  { id: 'yemenjpt-map', name: 'YemenJPT Map', description: 'نموذج متخصص في تحليل البيانات الجغرافية والخرائط السيادية.', url: '#', category: 'الرصد الجيومكاني', tags: ['GeoINT', 'OSM'], installationType: 'docker', status: 'active', tier: ['متقدم'] },
  { id: 'yemenjpt-audio', name: 'YemenJPT Audio', description: 'محرك مُنصت: تفريغ اللهجات اليمنية وتنقية التسجيلات الميدانية.', url: '#', category: 'التحقق والجنايات الرقمية', tags: ['Audio', 'Forensics', 'Dialects'], installationType: 'python', status: 'active', tier: ['أساسي', 'متقدم'] },

  // Module 2: Intelligence Tools
  { id: 'searxng', name: 'SearXNG Sovereign', description: 'محرك بحث فوقي مشفر لا يترك أي أثر رقمي.', url: '#', category: 'OSINT واستخبارات', tags: ['Privacy', 'Search'], installationType: 'docker', status: 'active', tier: ['أساسي'] },
  { id: 'spiderfoot', name: 'SpiderFoot Auto', description: 'أتمتة جمع المعلومات الاستخباراتية عن الأهداف الرقمية.', url: '#', category: 'OSINT واستخبارات', tags: ['OSINT', 'Auto'], installationType: 'docker', status: 'active', tier: ['متقدم'] }
];
