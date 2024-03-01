import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPitch, NewPitch } from '../pitch.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPitch for edit and NewPitchFormGroupInput for create.
 */
type PitchFormGroupInput = IPitch | PartialWithRequiredKeyOf<NewPitch>;

type PitchFormDefaults = Pick<NewPitch, 'id'>;

type PitchFormGroupContent = {
  id: FormControl<IPitch['id'] | NewPitch['id']>;
  name: FormControl<IPitch['name']>;
  location: FormControl<IPitch['location']>;
};

export type PitchFormGroup = FormGroup<PitchFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PitchFormService {
  createPitchFormGroup(pitch: PitchFormGroupInput = { id: null }): PitchFormGroup {
    const pitchRawValue = {
      ...this.getFormDefaults(),
      ...pitch,
    };
    return new FormGroup<PitchFormGroupContent>({
      id: new FormControl(
        { value: pitchRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(pitchRawValue.name),
      location: new FormControl(pitchRawValue.location),
    });
  }

  getPitch(form: PitchFormGroup): IPitch | NewPitch {
    return form.getRawValue() as IPitch | NewPitch;
  }

  resetForm(form: PitchFormGroup, pitch: PitchFormGroupInput): void {
    const pitchRawValue = { ...this.getFormDefaults(), ...pitch };
    form.reset(
      {
        ...pitchRawValue,
        id: { value: pitchRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PitchFormDefaults {
    return {
      id: null,
    };
  }
}
