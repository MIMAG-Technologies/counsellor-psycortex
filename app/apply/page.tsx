"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { counsellor, Education, License, Language, ScheduleItem, PricingItem } from './utils/counsellorTypes';
import axios from 'axios';
import BasicDetails from './components/BasicDetails';
import ProfessionalInfo from './components/ProfessionalInfo';
import ModeAndPricing from './components/ModeAndPricing';
import Schedule from './components/Schedule';
import SpecialitiesAndLanguages from './components/SpecialitiesAndLanguages';
import { createCounsellor, updatePersonalInfo, updateProfessionalInfo, updatePricing, updateSchedule, updateLanguages, updateSpecialties, updateCommunicationModes } from './utils/counsellorUtils';

export default function Apply() {
    const searchParams = useSearchParams();
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwicGhvbmUiOiIrMTIzNDU2Nzg5MCIsInN0YXR1cyI6InJldmVyaWZ5IiwiY291bnNlbGxvcklkIjoiYzEyMyIsInJlbWFyayI6Ik1pc3NpbmcgcGhvbmUgbnVtYmVyIn0=.+aFFtVJ6pGoxL3yBIPLBNix92xWSKpLi8aQTrpaQlow=";
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [counsellorId, setCounsellorId] = useState<string>('');
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

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsTokenValid(false);
                return;
            }

            try {
                const config = {
                    method: 'get',
                    url: `${process.env.NEXT_PUBLIC_API_URL}/send/verify_link.php`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const res = await axios.request(config);

                if (res.data) {
                    setIsTokenValid(true);
                    setFormData(prev => ({
                        ...prev,
                        basicInfo: {
                            ...prev.basicInfo!,
                            email: res.data.email || '',
                            phone: res.data.phone || '',
                        }
                    }));
                } else {
                    setIsTokenValid(false);
                }
            } catch (error) {
                console.error('Error validating token:', error);
                setIsTokenValid(false);
            }
        };

        validateToken();
    }, [token]);

    const handleNext = async () => {
        setIsLoading(true);
        try {
            if (currentStep === 1) {
                // Create counsellor and get ID
                const id = await createCounsellor(
                    formData.basicInfo?.name || '',
                    formData.basicInfo?.email || '',
                    formData.basicInfo?.phone || '',
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                );
                if (id) {
                    setCounsellorId(id);
                    await updatePersonalInfo(id, {
                        name: formData.basicInfo?.name || '',
                        email: formData.basicInfo?.email || '',
                        phone: formData.basicInfo?.phone || '',
                        dateOfBirth: formData.basicInfo?.dateOfBirth,
                        gender: formData.basicInfo?.gender,
                        biography: formData.basicInfo?.biography,
                    });
                }
            } else if (currentStep === 2) {
                await updateProfessionalInfo(counsellorId, formData.professionalInfo!);
            } else if (currentStep === 3) {
                await updatePricing(counsellorId, formData.pricing!);
                await updateCommunicationModes(
                    counsellorId,
                    JSON.stringify(formData.communicationModes)
                );
            } else if (currentStep === 4) {
                await updateSchedule(counsellorId, formData.schedule!);
            } else if (currentStep === 5) {
                await updateLanguages(counsellorId, formData.languages!);
                await updateSpecialties(counsellorId, formData.specialties!);
            }
            setCurrentStep(prev => prev + 1);
        } catch (error) {
            console.error('Error saving step:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const updateFormData = (section: keyof counsellor, data: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: data
        }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicDetails
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 2:
                return (
                    <ProfessionalInfo
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 3:
                return (
                    <ModeAndPricing
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 4:
                return (
                    <Schedule
                        counsellor={formData}
                        updateCounsellor={updateFormData}
                    />
                );
            case 5:
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

    if (isTokenValid === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Validating your link...</p>
                </div>
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invalid or Expired Link</h2>
                    <p className="text-gray-600 mb-6">
                        The application link you're trying to access is either invalid or has expired.
                        Please request a new application link.
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${step <= currentStep
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Basic Details</span>
                        <span>Professional Info</span>
                        <span>Mode & Pricing</span>
                        <span>Schedule</span>
                        <span>Specialties</span>
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {renderStep()}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                disabled={isLoading}
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={isLoading}
                        >
                            {currentStep === 5 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
