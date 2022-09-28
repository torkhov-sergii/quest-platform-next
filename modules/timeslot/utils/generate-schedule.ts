// Генерировать расписание слотов dateFrom, dateTo, room.schedule
import { RoomCalendarDay, RoomCalendarDayTimeslot } from "@modules/room/types/calendar";
import { addMinutes, eachDayOfInterval, format, isBefore, isSameHour, isWithinInterval, parse } from 'date-fns';
import { Room } from '@modules/room/types/room';

type Props = {
  dateFrom: Date
  dateTo: Date
  room: Room
}

export const generateSchedule = (data: Props) => {
  let RoomCalendarDays: RoomCalendarDay[] = [];

  //create array of days
  const eachDay = eachDayOfInterval({
    start: data.dateFrom,
    end: data.dateTo,
  });

  eachDay.forEach((date, index) => {
    RoomCalendarDays.push({
      date: date,
      RoomCalendarDayTimeslots: []
    });
  });

  data.room.schedule?.forEach((schedule, index) => {
    let scheduleDateFrom = parse(schedule.date_from, 'yyyy-MM-dd', new Date());
    let scheduleDateTo = parse(schedule.date_to, 'yyyy-MM-dd', new Date());

    //week foreach
    schedule.week.forEach((week, index) => {

      eachDay.forEach((eachDayDate, eachDayIndex) => {
        let weekDay = format(eachDayDate, 'eeee').toLowerCase()

        // If current day in array "Days of the week" in admin panel
        if(week.week_days.includes(weekDay)) {

          let isRoomCalendarDayWithinScheduleInterval = isWithinInterval(
            RoomCalendarDays[eachDayIndex].date,
            {
              start: scheduleDateFrom,
              end: scheduleDateTo,
            }
          );

          if (isRoomCalendarDayWithinScheduleInterval) {
            if (eachDayIndex !== -1) {
              let timeslots: RoomCalendarDayTimeslot[] = [];

              //time_slots foreach
              week.time_slots.forEach((timeslot, index) => {
                let timeslotTimeFrom = parse(timeslot.time_from, 'H:mm:ss', eachDayDate);
                let timeslotTimeTo = parse(timeslot.time_to, 'H:mm:ss', eachDayDate);
                let timeslotDateTime = timeslotTimeFrom;

                let safety = 0;
                const maxSafety = 50;
                while (isBefore(timeslotDateTime, timeslotTimeTo) && safety++ < maxSafety) {
                  let foundTimeslotIndex = timeslots.findIndex((timeslot) => isSameHour(timeslot.start, timeslotDateTime));

                  let _timeslot = {
                    start: timeslotDateTime,
                    color: timeslot.color,
                    price: timeslot.price,
                    // timeslot: '666'
                  };

                  if (foundTimeslotIndex !== -1) timeslots[foundTimeslotIndex] = _timeslot;
                  else timeslots.push(_timeslot);

                  timeslotDateTime = addMinutes(timeslotDateTime, 60);
                }
              });

              RoomCalendarDays[eachDayIndex].RoomCalendarDayTimeslots = timeslots;
            }
          }
          //});
        }

      });
    });
  });

  // setSchedule(RoomCalendarDays)
  return RoomCalendarDays
}
