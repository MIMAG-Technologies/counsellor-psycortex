import { useState, useEffect } from 'react';
import { fetchTestSlugs } from '@/utils/ChatSession/fetchslugname';
import { recommendTest } from '@/utils/ChatSession/RecommendPost';
import { TestDetails } from '@/types/RecommenTests/Recommend';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

interface TestRecommendModalProps {
  userId: string;
  counsellorId: string;
  onClose: () => void;
}

export function TestRecommendModal({ userId, counsellorId, onClose }: TestRecommendModalProps) {
  const [tests, setTests] = useState<TestDetails[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const data = await fetchTestSlugs();
        if (data.success) {
          setTests(data.tests);
        }
      } catch (error) {
        toast.error('Failed to load tests');
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  const handleSubmit = async () => {
    if (!selectedTest) {
      toast.error('Please select a test');
      return;
    }

    setSubmitting(true);
    try {
      await recommendTest({
        user_id: userId,
        test_slug: selectedTest,
        counsellor_id: counsellorId
      });
      toast.success('Test recommended successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to recommend test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[12px] bg-black/30 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="bg-indigo-500 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-white">Recommend Test</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Test
              </label>
              <div className="relative z-[60]">
                <select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Choose a test...</option>
                  {tests.map((test) => (
                    <option key={test.slug} value={test.slug} className="py-2">
                      {test.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {selectedTest && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-[200px] overflow-y-auto">
                  <p className="text-sm text-gray-600">
                    {tests.find(t => t.slug === selectedTest)?.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedTest || submitting}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {submitting ? 'Recommending...' : 'Recommend Test'}
          </button>
        </div>
      </div>
    </div>
  );
}