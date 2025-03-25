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

      <div className="w-full max-w-[1150px] md:ml-80 py-4  ml-16 mx-auto shadow-sm rounded-2xl overflow-hidden ">
        {/* Profile Header */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <img 
              src={personalInfo.profileImage} 
              alt={`${personalInfo.name} profile`}
              className="w-28 h-28 rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-indigo-500">{personalInfo.name}</h1>
          <p className="text-indigo-500 font-medium">{professionalInfo.title}</p>
        </div>

        {/* About Me Section */}
        <div className="p-6 ">
          <h2 className="text-xl font-semibold text-indigo-500 mb-4">About Me</h2>
          <p className="text-gray-700 mb-4">{personalInfo.biography}</p>
          <div className="space-y-3  ">
            <div className="flex items-center">
              <MailIcon className="mr-2 text-xl text-indigo-500" size={20} />
              <span className='text-gray-700 font-medium'>{personalInfo.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="mr-2 text-xl text-indigo-500" size={20} />
              <span className='text-gray-700 font-medium'>{personalInfo.phone}</span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="p-6 mt-2">
          <h2 className="text-xl font-semibold text-indigo-500 mb-4">Professional Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text- text-indigo-500">Years of Experience</h3>
              <p className="text-gray-700">{professionalInfo.yearsOfExperience} Years</p>
            </div>
            <div>
              <h3 className="font-medium text-indigo-500">Education</h3>
              {professionalInfo.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <p className="text-indigo-500 font-medium">{edu.degree} in {edu.field}</p>
                  <p className="text-gray-700">{edu.institution}, {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Licenses Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-indigo-500 mb-4">Licenses</h2>
          {professionalInfo.licenses.map((license, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
              <p className="text-indigo-500 font-medium">{license.type}</p>
              <p className="text-gray-700">License Number: {license.licenseNumber}</p>
              <p className="text-gray-700">Issued by: {license.issuingAuthority}</p>
              <p className="text-gray-700">Valid Until: {license.validUntil}</p>
            </div>
          ))}
        </div>

        {/* Specialties and Languages */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-indigo-500 mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {practiceInfo.specialties.map((specialty, index) => (
                  <span key={index} className="bg-gray-100 text-indigo-500 px-3 py-1 rounded-full text-sm">{specialty}</span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-indigo-500 mb-4">Languages</h2>
              {practiceInfo.languages.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-indigo-500">{lang.language}</span>
                  <span className="text-gray-700">{lang.proficiencyLevel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Rates */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-indigo-500 mb-4">Session Rates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sessionInfo.pricing.rates.map((rate, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 text-center">
                <h3 className="text-indigo-500 font-medium">{rate.sessionTitle}</h3>
                <p className="text-gray-700">{rate.price} {rate.currency}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
