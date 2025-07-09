"use client";

import React, { useEffect, useState } from 'react';
import { counsellor } from '@/app/apply/utils/counsellorTypes';
import BasicDetails from '@/app/apply/components/BasicDetails';
import ProfessionalInfo from '@/app/apply/components/ProfessionalInfo';
import ModeAndPricing from '@/app/apply/components/ModeAndPricing';
import Schedule from '@/app/apply/components/Schedule';
import SpecialitiesAndLanguages from '@/app/apply/components/SpecialitiesAndLanguages';
import { toast } from 'react-toastify';
import { getCounsellor, updatePersonalInfo, updateProfessionalInfo, updatePricing, updateCommunicationModes, updateSchedule, updateLanguages, updateSpecialties, UpdateBranches } from '@/app/apply/utils/counsellorUtils';
import { useAuth } from '@/context/AuthContext';
import { IoSave, IoRefresh } from 'react-icons/io5';

export default function EditProfile() {
    const { me } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('basicInfo');

    const [formData, setFormData] = useState<Partial<counsellor>>({
        basicInfo: {
            name: '',
            dateOfBirth: '',
            gender: '',
            biography: '',
            email: '',
            phone: '',
            profileImage: '',
        },
        professionalInfo: {
            title: '',
            yearsOfExperience: 0,
            education: [],
            licenses: [],
        },
        primaryAddress: {
            street_address: '',
            city: '',
            state: '',
            pincode: '',
        },
        preferredCenterAddress: {
            street_address: '',
            city: '',
            state: '',
            pincode: '',
        },
        communicationModes: {
            chat: false,
            call: false,
            video: false,
            in_person: false,
        },
        pricing: [],
        schedule: [],
        languages: [],
        specialties: [],
    });

    const [originalData, setOriginalData] = useState<Partial<counsellor>>({});

    // Fetch counsellor data on component mount
    useEffect(() => {
        const fetchCounsellorProfile = async () => {
            if (!me?.id) {
                setError("Counsellor ID not found. Please contact support.");
                setIsFetching(false);
                return;
            }

            try {
                setIsFetching(true);
                const counsellorData = await getCounsellor(me.id);

                if (!counsellorData) {
                    setError("Failed to fetch counsellor data.");
                    return;
                }

                // Debug log to check the API response structure
                console.log('Counsellor data from API:', counsellorData);
                console.log('Schedule data:', counsellorData.sessionInfo?.availability?.weeklySchedule);

                // Map the API response to the counsellor type format
                let mappedData: counsellor;

                try {
                    mappedData = {
                        basicInfo: {
                            name: counsellorData.personalInfo.name,
                            dateOfBirth: counsellorData.personalInfo.dateOfBirth,
                            gender: counsellorData.personalInfo.gender,
                            biography: counsellorData.personalInfo.biography,
                            email: counsellorData.personalInfo.email,
                            phone: counsellorData.personalInfo.phone,
                            profileImage: counsellorData.personalInfo.profileImage,
                        },
                        professionalInfo: {
                            title: counsellorData.professionalInfo.title,
                            yearsOfExperience: counsellorData.professionalInfo.yearsOfExperience,
                            education: counsellorData.professionalInfo.education,
                            licenses: counsellorData.professionalInfo.licenses,
                        },
                        primaryAddress: counsellorData.addresses[0]
                            ? {
                                street_address: counsellorData.addresses[0].address,
                                city: counsellorData.addresses[0].city,
                                state: counsellorData.addresses[0].state,
                                pincode: counsellorData.addresses[0].pincode,
                            }
                            : {
                                street_address: '',
                                city: '',
                                state: '',
                                pincode: '',
                            },
                        preferredCenterAddress: counsellorData.addresses[1]
                            ? {
                                street_address: counsellorData.addresses[1].address,
                                city: counsellorData.addresses[1].city,
                                state: counsellorData.addresses[1].state,
                                pincode: counsellorData.addresses[1].pincode,
                            }
                            : {
                                street_address: '',
                                city: '',
                                state: '',
                                pincode: '',
                            },
                        communicationModes: {
                            chat: counsellorData.sessionInfo.availability.communicationModes.includes('chat'),
                            call: counsellorData.sessionInfo.availability.communicationModes.includes('call'),
                            video: counsellorData.sessionInfo.availability.communicationModes.includes('video'),
                            in_person: counsellorData.sessionInfo.availability.communicationModes.includes('in_person'),
                        },
                        pricing: counsellorData.sessionInfo.pricing.rates.map((rate: any) => ({
                            sessionType: rate.sessionType,
                            sessionTitle: rate.sessionTitle,
                            price: rate.price,
                            currency: rate.currency,
                            typeOfAvailability: rate.availabilityTypes[0],
                        })),
                        schedule: (() => {
                            const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                            const apiSchedule = counsellorData.sessionInfo.availability.weeklySchedule || [];

                            // Helper function to convert HH:mm:ss to HH:mm format
                            const formatTime = (timeString: string | null): string | null => {
                                if (!timeString) return null;
                                // Extract HH:mm from HH:mm:ss format
                                return timeString.substring(0, 5);
                            };

                            // Create a complete week schedule with all 7 days
                            return DAYS_OF_WEEK.map(day => {
                                const dayData = apiSchedule.find((schedule: any) => schedule.day === day);

                                if (dayData) {
                                    return {
                                        day: day as any,
                                        startTime: formatTime(dayData.working_hours?.start) || null,
                                        endTime: formatTime(dayData.working_hours?.end) || null,
                                        isWorkingDay: dayData.isWorkingDay === 1,
                                    };
                                } else {
                                    // Default for missing days
                                    return {
                                        day: day as any,
                                        startTime: null,
                                        endTime: null,
                                        isWorkingDay: false,
                                    };
                                }
                            });
                        })(),
                        languages: counsellorData.practiceInfo.languages,
                        specialties: counsellorData.practiceInfo.specialties,
                    };

                    console.log('Mapped schedule data:', mappedData.schedule);

                    setFormData(mappedData);
                    setOriginalData(JSON.parse(JSON.stringify(mappedData)));

                } catch (mappingError) {
                    console.error('Error mapping counsellor data:', mappingError);
                    setError('Failed to process counsellor data. Please contact support.');
                    return;
                }

            } catch (error) {
                console.error('Error fetching counsellor data:', error);
                setError('Failed to load profile data. Please try again.');
            } finally {
                setIsFetching(false);
            }
        };

        fetchCounsellorProfile();
    }, [me?.id]);

    // Track changes
    useEffect(() => {
        const hasChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
        setHasChanges(hasChanged);
    }, [formData, originalData]);

    const updateFormData = (section: keyof counsellor, data: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: data
        }));
    };

    const handleSave = async () => {
        if (!me?.id) {
            toast.error("Counsellor ID not found.");
            return;
        }

        if (!hasChanges) {
            toast.info("No changes to save.");
            return;
        }

        setIsLoading(true);
        try {
            const counsellorId = me.id;

            // Update Personal Information
            if (JSON.stringify(formData.basicInfo) !== JSON.stringify(originalData.basicInfo)) {
                const personalInfoResult = await updatePersonalInfo(counsellorId, {
                    name: formData.basicInfo?.name || '',
                    dateOfBirth: formData.basicInfo?.dateOfBirth || '',
                    gender: formData.basicInfo?.gender || '',
                    biography: formData.basicInfo?.biography || '',
                    email: formData.basicInfo?.email || '',
                    phone: formData.basicInfo?.phone || '',
                    profileImage: formData.basicInfo?.profileImage || '',
                });

                if (!personalInfoResult) {
                    throw new Error("Failed to update personal information");
                }
            }

            // Update Professional Information
            if (JSON.stringify(formData.professionalInfo) !== JSON.stringify(originalData.professionalInfo)) {
                const professionalInfoResult = await updateProfessionalInfo(counsellorId, {
                    title: formData.professionalInfo?.title || '',
                    yearsOfExperience: formData.professionalInfo?.yearsOfExperience || 0,
                    education: formData.professionalInfo?.education || [],
                    licenses: formData.professionalInfo?.licenses || [],
                });

                if (!professionalInfoResult) {
                    throw new Error("Failed to update professional information");
                }
            }

            // Update Communication Modes and Pricing
            if (JSON.stringify(formData.communicationModes) !== JSON.stringify(originalData.communicationModes) ||
                JSON.stringify(formData.pricing) !== JSON.stringify(originalData.pricing)) {

                const selectedModes = Object.entries(formData.communicationModes || {})
                    .filter(([_, isSelected]) => isSelected)
                    .map(([mode]) => mode);

                const communicationResult = await updateCommunicationModes(counsellorId, selectedModes.join(','));
                if (!communicationResult) {
                    throw new Error("Failed to update communication modes");
                }

                const pricingResult = await updatePricing(counsellorId, formData.pricing || []);
                if (!pricingResult) {
                    throw new Error("Failed to update pricing");
                }
            }

            // Update Schedule
            if (JSON.stringify(formData.schedule) !== JSON.stringify(originalData.schedule)) {
                const scheduleResult = await updateSchedule(counsellorId, formData.schedule || []);
                if (!scheduleResult) {
                    throw new Error("Failed to update schedule");
                }
            }

            // Update Languages
            if (JSON.stringify(formData.languages) !== JSON.stringify(originalData.languages)) {
                const languagesResult = await updateLanguages(counsellorId, formData.languages || []);
                if (!languagesResult) {
                    throw new Error("Failed to update languages");
                }
            }

            // Update Specialties
            if (JSON.stringify(formData.specialties) !== JSON.stringify(originalData.specialties)) {
                const specialtiesResult = await updateSpecialties(counsellorId, formData.specialties || []);
                if (!specialtiesResult) {
                    throw new Error("Failed to update specialties");
                }
            }

            // Update Addresses (Primary and Preferred Center)
            if (JSON.stringify(formData.primaryAddress) !== JSON.stringify(originalData.primaryAddress) ||
                JSON.stringify(formData.preferredCenterAddress) !== JSON.stringify(originalData.preferredCenterAddress)) {

                const primaryAddress = {
                    street_address: formData.primaryAddress?.street_address || '',
                    city: formData.primaryAddress?.city || '',
                    state: formData.primaryAddress?.state || '',
                    pincode: formData.primaryAddress?.pincode || '',
                };

                const preferredCenterAddress = {
                    street_address: formData.preferredCenterAddress?.street_address || '',
                    city: formData.preferredCenterAddress?.city || '',
                    state: formData.preferredCenterAddress?.state || '',
                    pincode: formData.preferredCenterAddress?.pincode || '',
                };

                const addressResult = await UpdateBranches(counsellorId, primaryAddress, preferredCenterAddress);
                if (!addressResult) {
                    throw new Error("Failed to update addresses");
                }
            }

            // Update original data to reflect saved changes
            setOriginalData(JSON.parse(JSON.stringify(formData)));
            toast.success('Profile updated successfully!');

        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData(JSON.parse(JSON.stringify(originalData)));
        toast.info('Changes reset to last saved version.');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basicInfo':
                return (
                    <BasicDetails
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 'professionalInfo':
                return (
                    <ProfessionalInfo
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 'modeAndPricing':
                return (
                    <ModeAndPricing
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 'schedule':
                return (
                    <Schedule
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 'specialitiesAndLanguages':
                return (
                    <SpecialitiesAndLanguages
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            default:
                return null;
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'basicInfo', label: 'Personal Info', shortLabel: 'Personal', icon: '👤' },
        { id: 'professionalInfo', label: 'Professional', shortLabel: 'Professional', icon: '🎓' },
        { id: 'modeAndPricing', label: 'Services & Pricing', shortLabel: 'Services', icon: '💰' },
        { id: 'schedule', label: 'Schedule', shortLabel: 'Schedule', icon: '📅' },
        { id: 'specialitiesAndLanguages', label: 'Skills & Languages', shortLabel: 'Skills', icon: '🗣️' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 gap-3 sm:gap-0">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Profile</h1>
                            <p className="text-xs sm:text-sm text-gray-600">Update your professional information</p>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            {hasChanges && (
                                <button
                                    onClick={handleReset}
                                    className="flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <IoRefresh className="mr-1 sm:mr-2" size={14} />
                                    <span className="hidden sm:inline">Reset</span>
                                    <span className="sm:hidden">Reset</span>
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isLoading}
                                className={`flex items-center px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${hasChanges && !isLoading
                                    ? 'bg-primary text-white hover:bg-secondary'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                                        <span className="hidden sm:inline">Saving...</span>
                                        <span className="sm:hidden">Save</span>
                                    </>
                                ) : (
                                    <>
                                        <IoSave className="mr-1 sm:mr-2" size={14} />
                                        <span className="hidden sm:inline">Save Changes</span>
                                        <span className="sm:hidden">Save</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Mobile Tab Navigation */}
                    <div className="lg:hidden">
                        <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
                            <div className="flex overflow-x-auto space-x-1 pb-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex flex-col items-center px-3 py-2 rounded-lg whitespace-nowrap transition-colors min-w-[80px] ${activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-lg mb-1">{tab.icon}</span>
                                        <span className="text-xs font-medium">{tab.shortLabel}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Sidebar Navigation */}
                    <div className="hidden lg:block lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-lg mr-3">{tab.icon}</span>
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
