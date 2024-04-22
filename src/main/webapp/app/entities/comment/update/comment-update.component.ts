import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CommentFormService, CommentFormGroup } from './comment-form.service';
import { IComment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IMatch } from 'app/entities/match/match.model';
import { MatchService } from 'app/entities/match/service/match.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
  styleUrls: ['./comment-update.component.scss'],
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;
  comment: IComment | null = null;
  myForm: FormGroup | null = null;
  currentUser: IUserProfile | null = null;
  targetUser: IUserProfile | null = null;
  match: IMatch | null = null;
  toId = 0;
  section = '';

  commentsSharedCollection: IComment[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];
  matchesSharedCollection: IMatch[] = [];
  currentAccountId: number | null = null;
  editForm: CommentFormGroup = this.commentFormService.createCommentFormGroup();

  constructor(
    protected commentService: CommentService,
    protected commentFormService: CommentFormService,
    protected userProfileService: UserProfileService,
    protected matchService: MatchService,
    protected activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    protected UserService: UserService,
    protected AccountService: AccountService
  ) {}

  compareComment = (o1: IComment | null, o2: IComment | null): boolean => this.commentService.compareComment(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  compareMatch = (o1: IMatch | null, o2: IMatch | null): boolean => this.matchService.compareMatch(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.comment = comment;
      if (comment) {
        this.updateForm(comment);
      }
      this.activatedRoute.queryParams.subscribe(params => {
        this.toId = params['id'];
        this.section = params['section'];
      });
      this.loadRelationshipsOptions();
    });
    this.AccountService.identity().subscribe(
      account => {
        if (account) {
          this.currentAccountId = account.id;
          this.userProfileService.find(this.currentAccountId).subscribe(res => {
            this.currentUser = res.body;
          });
        } else {
          this.currentAccountId = null;
        }
      },
      error => {
        console.error('Error fetching account information:', error);
        this.currentAccountId = null;
      }
    );
    if (this.editForm && this.currentAccountId != null) {
      this.editForm.patchValue({
        author: this.currentUser,
        rating: 5,
      });
    }
    if (this.section == 'Player') {
      this.userProfileService.find(this.toId).subscribe(res => {
        this.targetUser = res.body;
        this.editForm.patchValue({
          targetUser: this.targetUser,
        });
      });
    } else if (this.section == 'Match') {
      this.matchService.find(this.toId).subscribe(res => {
        this.match = res.body;
        this.editForm.patchValue({
          match: this.match,
        });
      });
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.commentFormService.getComment(this.editForm);
    if (comment.id !== null) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(comment: IComment): void {
    this.comment = comment;
    this.commentFormService.resetForm(this.editForm, comment);

    this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing<IComment>(
      this.commentsSharedCollection,
      comment.replyingTo
    );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      comment.author,
      comment.targetUser
    );
    this.matchesSharedCollection = this.matchService.addMatchToCollectionIfMissing<IMatch>(this.matchesSharedCollection, comment.match);
  }

  protected loadRelationshipsOptions(): void {
    this.commentService
      .query()
      .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
      .pipe(
        map((comments: IComment[]) => this.commentService.addCommentToCollectionIfMissing<IComment>(comments, this.comment?.replyingTo))
      )
      .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
            userProfiles,
            this.comment?.author,
            this.comment?.targetUser
          )
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));

    this.matchService
      .query()
      .pipe(map((res: HttpResponse<IMatch[]>) => res.body ?? []))
      .pipe(map((matches: IMatch[]) => this.matchService.addMatchToCollectionIfMissing<IMatch>(matches, this.comment?.match)))
      .subscribe((matches: IMatch[]) => (this.matchesSharedCollection = matches));
  }
}
