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
    <div className="mx-auto p-6 bg-white rounded-lg">
      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={counsellor.basicInfo?.name || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              name: e.target.value
            })}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={counsellor.basicInfo?.email || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              email: e.target.value
            })}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={counsellor.basicInfo?.phone || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              phone: e.target.value
            })}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter phone number"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={counsellor.basicInfo?.dateOfBirth || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              dateOfBirth: e.target.value
            })}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            value={counsellor.basicInfo?.gender || ''}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              gender: e.target.value
            })}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
            Biography
          </label>
          <textarea
            value={counsellor.basicInfo?.biography || ''}
            style={{ resize: "none" }}
            onChange={(e) => updateCounsellor("basicInfo", {
              ...counsellor.basicInfo,
              biography: e.target.value
            })}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Write a short biography"
            rows={3}
          />
        </div>
      </div>

      {/* Primary Address */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Primary Address</h3>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Street Address
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.street_address || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                street_address: e.target.value
              })}
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              City
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.city || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                city: e.target.value
              })}
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              State
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.state || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                state: e.target.value
              })}
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Pincode
            </label>
            <input
              type="text"
              value={counsellor.primaryAddress?.pincode || ''}
              onChange={(e) => updateCounsellor("primaryAddress", {
                ...counsellor.primaryAddress,
                pincode: e.target.value
              })}
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
