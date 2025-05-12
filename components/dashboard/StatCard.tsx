import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  leftBorder?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  variant = 'primary',
  leftBorder = false
}) => {
  const variantClasses = {
    primary: {
      text: 'text-indigo-500',
      bg: 'bg-purple-50',
      border: 'border-indigo-500'
    },
    success: {
      text: 'text-green-500',
      bg: 'bg-green-50',
      border: 'border-green-500'
    },
    warning: {
      text: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-500'
    },
    danger: {
      text: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-500'
    }
  };

  const classes = variantClasses[variant];

  return (
    <div className={`bg-white rounded-xl p-6 shadow-md ${leftBorder ? `border-l-4 ${classes.border}` : 'border border-gray-300'}`}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-800 text-xl">{title}</span>
        <div className={`${classes.bg} p-2 rounded-lg flex items-center justify-center`}>
          <div className={`w-6 h-6 ${classes.text}`}>{icon}</div>
        </div>
      </div>
      <div className={`text-3xl font-bold ${classes.text} mb-1`}>{value}</div>
      <div className="text-gray-600">{description}</div>
    </div>
  );
};

export default StatCard; 