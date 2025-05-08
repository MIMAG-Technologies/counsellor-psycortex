'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchDashboard } from '@/utils/dashboard/fetchDashboard'
import fetchProfile from '@/utils/profile'
import { handleVerification, checkVerificationStatus } from '@/utils/verification'
import { toast } from 'react-toastify'
import { CounselorData, CounselorProfileData } from '@/types/profile/profile'
import { CounselorStatsResponse } from './types'

// Dashboard Components
import {
  DashboardHeader,
  OverviewStats,
  SessionStats,
  MetricsSection,
  VerificationStatus
} from '@/components/dashboard'
import Loader from '@/components/loader'

const Dashboard = () => {
  const { me } = useAuth();
  const [stats, setStats] = useState<CounselorStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [counsellor, setCounsellor] = useState<CounselorData | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  const fetchDashboardData = async () => {
    try {
      if(!me) return null;
      
      const statsData = await fetchDashboard({
        counsellorId: me.id,
        filter: 'custom',
        startDate: '2025-01-01',
        endDate: '2025-04-01'
      });
      
      return statsData;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(true);
      return null;
    }
  };

  const fetchCounsellorProfile = async () => {
    try {
      if (!me || !me.id) return null;
      const response = await fetchProfile(me.id);
      return response as CounselorProfileData;
    } catch (error) {
      console.error("Error fetching counselor profile:", error);
      setError(true);
      return null;
    }
  };

  const initiateVerification = async () => {
    if (!me?.id) {
      toast.error('Counsellor ID not found');
      return;
    }
    
    await handleVerification({
      counsellorId: me.id,
      onSuccess: () => setIsVerified(true),
      onError: (error) => console.error('Verification error:', error)
    });
  };
  
  const loadData = async () => {
    setLoading(true);
    setError(false);
    
    // Fetch stats data
    const statsData = await fetchDashboardData();
    if (statsData) {
      setStats(statsData);
    }
    
    // Fetch counselor profile data
    const profileData = await fetchCounsellorProfile();
    if (profileData && profileData.success) {
      setCounsellor(profileData.data);
    }
    
    // Check verification status
    if (me) {
      const verificationStatus = await checkVerificationStatus(me.id);
      setIsVerified(verificationStatus);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  if (loading) {
    return <Loader />;
  }

  if (error || !stats) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load dashboard data</div>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader 
        counsellor={counsellor} 
        isVerified={isVerified} 
        onVerify={initiateVerification} 
      />

      <OverviewStats 
        totalSessions={stats.sessionCounts.total} 
        testReferrals={stats.testReferrals} 
        totalEarnings={stats.earnings.total} 
      />

      <SessionStats sessionCounts={stats.sessionCounts} />

      {counsellor && counsellor.metrics && (
        <MetricsSection metrics={counsellor.metrics} />
      )}

      {counsellor && counsellor.verificationStatus && (
        <VerificationStatus verificationStatus={counsellor.verificationStatus} />
      )}
    </>
  );
};

export default Dashboard; 