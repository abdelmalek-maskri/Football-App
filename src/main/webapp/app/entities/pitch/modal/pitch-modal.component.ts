import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-pitch-details-modal',
  templateUrl: './pitch-modal.component.html',
  standalone: true,
  imports: [FontAwesomeModule, NgIf, SharedModule],
  styleUrls: ['./pitch-modal.component.scss'],
})
export class PitchModalComponent {
  @Input() pitch: any;

  constructor(public activeModal: NgbActiveModal) {}
}
