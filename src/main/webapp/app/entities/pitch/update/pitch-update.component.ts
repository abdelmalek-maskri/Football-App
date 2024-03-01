import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PitchFormService, PitchFormGroup } from './pitch-form.service';
import { IPitch } from '../pitch.model';
import { PitchService } from '../service/pitch.service';

@Component({
  selector: 'jhi-pitch-update',
  templateUrl: './pitch-update.component.html',
})
export class PitchUpdateComponent implements OnInit {
  isSaving = false;
  pitch: IPitch | null = null;

  editForm: PitchFormGroup = this.pitchFormService.createPitchFormGroup();

  constructor(
    protected pitchService: PitchService,
    protected pitchFormService: PitchFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pitch }) => {
      this.pitch = pitch;
      if (pitch) {
        this.updateForm(pitch);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pitch = this.pitchFormService.getPitch(this.editForm);
    if (pitch.id !== null) {
      this.subscribeToSaveResponse(this.pitchService.update(pitch));
    } else {
      this.subscribeToSaveResponse(this.pitchService.create(pitch));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPitch>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pitch: IPitch): void {
    this.pitch = pitch;
    this.pitchFormService.resetForm(this.editForm, pitch);
  }
}
