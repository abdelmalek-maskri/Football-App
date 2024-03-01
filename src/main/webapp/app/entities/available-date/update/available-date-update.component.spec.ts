import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AvailableDateFormService } from './available-date-form.service';
import { AvailableDateService } from '../service/available-date.service';
import { IAvailableDate } from '../available-date.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

import { AvailableDateUpdateComponent } from './available-date-update.component';

describe('AvailableDate Management Update Component', () => {
  let comp: AvailableDateUpdateComponent;
  let fixture: ComponentFixture<AvailableDateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let availableDateFormService: AvailableDateFormService;
  let availableDateService: AvailableDateService;
  let userProfileService: UserProfileService;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AvailableDateUpdateComponent],
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
      .overrideTemplate(AvailableDateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AvailableDateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    availableDateFormService = TestBed.inject(AvailableDateFormService);
    availableDateService = TestBed.inject(AvailableDateService);
    userProfileService = TestBed.inject(UserProfileService);
    teamService = TestBed.inject(TeamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const availableDate: IAvailableDate = { id: 456 };
      const userProfile: IUserProfile = { id: 71073 };
      availableDate.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 37739 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ availableDate });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Team query and add missing value', () => {
      const availableDate: IAvailableDate = { id: 456 };
      const team: ITeam = { id: 25058 };
      availableDate.team = team;

      const teamCollection: ITeam[] = [{ id: 72010 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [team];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ availableDate });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(
        teamCollection,
        ...additionalTeams.map(expect.objectContaining)
      );
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const availableDate: IAvailableDate = { id: 456 };
      const userProfile: IUserProfile = { id: 35338 };
      availableDate.userProfile = userProfile;
      const team: ITeam = { id: 3174 };
      availableDate.team = team;

      activatedRoute.data = of({ availableDate });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.teamsSharedCollection).toContain(team);
      expect(comp.availableDate).toEqual(availableDate);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAvailableDate>>();
      const availableDate = { id: 123 };
      jest.spyOn(availableDateFormService, 'getAvailableDate').mockReturnValue(availableDate);
      jest.spyOn(availableDateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ availableDate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: availableDate }));
      saveSubject.complete();

      // THEN
      expect(availableDateFormService.getAvailableDate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(availableDateService.update).toHaveBeenCalledWith(expect.objectContaining(availableDate));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAvailableDate>>();
      const availableDate = { id: 123 };
      jest.spyOn(availableDateFormService, 'getAvailableDate').mockReturnValue({ id: null });
      jest.spyOn(availableDateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ availableDate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: availableDate }));
      saveSubject.complete();

      // THEN
      expect(availableDateFormService.getAvailableDate).toHaveBeenCalled();
      expect(availableDateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAvailableDate>>();
      const availableDate = { id: 123 };
      jest.spyOn(availableDateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ availableDate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(availableDateService.update).toHaveBeenCalled();
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
