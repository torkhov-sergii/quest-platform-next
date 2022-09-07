
export interface RoomCalendar {
  RoomCalendarDays: RoomCalendarDay[]
}

export interface RoomCalendarDay {
  date: Date
  RoomCalendarDayTimeslots?: RoomCalendarDayTimeslot[] | null
}

export interface RoomCalendarDayTimeslot {
  start: Date
  color?: string
  price?: number
}
