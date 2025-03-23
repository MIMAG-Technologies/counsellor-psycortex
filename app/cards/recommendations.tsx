import React from "react";
import { BiUser, BiCalendar, BiEdit, BiTrash } from "react-icons/bi"; 
import { MdOutlineMessage, MdLocalHospital } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { recommendations } from "../types/recommendations/recommendations";

const RecommendationCard = ({ rec }: { rec: recommendations }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-5 border-2 border-gray-100 w-full max-w-xl h-64 flex flex-col justify-between relative overflow-hidden hover:shadow-xl transition-all duration-300">
    
      <div>
        <div className="flex items-center gap-2 pb-2">
          <div className="bg-indigo-100 p-2 rounded-full">
            <FaUserCircle className="text-xl text-indigo-500" />
          </div>
          <h2 className="text-indigo-500 text-lg font-bold truncate">
            {rec.clientname}
          </h2>
        </div>
        <div className="flex items-center gap-2 mt-1 bg-purple-50 py-1 px-3 rounded-full w-fit">
          <MdLocalHospital className="text-lg text-purple-500" />
          <p className="text-purple-500 font-medium text-sm">{rec.problem}</p>
        </div>
      </div>
      
      
      <div className="my-3 border-l-4 border-indigo-300 pl-3 py-1">
        <p className="text-gray-700 text-sm flex items-start gap-2 line-clamp-2">
          <MdOutlineMessage className="text-lg text-indigo-500 flex-shrink-0 mt-1" />
          <span>{rec.message}</span>
        </p>
      </div>
      
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-100">
        <div className="flex gap-4 text-gray-600 text-sm font-medium">
          <div className="flex items-center gap-1 bg-gray-50 py-1 px-3 rounded-full">
            <BiUser className="text-lg text-indigo-400" /> {rec.age} Years Old
          </div>
          <div className="flex items-center gap-1 bg-gray-50 py-1 px-3 rounded-full">
            <BiCalendar className="text-lg text-indigo-400" /> {rec.date}
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default RecommendationCard;