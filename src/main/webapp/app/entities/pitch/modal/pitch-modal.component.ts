import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-pitch-details-modal',
  templateUrl: './pitch-modal.component.html',
  standalone: true,
  imports: [FontAwesomeModule, NgIf, SharedModule],
  styleUrls: ['./pitch-modal.component.scss'],
})
export class PitchModalComponent {
  @Input() pitch: any;

  constructor(public activeModal: NgbActiveModal, private router: Router) {}

  modalRef: any; // Declare modalRef variable

  setModalRef(modalRef: any) {
    this.modalRef = modalRef;
  }
  navigateToBooking(pitch: any) {
    // Close the modal before navigating
    if (this.modalRef) {
      this.modalRef.close();
    }
    const pitchWithoutBookings = { ...pitch }; // Create a copy of the pitch object
    delete pitchWithoutBookings.pitchBookings; // Remove the pitchBookings property from the copy
    // Navigate to /pitch-booking/new and pass pitch details as query parameters
    this.router.navigate(['/pitch-booking/new'], { queryParams: { pitch: JSON.stringify(pitchWithoutBookings) } });
  }
}
