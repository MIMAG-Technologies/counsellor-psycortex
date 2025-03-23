import Sidebar from "../components/sidebar/page";
import { MockData } from "../types/recommendations/recommendations";
import RecommendationCard from "../cards/recommendations"; // Import the card component

const Recommendation = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-16 md:ml-64 p-6 pl text-2xl text-indigo-500 w-full">
        <h1 className="mb-4 font-bold p-4">View Recommendations</h1>

        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MockData.map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
