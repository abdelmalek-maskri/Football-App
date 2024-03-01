import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITournament, NewTournament } from '../tournament.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITournament for edit and NewTournamentFormGroupInput for create.
 */
type TournamentFormGroupInput = ITournament | PartialWithRequiredKeyOf<NewTournament>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITournament | NewTournament> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type TournamentFormRawValue = FormValueOf<ITournament>;

type NewTournamentFormRawValue = FormValueOf<NewTournament>;

type TournamentFormDefaults = Pick<NewTournament, 'id' | 'startDate' | 'endDate' | 'teams'>;

type TournamentFormGroupContent = {
  id: FormControl<TournamentFormRawValue['id'] | NewTournament['id']>;
  name: FormControl<TournamentFormRawValue['name']>;
  startDate: FormControl<TournamentFormRawValue['startDate']>;
  endDate: FormControl<TournamentFormRawValue['endDate']>;
  location: FormControl<TournamentFormRawValue['location']>;
  maxTeams: FormControl<TournamentFormRawValue['maxTeams']>;
  teams: FormControl<TournamentFormRawValue['teams']>;
};

export type TournamentFormGroup = FormGroup<TournamentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TournamentFormService {
  createTournamentFormGroup(tournament: TournamentFormGroupInput = { id: null }): TournamentFormGroup {
    const tournamentRawValue = this.convertTournamentToTournamentRawValue({
      ...this.getFormDefaults(),
      ...tournament,
    });
    return new FormGroup<TournamentFormGroupContent>({
      id: new FormControl(
        { value: tournamentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(tournamentRawValue.name, {
        validators: [Validators.required, Validators.maxLength(128)],
      }),
      startDate: new FormControl(tournamentRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(tournamentRawValue.endDate, {
        validators: [Validators.required],
      }),
      location: new FormControl(tournamentRawValue.location, {
        validators: [Validators.required],
      }),
      maxTeams: new FormControl(tournamentRawValue.maxTeams, {
        validators: [Validators.required, Validators.min(4), Validators.max(32)],
      }),
      teams: new FormControl(tournamentRawValue.teams ?? []),
    });
  }

  getTournament(form: TournamentFormGroup): ITournament | NewTournament {
    return this.convertTournamentRawValueToTournament(form.getRawValue() as TournamentFormRawValue | NewTournamentFormRawValue);
  }

  resetForm(form: TournamentFormGroup, tournament: TournamentFormGroupInput): void {
    const tournamentRawValue = this.convertTournamentToTournamentRawValue({ ...this.getFormDefaults(), ...tournament });
    form.reset(
      {
        ...tournamentRawValue,
        id: { value: tournamentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TournamentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      teams: [],
    };
  }

  private convertTournamentRawValueToTournament(
    rawTournament: TournamentFormRawValue | NewTournamentFormRawValue
  ): ITournament | NewTournament {
    return {
      ...rawTournament,
      startDate: dayjs(rawTournament.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawTournament.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertTournamentToTournamentRawValue(
    tournament: ITournament | (Partial<NewTournament> & TournamentFormDefaults)
  ): TournamentFormRawValue | PartialWithRequiredKeyOf<NewTournamentFormRawValue> {
    return {
      ...tournament,
      startDate: tournament.startDate ? tournament.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: tournament.endDate ? tournament.endDate.format(DATE_TIME_FORMAT) : undefined,
      teams: tournament.teams ?? [],
    };
  }
}
