'use client'

import Sidebar from "../components/sidebar/page";

const Sessions = () => {
  return (
    <div className="bg-white min-h-screen">
      <Sidebar />
      <div className="ml-16 md:ml-[250px] p-6">
        <h1 className="text-3xl text-purple-700 font-medium">
          My Sessions
        </h1>

        <div className="flex items-center gap-4 pt-7">
          <h1 className="text-xl text-gray-700 font-medium">
            Mode:
          </h1>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white rounded-full shadow-lg hover:bg-purple-500 transition duration-300">
            📹 Video
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white rounded-full shadow-lg hover:bg-purple-500 transition duration-300">
          💬 Chat
            
          </button>
          
        </div>

        <div className="flex flex-col gap-2 pt-3">
          <h1 className="text-xl  text-gray-700 font-medium">
            Status:
          </h1>

          <div className="flex flex-row gap-3">
            <button className="flex items-center   p-3 gap-5 rounded-full w-23 h-10 shadow-lg transition-all duration-300 bg-purple-800 hover:bg-purple-500 text-white ">
              Upcoming
            </button>

            <button className="flex items-center   p-3 gap-5 rounded-full w-24 h-10 shadow-lg transition-all duration-300 bg-purple-800 hover:bg-purple-500 text-white ">
              Completed
            </button>

            <button className="flex items-center   p-3 gap-5 rounded-full w-23 h-10 shadow-lg transition-all duration-300 bg-purple-800 hover:bg-purple-500 text-white ">
              Cancelled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sessions;
