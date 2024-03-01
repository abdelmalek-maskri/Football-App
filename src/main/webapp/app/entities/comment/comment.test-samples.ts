import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
  rating: 1,
};

export const sampleWithPartialData: IComment = {
  id: 40657,
  rating: 4,
  content: 'Alabama Customer',
};

export const sampleWithFullData: IComment = {
  id: 42730,
  rating: 0,
  content: 'repurpose deposit',
  likeCount: 18129,
};

export const sampleWithNewData: NewComment = {
  rating: 5,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
