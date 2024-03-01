import dayjs from 'dayjs/esm';

import { IAvailableDate, NewAvailableDate } from './available-date.model';

export const sampleWithRequiredData: IAvailableDate = {
  id: 88606,
  fromTime: dayjs('2024-03-01T05:30'),
  toTime: dayjs('2024-02-29T21:08'),
  isAvailable: true,
};

export const sampleWithPartialData: IAvailableDate = {
  id: 61282,
  fromTime: dayjs('2024-02-29T17:10'),
  toTime: dayjs('2024-03-01T02:29'),
  isAvailable: false,
};

export const sampleWithFullData: IAvailableDate = {
  id: 1460,
  fromTime: dayjs('2024-03-01T15:20'),
  toTime: dayjs('2024-03-01T12:30'),
  isAvailable: false,
};

export const sampleWithNewData: NewAvailableDate = {
  fromTime: dayjs('2024-02-29T19:35'),
  toTime: dayjs('2024-03-01T02:33'),
  isAvailable: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
