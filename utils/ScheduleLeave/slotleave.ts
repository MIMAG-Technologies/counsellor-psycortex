/* eslint-disable @typescript-eslint/no-unused-vars */
import { MultiDayLeave, MultiDayLeaveResponse } from '@/types/ScheduleLeave/multileave';
import { IndividualSlotLeave, IndividualSlotResponse } from '@/types/ScheduleLeave/individualslot';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const applyIndividualLeave = async (data: IndividualSlotLeave): Promise<IndividualSlotResponse> => {
  try {
    const response = await fetch(`${baseUrl}/counsellor/update_slot_status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to apply individual leave');
  }
};

export const applyMultiDayLeave = async (data: MultiDayLeave): Promise<MultiDayLeaveResponse> => {
  try {
    const response = await fetch(`${baseUrl}/counsellor/update_leaves.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to apply multi-day leave');
  }
};