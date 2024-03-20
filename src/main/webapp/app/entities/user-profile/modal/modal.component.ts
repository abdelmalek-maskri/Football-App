import { Component, OnInit } from '@angular/core';

import { ContactService } from '../../contact/service/contact.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactType } from '../../enumerations/contact-type.model';
import { IContact } from '../../contact/contact.model';
import { ActivatedRoute } from '@angular/router';
import { IUserProfile } from '../user-profile.model';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  contactsList: IContact[] | null = null;
  userProfile: IUserProfile | null = null;
  theAccount?: Account;
  id: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private contactService: ContactService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    // this.id =  this.activatedRoute.snapshot.params['id'];

    this.contactService.findByUserID(1001).subscribe(contacts => {
      if (contacts) {
        this.contactsList = contacts.body;
      }
    });
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }
}
