import React from 'react';

interface ToolCardProps {
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'offline' | 'deploying';
  isSelected: boolean;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ name, description, icon, status, isSelected, onClick }) => {

  const getStatusColor = (status: 'active' | 'offline' | 'deploying') => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'deploying': return 'bg-yellow-500 animate-pulse';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg
        flex flex-col cursor-pointer transition-all duration-300 ease-in-out
        ${isSelected
          ? 'scale-105 border-brand-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)]'
          : 'hover:border-brand-cyan/50 hover:shadow-xl'
        }
      `}
    >
      <div className="transition-transform duration-300 ease-in-out group-hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="text-2xl">{icon}</div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-white text-sm">{name}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{description}</p>
          </div>
          <div className={`ml-auto w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(status)}`}></div>
        </div>
      </div>
      
      {/* This invisible element helps maintain card height during the parallax effect */}
      <div className="h-[4px] w-full opacity-0"></div>

    </div>
  );
};

export default ToolCard;
