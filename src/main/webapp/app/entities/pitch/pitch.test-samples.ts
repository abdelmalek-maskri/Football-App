import { IPitch, NewPitch } from './pitch.model';

export const sampleWithRequiredData: IPitch = {
  id: 21161,
};

export const sampleWithPartialData: IPitch = {
  id: 32993,
  name: 'invoice Louisiana',
  location: 'digital Supervisor fuchsia',
};

export const sampleWithFullData: IPitch = {
  id: 66626,
  name: 'Coordinator',
  location: 'Orchestrator',
};

export const sampleWithNewData: NewPitch = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
