"use client";

import { DayOfWeek, ScheduleItem } from "@/app/apply/utils/counsellorTypes";
import { toast } from "react-toastify";
import { counsellor } from "../utils/counsellorTypes";
import { useEffect } from "react";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Generate time slots from 00:00 to 23:00 in 1-hour intervals
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function Schedule({
  counsellor,
  updateCounsellor,
}: {
  counsellor: Partial<counsellor>
  updateCounsellor: (section: keyof counsellor, data: any) => void
}) {
  // Initialize schedule if not exists
  useEffect(() => {
    if (!counsellor.schedule?.length) {
      const initialSchedule: ScheduleItem[] = DAYS_OF_WEEK.map(day => ({
        day,
        startTime: null,
        endTime: null,
        isWorkingDay: false
      }));
      updateCounsellor("schedule", initialSchedule);
    }
  }, []);

  const updateScheduleItem = (day: DayOfWeek, updates: Partial<ScheduleItem>) => {
    const updatedSchedule = (counsellor.schedule || []).map(item => {
      if (item.day === day) {
        return {
          ...item,
          ...updates
        };
      }
      return item;
    });
    updateCounsellor("schedule", updatedSchedule);
  };

  const validateTimeRange = (day: DayOfWeek, startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return true;
    return startTime < endTime;
  };

  const handleTimeChange = (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
    const currentItem = counsellor.schedule?.find(item => item.day === day);
    if (!currentItem) return;

    const newValue = value || null;
    const otherField = field === 'startTime' ? 'endTime' : 'startTime';
    const otherValue = currentItem[otherField];

    if (!validateTimeRange(day, field === 'startTime' ? newValue : otherValue, field === 'endTime' ? newValue : otherValue)) {
      toast.error("End time must be after start time");
      return;
    }

    updateScheduleItem(day, { [field]: newValue });
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      {/* Schedule List */}
      <div className="space-y-4 mt-4">
        {counsellor.schedule?.map((item) => (
          <div key={item.day} className="bg-gray-100 p-4 rounded-lg shadow-sm">
            {/* Day Name */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                {item.day}
              </h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.isWorkingDay}
                  onChange={(e) =>
                    updateScheduleItem(item.day, {
                      isWorkingDay: e.target.checked,
                      // Reset times when unchecking working day
                      ...(e.target.checked ? {} : { startTime: null, endTime: null })
                    })
                  }
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Working Day</span>
              </label>
            </div>

            {/* Start & End Time Inputs */}
            {item.isWorkingDay && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Start Time
                  </label>
                  <select
                    value={item.startTime || ""}
                    onChange={(e) => handleTimeChange(item.day, 'startTime', e.target.value)}
                    className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    End Time
                  </label>
                  <select
                    value={item.endTime || ""}
                    onChange={(e) => handleTimeChange(item.day, 'endTime', e.target.value)}
                    className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
