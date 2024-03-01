import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPitch } from '../pitch.model';

@Component({
  selector: 'jhi-pitch-detail',
  templateUrl: './pitch-detail.component.html',
})
export class PitchDetailComponent implements OnInit {
  pitch: IPitch | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pitch }) => {
      this.pitch = pitch;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
