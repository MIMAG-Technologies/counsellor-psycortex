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
    <div className="mx-auto p-4 sm:p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={counsellor.professionalInfo?.title || ''}
            onChange={(e) => updateCounsellor("professionalInfo", {
              ...counsellor.professionalInfo,
              title: e.target.value
            })}
            className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Licensed Therapist"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. 5"
          />
          {(counsellor.professionalInfo?.yearsOfExperience || 0) > 99 && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">Years of experience must be less than 100</p>
          )}
          {(counsellor.professionalInfo?.yearsOfExperience || 0) <= 0 && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">Years of experience must be greater than 0</p>
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            Education
          </h3>
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
              className="self-start sm:self-auto text-indigo-600 hover:text-indigo-800 transition flex items-center text-sm sm:text-base"
            >
              <IoAddCircleOutline className="mr-1" size={18} />
              Add Education
            </button>
          )}
        </div>

        {!counsellor.professionalInfo?.education?.length && (
          <p className="text-gray-500 text-sm mt-2">No education added.</p>
        )}

        <div className="space-y-3 sm:space-y-4">
          {counsellor.professionalInfo?.education?.map((edu, index) => (
            <div
              key={index}
              className="bg-gray-100 p-3 sm:p-4 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, { degree: e.target.value })
                    }
                    className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Degree (e.g. BSc in Psychology)"
                  />
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(index, { field: e.target.value })
                    }
                    className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Field of Study"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(index, { institution: e.target.value })
                    }
                    className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Institution Name"
                  />
                  <input
                    type="number"
                    value={edu.year}
                    onChange={(e) => {
                      updateEducation(index, { year: parseInt(e.target.value.replace(/^0+/, '')) || 0 });
                    }}
                    className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Year (YYYY)"
                  />
                </div>
                <div className="flex sm:flex-col justify-end sm:justify-start">
                  <button
                    onClick={() => deleteEducation(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                  >
                    <IoTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* License Section */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            Licenses
          </h3>
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
              className="self-start sm:self-auto text-indigo-600 hover:text-indigo-800 transition flex items-center text-sm sm:text-base"
            >
              <IoAddCircleOutline className="mr-1" size={18} />
              Add License
            </button>
          )}
        </div>

        {!counsellor.professionalInfo?.licenses?.length && (
          <p className="text-gray-500 text-sm mt-2">No licenses added.</p>
        )}

        <div className="space-y-3 sm:space-y-4">
          {counsellor.professionalInfo?.licenses?.map((lic, index) => (
            <div
              key={index}
              className="bg-gray-100 p-3 sm:p-4 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={lic.type}
                    onChange={(e) => updateLicense(index, { type: e.target.value })}
                    className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="License Type"
                  />
                  <input
                    type="text"
                    value={lic.licenseNumber}
                    onChange={(e) =>
                      updateLicense(index, { licenseNumber: e.target.value })
                    }
                    className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="License Number"
                  />
                  <input
                    type="text"
                    value={lic.issuingAuthority}
                    onChange={(e) =>
                      updateLicense(index, { issuingAuthority: e.target.value })
                    }
                    className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Issuing Authority"
                  />
                  <div>
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
                      className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {lic.validUntil && !validateLicenseDate(lic.validUntil) && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">License expiry date must be in the future</p>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col justify-end sm:justify-start">
                  <button
                    onClick={() => deleteLicense(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                  >
                    <IoTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
