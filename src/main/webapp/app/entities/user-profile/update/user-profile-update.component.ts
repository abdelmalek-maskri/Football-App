import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserProfileFormService, UserProfileFormGroup } from './user-profile-form.service';
import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { Genders } from 'app/entities/enumerations/genders.model';
import { Positions } from 'app/entities/enumerations/positions.model';
import { IContact } from '../../contact/contact.model';
import { ContactType } from '../../enumerations/contact-type.model';
import { ContactService } from '../../contact/service/contact.service';
import { NewContact } from '../../contact/contact.model';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';

@Component({
  selector: 'jhi-user-profile-update',
  templateUrl: './user-profile-update.component.html',
  styleUrls: ['../../../../content/scss/updatePage.scss'],
})
export class UserProfileUpdateComponent implements OnInit {
  isSaving = false;
  userProfile: IUserProfile | null = null;
  gendersValues = Object.keys(Genders);
  positionsValues = Object.keys(Positions);
  teamsSharedCollection: ITeam[] = [];
  theAccount?: Account;

  contactTypes: String[] = [];

  editForm: UserProfileFormGroup = this.userProfileFormService.createUserProfileFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected userProfileService: UserProfileService,
    protected userProfileFormService: UserProfileFormService,
    protected contactService: ContactService,
    protected teamService: TeamService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {}

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  ngOnInit(): void {
    for (const enumMember in ContactType) {
      this.contactTypes.push(enumMember.toString());
    }

    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.userProfile = userProfile;
      if (userProfile) {
        this.updateForm(userProfile);
      }
      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userProfile = this.userProfileFormService.getUserProfile(this.editForm);
    if (userProfile.id !== null) {
      this.subscribeToSaveResponse(this.userProfileService.update(userProfile));
    } else {
      this.subscribeToSaveResponse(this.userProfileService.create(userProfile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserProfile>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.saveContactDetails(),
      error: () => this.onSaveError(),
    });
  }

  protected saveContactDetails(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.theAccount = account;
      }

      let contactsList: IContact[] | null = [];
      this.contactService.findByUserID(this.theAccount!.id).subscribe(contacts => {
        if (contacts) {
          console.log('HERE:' + contacts);
          contactsList = contacts.body;
        }
      });

      for (const enumMember of Object.values(ContactType)) {
        console.log('HERE');
        let tempIn = (document.getElementById('contact_details_' + enumMember.toString()) as HTMLInputElement).value;
        if (tempIn != '') {
          //currently doesn't delete previous contacts
          for (const contact of contactsList) {
            if (contact.contactType?.valueOf() === enumMember.valueOf()) {
              this.contactService.delete(contact.id).subscribe(() => {
                console.log('DELETED DUPLICATE CONTACTS');
              });
            }
          }

          let newCon: NewContact = {
            id: null,
            contactType: enumMember,
            contactValue: tempIn,
            userProfile: { id: this.userProfile!.id },
            team: null,
          };

          this.contactService.create(newCon).subscribe({
            error: () => this.onSaveError(),
          });
        }
      }
    });
    this.onSaveSuccess();
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

  protected updateForm(userProfile: IUserProfile): void {
    this.userProfile = userProfile;
    this.userProfileFormService.resetForm(this.editForm, userProfile);

    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, userProfile.team);
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, this.userProfile?.team)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }

  protected readonly ContactType = ContactType;
}
