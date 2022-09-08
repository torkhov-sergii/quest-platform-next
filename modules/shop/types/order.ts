import { Timeslot } from '@modules/timeslot/types/timeslot';
import { Customer } from '@modules/shop/types/customer';

export interface Order {
  id: number
  customer_id: number
  promo_code_id: number
  number: string

  total_price: number
  status: string

  comment: string
  customer_comment: string
  members: JSON
  secret_key: string

  customer: Customer
  timeslots: [Timeslot]
}

