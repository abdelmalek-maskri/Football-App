import dayjs from 'dayjs/esm';

import { IMatch, NewMatch } from './match.model';

export const sampleWithRequiredData: IMatch = {
  id: 82797,
  date: dayjs('2024-02-29T21:27'),
};

export const sampleWithPartialData: IMatch = {
  id: 57874,
  awayScore: 727,
  date: dayjs('2024-02-29T20:04'),
};

export const sampleWithFullData: IMatch = {
  id: 99021,
  homeScore: 35227,
  awayScore: 56722,
  date: dayjs('2024-03-01T08:29'),
};

export const sampleWithNewData: NewMatch = {
  date: dayjs('2024-03-01T04:18'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
