/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react';
import { PhoneIcon, MailIcon } from 'lucide-react';
import { CounselorData } from '../types/profile/profile';
import fetchProfile from '../utils/profile';
import Loader from '../components/loader';
import Sidebar from '../components/sidebar/page';


export default function CounselorProfilePage() {
  const [data, setData] = useState<CounselorData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await fetchProfile();
      setData(profileData);
    };
    fetchData();
  }, []);

  if (!data) return <Loader/>;

  const { personalInfo, professionalInfo, practiceInfo, sessionInfo } = data;

  return (
    <div className='min-h-screen flex'>
      <Sidebar /> 

      <div className="w-full max-w-[1150px] md:ml-80 py-8 ml-16 mx-auto shadow-sm rounded-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 flex flex-col items-center">
          <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105">
            <img 
              src={personalInfo.profileImage} 
              alt={`${personalInfo.name} profile`}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-indigo-500 mb-2">{personalInfo.name}</h1>
          <p className="text-lg text-indigo-500 font-medium">{professionalInfo.title}</p>
        </div>

        {/* About Me Section */}
        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-500 mb-5">About Me</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{personalInfo.biography}</p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <MailIcon className="text-indigo-500 group-hover:text-indigo-600 transition-colors" size={24} />
              <span className='text-lg text-gray-700 font-medium group-hover:text-indigo-500 transition-colors'>{personalInfo.email}</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <PhoneIcon className="text-indigo-500 group-hover:text-indigo-600 transition-colors" size={24} />
              <span className='text-lg text-gray-700 font-medium group-hover:text-indigo-500 transition-colors'>{personalInfo.phone}</span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-500 mb-5">Professional Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="text-lg font-medium text-indigo-500">Years of Experience</h3>
              <p className="text-lg text-gray-700">{professionalInfo.yearsOfExperience} Years</p>
            </div>
            <div className="space-y-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="text-lg font-medium text-indigo-500">Education</h3>
              {professionalInfo.education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-indigo-500 font-medium text-lg">{edu.degree} in {edu.field}</p>
                  <p className="text-gray-700 text-base">{edu.institution}, {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Licenses Section */}
        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-500 mb-5">Licenses</h2>
          {professionalInfo.licenses.map((license, index) => (
            <div key={index} className="mb-6 p-6 border border-gray-300 rounded-lg space-y-3 hover:bg-gray-50 transition-colors">
              <p className="text-lg text-indigo-500 font-medium">{license.type}</p>
              <p className="text-gray-700">License Number: {license.licenseNumber}</p>
              <p className="text-gray-700">Issued by: {license.issuingAuthority}</p>
              <p className="text-gray-700">Valid Until: {license.validUntil}</p>
            </div>
          ))}
        </div>

        {/* Specialties and Languages */}
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-indigo-500">Specialties</h2>
              <div className="flex flex-wrap gap-3">
                {practiceInfo.specialties.map((specialty, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-indigo-500 px-4 py-2 rounded-full text-base 
                    hover:bg-indigo-100 hover:text-indigo-600 transition-colors cursor-default"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-indigo-500">Languages</h2>
              <div className="space-y-3">
                {practiceInfo.languages.map((lang, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg text-indigo-500">{lang.language}</span>
                    <span className="text-base text-gray-700">{lang.proficiencyLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Session Rates */}
        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-500 mb-5">Session Rates</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sessionInfo.pricing.rates.map((rate, index) => (
              <div 
                key={index} 
                className="border border-gray-300 rounded-lg p-6 text-center space-y-3 
                hover:bg-gray-50 hover:border-indigo-100 transition-colors"
              >
                <h3 className="text-lg text-indigo-500 font-medium">{rate.sessionTitle}</h3>
                <p className="text-xl text-gray-700">{rate.price} {rate.currency}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}