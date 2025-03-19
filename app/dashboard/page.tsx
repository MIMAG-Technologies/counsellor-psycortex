'use client'

import { useEffect, useState } from 'react'
import Sidebar from "../components/sidebar/page"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts'
import axios from 'axios'

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.psycortex.in';

const fetchDashboard = async (counselorId: string = 'c123456') => {
  try {
    const api = `${BASE_URL}/counsellor/get_counsellors_work.php?counsellorId=c123456&filter=custom&startDate=2025-01-01&endDate=2025-04-01`;
    const response = await axios.get<CounselorStatsResponse>(api);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState<CounselorStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const data = await fetchDashboard();
      if (data) {
        setStats(data);
      }
      setLoading(false);
    };

    loadDashboard();
  }, []);

  const commissionRatesData = stats ? [
    { name: 'Video', rate: parseFloat(stats.commissionRates.video), fill: '#4C51BF' },
    { name: 'Chat', rate: parseFloat(stats.commissionRates.chat), fill: '#38B2AC' },
    { name: 'Phone', rate: parseFloat(stats.commissionRates.phone), fill: '#ED8936' },
    { name: 'Offline', rate: parseFloat(stats.commissionRates.offline), fill: '#9F7AEA' },
    { name: 'Test', rate: parseFloat(stats.commissionRates.testRecommendation), fill: '#ED64A6' }
  ] : [];

  const sessionData = stats ? [
    { name: 'Video', count: stats.sessionCounts.video, fill: '#4C51BF' },
    { name: 'Chat', count: stats.sessionCounts.chat, fill: '#38B2AC' },
    { name: 'Phone', count: stats.sessionCounts.phone, fill: '#ED8936' },
    { name: 'Offline', count: stats.sessionCounts.offline, fill: '#9F7AEA' }
  ] : [];

  const earningsData = stats ? [
    { name: 'Video', value: parseFloat(stats.earnings.video), fill: '#4C51BF' },
    { name: 'Chat', value: parseFloat(stats.earnings.chat), fill: '#38B2AC' },
    { name: 'Phone', value: parseFloat(stats.earnings.phone), fill: '#ED8936' },
    { name: 'Offline', value: parseFloat(stats.earnings.offline), fill: '#9F7AEA' },
    { name: 'Test Rec.', value: parseFloat(stats.earnings.testRecommendation), fill: '#ED64A6' }
  ] : [];

  const COLORS = ['#4C51BF', '#38B2AC', '#ED8936', '#9F7AEA', '#ED64A6'];

  if (loading) {
    return (
      <div className="flex flex-row bg-white min-h-screen">
        <div>
          <Sidebar />
        </div>
        <div className="ml-16 p-7 text-2xl text-gray-800 flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 bg-gray-300 rounded mx-auto mb-4"></div>
            <div className="text-purple-500">Loading dashboard data...</div>
          </div>
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
          <div className='flex flex-col'>
            <h1 className="text-2xl   font-semibold text-gray-700">Counselor Dashboard</h1>
            <p className="text-md font-medium text-gray-500">
              Data for {stats.dateRange.startDate} to {stats.dateRange.endDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-purple-600 font-medium">Total Sessions</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.sessionCounts.total}</div>
            <div className="text-purple-600 text-sm">All session types</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-purple-600 font-medium">Test Referrals</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.testReferrals}</div>
            <div className="text-purple-600 text-sm">Total recommendations</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-purple-600 font-medium">Total Earnings</span>
              <div className="bg-purple-50 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">₹{stats.earnings.total}</div>
            <div className="text-purple-600 text-sm">Combined income</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6  shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <div className="text-gray-600 font-medium">Video Sessions</div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.sessionCounts.video}</div>
            <div className="text-blue-500 font-medium mt-2">₹{stats.earnings.video}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-teal-600">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
              <div className="text-gray-600 font-medium">Chat Sessions</div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.sessionCounts.chat}</div>
            <div className="text-teal-500 font-medium mt-2">₹{stats.earnings.chat}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-600">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <div className="text-gray-600 font-medium">Phone Sessions</div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.sessionCounts.phone}</div>
            <div className="text-orange-500 font-medium mt-2">₹{stats.earnings.phone}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-600">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <div className="text-gray-600 font-medium">Offline Sessions</div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.sessionCounts.offline}</div>
            <div className="text-purple-500 font-medium mt-2">₹{stats.earnings.offline}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Session Distribution</h2>
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Last 3 months</div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sessionData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  <Legend />
                  <Bar dataKey="count" name="Sessions" radius={[4, 4, 0, 0]}>
                    {sessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Commission Rates</h2>
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">By Session Type</div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={commissionRatesData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="Rate (%)" 
                    stroke="#4F46E5" 
                    strokeWidth={3} 
                    dot={{ r: 6, strokeWidth: 2 }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;