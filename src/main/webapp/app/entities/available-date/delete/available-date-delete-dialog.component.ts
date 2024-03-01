import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAvailableDate } from '../available-date.model';
import { AvailableDateService } from '../service/available-date.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './available-date-delete-dialog.component.html',
})
export class AvailableDateDeleteDialogComponent {
  availableDate?: IAvailableDate;

  constructor(protected availableDateService: AvailableDateService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.availableDateService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
