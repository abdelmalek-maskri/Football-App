import dayjs from 'dayjs/esm';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { ITeam } from 'app/entities/team/team.model';

export interface IPitchBooking {
  id: number;
  bookingDate?: dayjs.Dayjs | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  pitch?: Pick<IPitch, 'id'> | null;
  team?: Pick<ITeam, 'id'> | null;
}

export type NewPitchBooking = Omit<IPitchBooking, 'id'> & { id: null };
