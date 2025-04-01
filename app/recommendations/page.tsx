'use client'
import { BiPlus } from "react-icons/bi";
import Sidebar from "../../components/sidebar/page";
import { MockData } from "@/types/recommendations/recommendations";
import RecommendationCard from "../cards/recommendations";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "../../components/loader";

const Recommendation = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  const handleAddRecommendation = () => {
    router.push('/recommendations/add');
  };

  return (
    <div className="flex">
      <Sidebar />
  
      {loading ? (
      <div className="flex-grow flex justify-center items-center">
        <Loader />
      </div>
    ) : (
        <div className="ml-16 md:ml-64 p-6 w-full">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between text-indigo-500">
            <h1 className="text-2xl font-bold">View Recommendations</h1>
            <button
              className="bg-indigo-500 text-white p-2.5 rounded-full hover:bg-indigo-600 shadow-md transition-all hover:shadow-lg"
              onClick={handleAddRecommendation}
            >
              <BiPlus className="text-2xl" />
            </button>
          </div>
  
          {/* Recommendation Cards */}
          <div className="p-2 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MockData.map((rec, index) => (
                <RecommendationCard key={index} rec={rec} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Recommendation;
