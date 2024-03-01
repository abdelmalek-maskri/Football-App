import dayjs from 'dayjs/esm';

import { ITournament, NewTournament } from './tournament.model';

export const sampleWithRequiredData: ITournament = {
  id: 73077,
  name: 'silver Fantastic Future-proofed',
  startDate: dayjs('2024-02-29T17:51'),
  endDate: dayjs('2024-03-01T07:05'),
  location: 'e-business',
  maxTeams: 32,
};

export const sampleWithPartialData: ITournament = {
  id: 54956,
  name: 'protocol scale',
  startDate: dayjs('2024-03-01T01:00'),
  endDate: dayjs('2024-03-01T13:30'),
  location: 'Chair mobile',
  maxTeams: 18,
};

export const sampleWithFullData: ITournament = {
  id: 49710,
  name: 'redundant Industrial Fresh',
  startDate: dayjs('2024-03-01T13:34'),
  endDate: dayjs('2024-03-01T13:32'),
  location: 'Sleek withdrawal EXE',
  maxTeams: 10,
};

export const sampleWithNewData: NewTournament = {
  name: 'Alley Pizza',
  startDate: dayjs('2024-03-01T10:18'),
  endDate: dayjs('2024-03-01T09:29'),
  location: 'Multi-tiered',
  maxTeams: 31,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
