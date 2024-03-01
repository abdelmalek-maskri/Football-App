import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TournamentFormService } from './tournament-form.service';
import { TournamentService } from '../service/tournament.service';
import { ITournament } from '../tournament.model';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

import { TournamentUpdateComponent } from './tournament-update.component';

describe('Tournament Management Update Component', () => {
  let comp: TournamentUpdateComponent;
  let fixture: ComponentFixture<TournamentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tournamentFormService: TournamentFormService;
  let tournamentService: TournamentService;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TournamentUpdateComponent],
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
      .overrideTemplate(TournamentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TournamentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tournamentFormService = TestBed.inject(TournamentFormService);
    tournamentService = TestBed.inject(TournamentService);
    teamService = TestBed.inject(TeamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Team query and add missing value', () => {
      const tournament: ITournament = { id: 456 };
      const teams: ITeam[] = [{ id: 99146 }];
      tournament.teams = teams;

      const teamCollection: ITeam[] = [{ id: 55602 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [...teams];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tournament });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(
        teamCollection,
        ...additionalTeams.map(expect.objectContaining)
      );
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tournament: ITournament = { id: 456 };
      const teams: ITeam = { id: 55090 };
      tournament.teams = [teams];

      activatedRoute.data = of({ tournament });
      comp.ngOnInit();

      expect(comp.teamsSharedCollection).toContain(teams);
      expect(comp.tournament).toEqual(tournament);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITournament>>();
      const tournament = { id: 123 };
      jest.spyOn(tournamentFormService, 'getTournament').mockReturnValue(tournament);
      jest.spyOn(tournamentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tournament });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tournament }));
      saveSubject.complete();

      // THEN
      expect(tournamentFormService.getTournament).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tournamentService.update).toHaveBeenCalledWith(expect.objectContaining(tournament));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITournament>>();
      const tournament = { id: 123 };
      jest.spyOn(tournamentFormService, 'getTournament').mockReturnValue({ id: null });
      jest.spyOn(tournamentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tournament: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tournament }));
      saveSubject.complete();

      // THEN
      expect(tournamentFormService.getTournament).toHaveBeenCalled();
      expect(tournamentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITournament>>();
      const tournament = { id: 123 };
      jest.spyOn(tournamentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tournament });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tournamentService.update).toHaveBeenCalled();
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
  });
});
