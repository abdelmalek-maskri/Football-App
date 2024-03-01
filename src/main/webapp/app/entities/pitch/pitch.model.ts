export interface IPitch {
  id: number;
  name?: string | null;
  location?: string | null;
}

export type NewPitch = Omit<IPitch, 'id'> & { id: null };
