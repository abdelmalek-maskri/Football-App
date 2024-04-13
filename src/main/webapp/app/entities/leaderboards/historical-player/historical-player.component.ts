import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-historical-player',
  templateUrl: './historical-player.component.html',
  styleUrls: ['./historical-player.component.scss'],
})
export class HistoricalPlayerComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  goBackToLeaderboard(): void {
    this.router.navigate(['/ld']);
  }
}
