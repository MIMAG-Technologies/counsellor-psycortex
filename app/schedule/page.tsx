'use client';

import type { NextPage } from 'next';

import CounselorSchedule from '../components/schedule/Scheduledays';
import Sidebar from '../components/sidebar/page';

const SchedulePage: NextPage = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-16 md:ml-64 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-[95%] xl:max-w-[90%] mx-auto">
            <CounselorSchedule />
          </div>
        </div>
      </div>
    </>
  );
};

export default SchedulePage;