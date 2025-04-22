import { ReactNode } from "react";

interface SessionInfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function SessionInfoItem({ icon, label, value }: SessionInfoItemProps) {
  return (
    <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <span className="text-sm text-gray-500">{label}</span>
          <p className="text-gray-900 font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}