import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { ITeam } from 'app/entities/team/team.model';
import { ContactType } from 'app/entities/enumerations/contact-type.model';

export interface IContact {
  id: number;
  contactType?: ContactType | null;
  contactValue?: string | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
  team?: Pick<ITeam, 'id'> | null;
}

export type NewContact = Omit<IContact, 'id'> & { id: null };
