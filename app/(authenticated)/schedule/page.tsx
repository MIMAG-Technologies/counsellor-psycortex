'use client';

import type { NextPage } from 'next';
import CounselorSchedule from '@/components/schedule/Scheduledays';

const SchedulePage: NextPage = () => {
  return (
    <div className="w-full max-w-[95%] xl:max-w-[90%] mx-auto">
      <CounselorSchedule />
    </div>
  );
};

export default SchedulePage; 