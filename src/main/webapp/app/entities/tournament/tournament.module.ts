import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TournamentComponent } from './list/tournament.component';
import { TournamentDetailComponent } from './detail/tournament-detail.component';
import { TournamentUpdateComponent } from './update/tournament-update.component';
import { TournamentDeleteDialogComponent } from './delete/tournament-delete-dialog.component';
import { TournamentRoutingModule } from './route/tournament-routing.module';

@NgModule({
  imports: [SharedModule, TournamentRoutingModule],
  declarations: [TournamentComponent, TournamentDetailComponent, TournamentUpdateComponent, TournamentDeleteDialogComponent],
})
export class TournamentModule {}
