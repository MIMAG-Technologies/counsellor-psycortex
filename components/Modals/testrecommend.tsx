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
    <div className="fixed inset-0 backdrop-blur-[12px] bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
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
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Choose a test...</option>
                {tests.map((test) => (
                  <option key={test.slug} value={test.slug}>
                    {test.name}
                  </option>
                ))}
              </select>

              {selectedTest && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  {tests.find(t => t.slug === selectedTest)?.description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
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