import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PitchBookingFormService } from './pitch-booking-form.service';
import { PitchBookingService } from '../service/pitch-booking.service';
import { IPitchBooking } from '../pitch-booking.model';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { PitchService } from 'app/entities/pitch/service/pitch.service';

import { PitchBookingUpdateComponent } from './pitch-booking-update.component';

describe('PitchBooking Management Update Component', () => {
  let comp: PitchBookingUpdateComponent;
  let fixture: ComponentFixture<PitchBookingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pitchBookingFormService: PitchBookingFormService;
  let pitchBookingService: PitchBookingService;
  let teamService: TeamService;
  let pitchService: PitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PitchBookingUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PitchBookingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PitchBookingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pitchBookingFormService = TestBed.inject(PitchBookingFormService);
    pitchBookingService = TestBed.inject(PitchBookingService);
    teamService = TestBed.inject(TeamService);
    pitchService = TestBed.inject(PitchService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Team query and add missing value', () => {
      const pitchBooking: IPitchBooking = { id: 456 };
      const team: ITeam = { id: 16465 };
      pitchBooking.team = team;

      const teamCollection: ITeam[] = [{ id: 56229 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [team];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pitchBooking });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(
        teamCollection,
        ...additionalTeams.map(expect.objectContaining)
      );
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Pitch query and add missing value', () => {
      const pitchBooking: IPitchBooking = { id: 456 };
      const pitch: IPitch = { id: 7294 };
      pitchBooking.pitch = pitch;

      const pitchCollection: IPitch[] = [{ id: 77932 }];
      jest.spyOn(pitchService, 'query').mockReturnValue(of(new HttpResponse({ body: pitchCollection })));
      const additionalPitches = [pitch];
      const expectedCollection: IPitch[] = [...additionalPitches, ...pitchCollection];
      jest.spyOn(pitchService, 'addPitchToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pitchBooking });
      comp.ngOnInit();

      expect(pitchService.query).toHaveBeenCalled();
      expect(pitchService.addPitchToCollectionIfMissing).toHaveBeenCalledWith(
        pitchCollection,
        ...additionalPitches.map(expect.objectContaining)
      );
      expect(comp.pitchesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pitchBooking: IPitchBooking = { id: 456 };
      const team: ITeam = { id: 70003 };
      pitchBooking.team = team;
      const pitch: IPitch = { id: 2599 };
      pitchBooking.pitch = pitch;

      activatedRoute.data = of({ pitchBooking });
      comp.ngOnInit();

      expect(comp.teamsSharedCollection).toContain(team);
      expect(comp.pitchesSharedCollection).toContain(pitch);
      expect(comp.pitchBooking).toEqual(pitchBooking);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPitchBooking>>();
      const pitchBooking = { id: 123 };
      jest.spyOn(pitchBookingFormService, 'getPitchBooking').mockReturnValue(pitchBooking);
      jest.spyOn(pitchBookingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pitchBooking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pitchBooking }));
      saveSubject.complete();

      // THEN
      expect(pitchBookingFormService.getPitchBooking).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pitchBookingService.update).toHaveBeenCalledWith(expect.objectContaining(pitchBooking));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPitchBooking>>();
      const pitchBooking = { id: 123 };
      jest.spyOn(pitchBookingFormService, 'getPitchBooking').mockReturnValue({ id: null });
      jest.spyOn(pitchBookingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pitchBooking: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pitchBooking }));
      saveSubject.complete();

      // THEN
      expect(pitchBookingFormService.getPitchBooking).toHaveBeenCalled();
      expect(pitchBookingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPitchBooking>>();
      const pitchBooking = { id: 123 };
      jest.spyOn(pitchBookingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pitchBooking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pitchBookingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTeam', () => {
      it('Should forward to teamService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(teamService, 'compareTeam');
        comp.compareTeam(entity, entity2);
        expect(teamService.compareTeam).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePitch', () => {
      it('Should forward to pitchService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pitchService, 'comparePitch');
        comp.comparePitch(entity, entity2);
        expect(pitchService.comparePitch).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
