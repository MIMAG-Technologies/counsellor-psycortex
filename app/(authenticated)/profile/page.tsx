'use client'
import React, { useEffect, useState } from 'react';
import { CounselorData } from '@/types/profile/profile';
import fetchProfile from '@/utils/profile';
import Loader from '@/components/loader';
import { useAuth } from '@/context/AuthContext';
import ProfileDetails from '@/components/profile/ProfileDetails';

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
    return <Loader />;
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold text-indigo-500 mb-4">Profile Not Found</h1>
        <p className="text-gray-600">
          We couldn't load your profile information. Please try again later or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1150px] mx-auto rounded-2xl overflow-hidden">
      <ProfileDetails data={data} />
    </div>
  );
} 