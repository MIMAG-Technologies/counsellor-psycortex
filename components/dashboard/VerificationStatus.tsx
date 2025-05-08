import React from 'react';

interface VerificationStatusProps {
  verificationStatus: {
    isVerified: boolean;
    documentsVerified: boolean;
    backgroundCheckDate?: string;
  };
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ 
  verificationStatus 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300 mb-8">
      <h2 className="text-xl font-semibold text-gray-600 mb-4">Account Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${verificationStatus.isVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <svg className={`w-6 h-6 ${verificationStatus.isVerified ? 'text-green-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Profile Verification</div>
            <div className="text-sm text-gray-500">
              {verificationStatus.isVerified ? 'Your profile is verified' : 'Verification pending'}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${verificationStatus.documentsVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <svg className={`w-6 h-6 ${verificationStatus.documentsVerified ? 'text-green-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Document Status</div>
            <div className="text-sm text-gray-500">
              {verificationStatus.documentsVerified ? 'Documents verified' : 'Document verification pending'}
            </div>
          </div>
        </div>
      </div>
      
      {verificationStatus.backgroundCheckDate && (
        <div className="mt-4 text-sm text-gray-500">
          Last background check: {new Date(verificationStatus.backgroundCheckDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default VerificationStatus; 