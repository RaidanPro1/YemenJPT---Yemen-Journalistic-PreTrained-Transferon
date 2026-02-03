export type ToolCategory = 
  | 'AI وذكاء معرفي' 
  | 'OSINT واستخبارات' 
  | 'التحقق والجنايات الرقمية' 
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
  // FIX: Added optional invocationCmd to allow for custom command definitions.
  invocationCmd?: string;
}