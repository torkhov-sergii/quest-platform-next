import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Room, Schedule } from '../../types/room';
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
import { Box, Card, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { RoomScheduleDialog } from '@modules/room/components/schedule/dialog/RoomScheduleDialog';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetRoom, GetRoomSchedule } from '@modules/room/graphql';
import { useTranslation } from 'next-i18next';

interface RoomScheduleProps {
  room: Room;
}

//date-fns examples  https://github.com/you-dont-need/You-Dont-Need-Momentjs#day-of-week
export const RoomSchedule: React.FC<RoomScheduleProps> = ({ room }) => {
  const { i18n } = useTranslation();
  const apolloClient = initializeApollo(i18n.language);

  const [timeslot, setTimeslot] = React.useState<RoomCalendarDayTimeslot | null>(null);
  const [dayDate, setDayDate] = React.useState<Date>(new  Date());
  const [dateFrom, setDateFrom] = React.useState<Date>(new Date(2022, 9-1, 7)); //0 - january
  const [dateTo, setDateTo] = React.useState<Date>(new Date(2022, 9-1, 15));
  const [schedules, setSchedules] = useState<[Schedule] | null>(null)

  // Load room schedule
  apolloClient.query({
    query: GetRoomSchedule,
    variables: {
      column: 'SLUG',
      slug: room.slug,
    },
    fetchPolicy: 'no-cache' //отключить кеширование этого запроса
  }).then(({data, loading}) => {
    setSchedules(data.room.schedule)
  })

  const timeslotOpen = (day: RoomCalendarDay, timeslot: RoomCalendarDayTimeslot) => {
    setTimeslot(timeslot)
    setDayDate(day.date)
  }

  const timeslotClose = () => {
    setTimeslot(null)
  }

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

    schedules?.forEach((schedule, index) => {
        let scheduleDateFrom = parse(schedule.date_from, 'yyyy-MM-dd', new Date());
        let scheduleDateTo = parse(schedule.date_to, 'yyyy-MM-dd', new Date());

        //week foreach
        schedule.week.forEach((week, index) => {

          eachDay.forEach((eachDayDate, eachDayIndex) => {
            let weekDay = format(eachDayDate, 'eeee').toLowerCase()

            // If current day in array "Days of the week" in admin panel
            if(week.week_days.includes(weekDay)) {

              //week_days foreach
              // week.week_days.forEach((weekDay) => {
              // let eachDayIndex = RoomCalendarDays.findIndex(
              //   (day) => format(day.date, 'eeee').toLowerCase() === weekDay
              // );

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

                  RoomCalendarDays[eachDayIndex].RoomCalendarDayTimeslots = timeslots;
                }
              }
              //});
            }

          });
        });
      });

    return { RoomCalendarDays: RoomCalendarDays };
  })();

  // console.log(roomCalendar);
  // console.log(schedule);

  if (!schedules) return (
    <>
      <div className={styles.progress}>
        <LinearProgress />
      </div>
    </>
  )

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
                    <Card key={index} className={styles.timeslot} onClick={() => timeslotOpen(day, timeslot)}>
                      <Typography component="div">
                        {format(timeslot.time, 'H:mm')} - {timeslot.price}$
                      </Typography>
                    </Card>
                  ))}
              </Card>
            ))}
        </Box>
      </div>

      <RoomScheduleDialog room={room} date={dayDate} timeslot={timeslot} timeslotClose={timeslotClose}/>
    </>
  );
};
