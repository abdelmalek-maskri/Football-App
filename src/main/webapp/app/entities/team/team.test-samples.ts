import dayjs from 'dayjs/esm';

import { PlayType } from 'app/entities/enumerations/play-type.model';

import { ITeam, NewTeam } from './team.model';

export const sampleWithRequiredData: ITeam = {
  id: 88024,
  created: dayjs('2024-03-01T04:18'),
  name: 'Assurance SDD invoice',
};

export const sampleWithPartialData: ITeam = {
  id: 78743,
  created: dayjs('2024-03-01T07:39'),
  name: 'Operations',
  description: 'panel orange',
  colour: 'Grocer',
  schedule: 'Maine experiences',
  playType: PlayType['COMPETITIVE'],
};

export const sampleWithFullData: ITeam = {
  id: 56555,
  created: dayjs('2024-02-29T21:04'),
  name: 'Facilitator Afghanistan',
  description: 'Refined Borders 1080p',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  colour: 'Pakist',
  schedule: 'Music Digitized',
  playType: PlayType['SOCIAL'],
};

export const sampleWithNewData: NewTeam = {
  created: dayjs('2024-02-29T20:45'),
  name: 'Frozen Fully-configurable',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
