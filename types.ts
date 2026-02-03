
export type ToolCategory = 
  | 'AI وذكاء معرفي' 
  | 'أبحاث المصادر المفتوحة' // Changed from OSINT to match previous updates
  | 'التحقق والتدقيق الرقمي' // Changed from Forensic to Verification
  | 'تتبع الأموال والشركات' 
  | 'الرصد الجيومكاني' 
  | 'علم البيانات والتحليل'
  | 'الأمن والعمليات السيادية' 
  | 'إدارة البنية التحتية';

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ToolCategory;
  tags: string[];
  installationType: 'docker' | 'npm' | 'binary' | 'python';
  status: 'active' | 'deploying' | 'offline';
  tier: ('أساسي' | 'متقدم')[];
  invocationCmd?: string;
}
