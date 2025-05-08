'use client'
import React, { useEffect, useState } from 'react';
import { CounselorData } from '@/types/profile/profile';
import fetchProfile from '@/utils/profile';
import Loader from '@/components/loader';
import { useAuth } from '@/context/AuthContext';
import ProfileDetails from '@/components/profile/ProfileDetails';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [data, setData] = useState<CounselorData | null>(null);
  const [loading, setLoading] = useState(true);
  const { me } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!me || me.id === null) {
        setLoading(false);
        return;
      }
      try {
        const profileData = await fetchProfile(me.id);
        if (profileData && profileData.success) {
          setData(profileData.data);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [me]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="bg-white shadow-xl rounded-2xl p-10 border border-indigo-100 max-w-md w-full">
          <svg 
            className="w-20 h-20 text-indigo-200 mx-auto mb-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h1 className="text-2xl font-bold text-indigo-600 mb-4 text-center">Profile Not Found</h1>
          <p className="text-gray-600 text-center">
            We couldn't load your profile information. Please try again later or contact support.
          </p>
          <button className="mt-6 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg w-full transition-all duration-200 shadow-md hover:shadow-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="w-full mx-auto rounded-2xl overflow-hidden bg-white shadow-xl border border-indigo-100/50">
        <ProfileDetails data={data} />
      </div>
    </motion.div>
  );
} 