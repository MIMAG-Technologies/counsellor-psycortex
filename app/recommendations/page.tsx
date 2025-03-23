'use client'
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import Sidebar from "../components/sidebar/page";
import { MockData } from "@/app/types/recommendations/recommendations";
import AddRecommendationModal from "../components/Modals/recommendations";
import RecommendationCard from "../cards/recommendations";

const Recommendation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-16 md:ml-64 p-6 w-full">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between text-indigo-500">
          <h1 className="text-2xl font-bold">View Recommendations</h1>
          <button
            className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 shadow-md transition"
            onClick={() => setIsModalOpen(true)}
          >
            <BiPlus className="text-2xl" />
          </button>
        </div>

        {/* Recommendation Cards */}
        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MockData.map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <AddRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Recommendation;
