import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IMatch } from 'app/entities/match/match.model';

export interface IComment {
  id: number;
  rating?: number | null;
  content?: string | null;
  likeCount?: number | null;
  replyingTo?: Pick<IComment, 'id'> | null;
  author?: Pick<IUserProfile, 'id'> | null;
  targetUser?: Pick<IUserProfile, 'id'> | null;
  match?: Pick<IMatch, 'id'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
