import dayjs from 'dayjs/esm';
import { ITeam } from 'app/entities/team/team.model';
import { Genders } from 'app/entities/enumerations/genders.model';
import { Positions } from 'app/entities/enumerations/positions.model';

export interface IUserProfile {
  id: number;
  created?: dayjs.Dayjs | null;
  name?: string | null;
  profilePic?: string | null;
  profilePicContentType?: string | null;
  gender?: Genders | null;
  location?: string | null;
  position?: Positions | null;
  referee?: boolean | null;
  team?: Pick<ITeam, 'id'> | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
