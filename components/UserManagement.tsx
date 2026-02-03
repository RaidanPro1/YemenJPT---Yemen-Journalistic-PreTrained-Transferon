
import React, { useState } from 'react';
import { 
  Users, UserPlus, ShieldCheck, Lock, Key, 
  Search, MoreVertical, Trash2, Edit3, ShieldAlert,
  Activity, Eye, EyeOff, CheckCircle2, XCircle
} from 'lucide-react';
import RootAuthGuard from './RootAuthGuard';

interface UserIdentity {
  id: string;
  name: string;
  email: string;
  role: 'Journalist' | 'Lead Investigator' | 'Root Admin';
  status: 'active' | 'suspended' | 'pending';
  org: string;
  lastActive: string;
  securityLevel: number;
}

const UserManagementContent: React.FC<{ authToken: string }> = ({ authToken }) => {
  const [users, setUsers] = useState<UserIdentity[]>([
    { id: '1', name: 'أحمد المحقق', email: 'a.investigator@raidan.pro', role: 'Lead Investigator', status: 'active', org: 'وحدة التحقق الجنائي', lastActive: 'الآن', securityLevel: 4 },
    { id: '2', name: 'سارة الصحفية', email: 'sara.field@raidan.pro', role: 'Journalist', status: 'active', org: 'مكتب تعز الميداني', lastActive: 'منذ ساعتين', securityLevel: 2 },
    { id: '3', name: 'نظام رادان', email: 'root@raidan.pro', role: 'Root Admin', status: 'active', org: 'النواة السيادية', lastActive: 'نشط', securityLevel: 5 },
    { id: '4', name: 'مستخدم تجريبي', email: 'test@yemenjpt.local', role: 'Journalist', status: 'suspended', org: 'خارجي', lastActive: 'منذ شهر', securityLevel: 1 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Root Admin': return 'text-brand-red bg-brand-red/5 border-brand-red/10';
      case 'Lead Investigator': return 'text-brand-gold bg-brand-gold/5 border-brand-gold/10';
      default: return 'text-brand-cyan bg-brand-cyan/5 border-brand-cyan/10';
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">إدارة الهوية والوصول (IAM)</h2>
          <p className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
            <ShieldCheck size={14} /> Sovereign Identity & Access Control
          </p>
        </div>
        <button className="px-8 py-4 bg-brand-cyan text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-3">
          <UserPlus size={18} /> إضافة عضو جديد للأسطول
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-brand-cyan/10 rounded-2xl flex items-center justify-center text-brand-cyan">
              <Users size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الهويات</p>
              <p className="text-3xl font-black text-slate-900">{users.length}</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold">
              <Activity size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الجلسات النشطة</p>
              <p className="text-3xl font-black text-slate-900">3</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red">
              <ShieldAlert size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">محاولات وصول مرفوضة</p>
              <p className="text-3xl font-black text-slate-900">12</p>
           </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">قائمة أعضاء النواة</h3>
           <div className="relative w-full md:w-80">
              <Search className="absolute right-4 top-3 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="البحث بالاسم أو البريد..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-12 pl-4 text-xs outline-none focus:border-brand-cyan transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="p-6">المستخدم</th>
                <th className="p-6">المنظمة / الوحدة</th>
                <th className="p-6">الرتبة</th>
                <th className="p-6">مستوى الأمان</th>
                <th className="p-6">الحالة</th>
                <th className="p-6">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 group-hover:bg-brand-cyan group-hover:text-white transition-all">
                          {user.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-600">{user.org}</td>
                  <td className="p-6 text-xs">
                    <span className={`px-3 py-1 rounded-lg border font-black text-[9px] uppercase tracking-wider ${getRoleColor(user.role)}`}>
                       {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-1">
                       {[1, 2, 3, 4, 5].map(i => (
                         <div key={i} className={`w-3 h-1 rounded-full ${i <= user.securityLevel ? 'bg-brand-cyan' : 'bg-slate-200'}`}></div>
                       ))}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       {user.status === 'active' ? (
                         <CheckCircle2 size={14} className="text-brand-success" />
                       ) : (
                         <XCircle size={14} className="text-brand-red" />
                       )}
                       <span className="text-[10px] font-black uppercase text-slate-500">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-brand-cyan hover:bg-brand-cyan/5 rounded-lg transition-all"><Edit3 size={16}/></button>
                       <button className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all"><Trash2 size={16}/></button>
                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Logs Strip */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-gold">
               <Lock size={24} />
            </div>
            <div>
               <p className="text-xs font-black text-white">بروتوكول "تعتيم الهوية" نشط</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dynamic Identity Masking is Enabled for field ops</p>
            </div>
         </div>
         <button className="px-6 py-2 border border-white/20 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-xl hover:text-brand-cyan hover:border-brand-cyan transition-all">
            عرض سجلات الوصول الجنائي
         </button>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => (
  <div className="h-full relative">
    <RootAuthGuard>
      {(token) => <UserManagementContent authToken={token} />}
    </RootAuthGuard>
  </div>
);

export default UserManagement;
