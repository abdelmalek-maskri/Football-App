import dayjs from 'dayjs/esm';

import { Genders } from 'app/entities/enumerations/genders.model';
import { Positions } from 'app/entities/enumerations/positions.model';

import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
  created: dayjs('2024-03-01T02:23'),
  name: 'matrix Books',
  gender: Genders['MALE'],
  referee: true,
};

export const sampleWithPartialData: IUserProfile = {
  id: 12169,
  created: dayjs('2024-03-01T05:22'),
  name: 'Sleek Chair',
  profilePic: '../fake-data/blob/hipster.png',
  profilePicContentType: 'unknown',
  gender: Genders['FEMALE'],
  position: Positions['CB'],
  referee: true,
};

export const sampleWithFullData: IUserProfile = {
  id: 9713,
  created: dayjs('2024-03-01T02:46'),
  name: 'communities motivating National',
  profilePic: '../fake-data/blob/hipster.png',
  profilePicContentType: 'unknown',
  gender: Genders['OTHER'],
  location: 'payment transmitting Bacon',
  position: Positions['GK'],
  referee: true,
};

export const sampleWithNewData: NewUserProfile = {
  created: dayjs('2024-03-01T01:32'),
  name: 'firewall',
  gender: Genders['MALE'],
  referee: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
