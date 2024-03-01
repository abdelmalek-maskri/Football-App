import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PitchBookingComponent } from './list/pitch-booking.component';
import { PitchBookingDetailComponent } from './detail/pitch-booking-detail.component';
import { PitchBookingUpdateComponent } from './update/pitch-booking-update.component';
import { PitchBookingDeleteDialogComponent } from './delete/pitch-booking-delete-dialog.component';
import { PitchBookingRoutingModule } from './route/pitch-booking-routing.module';

@NgModule({
  imports: [SharedModule, PitchBookingRoutingModule],
  declarations: [PitchBookingComponent, PitchBookingDetailComponent, PitchBookingUpdateComponent, PitchBookingDeleteDialogComponent],
})
export class PitchBookingModule {}
