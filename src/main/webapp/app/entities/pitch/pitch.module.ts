import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PitchComponent } from './list/pitch.component';
import { PitchDetailComponent } from './detail/pitch-detail.component';
import { PitchUpdateComponent } from './update/pitch-update.component';
import { PitchDeleteDialogComponent } from './delete/pitch-delete-dialog.component';
import { PitchRoutingModule } from './route/pitch-routing.module';

@NgModule({
  imports: [SharedModule, PitchRoutingModule],
  declarations: [PitchComponent, PitchDetailComponent, PitchUpdateComponent, PitchDeleteDialogComponent],
})
export class PitchModule {}
