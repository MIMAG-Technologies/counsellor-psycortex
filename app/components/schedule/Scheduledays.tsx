/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format, addDays, subDays, parseISO, isToday, startOfToday, endOfToday, eachDayOfInterval } from 'date-fns';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from '../loader';

interface WorkingHours {
  start: string | null;
  end: string | null;
}

interface UnavailableSlot {
  time: string;
  is_available: boolean;
  status: string;
  leave_reason: string | null;
  leave_until: string | null;
}

interface DaySchedule {
  date: string;
  day: string;
  isWorkingDay: number;
  working_hours: WorkingHours;
  unavailable_slots: UnavailableSlot[];
}

interface CounselorData {
  success: boolean;
  data: {
    sessionInfo: {
      availability: {
        weeklySchedule: DaySchedule[];
      };
    };
  };
}

const CounselorSchedule: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<DaySchedule[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const BASE_URL=process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchCounselorData();
  }, []);

  useEffect(() => {
    // Scroll to selected date when it changes
    if (calendarRef.current) {
      const selectedElement = calendarRef.current.querySelector('.selected-day');
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  const fetchCounselorData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<CounselorData>(`${BASE_URL}/counsellor/get_counsellor_details.php?counsellorId=c123456`);
      if (response.data.success) {
        setScheduleData(response.data.data.sessionInfo.availability.weeklySchedule);
      } else {
        setError('Failed to fetch data');
      }
      setLoading(false);
    } catch (err) {
      setError(`Error fetching data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const handlePrevDay = (): void => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = (): void => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const formatTime = (timeString: string | null): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const generateTimeSlots = (startTime: string | null, endTime: string | null): string[] => {
    if (!startTime || !endTime) return [];

    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00:00`);
    }

    return slots;
  };

  const isSlotAvailable = (slot: string, unavailableSlots: UnavailableSlot[] | undefined): boolean => {
    if (!unavailableSlots) return true;
    return !unavailableSlots.some(unavailableSlot => unavailableSlot.time === slot);
  };

  const renderSelectedDaySchedule = () => {
    if (!scheduleData) return null;

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayData = scheduleData.find(day => day.date === selectedDateStr);

    if (!dayData) {
      return (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600 min-h-64">
          <p>No schedule information available for this date.</p>
        </div>
      );
    }

    if (!dayData.isWorkingDay) {
      return (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600 min-h-64">
          <p>This is not a working day.</p>
        </div>
      );
    }

    const { working_hours, unavailable_slots } = dayData;
    const timeSlots = generateTimeSlots(working_hours.start, working_hours.end);

    return (
      <div className="bg-white rounded-xl p-6 md:p-8 min-h-64">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-indigo-500 text-xl font-medium">
              {format(parseISO(dayData.date), 'EEEE (MMM d, yyyy)')}
            </h2>
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium w-fit">
              Working Day
            </span>
          </div>
          <div className="text-gray-600 text-sm">
            <span>Working Hours: </span>
            <span className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-500 font-medium">
              {formatTime(working_hours.start)} - {formatTime(working_hours.end)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {timeSlots.map(slot => {
            const available = isSlotAvailable(slot, unavailable_slots);
            return (
              <div 
                key={slot} 
                className={`rounded-lg p-4 border transition-all ${available ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="text-base md:text-lg font-medium text-center text-gray-800 mb-2">
                  {formatTime(slot)}
                </div>
                <div className={`text-center text-xs md:text-sm py-1 px-2 rounded-full mx-auto w-24
                  ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {available ? 'Available' : 'Booked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendarDays = () => {
    if (!scheduleData) return null;

    // Get 7 days from today
    const startDate = startOfToday();
    const endDate = addDays(startDate, 6);
    const sevenDaysInterval = eachDayOfInterval({ start: startDate, end: endDate });
    
    const days = sevenDaysInterval.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayData = scheduleData.find(d => d.date === dayStr);
      const isWorkingDay = dayData?.isWorkingDay === 1;
      const isSelected = format(selectedDate, 'yyyy-MM-dd') === dayStr;
      const isTodayDate = isToday(day);
      
      return (
        <div 
          key={dayStr} 
          className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all mx-1 min-w-12
            ${isSelected ? 'bg-indigo-100 border border-indigo-500 selected-day' : 'bg-white border border-gray-200'} 
            ${isWorkingDay ? 'border-green-200' : 'text-gray-400 bg-gray-50'} 
            ${isTodayDate ? 'font-bold' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          <div className={`flex items-center justify-center ${isTodayDate ? 'bg-indigo-500 text-white w-8 h-8 rounded-full' : 'w-8 h-8'}`}>
            {format(day, 'd')}
          </div>
          <div className="text-xs mt-1 text-center">{format(day, 'EEE')}</div>
        </div>
      );
    });
    
    return (
      <div className="mb-8 relative">
        <div 
          ref={calendarRef}
          className="flex justify-center overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100"
          style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}
        >
          <div className="flex space-x-1 px-2">
            {days}
          </div>
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-2">
          <button 
            onClick={handlePrevDay} 
            className="p-2 rounded-full bg-white hover:bg-indigo-100 text-indigo-500"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-2">
          <button 
            onClick={handleNextDay} 
            className="p-2 rounded-full bg-white hover:bg-indigo-100 text-indigo-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <Loader/>
  
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="w-full rounded-xl p-5 md:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-indigo-100">
        <h1 className="text-indigo-500 text-2xl font-semibold">Schedule Overview</h1>
        <button 
          className="bg-transparent text-indigo-500 p-2 rounded-full hover:bg-indigo-100 transition-colors"
          onClick={fetchCounselorData}
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {renderCalendarDays()}
      {renderSelectedDaySchedule()}
    </div>
  );
};

export default CounselorSchedule;