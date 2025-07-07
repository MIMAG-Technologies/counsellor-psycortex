"use client";

import { counsellor } from "@/app/apply/utils/counsellorTypes";
import { useEffect, useState } from "react";
import { getFilters } from "@/app/apply/utils/counsellorUtils";

export default function BasicDetails({
  counsellor,
  updateCounsellor,
}: {
  counsellor: Partial<counsellor>
  updateCounsellor: (section: keyof counsellor, data: any) => void
}) {
  type Filter = { id: number; name: string; priority: number };
  const [genders, setGenders] = useState<Filter[]>([]);

  const fetchFilters = async () => {
    const filters = await getFilters();
    setGenders(
      filters.genders?.sort(
        (a: Filter, b: Filter) => b.priority - a.priority
      ) || []
    );
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      updateCounsellor("basicInfo", {
        ...counsellor.basicInfo,
        profileImage: URL.createObjectURL(file)
      });
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 bg-white rounded-lg">
      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={counsellor.basicInfo?.name || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              name: e.target.value
            })}
            className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={counsellor.basicInfo?.email || ''}
            readOnly
            disabled
            className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={counsellor.basicInfo?.phone || ''}
            readOnly
            disabled
            className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={counsellor.basicInfo?.dateOfBirth || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              dateOfBirth: e.target.value
            })}
            max={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={counsellor.basicInfo?.gender || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              gender: e.target.value
            })}
            className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="" disabled>
              Select gender
            </option>
            {genders.map((g) => {
              return (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image
          </label>
          <input
            accept="image/*"
            onChange={handleFileChange}
            type="file"
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
          />
        </div>

        {/* Biography */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biography
          </label>
          <div className="relative">
            <textarea
              value={counsellor.basicInfo?.biography || ''}
              style={{ resize: "none" }}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= 400) {
                  updateCounsellor("basicInfo", {
                    ...counsellor.basicInfo,
                    biography: text
                  });
                }
              }}
              maxLength={400}
              className="mt-1 block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Write a short biography (max 400 characters)"
              rows={3}
            />
            <div className="absolute bottom-2 right-2 text-xs sm:text-sm text-gray-500">
              {(counsellor.basicInfo?.biography?.length || 0)}/400
            </div>
          </div>
        </div>
      </div>

      {/* Primary Address */}
      <div className="mt-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Primary Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.street_address || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                street_address: e.target.value
              })}
              className="block w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="Enter street address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              City
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.city || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                city: e.target.value
              })}
              className="block w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              State
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.state || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                state: e.target.value
              })}
              className="block w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="Enter state"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Pincode
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.pincode || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                pincode: e.target.value
              })}
              className="block w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              placeholder="Enter pincode"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
