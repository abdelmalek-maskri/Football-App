import { ContactType } from 'app/entities/enumerations/contact-type.model';

import { IContact, NewContact } from './contact.model';

export const sampleWithRequiredData: IContact = {
  id: 36482,
};

export const sampleWithPartialData: IContact = {
  id: 48090,
  contactValue: 'Assimilated',
};

export const sampleWithFullData: IContact = {
  id: 99423,
  contactType: ContactType['WEBSITE'],
  contactValue: 'Designer Outdoors forecast',
};

export const sampleWithNewData: NewContact = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
