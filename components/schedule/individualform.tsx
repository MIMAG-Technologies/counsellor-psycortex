/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { IndividualSlotLeave } from '@/types/ScheduleLeave/individualslot';
import { applyIndividualLeave } from '@/utils/ScheduleLeave/slotleave'; // Updated import path
import { toast } from 'react-toastify';

interface IndividualLeaveFormProps {
  counsellorId: string;
  date: string;
  timeSlot: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function IndividualLeaveForm({
  counsellorId,
  date,
  timeSlot,
  onClose,
  onSuccess
}: IndividualLeaveFormProps) {
  const [loading, setLoading] = useState(false);
  const [leaveReason, setLeaveReason] = useState('Personal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: IndividualSlotLeave = {
        counsellorId,
        date,
        timeSlot,
        status: 'leave',
        leaveReason,
        leaveUntil: null
      };

      const response = await applyIndividualLeave(data);
      if (response.success) {
        toast.success('Leave applied successfully');
        onSuccess();
      } else {
        toast.error(response.message || 'Failed to apply leave');
      }
    } catch (error) {
      toast.error('Failed to apply leave');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[12px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-indigo-500 mb-4">Apply Leave</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <div className="text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              {new Date(date).toLocaleDateString()} at {timeSlot}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Reason
            </label>
            <select
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Personal">Personal</option>
              <option value="Medical">Medical</option>
              <option value="Emergency">Emergency</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Applying...' : 'Apply Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}