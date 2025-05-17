import { counsellor } from "./counsellorTypes";
import { getCounsellor } from "./counsellorUtils";
import {
  createCounsellor,
  updatePersonalInfo,
  updateProfessionalInfo,
  updatePricing,
  updateCommunicationModes,
  updateSchedule,
  updateLanguages,
  updateSpecialties,
  updateProfilePic,
} from "./counsellorUtils";

export const counsellordata = async (payload: {
  email: string;
  phone: string;
  status: string;
  counsellorId: string | null;
  remark: string | null;
}) => {
  if (payload.status === "new") {
    return {
      basicInfo: {
        name: "",
        dateOfBirth: "",
        gender: "",
        biography: "",
        email: payload.email,
        phone: payload.phone,
        profileImage: "",
      },
      professionalInfo: {
        title: "",
        yearsOfExperience: 0,
        education: [],
        licenses: [],
      },
      primaryAddress: {
        street_address: "",
        city: "",
        state: "",
        pincode: "",
      },
      preferredCenterAddress: {
        street_address: "",
        city: "",
        state: "",
        pincode: "",
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
    } as counsellor;
  } else if (payload.status === "reverify" && payload.counsellorId) {
    const counsellor = await getCounsellor(payload.counsellorId);

    if (!counsellor) return null;

    // Map the API response to the counsellor type format
    return {
      basicInfo: {
        name: counsellor.personalInfo.name,
        dateOfBirth: counsellor.personalInfo.dateOfBirth,
        gender: counsellor.personalInfo.gender,
        biography: counsellor.personalInfo.biography,
        email: counsellor.personalInfo.email,
        phone: counsellor.personalInfo.phone,
        profileImage: counsellor.personalInfo.profileImage,
      },
      professionalInfo: {
        title: counsellor.professionalInfo.title,
        yearsOfExperience: counsellor.professionalInfo.yearsOfExperience,
        education: counsellor.professionalInfo.education,
        licenses: counsellor.professionalInfo.licenses,
      },
      primaryAddress: counsellor.addresses[0]
        ? {
            street_address: counsellor.addresses[0].address,
            city: counsellor.addresses[0].city,
            state: counsellor.addresses[0].state,
            pincode: counsellor.addresses[0].pincode,
          }
        : {
            street_address: "",
            city: "",
            state: "",
            pincode: "",
          },
      preferredCenterAddress: counsellor.addresses[1]
        ? {
            street_address: counsellor.addresses[1].address,
            city: counsellor.addresses[1].city,
            state: counsellor.addresses[1].state,
            pincode: counsellor.addresses[1].pincode,
          }
        : {
            street_address: "",
            city: "",
            state: "",
            pincode: "",
          },
      communicationModes: {
        chat: counsellor.sessionInfo.availability.communicationModes.includes(
          "chat"
        ),
        call: counsellor.sessionInfo.availability.communicationModes.includes(
          "call"
        ),
        video:
          counsellor.sessionInfo.availability.communicationModes.includes(
            "video"
          ),
        in_person:
          counsellor.sessionInfo.availability.communicationModes.includes(
            "in_person"
          ),
      },
      pricing: counsellor.sessionInfo.pricing.rates.map((rate: any) => ({
        sessionType: rate.sessionType as any,
        sessionTitle: rate.sessionTitle,
        price: rate.price,
        currency: rate.currency,
        typeOfAvailability: rate.availabilityTypes[0] as any,
      })),
      schedule: counsellor.sessionInfo.availability.weeklySchedule.map(
        (schedule: any) => ({
          day: schedule.day as any,
          startTime: schedule.working_hours.start,
          endTime: schedule.working_hours.end,
          isWorkingDay: schedule.isWorkingDay === 1,
        })
      ),
      languages: counsellor.practiceInfo.languages,
      specialties: counsellor.practiceInfo.specialties,
    } as counsellor;
  }

  return null;
};

export const submitApplication = async (
  payload: {
    email: string;
    phone: string;
    status: string;
    counsellorId: string | null;
    remark: string | null;
  },
  counsellor: counsellor
) => {
  try {
    let counsellorId = payload.counsellorId;

    // Step 1: If new counsellor, create one first
    if (payload.status === "new") {
      counsellorId = await createCounsellor(
        counsellor.basicInfo.name,
        counsellor.basicInfo.email,
        counsellor.basicInfo.phone,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );

      if (!counsellorId) {
        throw new Error("Failed to create counsellor");
      }
    }

    if (!counsellorId) {
      throw new Error("Counsellor ID is required");
    }

    // Step 2: Update Personal Information
    const personalInfoResult = await updatePersonalInfo(counsellorId, {
      name: counsellor.basicInfo.name,
      dateOfBirth: counsellor.basicInfo.dateOfBirth,
      gender: counsellor.basicInfo.gender,
      biography: counsellor.basicInfo.biography,
      email: counsellor.basicInfo.email,
      phone: counsellor.basicInfo.phone,
      profileImage: counsellor.basicInfo.profileImage,
    });

    if (!personalInfoResult) {
      throw new Error("Failed to update personal information");
    }

    // Step 3: Update Professional Information
    const professionalInfoResult = await updateProfessionalInfo(counsellorId, {
      title: counsellor.professionalInfo.title,
      yearsOfExperience: counsellor.professionalInfo.yearsOfExperience,
      education: counsellor.professionalInfo.education,
      licenses: counsellor.professionalInfo.licenses,
    });

    if (!professionalInfoResult) {
      throw new Error("Failed to update professional information");
    }

    // Step 4: Update Communication Modes
    const communicationModesString = Object.entries(
      counsellor.communicationModes
    )
      .filter(([_, isEnabled]) => isEnabled)
      .map(([mode]) => mode)
      .join(",");

    const communicationModesResult = await updateCommunicationModes(
      counsellorId,
      communicationModesString
    );

    if (!communicationModesResult) {
      throw new Error("Failed to update communication modes");
    }

    // Step 5: Update Pricing
    const pricingResult = await updatePricing(counsellorId, counsellor.pricing);

    if (!pricingResult) {
      throw new Error("Failed to update pricing information");
    }

    // Step 6: Update Schedule
    const scheduleResult = await updateSchedule(
      counsellorId,
      counsellor.schedule
    );

    if (!scheduleResult) {
      throw new Error("Failed to update schedule");
    }

    // Step 7: Update Languages
    const languagesResult = await updateLanguages(
      counsellorId,
      counsellor.languages
    );

    if (!languagesResult) {
      throw new Error("Failed to update languages");
    }

    // Step 8: Update Specialties
    const specialtiesResult = await updateSpecialties(
      counsellorId,
      counsellor.specialties
    );

    if (!specialtiesResult) {
      throw new Error("Failed to update specialties");
    }

    // Step 9: If there's a profile image as base64, update it
    if (
      counsellor.basicInfo.profileImage &&
      counsellor.basicInfo.profileImage.startsWith("data:image")
    ) {
      // Convert base64 to File object
      const base64Response = await fetch(counsellor.basicInfo.profileImage);
      const blob = await base64Response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      const profileImageResult = await updateProfilePic(counsellorId, file);
      if (!profileImageResult) {
        throw new Error("Failed to update profile image");
      }
    }

    return { success: true, counsellorId };
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit application",
      counsellorId: null,
    };
  }
};
