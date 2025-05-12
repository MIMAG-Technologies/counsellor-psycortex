/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { PhoneIcon, MailIcon, Award, Clock, Bookmark, Globe, DollarSign, IndianRupee } from 'lucide-react';
import { CounselorData } from '@/types/profile/profile';
import { motion } from 'framer-motion';
import { FaPencil } from 'react-icons/fa6';

interface ProfileDetailsProps {
  data: CounselorData;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { personalInfo, professionalInfo, practiceInfo, sessionInfo } = data;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleDraftMail = () => {
    const subject = `Profile Update of ${personalInfo.name}`;
    window.location.href = `mailto:care@psycortex.in?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <>
      {/* Profile Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 p-12 flex flex-col items-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-40 h-40 rounded-full bg-white shadow-lg p-2 flex items-center justify-center mb-6"
        >
          <img
            src={personalInfo.profileImage}
            alt={`${personalInfo.name} profile`}
            className="w-36 h-36 rounded-full object-cover"
          />
        </motion.div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 mb-2">{personalInfo.name}</h1>
        <p className="text-lg text-indigo-500 font-medium">{professionalInfo.title}</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-8 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          Edit Profile
          <FaPencil size={16} />
        </button>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Profile Modification Request</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              To update your professional details, please contact our support team with your requested changes. We
              will verify them and update your information within 24-48 hours.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handleDraftMail}
                className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <MailIcon size={16} />
                Draft Mail
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* About Me Section */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="p-8 md:p-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-indigo-600 mb-5 flex items-center gap-2">
          <Bookmark className="text-indigo-500" size={24} />
          About Me
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6 bg-gray-50 p-6 rounded-xl border border-gray-100">{personalInfo.biography}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3 group p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <MailIcon className="text-indigo-600" size={24} />
            </div>
            <span className="text-lg text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
              {personalInfo.email}
            </span>
          </div>
          <div className="flex items-center space-x-3 group p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <PhoneIcon className="text-indigo-600" size={24} />
            </div>
            <span className="text-lg text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
              {personalInfo.phone}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Professional Information */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="p-8 md:p-12 space-y-6 bg-gradient-to-r from-indigo-50/50 to-white"
      >
        <h2 className="text-2xl font-semibold text-indigo-600 mb-5 flex items-center gap-2">
          <Award className="text-indigo-500" size={24} />
          Professional Information
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 p-6 bg-white rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <Clock className="text-indigo-500" size={20} />
              <h3 className="text-lg font-medium text-indigo-600">Years of Experience</h3>
            </div>
            <p className="text-xl text-gray-700 font-semibold">{professionalInfo.yearsOfExperience} Years</p>
          </div>
          <div className="space-y-3 p-6 bg-white rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <Award className="text-indigo-500" size={20} />
              <h3 className="text-lg font-medium text-indigo-600">Education</h3>
            </div>
            {professionalInfo.education.map((edu, index) => (
              <div key={index} className="space-y-1 mt-3">
                <p className="text-indigo-600 font-medium text-lg">{edu.degree} in {edu.field}</p>
                <p className="text-gray-600 text-base">{edu.institution}, {edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Licenses Section */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="p-8 md:p-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-indigo-600 mb-5 flex items-center gap-2">
          <Award className="text-indigo-500" size={24} />
          Licenses
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {professionalInfo.licenses.map((license, index) => (
            <motion.div 
              key={index} 
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-indigo-100 space-y-3 hover:shadow-md transition-all"
            >
              <p className="text-lg text-indigo-600 font-medium">{license.type}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">License Number</p>
                  <p className="text-gray-800 font-medium">{license.licenseNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Issuing Authority</p>
                  <p className="text-gray-800 font-medium">{license.issuingAuthority}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Valid Until</p>
                    <p className="text-gray-800 font-medium">
                    {new Date(license.validUntil).toLocaleDateString('en-GB')}
                    </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Specialties and Languages */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="p-8 md:p-12 space-y-6 bg-gradient-to-r from-indigo-50/50 to-white"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-indigo-600 flex items-center gap-2">
              <Bookmark className="text-indigo-500" size={24} />
              Specialties
            </h2>
            <div className="flex flex-wrap gap-3">
              {practiceInfo.specialties.map((specialty, index) => (
                <motion.span 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white shadow-sm border border-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-base 
                  hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-default"
                >
                  {specialty}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-indigo-600 flex items-center gap-2">
              <Globe className="text-indigo-500" size={24} />
              Languages
            </h2>
            <div className="space-y-3">
              {practiceInfo.languages.map((lang, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-indigo-100 hover:border-indigo-200 transition-all"
                >
                  <span className="text-lg text-indigo-600 font-medium">{lang.language}</span>
                  <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg font-medium">{lang.proficiencyLevel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Session Rates */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="p-8 md:p-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-indigo-600 mb-5 flex items-center gap-2">
          <IndianRupee className="text-indigo-500" size={24} />
          Session Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionInfo.pricing.rates.map((rate, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-indigo-100 hover:shadow-md transition-all"
            >
              <div className="bg-indigo-500 py-3 px-4">
                <h3 className="text-lg text-white font-medium text-center">{rate.sessionTitle}</h3>
              </div>
              <div className="p-6 text-center">
                <p className="text-3xl font-bold text-indigo-600">{rate.price} <span className="text-sm font-normal text-gray-500">{rate.currency}</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default ProfileDetails; 