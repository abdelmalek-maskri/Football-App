import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITeam, NewTeam } from '../team.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITeam for edit and NewTeamFormGroupInput for create.
 */
type TeamFormGroupInput = ITeam | PartialWithRequiredKeyOf<NewTeam>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITeam | NewTeam> = Omit<T, 'created'> & {
  created?: string | null;
};

type TeamFormRawValue = FormValueOf<ITeam>;

type NewTeamFormRawValue = FormValueOf<NewTeam>;

type TeamFormDefaults = Pick<NewTeam, 'id' | 'created' | 'tournaments'>;

type TeamFormGroupContent = {
  id: FormControl<TeamFormRawValue['id'] | NewTeam['id']>;
  created: FormControl<TeamFormRawValue['created']>;
  name: FormControl<TeamFormRawValue['name']>;
  description: FormControl<TeamFormRawValue['description']>;
  image: FormControl<TeamFormRawValue['image']>;
  imageContentType: FormControl<TeamFormRawValue['imageContentType']>;
  colour: FormControl<TeamFormRawValue['colour']>;
  schedule: FormControl<TeamFormRawValue['schedule']>;
  playType: FormControl<TeamFormRawValue['playType']>;
  owner: FormControl<TeamFormRawValue['owner']>;
  tournaments: FormControl<TeamFormRawValue['tournaments']>;
};

export type TeamFormGroup = FormGroup<TeamFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TeamFormService {
  createTeamFormGroup(team: TeamFormGroupInput = { id: null }): TeamFormGroup {
    const teamRawValue = this.convertTeamToTeamRawValue({
      ...this.getFormDefaults(),
      ...team,
    });
    return new FormGroup<TeamFormGroupContent>({
      id: new FormControl(
        { value: teamRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      created: new FormControl(teamRawValue.created, {
        validators: [Validators.required],
      }),
      name: new FormControl(teamRawValue.name, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(40)],
      }),
      description: new FormControl(teamRawValue.description, {
        validators: [Validators.maxLength(512)],
      }),
      image: new FormControl(teamRawValue.image),
      imageContentType: new FormControl(teamRawValue.imageContentType),
      colour: new FormControl(teamRawValue.colour, {
        validators: [Validators.maxLength(6)],
      }),
      schedule: new FormControl(teamRawValue.schedule, {
        validators: [Validators.maxLength(64)],
      }),
      playType: new FormControl(teamRawValue.playType),
      owner: new FormControl(teamRawValue.owner),
      tournaments: new FormControl(teamRawValue.tournaments ?? []),
    });
  }

  getTeam(form: TeamFormGroup): ITeam | NewTeam {
    return this.convertTeamRawValueToTeam(form.getRawValue() as TeamFormRawValue | NewTeamFormRawValue);
  }

  resetForm(form: TeamFormGroup, team: TeamFormGroupInput): void {
    const teamRawValue = this.convertTeamToTeamRawValue({ ...this.getFormDefaults(), ...team });
    form.reset(
      {
        ...teamRawValue,
        id: { value: teamRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TeamFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created: currentTime,
      tournaments: [],
    };
  }

  private convertTeamRawValueToTeam(rawTeam: TeamFormRawValue | NewTeamFormRawValue): ITeam | NewTeam {
    return {
      ...rawTeam,
      created: dayjs(rawTeam.created, DATE_TIME_FORMAT),
    };
  }

  private convertTeamToTeamRawValue(
    team: ITeam | (Partial<NewTeam> & TeamFormDefaults)
  ): TeamFormRawValue | PartialWithRequiredKeyOf<NewTeamFormRawValue> {
    return {
      ...team,
      created: team.created ? team.created.format(DATE_TIME_FORMAT) : undefined,
      tournaments: team.tournaments ?? [],
    };
  }
}
