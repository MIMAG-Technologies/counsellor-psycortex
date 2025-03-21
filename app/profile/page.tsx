'use client';

import Sidebar from "../components/sidebar/page";
import { useState, useEffect } from "react";
import fetchProfile from "../utils/profile";
import { CounsellorData } from "../types/profile/profile";
import { MdEmail, MdPhone, MdPerson, MdEdit } from "react-icons/md";

const Profile = () => {
  const [profile, setProfile] = useState<CounsellorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-16 md:ml-64">
        <div className="p-6">
          <h1 className="text-indigo-500 font-bold text-3xl mb-8">My Profile</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-16 w-16"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Top Section: Profile Card & About Me */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
                    
                    <div className="px-4 py-6 text-center flex-1 flex flex-col">
                      <div className="w-20 mt-1 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-500 shadow-lg border-l-indigo-500  mb-4">
                        {profile?.personalInfo.profileImage ? (
                          <img
                            src={profile.personalInfo.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <MdPerson size={32} className="text-white" />
                        )}
                      </div>

                      <h2 className="text-xl font-semibold text-gray-800 mb-1">{profile?.personalInfo.name || "Dr. Sarah Johnson"}</h2>
                      <p className="text-gray-500 text-sm">{profile?.personalInfo.phone || "+1234567890"}</p>

                      <div className="mt-auto">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <MdEdit size={16} />
                          <span>Edit Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Me with Unique Styling */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-xl shadow-md border-l-4 border-indigo-500 overflow-hidden h-full flex flex-col">
                    <div className="p-6 flex-1">
                      <h3 className="text-lg font-semibold text-indigo-500 mb-4 flex items-center">
                        <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                          <MdPerson className="text-indigo-500" size={20} />
                        </span>
                        About Me
                      </h3>
                      <p className="text-gray-700">
                        {profile?.personalInfo.biography || "As a licensed clinical psychologist with over 15 years of experience, I specialize in cognitive behavioral therapy and mindfulness-based approaches. I have extensive experience working with anxiety, depression, trauma, and relationship issues."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Contact Information */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-purple-500 mb-4 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3">
                      <MdPhone className="text-purple-500" size={20} />
                    </span>
                    Contact Information
                  </h3>

                  {/* Horizontal Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                      <span className="bg-indigo-100 p-2 rounded-lg mr-4">
                        <MdEmail className="text-indigo-500" size={20} />
                      </span>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-gray-700">{profile?.personalInfo.email || "sarah.johnson@example.com"}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                      <span className="bg-purple-100 p-2 rounded-lg mr-4">
                        <MdPhone className="text-purple-500" size={20} />
                      </span>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-gray-700">{profile?.personalInfo.phone || "+1234567890"}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
