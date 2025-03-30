'use client'

interface AddRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecommendationModal: React.FC<AddRecommendationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/45">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] md:w-[600px] lg:w-[700px]">
        <h2 className="text-lg font-semibold text-indigo-500 mb-4">
          Add Recommendation
        </h2>

        <input
          type="text"
          placeholder="Client Name"
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Problem"
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="number"
          placeholder="Age"
          className="w-full border p-2 rounded mb-2"
        />
        <textarea
          placeholder="Message"
          className="w-full border p-2 rounded mb-2"
        ></textarea>
        <input type="date" className="w-full border p-2 rounded mb-4" />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecommendationModal;
