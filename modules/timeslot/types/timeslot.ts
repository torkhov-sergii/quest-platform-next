import { Order } from '@modules/shop/types/order';
import { Room } from '@modules/room/types/room';

export interface Timeslot {
  id: number
  order_id: number
  room_id: number
  number: string

  start: string
  start2: Date
  status: string

  players: number
  age: string
  price_final: number

  price: number
  players_from: number
  players_to: number
  players_additional_price: number

  order: Order
  room: Room
}
