import React, { useCallback, useEffect } from 'react';
import styles from './index.module.scss';
import { Schedule } from '../../types/room';
import { RoomCalendar, RoomCalendarDay, RoomCalendarDayTimeslot } from '../../types/calendar';
import {
  parse,
  format,
  compareAsc,
  eachDayOfInterval,
  addMinutes,
  isSameHour,
  isBefore,
  isAfter,
  isWithinInterval,
} from 'date-fns';
import { Box, Card, Typography } from '@mui/material';

interface ScheduleProps {
  schedules: [Schedule];
}

//date-fns examples  https://github.com/you-dont-need/You-Dont-Need-Momentjs#day-of-week
export const RoomSchedule: React.FC<ScheduleProps> = ({ schedules }) => {
  const [dateFrom, setDateFrom] = React.useState<Date>(new Date(2022, 9, 1));
  const [dateTo, setDateTo] = React.useState<Date>(new Date(2022, 9, 7));

  const roomCalendar = (function (): RoomCalendar {
    const RoomCalendarDays: RoomCalendarDay[] = [];

    //create array of days
    const eachDay = eachDayOfInterval({
      start: dateFrom,
      end: dateTo,
    });

    eachDay.forEach((date, index) => {
      RoomCalendarDays.push({
        date: date,
      });
    });

    schedules.forEach((schedule, index) => {
      let scheduleDateFrom = parse(schedule.date_from, 'yyyy-MM-dd', new Date());
      let scheduleDateTo = parse(schedule.date_to, 'yyyy-MM-dd', new Date());

      //week foreach
      schedule.week.forEach((week, index) => {

        //week_days foreach
        week.week_days.forEach((weekDay) => {
          let foundRoomCalendarDayIndex = RoomCalendarDays.findIndex(
            (day) => format(day.date, 'eeee').toLowerCase() === weekDay
          );

          let isRoomCalendarDayWithinScheduleInterval = isWithinInterval(
            RoomCalendarDays[foundRoomCalendarDayIndex].date,
            {
              start: scheduleDateFrom,
              end: scheduleDateTo,
            }
          );

          if (isRoomCalendarDayWithinScheduleInterval) {
            if (foundRoomCalendarDayIndex !== -1) {
              let timeslots: RoomCalendarDayTimeslot[] = [];

              //time_slots foreach
              week.time_slots.forEach((timeslot, index) => {
                let timeslotTimeFrom = parse(timeslot.time_from, 'H:mm:ss', new Date());
                let timeslotTimeTo = parse(timeslot.time_to, 'H:mm:ss', new Date());
                let timeslotTime = timeslotTimeFrom;

                let safety = 0;
                const maxSafety = 50;
                while (isBefore(timeslotTime, timeslotTimeTo) && safety++ < maxSafety) {
                  let foundTimeslotIndex = timeslots.findIndex((timeslot) => isSameHour(timeslot.time, timeslotTime));

                  let _timeslot = {
                    time: timeslotTime,
                    color: timeslot.color,
                    price: timeslot.price,
                  };

                  if (foundTimeslotIndex !== -1) timeslots[foundTimeslotIndex] = _timeslot;
                  else timeslots.push(_timeslot);

                  timeslotTime = addMinutes(timeslotTime, 60);
                }
              });

              RoomCalendarDays[foundRoomCalendarDayIndex].RoomCalendarDayTimeslots = timeslots;
            }
          }
        });
      });
    });

    return { RoomCalendarDays: RoomCalendarDays };
  })();

  // console.log(roomCalendar);
  // console.log(schedule);

  return (
    <>
      <div className={styles.schedule}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {roomCalendar &&
            roomCalendar?.RoomCalendarDays.map((day, index) => (
              <Card key={index} className={styles.day}>
                <Typography component="div">{format(day.date, 'eeee')}</Typography>
                <Typography component="div">{format(day.date, 'MMMM d')}</Typography>
                {day &&
                  day?.RoomCalendarDayTimeslots?.map((timeslot, index) => (
                    <Card key={index} className={styles.timeslot}>
                      <Typography component="div">
                        {format(timeslot.time, 'H:mm')} - {timeslot.price}$
                      </Typography>
                    </Card>
                  ))}
              </Card>
            ))}
        </Box>
      </div>
    </>
  );
};
