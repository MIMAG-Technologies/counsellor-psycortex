import { ReactNode } from "react";

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant: "primary" | "secondary" | "outline" | "danger" | "success" | "info";
  fullWidth?: boolean;
}

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  variant, 
  fullWidth = false 
}: ActionButtonProps) {
  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    info: "bg-purple-600 text-white hover:bg-purple-700"
  };

  return (
    <button 
      onClick={onClick}
      className={`${variantStyles[variant]} rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-colors ${fullWidth ? 'w-full' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
