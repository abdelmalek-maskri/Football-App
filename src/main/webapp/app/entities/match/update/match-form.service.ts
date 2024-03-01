import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMatch, NewMatch } from '../match.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMatch for edit and NewMatchFormGroupInput for create.
 */
type MatchFormGroupInput = IMatch | PartialWithRequiredKeyOf<NewMatch>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMatch | NewMatch> = Omit<T, 'date'> & {
  date?: string | null;
};

type MatchFormRawValue = FormValueOf<IMatch>;

type NewMatchFormRawValue = FormValueOf<NewMatch>;

type MatchFormDefaults = Pick<NewMatch, 'id' | 'date'>;

type MatchFormGroupContent = {
  id: FormControl<MatchFormRawValue['id'] | NewMatch['id']>;
  homeScore: FormControl<MatchFormRawValue['homeScore']>;
  awayScore: FormControl<MatchFormRawValue['awayScore']>;
  date: FormControl<MatchFormRawValue['date']>;
  referee: FormControl<MatchFormRawValue['referee']>;
  pitch: FormControl<MatchFormRawValue['pitch']>;
  home: FormControl<MatchFormRawValue['home']>;
  away: FormControl<MatchFormRawValue['away']>;
  tournament: FormControl<MatchFormRawValue['tournament']>;
};

export type MatchFormGroup = FormGroup<MatchFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MatchFormService {
  createMatchFormGroup(match: MatchFormGroupInput = { id: null }): MatchFormGroup {
    const matchRawValue = this.convertMatchToMatchRawValue({
      ...this.getFormDefaults(),
      ...match,
    });
    return new FormGroup<MatchFormGroupContent>({
      id: new FormControl(
        { value: matchRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      homeScore: new FormControl(matchRawValue.homeScore, {
        validators: [Validators.min(0)],
      }),
      awayScore: new FormControl(matchRawValue.awayScore, {
        validators: [Validators.min(0)],
      }),
      date: new FormControl(matchRawValue.date, {
        validators: [Validators.required],
      }),
      referee: new FormControl(matchRawValue.referee),
      pitch: new FormControl(matchRawValue.pitch),
      home: new FormControl(matchRawValue.home),
      away: new FormControl(matchRawValue.away),
      tournament: new FormControl(matchRawValue.tournament),
    });
  }

  getMatch(form: MatchFormGroup): IMatch | NewMatch {
    return this.convertMatchRawValueToMatch(form.getRawValue() as MatchFormRawValue | NewMatchFormRawValue);
  }

  resetForm(form: MatchFormGroup, match: MatchFormGroupInput): void {
    const matchRawValue = this.convertMatchToMatchRawValue({ ...this.getFormDefaults(), ...match });
    form.reset(
      {
        ...matchRawValue,
        id: { value: matchRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MatchFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertMatchRawValueToMatch(rawMatch: MatchFormRawValue | NewMatchFormRawValue): IMatch | NewMatch {
    return {
      ...rawMatch,
      date: dayjs(rawMatch.date, DATE_TIME_FORMAT),
    };
  }

  private convertMatchToMatchRawValue(
    match: IMatch | (Partial<NewMatch> & MatchFormDefaults)
  ): MatchFormRawValue | PartialWithRequiredKeyOf<NewMatchFormRawValue> {
    return {
      ...match,
      date: match.date ? match.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
