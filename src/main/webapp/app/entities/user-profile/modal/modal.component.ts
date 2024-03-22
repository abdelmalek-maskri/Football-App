import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ContactService } from '../../contact/service/contact.service';
import { IContact } from '../../contact/contact.model';

@Component({
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  userProfile?: IUserProfile;
  contactsList: IContact[] | null = null;

  constructor(
    protected userProfileService: UserProfileService,
    protected activeModal: NgbActiveModal,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    // this.id =  this.activatedRoute.snapshot.params['id'];

    this.contactService.findByUserID(3051).subscribe(contacts => {
      if (contacts) {
        this.contactsList = contacts.body;
      }
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}

// import { Component, OnInit } from '@angular/core';
//
// import { ContactService } from '../../contact/service/contact.service';
// import { MatDialogRef } from '@angular/material/dialog';
// import { ContactType } from '../../enumerations/contact-type.model';
// import { IContact } from '../../contact/contact.model';
// import { ActivatedRoute } from '@angular/router';
// import { IUserProfile } from '../user-profile.model';
// import { AccountService } from '../../../core/auth/account.service';
// import { Account } from '../../../core/auth/account.model';
// import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
//
// @Component({
//   templateUrl: './modal.component.html',
//   styleUrls: ['./modal.component.scss'],
// })
// export class ModalComponent{
//   contactsList: IContact[] | null = null;
//   userProfile: IUserProfile | null = null;
//   theAccount?: Account;
//   id: number | null = null;
//
//   constructor(
//     public dialogRef: MatDialogRef<ModalComponent>,
//     private contactService: ContactService,
//     protected activatedRoute: ActivatedRoute,
//     private accountService: AccountService,
//     protected activeModal: NgbActiveModal
//   ) {}
//
//   ngOnInit() {
//     // this.id =  this.activatedRoute.snapshot.params['id'];
//
//     this.contactService.findByUserID(3051).subscribe(contacts => {
//       if (contacts) {
//         this.contactsList = contacts.body;
//       }
//     });
//   }
//
//   // If the user clicks the cancel button a.k.a. the go back button, then\
//   // just close the modal
//   closeModal() {
//     this.dialogRef.close();
//   }
// }
//
