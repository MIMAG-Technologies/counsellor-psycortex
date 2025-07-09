"use client";

import { counsellor } from "@/app/apply/utils/counsellorTypes";
import { useEffect, useState } from "react";
import { getFilters, updateProfilePic } from "@/app/apply/utils/counsellorUtils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { IoCamera, IoCheckmark, IoClose } from "react-icons/io5";

export default function BasicDetails({
  counsellor,
  updateCounsellor,
}: {
  counsellor: Partial<counsellor>
  updateCounsellor: (section: keyof counsellor, data: any) => void
}) {
  const { me } = useAuth();
  type Filter = { id: number; name: string; priority: number };
  const [genders, setGenders] = useState<Filter[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // Set image preview when counsellor data loads
  useEffect(() => {
    if (counsellor.basicInfo?.profileImage && !imagePreview) {
      setImagePreview(counsellor.basicInfo.profileImage);
    }
  }, [counsellor.basicInfo?.profileImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!me?.id) {
      toast.error('User ID not found. Please try again.');
      return;
    }

    try {
      setIsUploadingImage(true);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload image
      const success = await updateProfilePic(me.id, file);

      if (success) {
        // Update the counsellor data with new image URL
        updateCounsellor("basicInfo", {
          ...counsellor.basicInfo,
          profileImage: previewUrl // You might want to use a proper URL from the API response
        });
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error('Failed to upload image. Please try again.');
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    updateCounsellor("basicInfo", {
      ...counsellor.basicInfo,
      profileImage: ''
    });
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
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Image Preview */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {imagePreview || counsellor.basicInfo?.profileImage ? (
                  <img
                    src={imagePreview || counsellor.basicInfo?.profileImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <IoCamera className="w-8 h-8 text-gray-400" />
                )}

                {/* Loading overlay */}
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Remove button */}
              {(imagePreview || counsellor.basicInfo?.profileImage) && !isUploadingImage && (
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <IoClose className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1">
              <div className="space-y-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                  <div className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${isUploadingImage
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                    }`}>
                    <IoCamera className="w-4 h-4 mr-2" />
                    {isUploadingImage ? 'Uploading...' : 'Choose Image'}
                  </div>
                </label>
                <p className="text-xs text-gray-500">
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>
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
