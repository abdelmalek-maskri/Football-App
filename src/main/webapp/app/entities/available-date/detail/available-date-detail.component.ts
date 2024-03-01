import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAvailableDate } from '../available-date.model';

@Component({
  selector: 'jhi-available-date-detail',
  templateUrl: './available-date-detail.component.html',
})
export class AvailableDateDetailComponent implements OnInit {
  availableDate: IAvailableDate | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ availableDate }) => {
      this.availableDate = availableDate;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
