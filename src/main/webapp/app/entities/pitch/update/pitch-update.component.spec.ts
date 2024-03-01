import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PitchFormService } from './pitch-form.service';
import { PitchService } from '../service/pitch.service';
import { IPitch } from '../pitch.model';

import { PitchUpdateComponent } from './pitch-update.component';

describe('Pitch Management Update Component', () => {
  let comp: PitchUpdateComponent;
  let fixture: ComponentFixture<PitchUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pitchFormService: PitchFormService;
  let pitchService: PitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PitchUpdateComponent],
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
      .overrideTemplate(PitchUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PitchUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pitchFormService = TestBed.inject(PitchFormService);
    pitchService = TestBed.inject(PitchService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pitch: IPitch = { id: 456 };

      activatedRoute.data = of({ pitch });
      comp.ngOnInit();

      expect(comp.pitch).toEqual(pitch);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPitch>>();
      const pitch = { id: 123 };
      jest.spyOn(pitchFormService, 'getPitch').mockReturnValue(pitch);
      jest.spyOn(pitchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pitch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pitch }));
      saveSubject.complete();

      // THEN
      expect(pitchFormService.getPitch).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pitchService.update).toHaveBeenCalledWith(expect.objectContaining(pitch));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPitch>>();
      const pitch = { id: 123 };
      jest.spyOn(pitchFormService, 'getPitch').mockReturnValue({ id: null });
      jest.spyOn(pitchService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pitch: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pitch }));
      saveSubject.complete();

      // THEN
      expect(pitchFormService.getPitch).toHaveBeenCalled();
      expect(pitchService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPitch>>();
      const pitch = { id: 123 };
      jest.spyOn(pitchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pitch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pitchService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
