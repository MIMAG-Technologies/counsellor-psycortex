import { FaTimes, FaCalendar, FaVideo, FaUser, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CaseHistory } from "@/types/casehistory/case";

interface CaseHistoryModalProps {
  histories: CaseHistory[];
  onClose: () => void;
  loading: boolean;
}

export function CaseHistoryModal({ histories, onClose, loading }: CaseHistoryModalProps) {
  const router = useRouter();

  const handleCaseClick = (caseId: number) => {
    router.push(`/case-history/${caseId}`);
    onClose(); // Close the modal after navigation
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[12px] bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl min-h-[80vh] max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="bg-indigo-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Case History Overview</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-indigo-100 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {histories.map((history) => (
                <button 
                  key={history.id}
                  onClick={() => handleCaseClick(history.id)}
                  className="w-full bg-indigo-50/50 rounded-lg p-4 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <div className="grid grid-cols-[1fr,auto] gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Case History Information */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUser className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm">Counsellor:</span>
                          <span className="text-gray-900 font-medium">
                            {history.counsellor_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaVideo className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Session Type:</span>
                          <span className="text-gray-900 font-medium capitalize">
                            {history.session_type}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaCalendar className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm">Date:</span>
                          <span className="text-gray-900 font-medium">
                            {new Date(history.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">Session ID:</span>
                          <span className="text-gray-900 font-mono text-sm">
                            {history.session_id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
