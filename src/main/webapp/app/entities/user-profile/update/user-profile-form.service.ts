import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserProfile, NewUserProfile } from '../user-profile.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserProfile for edit and NewUserProfileFormGroupInput for create.
 */
type UserProfileFormGroupInput = IUserProfile | PartialWithRequiredKeyOf<NewUserProfile>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserProfile | NewUserProfile> = Omit<T, 'created'> & {
  created?: string | null;
};

type UserProfileFormRawValue = FormValueOf<IUserProfile>;

type NewUserProfileFormRawValue = FormValueOf<NewUserProfile>;

type UserProfileFormDefaults = Pick<NewUserProfile, 'id' | 'created' | 'referee'>;

type UserProfileFormGroupContent = {
  id: FormControl<UserProfileFormRawValue['id'] | NewUserProfile['id']>;
  created: FormControl<UserProfileFormRawValue['created']>;
  name: FormControl<UserProfileFormRawValue['name']>;
  profilePic: FormControl<UserProfileFormRawValue['profilePic']>;
  profilePicContentType: FormControl<UserProfileFormRawValue['profilePicContentType']>;
  gender: FormControl<UserProfileFormRawValue['gender']>;
  location: FormControl<UserProfileFormRawValue['location']>;
  position: FormControl<UserProfileFormRawValue['position']>;
  referee: FormControl<UserProfileFormRawValue['referee']>;
  team: FormControl<UserProfileFormRawValue['team']>;
};

export type UserProfileFormGroup = FormGroup<UserProfileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserProfileFormService {
  createUserProfileFormGroup(userProfile: UserProfileFormGroupInput = { id: null }): UserProfileFormGroup {
    const userProfileRawValue = this.convertUserProfileToUserProfileRawValue({
      ...this.getFormDefaults(),
      ...userProfile,
    });
    return new FormGroup<UserProfileFormGroupContent>({
      id: new FormControl(
        { value: userProfileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      created: new FormControl(userProfileRawValue.created, {
        validators: [Validators.required],
      }),
      name: new FormControl(userProfileRawValue.name, {
        validators: [Validators.required, Validators.maxLength(32)],
      }),
      profilePic: new FormControl(userProfileRawValue.profilePic),
      profilePicContentType: new FormControl(userProfileRawValue.profilePicContentType),
      gender: new FormControl(userProfileRawValue.gender, {
        validators: [Validators.required],
      }),
      location: new FormControl(userProfileRawValue.location, {
        validators: [Validators.required],
      }),
      position: new FormControl(userProfileRawValue.position, {
        validators: [Validators.required],
      }),
      referee: new FormControl(userProfileRawValue.referee, {
        validators: [Validators.required],
      }),
      team: new FormControl(userProfileRawValue.team),
    });
  }

  getUserProfile(form: UserProfileFormGroup): IUserProfile | NewUserProfile {
    return this.convertUserProfileRawValueToUserProfile(form.getRawValue() as UserProfileFormRawValue | NewUserProfileFormRawValue);
  }

  resetForm(form: UserProfileFormGroup, userProfile: UserProfileFormGroupInput): void {
    const userProfileRawValue = this.convertUserProfileToUserProfileRawValue({ ...this.getFormDefaults(), ...userProfile });
    form.reset(
      {
        ...userProfileRawValue,
        id: { value: userProfileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserProfileFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created: currentTime,
      referee: false,
    };
  }

  private convertUserProfileRawValueToUserProfile(
    rawUserProfile: UserProfileFormRawValue | NewUserProfileFormRawValue
  ): IUserProfile | NewUserProfile {
    return {
      ...rawUserProfile,
      created: dayjs(rawUserProfile.created, DATE_TIME_FORMAT),
    };
  }

  private convertUserProfileToUserProfileRawValue(
    userProfile: IUserProfile | (Partial<NewUserProfile> & UserProfileFormDefaults)
  ): UserProfileFormRawValue | PartialWithRequiredKeyOf<NewUserProfileFormRawValue> {
    return {
      ...userProfile,
      created: userProfile.created ? userProfile.created.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
