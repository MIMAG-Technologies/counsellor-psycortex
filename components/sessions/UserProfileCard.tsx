import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa6";
import { UserDetails } from "@/types/sessiondetails/details";

interface UserProfileCardProps {
  userDetails: UserDetails;
}

export function UserProfileCard({ userDetails }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {userDetails.personalInfo.profileImage ? (
            <img
              src={userDetails.personalInfo.profileImage}
              alt={userDetails.personalInfo.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-50"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <FaUser className="w-6 h-6 text-indigo-500" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {userDetails.personalInfo.name}
            </h2>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <FaEnvelope className="w-4 h-4" />
                {userDetails.personalInfo.email}
              </div>
              <div className="flex items-center gap-1.5">
                <FaPhone className="w-4 h-4" />
                {userDetails.personalInfo.phone}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-indigo-600">
              {userDetails.stats.counselling.total}
            </p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-indigo-600">
              {userDetails.stats.counselling.completed}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}