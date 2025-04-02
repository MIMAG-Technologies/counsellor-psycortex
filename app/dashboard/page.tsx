'use client'

import { useEffect, useState } from 'react'
import Sidebar from "../../components/sidebar/page"
import axios from 'axios'
import Loader from '../../components/loader'
import { useAuth } from '@/context/AuthContext'
import fetchProfile from '@/utils/profile'
import { CounselorData, CounselorProfileData } from '@/types/profile/profile'
import { FaVideo, FaCommentDots, FaPhone, FaUser, FaStar, FaThumbsUp, FaCalendarTimes } from "react-icons/fa";

export interface CounselorStatsResponse {
  success: boolean;
  counsellorId: string;
  dateRange: {
    filter: string;
    startDate: string;
    endDate: string;
  };
  commissionRates: {
    video: string;
    chat: string;
    phone: string;
    offline: string;
    testRecommendation: string;
  };
  sessionCounts: {
    video: number;
    chat: number;
    phone: number;
    offline: number;
    total: number;
  };
  testReferrals: number;
  earnings: {
    video: string;
    chat: string;
    phone: string;
    offline: string;
    testRecommendation: string;
    total: string;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Dashboard = () => {
  const { me } = useAuth();
  const [stats, setStats] = useState<CounselorStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [counsellor, setCounsellor] = useState<CounselorData | null>(null);
  
  const fetchDashboard = async () => {
    try {
      if(me === null) return null;
      const api = `${BASE_URL}/counsellor/get_counsellors_work.php?counsellorId=${me.id}&filter=custom&startDate=2025-01-01&endDate=2025-04-01`;
      const response = await axios.get<CounselorStatsResponse>(api);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return null;
    }
  };

  const fetchCounsellorProfile = async () => {
    try {
      if (!me || !me.id) return null;
      const response = await fetchProfile();
      return response as CounselorProfileData;
    } catch (error) {
      console.error("Error fetching counselor profile:", error);
      return null;
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Fetch stats data
      const statsData = await fetchDashboard();
      if (statsData) {
        setStats(statsData);
      }
      
      // Fetch counselor profile data
      const profileData = await fetchCounsellorProfile();
      if (profileData && profileData.success) {
        setCounsellor(profileData.data);
      }
      
      setLoading(false);
    };

    loadData();
  }, [me]);

  if (loading) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar />
        <div className="flex-grow flex justify-center items-center">
          <Loader />
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="flex flex-row bg-white min-h-screen">
        <div>
          <Sidebar />
        </div>
        <div className="ml-16 p-7 text-2xl text-gray-800 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">Failed to load data</div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-600">Counselor Dashboard</h1>
            {counsellor && (
              <p className="text-gray-500">
                Welcome back, {counsellor.personalInfo.name}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 text-xl">Total Sessions</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.sessionCounts.total}</div>
            <div className="text-gray-600">All session types</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 text-xl">Test Referrals</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.testReferrals}</div>
            <div className="text-gray-600">Total recommendations</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 text-xl">Total Earnings</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-500 mb-1">₹{stats.earnings.total}</div>
            <div className="text-gray-600">Combined income</div>
          </div>
        </div>

        {/* Session Type Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Video Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 text-xl">Video Calls</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <FaVideo className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.sessionCounts.video}</div>
            <div className="text-gray-600">Live video consultations</div>
          </div>

          {/* Chat Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 text-xl">Chat Interactions</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <FaCommentDots className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.sessionCounts.chat}</div>
            <div className="text-gray-600">Quick text conversations</div>
          </div>

          {/* Phone Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 text-xl">Phone Calls</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <FaPhone className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.sessionCounts.phone}</div>
            <div className="text-gray-600">Voice-based consultations</div>
          </div>

          {/* Offline Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 text-xl">In-Person Meetings</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <FaUser className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-500 mb-1">{stats.sessionCounts.offline}</div>
            <div className="text-gray-600">Face-to-face interactions</div>
          </div>
        </div>

        {/* Profile Metrics Section */}
        {counsellor && counsellor.metrics && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Rating */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-800 text-xl">Average Rating</span>
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <FaStar className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-500 mb-1">
                  {counsellor.metrics.averageRating.toFixed(1)}
                </div>
                <div className="text-gray-600">From {counsellor.metrics.totalReviews} reviews</div>
              </div>

              {/* Response Rate */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-800 text-xl">Response Rate</span>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FaThumbsUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-500 mb-1">
                  {counsellor.metrics.responseRate}%
                </div>
                <div className="text-gray-600">Client message responses</div>
              </div>

              {/* Cancellation Rate */}
              <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-800 text-xl">Cancellation Rate</span>
                  <div className="bg-red-50 p-2 rounded-lg">
                    <FaCalendarTimes className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-500 mb-1">
                  {counsellor.metrics.cancellationRate}%
                </div>
                <div className="text-gray-600">Last-minute cancellations</div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {counsellor && counsellor.verificationStatus && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300 mb-8">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${counsellor.verificationStatus.isVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <svg className={`w-6 h-6 ${counsellor.verificationStatus.isVerified ? 'text-green-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Profile Verification</div>
                  <div className="text-sm text-gray-500">
                    {counsellor.verificationStatus.isVerified ? 'Your profile is verified' : 'Verification pending'}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${counsellor.verificationStatus.documentsVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <svg className={`w-6 h-6 ${counsellor.verificationStatus.documentsVerified ? 'text-green-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Document Status</div>
                  <div className="text-sm text-gray-500">
                    {counsellor.verificationStatus.documentsVerified ? 'Documents verified' : 'Document verification pending'}
                  </div>
                </div>
              </div>
            </div>
            
            {counsellor.verificationStatus.backgroundCheckDate && (
              <div className="mt-4 text-sm text-gray-500">
                Last background check: {new Date(counsellor.verificationStatus.backgroundCheckDate).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div> 
    </div>
  );
};

export default Dashboard;