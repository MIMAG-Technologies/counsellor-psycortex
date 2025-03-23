
'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'


const AddRecommendationPage = () => {
  const router = useRouter()

 
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleCancel = () => {
    router.back()
  }

  const handleSave = () => {
    
    router.push('/recommendations')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl mx-auto overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-indigo-500">Add Recommendation</h1>
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                placeholder="Enter client name"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Problem</label>
              <input
                type="text"
                placeholder="Enter problem"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                placeholder="Enter age"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                placeholder="Write a detailed message"
                rows={3}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              className="px-5 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              onClick={handleSave}
            >
             Recommend
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddRecommendationPage