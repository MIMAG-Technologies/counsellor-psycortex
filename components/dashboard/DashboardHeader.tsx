import React from 'react';
import { CounselorData } from '@/types/profile/profile';

interface DashboardHeaderProps {
  counsellor: CounselorData | null;
  isVerified: boolean;
  onVerify: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  counsellor,
  isVerified,
  onVerify
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-600">Counselor Dashboard</h1>
        {!isVerified && (
          <button
            onClick={onVerify}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
            Verify Account
          </button>
        )}
      </div>
      {counsellor && (
        <p className="text-gray-500">
          Welcome back, {counsellor.personalInfo.name}
        </p>
      )}
    </div>
  );
};

export default DashboardHeader; 