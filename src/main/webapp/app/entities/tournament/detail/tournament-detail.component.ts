import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITournament } from '../tournament.model';

@Component({
  selector: 'jhi-tournament-detail',
  templateUrl: './tournament-detail.component.html',
})
export class TournamentDetailComponent implements OnInit {
  tournament: ITournament | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tournament }) => {
      this.tournament = tournament;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
