import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pitch-booking.test-samples';

import { PitchBookingFormService } from './pitch-booking-form.service';

describe('PitchBooking Form Service', () => {
  let service: PitchBookingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PitchBookingFormService);
  });

  describe('Service methods', () => {
    describe('createPitchBookingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPitchBookingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bookingDate: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            team: expect.any(Object),
            pitch: expect.any(Object),
          })
        );
      });

      it('passing IPitchBooking should create a new form with FormGroup', () => {
        const formGroup = service.createPitchBookingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bookingDate: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            team: expect.any(Object),
            pitch: expect.any(Object),
          })
        );
      });
    });

    describe('getPitchBooking', () => {
      it('should return NewPitchBooking for default PitchBooking initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPitchBookingFormGroup(sampleWithNewData);

        const pitchBooking = service.getPitchBooking(formGroup) as any;

        expect(pitchBooking).toMatchObject(sampleWithNewData);
      });

      it('should return NewPitchBooking for empty PitchBooking initial value', () => {
        const formGroup = service.createPitchBookingFormGroup();

        const pitchBooking = service.getPitchBooking(formGroup) as any;

        expect(pitchBooking).toMatchObject({});
      });

      it('should return IPitchBooking', () => {
        const formGroup = service.createPitchBookingFormGroup(sampleWithRequiredData);

        const pitchBooking = service.getPitchBooking(formGroup) as any;

        expect(pitchBooking).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPitchBooking should not enable id FormControl', () => {
        const formGroup = service.createPitchBookingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPitchBooking should disable id FormControl', () => {
        const formGroup = service.createPitchBookingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
