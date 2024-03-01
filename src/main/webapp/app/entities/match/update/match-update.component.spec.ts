import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MatchFormService } from './match-form.service';
import { MatchService } from '../service/match.service';
import { IMatch } from '../match.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IPitch } from 'app/entities/pitch/pitch.model';
import { PitchService } from 'app/entities/pitch/service/pitch.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { ITournament } from 'app/entities/tournament/tournament.model';
import { TournamentService } from 'app/entities/tournament/service/tournament.service';

import { MatchUpdateComponent } from './match-update.component';

describe('Match Management Update Component', () => {
  let comp: MatchUpdateComponent;
  let fixture: ComponentFixture<MatchUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let matchFormService: MatchFormService;
  let matchService: MatchService;
  let userProfileService: UserProfileService;
  let pitchService: PitchService;
  let teamService: TeamService;
  let tournamentService: TournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MatchUpdateComponent],
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
      .overrideTemplate(MatchUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MatchUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    matchFormService = TestBed.inject(MatchFormService);
    matchService = TestBed.inject(MatchService);
    userProfileService = TestBed.inject(UserProfileService);
    pitchService = TestBed.inject(PitchService);
    teamService = TestBed.inject(TeamService);
    tournamentService = TestBed.inject(TournamentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const match: IMatch = { id: 456 };
      const referee: IUserProfile = { id: 26051 };
      match.referee = referee;

      const userProfileCollection: IUserProfile[] = [{ id: 35685 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [referee];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ match });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Pitch query and add missing value', () => {
      const match: IMatch = { id: 456 };
      const pitch: IPitch = { id: 21971 };
      match.pitch = pitch;

      const pitchCollection: IPitch[] = [{ id: 80036 }];
      jest.spyOn(pitchService, 'query').mockReturnValue(of(new HttpResponse({ body: pitchCollection })));
      const additionalPitches = [pitch];
      const expectedCollection: IPitch[] = [...additionalPitches, ...pitchCollection];
      jest.spyOn(pitchService, 'addPitchToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ match });
      comp.ngOnInit();

      expect(pitchService.query).toHaveBeenCalled();
      expect(pitchService.addPitchToCollectionIfMissing).toHaveBeenCalledWith(
        pitchCollection,
        ...additionalPitches.map(expect.objectContaining)
      );
      expect(comp.pitchesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Team query and add missing value', () => {
      const match: IMatch = { id: 456 };
      const home: ITeam = { id: 18651 };
      match.home = home;
      const away: ITeam = { id: 56131 };
      match.away = away;

      const teamCollection: ITeam[] = [{ id: 5252 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [home, away];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ match });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(
        teamCollection,
        ...additionalTeams.map(expect.objectContaining)
      );
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tournament query and add missing value', () => {
      const match: IMatch = { id: 456 };
      const tournament: ITournament = { id: 41519 };
      match.tournament = tournament;

      const tournamentCollection: ITournament[] = [{ id: 4727 }];
      jest.spyOn(tournamentService, 'query').mockReturnValue(of(new HttpResponse({ body: tournamentCollection })));
      const additionalTournaments = [tournament];
      const expectedCollection: ITournament[] = [...additionalTournaments, ...tournamentCollection];
      jest.spyOn(tournamentService, 'addTournamentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ match });
      comp.ngOnInit();

      expect(tournamentService.query).toHaveBeenCalled();
      expect(tournamentService.addTournamentToCollectionIfMissing).toHaveBeenCalledWith(
        tournamentCollection,
        ...additionalTournaments.map(expect.objectContaining)
      );
      expect(comp.tournamentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const match: IMatch = { id: 456 };
      const referee: IUserProfile = { id: 94441 };
      match.referee = referee;
      const pitch: IPitch = { id: 72424 };
      match.pitch = pitch;
      const home: ITeam = { id: 49369 };
      match.home = home;
      const away: ITeam = { id: 36215 };
      match.away = away;
      const tournament: ITournament = { id: 39911 };
      match.tournament = tournament;

      activatedRoute.data = of({ match });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(referee);
      expect(comp.pitchesSharedCollection).toContain(pitch);
      expect(comp.teamsSharedCollection).toContain(home);
      expect(comp.teamsSharedCollection).toContain(away);
      expect(comp.tournamentsSharedCollection).toContain(tournament);
      expect(comp.match).toEqual(match);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatch>>();
      const match = { id: 123 };
      jest.spyOn(matchFormService, 'getMatch').mockReturnValue(match);
      jest.spyOn(matchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ match });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: match }));
      saveSubject.complete();

      // THEN
      expect(matchFormService.getMatch).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(matchService.update).toHaveBeenCalledWith(expect.objectContaining(match));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatch>>();
      const match = { id: 123 };
      jest.spyOn(matchFormService, 'getMatch').mockReturnValue({ id: null });
      jest.spyOn(matchService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ match: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: match }));
      saveSubject.complete();

      // THEN
      expect(matchFormService.getMatch).toHaveBeenCalled();
      expect(matchService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatch>>();
      const match = { id: 123 };
      jest.spyOn(matchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ match });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(matchService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareTeam', () => {
      it('Should forward to teamService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(teamService, 'compareTeam');
        comp.compareTeam(entity, entity2);
        expect(teamService.compareTeam).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTournament', () => {
      it('Should forward to tournamentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tournamentService, 'compareTournament');
        comp.compareTournament(entity, entity2);
        expect(tournamentService.compareTournament).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
