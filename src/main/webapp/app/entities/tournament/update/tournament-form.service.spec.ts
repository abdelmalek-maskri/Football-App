import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tournament.test-samples';

import { TournamentFormService } from './tournament-form.service';

describe('Tournament Form Service', () => {
  let service: TournamentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentFormService);
  });

  describe('Service methods', () => {
    describe('createTournamentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTournamentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            location: expect.any(Object),
            maxTeams: expect.any(Object),
            teams: expect.any(Object),
          })
        );
      });

      it('passing ITournament should create a new form with FormGroup', () => {
        const formGroup = service.createTournamentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            location: expect.any(Object),
            maxTeams: expect.any(Object),
            teams: expect.any(Object),
          })
        );
      });
    });

    describe('getTournament', () => {
      it('should return NewTournament for default Tournament initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTournamentFormGroup(sampleWithNewData);

        const tournament = service.getTournament(formGroup) as any;

        expect(tournament).toMatchObject(sampleWithNewData);
      });

      it('should return NewTournament for empty Tournament initial value', () => {
        const formGroup = service.createTournamentFormGroup();

        const tournament = service.getTournament(formGroup) as any;

        expect(tournament).toMatchObject({});
      });

      it('should return ITournament', () => {
        const formGroup = service.createTournamentFormGroup(sampleWithRequiredData);

        const tournament = service.getTournament(formGroup) as any;

        expect(tournament).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITournament should not enable id FormControl', () => {
        const formGroup = service.createTournamentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTournament should disable id FormControl', () => {
        const formGroup = service.createTournamentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
