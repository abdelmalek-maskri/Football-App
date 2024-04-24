import dayjs from 'dayjs/esm';
import { ITeam } from 'app/entities/team/team.model';
import { IPitch } from 'app/entities/pitch/pitch.model';

export interface IPitchBooking {
  id: number;
  bookingDate?: dayjs.Dayjs | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  team?: Pick<ITeam, 'id'> | null;
  pitch?: Pick<IPitch, 'id'> | null;
  userProfileId?: number | null; // New property for user profile ID
}

export type NewPitchBooking = Omit<IPitchBooking, 'id'> & { id: null };
