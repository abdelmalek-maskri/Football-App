import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { ITournament } from 'app/entities/tournament/tournament.model';
import { PlayType } from 'app/entities/enumerations/play-type.model';

export interface ITeam {
  id: number;
  created?: dayjs.Dayjs | null;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  colour?: string | null;
  schedule?: string | null;
  playType?: PlayType | null;
  owner?: Pick<IUserProfile, 'id'> | null;
  tournaments?: Pick<ITournament, 'id'>[] | null;
}

export type NewTeam = Omit<ITeam, 'id'> & { id: null };
