import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AvailableDateComponent } from './list/available-date.component';
import { AvailableDateDetailComponent } from './detail/available-date-detail.component';
import { AvailableDateUpdateComponent } from './update/available-date-update.component';
import { AvailableDateDeleteDialogComponent } from './delete/available-date-delete-dialog.component';
import { AvailableDateRoutingModule } from './route/available-date-routing.module';

@NgModule({
  imports: [SharedModule, AvailableDateRoutingModule],
  declarations: [AvailableDateComponent, AvailableDateDetailComponent, AvailableDateUpdateComponent, AvailableDateDeleteDialogComponent],
})
export class AvailableDateModule {}
