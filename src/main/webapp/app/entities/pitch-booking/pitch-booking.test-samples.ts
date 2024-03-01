import dayjs from 'dayjs/esm';

import { IPitchBooking, NewPitchBooking } from './pitch-booking.model';

export const sampleWithRequiredData: IPitchBooking = {
  id: 55030,
  bookingDate: dayjs('2024-03-01T15:29'),
  startTime: dayjs('2024-03-01T04:16'),
  endTime: dayjs('2024-03-01T06:06'),
};

export const sampleWithPartialData: IPitchBooking = {
  id: 51998,
  bookingDate: dayjs('2024-02-29T20:13'),
  startTime: dayjs('2024-03-01T06:11'),
  endTime: dayjs('2024-03-01T11:39'),
};

export const sampleWithFullData: IPitchBooking = {
  id: 43300,
  bookingDate: dayjs('2024-02-29T18:47'),
  startTime: dayjs('2024-02-29T23:47'),
  endTime: dayjs('2024-02-29T22:08'),
};

export const sampleWithNewData: NewPitchBooking = {
  bookingDate: dayjs('2024-03-01T09:38'),
  startTime: dayjs('2024-03-01T01:38'),
  endTime: dayjs('2024-03-01T08:41'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
