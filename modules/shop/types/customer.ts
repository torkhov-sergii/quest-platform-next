import { Timeslot } from '@modules/timeslot/types/timeslot';

export interface Customer {
  id: number

  name: string | null
  email: string | null
  phone: string | null
  age: number
  birthday: Date
}

