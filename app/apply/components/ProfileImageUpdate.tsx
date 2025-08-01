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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Set image preview when counsellor data loads
    useEffect(() => {
        if (counsellor.basicInfo?.profileImage && !imagePreview) {
            setImagePreview(counsellor.basicInfo.profileImage);
        }
    }, [counsellor.basicInfo?.profileImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Store the file for later upload
        setSelectedFile(file);

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleUpdateImage = async () => {
        if (!selectedFile) {
            toast.error('Please select an image first');
            return;
        }

        if (!me?.id) {
            toast.error('User ID not found. Please try again.');
            return;
        }

        try {
            setIsUploadingImage(true);

            // Upload image
            const success = await updateProfilePic(me.id, selectedFile);

            if (success) {
                // Update the counsellor data with new image URL
                updateCounsellor("basicInfo", {
                    ...counsellor.basicInfo,
                    profileImage: imagePreview
                });
                toast.success('Profile picture updated successfully!');
                setSelectedFile(null); // Clear the selected file after successful upload
            } else {
                toast.error('Failed to upload image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const removeImage = () => {
        // Only for removing the selected file that hasn't been uploaded yet
        setSelectedFile(null);
        setImagePreview(counsellor.basicInfo?.profileImage || null);
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

                            {/* Remove button - only show when a file is selected but not yet uploaded */}
                            {selectedFile && !isUploadingImage && (
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

                                {selectedFile && (
                                    <button
                                        onClick={handleUpdateImage}
                                        disabled={isUploadingImage}
                                        className={`mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white ${isUploadingImage
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-secondary transition-colors'
                                            }`}
                                        type="button"
                                    >
                                        {isUploadingImage ? 'Updating...' : 'Update Profile Image'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}