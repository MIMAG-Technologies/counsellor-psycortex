"use client";

import React, { useEffect, useState } from 'react';
import { counsellor } from './utils/counsellorTypes';
import axios from 'axios';
import BasicDetails from './components/BasicDetails';
import ProfessionalInfo from './components/ProfessionalInfo';
import ModeAndPricing from './components/ModeAndPricing';
import Schedule from './components/Schedule';
import SpecialitiesAndLanguages from './components/SpecialitiesAndLanguages';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { counsellordata, submitApplication } from './utils/counsellorStateManager';
import { markLinkAsUsed } from './utils/counsellorUtils';

export default function Apply() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const [payLoad, setpayLoad] = useState<{
        email: string;
        phone: string;
        status: string;
        counsellorId: string | null;
        remark: string | null;
    } | null>(null)

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmations, setConfirmations] = useState({
        personalInfo: false,
        professionalInfo: false,
        communicationAndPricing: false,
        schedule: false,
        specialtiesAndLanguages: false
    });

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsTokenValid(false);
                return;
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/send/verify_link.php`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (res.data) {
                    setIsTokenValid(true);
                    setpayLoad(res.data)
                } else {
                    setIsTokenValid(false);
                }
            } catch (error: any) {
                console.error('Error validating token:', error);
                setIsTokenValid(false);
                if (error.response.data.error === "Token is completed") {
                    setError("This link has been used already. Please request a new link.");
                } else {
                    setError("This is an invalid or expired link. Please request a new link.");
                }
            }
        };

        validateToken();
    }, [token]);

    useEffect(() => {
        const fetchCounsellorData = async () => {
            if (payLoad) {
                const counsellorData = await counsellordata(payLoad)
                if (counsellorData) {
                    setFormData(counsellorData)
                }
            }
        }
        fetchCounsellorData()
    }, [payLoad]);
    const validateSection1 = () => {
        const { basicInfo } = formData;
        if (!basicInfo) return false;

        return !!(
            basicInfo.name &&
            basicInfo.dateOfBirth &&
            basicInfo.gender &&
            basicInfo.biography &&
            basicInfo.email &&
            basicInfo.phone
        );
    };

    const validateSection2 = () => {
        const { professionalInfo } = formData;
        if (!professionalInfo) return false;

        // Check title and years of experience
        if (!professionalInfo.title || !professionalInfo.yearsOfExperience) return false;

        // Check if at least one education entry exists and is complete
        if (!professionalInfo.education || professionalInfo.education.length === 0) return false;

        // Verify all education entries are complete
        const isEducationComplete = professionalInfo.education.every(edu =>
            edu.degree && edu.field && edu.institution && edu.year
        );
        if (!isEducationComplete) return false;

        // Verify all license entries (if any) are complete
        if (professionalInfo.licenses && professionalInfo.licenses.length > 0) {
            const isLicensesComplete = professionalInfo.licenses.every(license =>
                license.type && license.licenseNumber && license.issuingAuthority && license.validUntil
            );
            if (!isLicensesComplete) return false;
        }

        return true;
    };

    const validateSection3 = () => {
        const { communicationModes, pricing, preferredCenterAddress } = formData;
        if (!communicationModes || !pricing) return false;

        // Check if at least one mode is selected
        const hasOneMode = Object.values(communicationModes).some(mode => mode === true);
        if (!hasOneMode) return false;

        // Check if pricing exists for all selected modes
        const selectedModes = Object.entries(communicationModes)
            .filter(([_, isSelected]) => isSelected)
            .map(([mode]) => mode);

        const hasPricingForAllModes = selectedModes.every(mode =>
            pricing.some(item => item.typeOfAvailability === mode && item.sessionTitle && item.price >= 0)
        );

        // If in-person mode is selected, validate center address
        if (communicationModes.in_person) {
            if (!preferredCenterAddress) return false;
            const { street_address, city, state, pincode } = preferredCenterAddress;
            if (!street_address || !city || !state || !pincode) return false;
        }

        return hasPricingForAllModes;
    };

    const validateSection4 = () => {
        const { schedule } = formData;
        if (!schedule || schedule.length === 0) return false;

        // Count working days
        const workingDays = schedule.filter(day => day.isWorkingDay).length;
        if (workingDays < 3) return false;

        // Check if all working days have start and end times
        const isScheduleComplete = schedule.every(day =>
            !day.isWorkingDay || (day.startTime && day.endTime)
        );

        return isScheduleComplete;
    };

    const validateSection5 = () => {
        const { specialties, languages } = formData;
        if (!specialties || !languages) return false;

        return specialties.length > 0 && languages.length > 0;
    };

    const handleNext = () => {
        let isValid = false;
        let errorMessage = '';

        switch (currentStep) {
            case 1:
                isValid = validateSection1();
                errorMessage = 'Please fill in all required personal information fields.';
                break;
            case 2:
                isValid = validateSection2();
                errorMessage = 'Please complete all professional information. Title, years of experience, and at least one complete education entry are required.';
                break;
            case 3:
                isValid = validateSection3();
                errorMessage = 'Please select at least one communication mode and complete its pricing details. If you selected in-person mode, please also provide your preferred center address.';
                break;
            case 4:
                isValid = validateSection4();
                errorMessage = 'Please set up at least 3 working days with complete schedules.';
                break;
            case 5:
                isValid = validateSection5();
                errorMessage = 'Please select at least one specialty and one language.';
                break;
            default:
                isValid = true;
        }

        if (!isValid) {
            toast.error(errorMessage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError(null);
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        // Scroll to top when changing steps
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        // Validate the final section first
        if (!validateSection5()) {
            toast.error('Please complete all required fields before submitting.');
            return;
        }

        // Show confirmation modal instead of submitting directly
        setShowConfirmModal(true);
    };

    const handleFinalSubmit = async () => {
        // Check if all confirmations are checked
        if (!Object.values(confirmations).every(value => value)) {
            toast.error('Please confirm all checkboxes before submitting.');
            return;
        }

        setIsLoading(true);
        try {
            if (payLoad) {
                const result = await submitApplication(payLoad, formData as counsellor);

                if (result.success) {
                    setIsSubmitted(true);
                    if (token) {
                        await markLinkAsUsed(token);
                    }
                    toast.success('Application submitted successfully!');
                } else {
                    toast.error(result.error || 'Failed to submit application. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
            setShowConfirmModal(false);
        }
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

    const ConfirmationModal = () => {
        if (!showConfirmModal) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Confirm Application Submission</h2>

                    <div className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                        Please review and confirm the following before submitting your application:
                    </div>

                    <div className="space-y-2 sm:space-y-1 mb-6 sm:mb-8">
                        <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={confirmations.personalInfo}
                                onChange={(e) => setConfirmations(prev => ({
                                    ...prev,
                                    personalInfo: e.target.checked
                                }))}
                                className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 text-primary rounded border-gray-300 focus:ring-primary flex-shrink-0"
                            />
                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                I confirm that all my personal information is accurate and complete, including my name, contact details, and biographical information.
                            </span>
                        </label>

                        <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={confirmations.professionalInfo}
                                onChange={(e) => setConfirmations(prev => ({
                                    ...prev,
                                    professionalInfo: e.target.checked
                                }))}
                                className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 text-primary rounded border-gray-300 focus:ring-primary flex-shrink-0"
                            />
                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                I verify that my professional qualifications, education history, and licenses provided are valid and current.
                            </span>
                        </label>

                        <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={confirmations.communicationAndPricing}
                                onChange={(e) => setConfirmations(prev => ({
                                    ...prev,
                                    communicationAndPricing: e.target.checked
                                }))}
                                className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 text-primary rounded border-gray-300 focus:ring-primary flex-shrink-0"
                            />
                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                I confirm that my communication preferences and pricing details are correctly set and I agree to provide services at the stated rates.
                            </span>
                        </label>

                        <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={confirmations.schedule}
                                onChange={(e) => setConfirmations(prev => ({
                                    ...prev,
                                    schedule: e.target.checked
                                }))}
                                className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 text-primary rounded border-gray-300 focus:ring-primary flex-shrink-0"
                            />
                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                I commit to maintaining the availability schedule I have provided and will update it promptly if changes are needed.
                            </span>
                        </label>

                        <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={confirmations.specialtiesAndLanguages}
                                onChange={(e) => setConfirmations(prev => ({
                                    ...prev,
                                    specialtiesAndLanguages: e.target.checked
                                }))}
                                className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 text-primary rounded border-gray-300 focus:ring-primary flex-shrink-0"
                            />
                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                I confirm that I have the expertise in my selected specialties and am fluent in all listed languages at the indicated proficiency levels.
                            </span>
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 border-t pt-4 sm:pt-6">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleFinalSubmit}
                            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium flex items-center justify-center transition-colors text-sm sm:text-base order-1 sm:order-2 ${isLoading
                                ? 'opacity-50 cursor-not-allowed bg-primary text-white'
                                : Object.values(confirmations).every(value => value)
                                    ? 'bg-primary text-white hover:bg-secondary'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            disabled={isLoading || !Object.values(confirmations).every(value => value)}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Loading State
    if (isTokenValid === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-primary rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Validating Your Link</h2>
                    <p className="text-gray-600">Please wait while we verify your credentials...</p>
                </div>
            </div>
        );
    }

    // Invalid Token State
    if (!isTokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Link</h2>
                    <p className="text-gray-600 mb-8">
                        {error || "The application link you're trying to access is either invalid or has expired."}
                    </p>

                </div>
            </div>
        );
    }

    // Success State
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-green-50 rounded-full mx-auto flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-4">
                        Thank you for applying to join our counseling network. We've received your application and will review it soon.
                    </p>
                </div>
            </div>
        );
    }

    // Main Application Form
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Counselor Application</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Join our professional network and help make a difference in people's lives through your expertise and guidance.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                            />
                        </div>

                        {/* Step Circles */}
                        <div className="relative flex justify-between">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                    key={step}
                                    className="flex flex-col items-center z-10 cursor-pointer"
                                    onClick={() => step <= currentStep && setCurrentStep(step)}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md ${step < currentStep
                                            ? 'bg-primary border-primary text-white hover:bg-primary/90'
                                            : step === currentStep
                                                ? 'border-primary bg-white text-primary'
                                                : 'border-gray-300 bg-white text-gray-400'
                                            }`}
                                    >
                                        {step < currentStep ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span className="font-medium">{step}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto mb-10">
                    {/* Step Title */}
                    <div className="mb-8 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {currentStep === 1 && 'Personal Information'}
                            {currentStep === 2 && 'Professional Background'}
                            {currentStep === 3 && 'Communication Modes & Pricing'}
                            {currentStep === 4 && 'Availability Schedule'}
                            {currentStep === 5 && 'Specialties & Languages'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {currentStep === 1 && 'Tell us about yourself and your contact information'}
                            {currentStep === 2 && 'Share your professional qualifications and experience'}
                            {currentStep === 3 && "Set up how you'll communicate with clients and your rates"}
                            {currentStep === 4 && 'Define your working hours and availability'}
                            {currentStep === 5 && 'Select your areas of expertise and the languages you speak'}
                        </p>
                    </div>

                    {/* Error Message if any */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    {renderStep()}

                    {/* Navigation Buttons */}
                    <div className="mt-10 flex flex-wrap gap-4 justify-between border-t pt-6">
                        {currentStep > 1 ? (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Previous
                            </button>
                        ) : (
                            <div></div>
                        )}

                        <button
                            onClick={currentStep === 5 ? handleSubmit : handleNext}
                            className={`px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium flex items-center shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {currentStep === 5 ? 'Submitting...' : 'Loading...'}
                                </span>
                            ) : (
                                <>
                                    {currentStep === 5 ? 'Submit Application' : 'Next Step'}
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center text-gray-500 text-sm max-w-2xl mx-auto">
                    <p>Having trouble with your application? <a href="/support" className="text-primary hover:underline">Contact our support team</a> for assistance.</p>
                </div>
            </div>
            <ConfirmationModal />
        </div>
    );
}