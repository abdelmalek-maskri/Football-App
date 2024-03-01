import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-profile',
        data: { pageTitle: 'UserProfiles' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'available-date',
        data: { pageTitle: 'AvailableDates' },
        loadChildren: () => import('./available-date/available-date.module').then(m => m.AvailableDateModule),
      },
      {
        path: 'tournament',
        data: { pageTitle: 'Tournaments' },
        loadChildren: () => import('./tournament/tournament.module').then(m => m.TournamentModule),
      },
      {
        path: 'pitch-booking',
        data: { pageTitle: 'PitchBookings' },
        loadChildren: () => import('./pitch-booking/pitch-booking.module').then(m => m.PitchBookingModule),
      },
      {
        path: 'pitch',
        data: { pageTitle: 'Pitches' },
        loadChildren: () => import('./pitch/pitch.module').then(m => m.PitchModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'Comments' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'match',
        data: { pageTitle: 'Matches' },
        loadChildren: () => import('./match/match.module').then(m => m.MatchModule),
      },
      {
        path: 'team',
        data: { pageTitle: 'Teams' },
        loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
      },
      {
        path: 'contact',
        data: { pageTitle: 'Contacts' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
