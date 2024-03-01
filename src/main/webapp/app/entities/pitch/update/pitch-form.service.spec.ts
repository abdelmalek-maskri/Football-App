import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pitch.test-samples';

import { PitchFormService } from './pitch-form.service';

describe('Pitch Form Service', () => {
  let service: PitchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PitchFormService);
  });

  describe('Service methods', () => {
    describe('createPitchFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPitchFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            location: expect.any(Object),
          })
        );
      });

      it('passing IPitch should create a new form with FormGroup', () => {
        const formGroup = service.createPitchFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            location: expect.any(Object),
          })
        );
      });
    });

    describe('getPitch', () => {
      it('should return NewPitch for default Pitch initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPitchFormGroup(sampleWithNewData);

        const pitch = service.getPitch(formGroup) as any;

        expect(pitch).toMatchObject(sampleWithNewData);
      });

      it('should return NewPitch for empty Pitch initial value', () => {
        const formGroup = service.createPitchFormGroup();

        const pitch = service.getPitch(formGroup) as any;

        expect(pitch).toMatchObject({});
      });

      it('should return IPitch', () => {
        const formGroup = service.createPitchFormGroup(sampleWithRequiredData);

        const pitch = service.getPitch(formGroup) as any;

        expect(pitch).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPitch should not enable id FormControl', () => {
        const formGroup = service.createPitchFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPitch should disable id FormControl', () => {
        const formGroup = service.createPitchFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
