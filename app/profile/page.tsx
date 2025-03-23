'use client';

import Sidebar from "../components/sidebar/page";
import { useState, useEffect } from "react";
import fetchProfile from "../utils/profile";
import { CounsellorData } from "../types/profile/profile";
import { MdEmail, MdPerson, MdEdit } from "react-icons/md";
import { FaBriefcase, FaClock, FaDollarSign, FaStethoscope, } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdEventNote } from "react-icons/md";
import { MdChat, MdVideoCall, MdPhone } from "react-icons/md"
import { BsChatDots } from "react-icons/bs";
import Loader from "../components/loader";



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
            <Loader/>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Top Section: Profile Card & About Me */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl border-l-4 border-purple-500 shadow-md overflow-hidden h-full flex flex-col">
                    <div className="px-4 py-6 text-center flex-1 flex flex-col">
                      <div className="w-20 mt-1 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-500 shadow-lg border-l-indigo-500 mb-4">
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
                  <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-500 overflow-hidden h-full flex flex-col">
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

              {/* Contact Information */}
              <div className="bg-white border-l-4 mt-5 border-purple-500 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-indigo-500 mb-4 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3">
                      <MdPhone className="text-indigo-500" size={20} />
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
                        <p className="text-gray-700">{profile?.personalInfo.email}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                      <span className="bg-purple-100 p-2 rounded-lg mr-4">
                        <MdPhone className="text-indigo-500" size={20} />
                      </span>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-gray-700">{profile?.personalInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="grid grid-cols-2 gap-5">
  {/* Professional Experience */}
  <div className="bg-white border-l-4 border-purple-500 rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-indigo-500 mb-4 flex items-center">
        <span className="bg-purple-100 p-2 rounded-lg mr-3">
          <FaBriefcase className="text-indigo-500" size={20} />
        </span>
        Professional Experience
      </h3>
      <div className="flex items-center mt-4 bg-gray-50 rounded-lg p-4">
        <span className="bg-purple-100 p-2 rounded-lg mr-4">
          <FaBriefcase className="text-indigo-500" size={20} />
        </span>
        <div>
          <p className="text-xs text-gray-500">Total Experience</p>
          <p className="text-gray-700 text-lg">{profile?.professionalInfo?.yearsOfExperience || "10"} Years</p>
        </div>
      </div>
    </div>
  </div>

  {/* Education */}
  <div className="bg-white border-l-4 border-purple-500 rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-indigo-500 mb-4 flex items-center">
        <span className="bg-purple-100 p-2 rounded-lg mr-3">🎓</span>
        Education
      </h3>
      <div className="space-y-3 mt-4">
        {profile?.professionalInfo?.education && profile.professionalInfo.education.length > 0 ? (
          profile.professionalInfo.education.map((edu, index) => (
            <div key={index} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm">{edu.year}</div>
              <div className="ml-4">
                <h3 className="text-indigo-600 text-base">{edu.degree} in <span className="text-gray-700">{edu.field}</span></h3>
                <p className="text-gray-600 text-sm">{edu.institution}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center border border-gray-100">
            No Education History Found
          </div>
        )}
      </div>
    </div>
  </div>
</div>


    {/* Licenses & Certifications */}
  <div className="bg-white border-l-4 border-purple-500 rounded-xl shadow-md overflow-hidden mt-5">
  <div className="p-6">
    <h3 className=" font-semibold text-xl text-indigo-500 mb-4 flex items-center">
      <span className="bg-purple-100 p-2 rounded-lg mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-xl text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </span>
      Licenses & Certifications
    </h3>
    
    {profile?.professionalInfo?.licenses?.length ?? 0 > 0 ? (
      <div className="space-y-3 mt-4">
        {profile?.professionalInfo?.licenses.map((info, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            {/* License Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="font-medium text-blue-600">{info.licenseTitle}</h3>
              </div>
              <span className="bg-blue-100 text-green-600 px-3 py-1 rounded-full text-lg font-medium">
                Valid
              </span>
            </div>
            
            {/* License Details */}
            <div className="grid grid-cols-2 gap-y-2 bg--gray-100 p-3 rounded-lg">
              <div className="text-gray-700  text-lg">License Number</div>
              <div className="text-lg text-blue-600 ">{info.licenseNumber}</div>
              
              <div className="text-gray-700 text-lg">Issuing Authority</div>
              <div className=" text-blue-600 text-lg">{info.issuingAuthority}</div>
              
              <div className="text-gray-700 text-lg">Valid Until</div>
              <div className=" text-blue-600 text-lg">{info.validUntil}</div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center mt-4 border border-gray-200">
        No License Found
      </div>
    )}
  </div>
  </div>


          <div className="mt-8">
            <h1 className="text-xl text-indigo-500 font-semibold flex items-center gap-2 pb-2 border-b border-gray-200">
            <span><FaStethoscope/></span>
            Practice Details
            </h1>

          <div className="bg-white border-l-4 border-purple-500 rounded-xl shadow-md overflow-hidden mt-5 p-6">
          <div className="grid grid-cols-2 gap-6">
          {/* Specialties Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-indigo-500 text-xl flex items-center gap-2">
          <span><FaStethoscope/></span>
          Specialties
        </h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {profile?.practiceInfo?.specialties?.length ?? 0 > 0 ? (
            profile?.practiceInfo.specialties.map((specialty, index) => (
              <span
                key={index}
                className="bg-white text-indigo-500 px-3 py-1 rounded-full text-lg shadow-md"
              >
                {specialty}
              </span>
            ))
          ) : (
            <div className="p-2 bg-white rounded-lg text-gray-500 text-center w-full text-sm shadow-sm">
              No Specialties Listed
            </div>
          )}
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-indigo-500 text-xl flex items-center gap-2">
          <span>🌍</span>
          Languages
        </h2>
        <div className="space-y-2 mt-3">
          {profile?.practiceInfo?.languages && profile.practiceInfo.languages.length > 0 ? (
            profile?.practiceInfo.languages.map((lang, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg flex justify-between items-center shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span className="text-indigo-500 text-sm">{lang.language}</span>
                </div>
                <span className="bg-purple-200 text-purple-700 px-2 py-1 rounded-full text-lg">
                  {lang.proficiencyLevel}
                </span>
              </div>
            ))
          ) : (
            <div className="p-3 bg-white rounded-lg text-gray-500 text-center text-sm shadow-sm">
              No Languages Listed
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
            </div>



  <div className="grid grid-cols-2 gap-6">
  {/* Session Information (Left) */}
  <div className="bg-white border-l-4 border-purple-500 rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-indigo-500 mb-4 flex items-center">
        <span className="bg-purple-100 p-3 rounded-lg mr-3">
          <MdEventNote className="text-purple-500 text-2xl" />
        </span>
        Session Information
      </h3>

      {/* Time Zone */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center">
        <div className="bg-indigo-500 text-white p-3 rounded-lg">
          <AiOutlineClockCircle className="text-2xl" />
        </div>
        <div className="ml-4">
          <h3 className="text-indigo-600 text-lg font-medium">Time Zone</h3>
          <p className="text-gray-700 text-base">
            {profile?.sessionInfo?.availability?.timeZone || "Not Available"}
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Communication Modes (Right) */}
  <div className="bg-white border-l-4 border-purple-500 rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-indigo-500 mb-4 flex items-center">
        <span className="bg-purple-100 p-3 rounded-lg mr-3">
          <MdPhone className="text-purple-500 text-2xl" />
        </span>
        Communication Modes
      </h3>

      <div className="space-y-4 mt-4">
        {/* Chat Mode */}
        <div className="flex items-center bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="bg-indigo-500 text-white p-3 rounded-lg">
            <MdChat className="text-2xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-indigo-600 text-lg font-medium">Chat</h3>
            <p className="text-gray-700 text-base">Available for text communication</p>
          </div>
        </div>

        {/* Video Mode */}
        <div className="flex items-center bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="bg-indigo-500 text-white p-3 rounded-lg">
            <MdVideoCall className="text-2xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-indigo-600 text-lg font-medium">Video</h3>
            <p className="text-gray-700 text-base">Available for video calls</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


{/* Session Rates */}
<div className="mt-2">
  <h1 className="text-xl text-indigo-500 font-semibold flex items-center gap-3 pb-3 border-b-2 border-purple-500">
    <span className="text-xl"><FaDollarSign/></span>
    Session Rates
  </h1>

  <div className="bg-white rounded-xl shadow-xl mt-3 overflow-hidden border border-gray-200">
  {/* Header Section */}
  <div className="bg-purple-600 text-white py-4 px-6 text-lg font-bold flex justify-between items-center">
    <span>Comprehensive Counselling Session</span>
  </div>

  {/* Content Section */}
  <div className="p-6 space-y-5">
    {/* Time Zone */}
    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
      <div className="bg-purple-500 text-white p-3 rounded-lg">
        <FaClock className="text-xl" />
      </div>
      <span className="text-indigo-700 text-base font-medium ml-4">
        {profile?.sessionInfo?.availability?.timeZone || "Not Available"}
      </span>
    </div>

    {/* Availability */}
    <div>
      <h3 className="text-indigo-700 font-semibold text-lg mb-3">Available For:</h3>
      <div className="bg-purple-100 flex items-center px-5 py-3 rounded-full w-max shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
        <BsChatDots className="text-purple-500 text-xl" />
        <span className="text-indigo-700 text-base font-medium ml-3">Chat</span>
      </div>
    </div>
  </div>
</div>;
</div>



              
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;