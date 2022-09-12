import { Timeslot } from '@modules/timeslot/types/timeslot';

export interface RoomCalendar {
  RoomCalendarDays: RoomCalendarDay[]
}

export interface RoomCalendarDay {
  date: Date
  RoomCalendarDayTimeslots: RoomCalendarDayTimeslot[] | []
}

export interface RoomCalendarDayTimeslot {
  start: Date
  color?: string
  price?: number

  timeslot?: Timeslot
}
