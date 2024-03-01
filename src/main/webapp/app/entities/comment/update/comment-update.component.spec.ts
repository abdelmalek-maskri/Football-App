import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommentFormService } from './comment-form.service';
import { CommentService } from '../service/comment.service';
import { IComment } from '../comment.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IMatch } from 'app/entities/match/match.model';
import { MatchService } from 'app/entities/match/service/match.service';

import { CommentUpdateComponent } from './comment-update.component';

describe('Comment Management Update Component', () => {
  let comp: CommentUpdateComponent;
  let fixture: ComponentFixture<CommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commentFormService: CommentFormService;
  let commentService: CommentService;
  let userProfileService: UserProfileService;
  let matchService: MatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commentFormService = TestBed.inject(CommentFormService);
    commentService = TestBed.inject(CommentService);
    userProfileService = TestBed.inject(UserProfileService);
    matchService = TestBed.inject(MatchService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Comment query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const replyingTo: IComment = { id: 60734 };
      comment.replyingTo = replyingTo;

      const commentCollection: IComment[] = [{ id: 90269 }];
      jest.spyOn(commentService, 'query').mockReturnValue(of(new HttpResponse({ body: commentCollection })));
      const additionalComments = [replyingTo];
      const expectedCollection: IComment[] = [...additionalComments, ...commentCollection];
      jest.spyOn(commentService, 'addCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(commentService.query).toHaveBeenCalled();
      expect(commentService.addCommentToCollectionIfMissing).toHaveBeenCalledWith(
        commentCollection,
        ...additionalComments.map(expect.objectContaining)
      );
      expect(comp.commentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const author: IUserProfile = { id: 34029 };
      comment.author = author;
      const targetUser: IUserProfile = { id: 44225 };
      comment.targetUser = targetUser;

      const userProfileCollection: IUserProfile[] = [{ id: 3171 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [author, targetUser];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Match query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const match: IMatch = { id: 79046 };
      comment.match = match;

      const matchCollection: IMatch[] = [{ id: 3172 }];
      jest.spyOn(matchService, 'query').mockReturnValue(of(new HttpResponse({ body: matchCollection })));
      const additionalMatches = [match];
      const expectedCollection: IMatch[] = [...additionalMatches, ...matchCollection];
      jest.spyOn(matchService, 'addMatchToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(matchService.query).toHaveBeenCalled();
      expect(matchService.addMatchToCollectionIfMissing).toHaveBeenCalledWith(
        matchCollection,
        ...additionalMatches.map(expect.objectContaining)
      );
      expect(comp.matchesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const comment: IComment = { id: 456 };
      const replyingTo: IComment = { id: 91111 };
      comment.replyingTo = replyingTo;
      const author: IUserProfile = { id: 65361 };
      comment.author = author;
      const targetUser: IUserProfile = { id: 75679 };
      comment.targetUser = targetUser;
      const match: IMatch = { id: 90942 };
      comment.match = match;

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(comp.commentsSharedCollection).toContain(replyingTo);
      expect(comp.userProfilesSharedCollection).toContain(author);
      expect(comp.userProfilesSharedCollection).toContain(targetUser);
      expect(comp.matchesSharedCollection).toContain(match);
      expect(comp.comment).toEqual(comment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentFormService, 'getComment').mockReturnValue(comment);
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(commentFormService.getComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commentService.update).toHaveBeenCalledWith(expect.objectContaining(comment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentFormService, 'getComment').mockReturnValue({ id: null });
      jest.spyOn(commentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(commentFormService.getComment).toHaveBeenCalled();
      expect(commentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareComment', () => {
      it('Should forward to commentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(commentService, 'compareComment');
        comp.compareComment(entity, entity2);
        expect(commentService.compareComment).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMatch', () => {
      it('Should forward to matchService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(matchService, 'compareMatch');
        comp.compareMatch(entity, entity2);
        expect(matchService.compareMatch).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
