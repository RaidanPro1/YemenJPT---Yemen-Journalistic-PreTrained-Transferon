
import React, { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'med' | 'high';
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      priority: 'med'
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-brand-gold/70 uppercase tracking-[0.2em]">
          قائمة المهام اليومية
        </h3>
        <span className="bg-slate-100 dark:bg-black/30 px-2 py-0.5 rounded text-[10px] font-black text-slate-500">{tasks.length}</span>
      </div>
      
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="إضافة مهمة استقصائية..."
          className="flex-1 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-cyan transition-all placeholder:text-slate-500"
        />
        <button type="submit" className="bg-brand-cyan text-white w-10 rounded-xl flex items-center justify-center shadow-cyber transition-transform active:scale-95">+</button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-20 grayscale">
             <span className="text-3xl mb-2">📋</span>
             <p className="text-[10px] font-black uppercase tracking-widest">No pending tasks</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${task.completed ? 'bg-slate-50/50 dark:bg-black/10 border-transparent opacity-50' : 'bg-white dark:bg-brand-panel border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-cyan/30'}`}>
                <button 
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-brand-cyan border-brand-cyan text-white' : 'border-slate-300 dark:border-slate-700'}`}
                >
                  {task.completed && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className={`flex-1 text-xs font-bold leading-relaxed ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {task.text}
                </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
