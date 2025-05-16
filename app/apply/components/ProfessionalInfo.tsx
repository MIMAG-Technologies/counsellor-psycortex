"use client";

import { Education, License } from "@/app/apply/utils/counsellorTypes";
import { IoTrash, IoAddCircleOutline } from "react-icons/io5";
import { counsellor } from "../utils/counsellorTypes";

export default function ProfessionalInfo({
  counsellor,
  updateCounsellor,
}: {
  counsellor: Partial<counsellor>
  updateCounsellor: (section: keyof counsellor, data: any) => void
}) {
  const maxEntries = 20;

  // Validation functions
  const validateYearsOfExperience = (years: number): boolean => {
    return years > 0 && years < 100;
  };

  const validateEducationYear = (year: number): boolean => {
    return year >= 1000 && year <= 9999 && year <= new Date().getFullYear();
  };

  const validateLicenseDate = (date: string): boolean => {
    return new Date(date) > new Date();
  };

  const addEducation = (education: Education) => {
    const updatedEducation = [...(counsellor.professionalInfo?.education || []), education];
    updateCounsellor("professionalInfo", {
      ...counsellor.professionalInfo,
      education: updatedEducation
    });
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    const updatedEducation = [...(counsellor.professionalInfo?.education || [])];
    updatedEducation[index] = {
      ...updatedEducation[index],
      ...updates
    };
    updateCounsellor("professionalInfo", {
      ...counsellor.professionalInfo,
      education: updatedEducation
    });
  };

  const deleteEducation = (index: number) => {
    const updatedEducation = (counsellor.professionalInfo?.education || []).filter((_, i) => i !== index);
    updateCounsellor("professionalInfo", {
      ...counsellor.professionalInfo,
      education: updatedEducation
    });
  };

  const addLicense = (license: License) => {
    const updatedLicenses = [...(counsellor.professionalInfo?.licenses || []), license];
    updateCounsellor("professionalInfo", {
      ...counsellor.professionalInfo,
      licenses: updatedLicenses
    });
  };

  const updateLicense = (index: number, updates: Partial<License>) => {
    const updatedLicenses = [...(counsellor.professionalInfo?.licenses || [])];
    updatedLicenses[index] = {
      ...updatedLicenses[index],
      ...updates
    };
    updateCounsellor("professionalInfo", {
      ...counsellor.professionalInfo,
      licenses: updatedLicenses
    });
  };

  const deleteLicense = (index: number) => {
    const updatedLicenses = (counsellor.professionalInfo?.licenses || []).filter((_, i) => i !== index);
    updateCounsellor("professionalInfo", {
      ...counsellor.professionalInfo,
      licenses: updatedLicenses
    });
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={counsellor.professionalInfo?.title || ''}
            onChange={(e) => updateCounsellor("professionalInfo", {
              ...counsellor.professionalInfo,
              title: e.target.value
            })}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Licensed Therapist"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <input
            type="number"
            min="1"
            max="99"
            value={counsellor.professionalInfo?.yearsOfExperience || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!e.target.value || validateYearsOfExperience(value)) {
                updateCounsellor("professionalInfo", {
                  ...counsellor.professionalInfo,
                  yearsOfExperience: e.target.value ? value : 0
                });
              }
            }}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. 5"
          />
          {(counsellor.professionalInfo?.yearsOfExperience || 0) > 99 && (
            <p className="text-red-500 text-sm mt-1">Years of experience must be less than 100</p>
          )}
          {(counsellor.professionalInfo?.yearsOfExperience || 0) <= 0 && (
            <p className="text-red-500 text-sm mt-1">Years of experience must be greater than 0</p>
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Education
          {(counsellor.professionalInfo?.education?.length || 0) < maxEntries && (
            <button
              onClick={() =>
                addEducation({
                  degree: "",
                  field: "",
                  institution: "",
                  year: new Date().getFullYear(),
                })
              }
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {!counsellor.professionalInfo?.education?.length && (
          <p className="text-gray-500 text-sm mt-2">No education added.</p>
        )}

        {counsellor.professionalInfo?.education?.map((edu, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(index, { degree: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Degree (e.g. BSc in Psychology)"
              />
              <input
                type="text"
                value={edu.field}
                onChange={(e) =>
                  updateEducation(index, { field: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Field of Study"
              />
              <input
                type="text"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(index, { institution: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Institution Name"
              />
              <input
                type="number"
                value={edu.year}
                onChange={(e) => {
                  updateEducation(index, { year: parseInt(e.target.value.replace(/^0+/, '')) || 0 });
                }}
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Year (YYYY)"
              />
            </div>
            <button
              onClick={() => deleteEducation(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>

      {/* License Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Licenses
          {(counsellor.professionalInfo?.licenses?.length || 0) < maxEntries && (
            <button
              onClick={() =>
                addLicense({
                  type: "",
                  licenseNumber: "",
                  issuingAuthority: "",
                  validUntil: "",
                })
              }
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {!counsellor.professionalInfo?.licenses?.length && (
          <p className="text-gray-500 text-sm mt-2">No licenses added.</p>
        )}

        {counsellor.professionalInfo?.licenses?.map((lic, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <input
                type="text"
                value={lic.type}
                onChange={(e) => updateLicense(index, { type: e.target.value })}
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="License Type"
              />
              <input
                type="text"
                value={lic.licenseNumber}
                onChange={(e) =>
                  updateLicense(index, { licenseNumber: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="License Number"
              />
              <input
                type="text"
                value={lic.issuingAuthority}
                onChange={(e) =>
                  updateLicense(index, { issuingAuthority: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Issuing Authority"
              />
              <input
                type="date"
                value={lic.validUntil}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || validateLicenseDate(value)) {
                    updateLicense(index, { validUntil: value });
                  }
                }}
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {lic.validUntil && !validateLicenseDate(lic.validUntil) && (
                <p className="text-red-500 text-sm mt-1">License expiry date must be in the future</p>
              )}
            </div>
            <button
              onClick={() => deleteLicense(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
