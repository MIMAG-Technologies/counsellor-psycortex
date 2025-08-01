"use client";

import { counsellor } from "@/app/apply/utils/counsellorTypes";
import { useEffect, useState } from "react";
import { updateProfilePic } from "@/app/apply/utils/counsellorUtils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { IoCamera, IoClose } from "react-icons/io5";

export default function ProfileImageUpdate({
    counsellor,
    updateCounsellor,
}: {
    counsellor: Partial<counsellor>
    updateCounsellor: (section: keyof counsellor, data: any) => void
}) {
    const { me } = useAuth();
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
            <div className="">

                {/* Profile Image */}
                <div className="">
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
                {/* Alert dialog */}
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Important Note</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>After updating your profile image, don't click the "Save Changes" button at the top of the page. Your image has been automatically saved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}