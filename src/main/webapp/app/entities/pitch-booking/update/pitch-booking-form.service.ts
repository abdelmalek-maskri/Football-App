import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPitchBooking, NewPitchBooking } from '../pitch-booking.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPitchBooking for edit and NewPitchBookingFormGroupInput for create.
 */
type PitchBookingFormGroupInput = IPitchBooking | PartialWithRequiredKeyOf<NewPitchBooking>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPitchBooking | NewPitchBooking> = Omit<T, 'bookingDate' | 'startTime' | 'endTime'> & {
  bookingDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

type PitchBookingFormRawValue = FormValueOf<IPitchBooking>;

type NewPitchBookingFormRawValue = FormValueOf<NewPitchBooking>;

type PitchBookingFormDefaults = Pick<NewPitchBooking, 'id' | 'bookingDate' | 'startTime' | 'endTime'>;

type PitchBookingFormGroupContent = {
  id: FormControl<PitchBookingFormRawValue['id'] | NewPitchBooking['id']>;
  bookingDate: FormControl<PitchBookingFormRawValue['bookingDate']>;
  startTime: FormControl<PitchBookingFormRawValue['startTime']>;
  endTime: FormControl<PitchBookingFormRawValue['endTime']>;
  team: FormControl<PitchBookingFormRawValue['team']>;
  pitch: FormControl<PitchBookingFormRawValue['pitch']>;
};

export type PitchBookingFormGroup = FormGroup<PitchBookingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PitchBookingFormService {
  createPitchBookingFormGroup(pitchBooking: PitchBookingFormGroupInput = { id: null }): PitchBookingFormGroup {
    const pitchBookingRawValue = this.convertPitchBookingToPitchBookingRawValue({
      ...this.getFormDefaults(),
      ...pitchBooking,
    });
    return new FormGroup<PitchBookingFormGroupContent>({
      id: new FormControl(
        { value: pitchBookingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      bookingDate: new FormControl(pitchBookingRawValue.bookingDate, {
        validators: [Validators.required],
      }),
      startTime: new FormControl(pitchBookingRawValue.startTime, {
        validators: [Validators.required],
      }),
      endTime: new FormControl(pitchBookingRawValue.endTime, {
        validators: [Validators.required],
      }),
      team: new FormControl(pitchBookingRawValue.team),
      pitch: new FormControl(pitchBookingRawValue.pitch),
    });
  }

  getPitchBooking(form: PitchBookingFormGroup): IPitchBooking | NewPitchBooking {
    return this.convertPitchBookingRawValueToPitchBooking(form.getRawValue() as PitchBookingFormRawValue | NewPitchBookingFormRawValue);
  }

  resetForm(form: PitchBookingFormGroup, pitchBooking: PitchBookingFormGroupInput): void {
    const pitchBookingRawValue = this.convertPitchBookingToPitchBookingRawValue({ ...this.getFormDefaults(), ...pitchBooking });
    form.reset(
      {
        ...pitchBookingRawValue,
        id: { value: pitchBookingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PitchBookingFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      bookingDate: currentTime,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertPitchBookingRawValueToPitchBooking(
    rawPitchBooking: PitchBookingFormRawValue | NewPitchBookingFormRawValue
  ): IPitchBooking | NewPitchBooking {
    return {
      ...rawPitchBooking,
      bookingDate: dayjs(rawPitchBooking.bookingDate, DATE_TIME_FORMAT),
      startTime: dayjs(rawPitchBooking.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawPitchBooking.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertPitchBookingToPitchBookingRawValue(
    pitchBooking: IPitchBooking | (Partial<NewPitchBooking> & PitchBookingFormDefaults)
  ): PitchBookingFormRawValue | PartialWithRequiredKeyOf<NewPitchBookingFormRawValue> {
    return {
      ...pitchBooking,
      bookingDate: pitchBooking.bookingDate ? pitchBooking.bookingDate.format(DATE_TIME_FORMAT) : undefined,
      startTime: pitchBooking.startTime ? pitchBooking.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: pitchBooking.endTime ? pitchBooking.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
