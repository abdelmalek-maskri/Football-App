import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { ITeam } from 'app/entities/team/team.model';
import { ITournament } from 'app/entities/tournament/tournament.model';

export interface IMatch {
  id: number;
  homeScore?: number | null;
  awayScore?: number | null;
  date?: dayjs.Dayjs | null;
  referee?: Pick<IUserProfile, 'id'> | null;
  pitch?: Pick<IPitch, 'id'> | null;
  home?: Pick<ITeam, 'id'> | null;
  away?: Pick<ITeam, 'id'> | null;
  tournament?: Pick<ITournament, 'id'> | null;
}

export type NewMatch = Omit<IMatch, 'id'> & { id: null };
