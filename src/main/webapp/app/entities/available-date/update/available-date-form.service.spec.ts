import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../available-date.test-samples';

import { AvailableDateFormService } from './available-date-form.service';

describe('AvailableDate Form Service', () => {
  let service: AvailableDateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableDateFormService);
  });

  describe('Service methods', () => {
    describe('createAvailableDateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAvailableDateFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fromTime: expect.any(Object),
            toTime: expect.any(Object),
            isAvailable: expect.any(Object),
            userProfile: expect.any(Object),
            team: expect.any(Object),
          })
        );
      });

      it('passing IAvailableDate should create a new form with FormGroup', () => {
        const formGroup = service.createAvailableDateFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fromTime: expect.any(Object),
            toTime: expect.any(Object),
            isAvailable: expect.any(Object),
            userProfile: expect.any(Object),
            team: expect.any(Object),
          })
        );
      });
    });

    describe('getAvailableDate', () => {
      it('should return NewAvailableDate for default AvailableDate initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAvailableDateFormGroup(sampleWithNewData);

        const availableDate = service.getAvailableDate(formGroup) as any;

        expect(availableDate).toMatchObject(sampleWithNewData);
      });

      it('should return NewAvailableDate for empty AvailableDate initial value', () => {
        const formGroup = service.createAvailableDateFormGroup();

        const availableDate = service.getAvailableDate(formGroup) as any;

        expect(availableDate).toMatchObject({});
      });

      it('should return IAvailableDate', () => {
        const formGroup = service.createAvailableDateFormGroup(sampleWithRequiredData);

        const availableDate = service.getAvailableDate(formGroup) as any;

        expect(availableDate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAvailableDate should not enable id FormControl', () => {
        const formGroup = service.createAvailableDateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAvailableDate should disable id FormControl', () => {
        const formGroup = service.createAvailableDateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
