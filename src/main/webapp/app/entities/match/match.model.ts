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
  referee?: Pick<IUserProfile, 'id' | 'name'> | null;
  pitch?: Pick<IPitch, 'id' | 'name'> | null;
  home?: Pick<ITeam, 'id' | 'name' | 'image' | 'imageContentType' | 'members'> | null;
  away?: Pick<ITeam, 'id' | 'name' | 'image' | 'imageContentType' | 'members'> | null;
  tournament?: Pick<ITournament, 'id' | 'name'> | null;
}

export interface IMatchDated {
  date?: string;
  list: IMatch[];
}

export type NewMatch = Omit<IMatch, 'id'> & { id: null };
