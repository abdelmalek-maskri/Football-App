import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { ITeam } from 'app/entities/team/team.model';

export interface IAvailableDate {
  id: number;
  fromTime?: dayjs.Dayjs | null;
  toTime?: dayjs.Dayjs | null;
  isAvailable?: boolean | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
  team?: Pick<ITeam, 'id'> | null;
}

export type NewAvailableDate = Omit<IAvailableDate, 'id'> & { id: null };
