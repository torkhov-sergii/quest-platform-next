//
import { RoomCalendarDay, RoomCalendarDayTimeslot } from "@modules/room/types/calendar";
import {
  addMinutes,
  eachDayOfInterval,
  format,
  isBefore,
  isSameDay,
  isSameHour,
  isWithinInterval,
  parse
} from "date-fns";
import { Timeslot } from "@modules/timeslot/types/timeslot";

type Props = {
  timeslot: Timeslot
  schedule: RoomCalendarDay[]
}

export const findTimeslotByDatetime = (data: Props): RoomCalendarDayTimeslot => {
  let timeslotDateTime = parse(data.timeslot.start, 'yyyy-MM-dd H:mm:ss', new Date(data.timeslot.start))
  let scheduleDayIndex = data.schedule?.findIndex(day => isSameDay(day.date, timeslotDateTime))
  let scheduleTimeIndex
  let timeslotFounded

  if(scheduleDayIndex > -1) {
    scheduleTimeIndex = data.schedule?.[scheduleDayIndex]?.RoomCalendarDayTimeslots?.findIndex(timeslot => isSameHour(timeslot.start, timeslotDateTime))
    timeslotFounded = data.schedule?.[scheduleDayIndex]?.RoomCalendarDayTimeslots?.[scheduleTimeIndex]
  }

  return timeslotFounded
}
