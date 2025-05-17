import { counsellor } from "./counsellorTypes";
import { getCounsellor } from "./counsellorUtils";

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
