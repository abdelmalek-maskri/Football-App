import dayjs from 'dayjs/esm';
import { ITeam } from 'app/entities/team/team.model';

export interface ITournament {
  id: number;
  name?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  location?: string | null;
  maxTeams?: number | null;
  // teams?: Pick<ITeam, 'id'>[] | null;
  teams?: ITeam[] | null;
}

export type NewTournament = Omit<ITournament, 'id'> & { id: null };
