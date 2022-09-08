import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Room, Schedule } from '../../types/room';
import { RoomCalendar, RoomCalendarDay, RoomCalendarDayTimeslot } from '../../types/calendar';
import {
  parse,
  format,
  compareAsc,
  eachDayOfInterval,
  addMinutes,
  addDays,
  isSameHour,
  isBefore,
  isAfter,
  isWithinInterval,
} from 'date-fns';
import { Box, Button, Card, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { RoomScheduleDialog } from '@modules/room/components/schedule/dialog/RoomScheduleDialog';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetRoom } from '@modules/room/graphql';
import { useTranslation } from 'next-i18next';
import { GetTimeslots } from '@modules/timeslot/graphql';
import { Timeslot } from '@modules/timeslot/types/timeslot';
import _ from 'lodash';
interface RoomScheduleProps {
  room: Room;
}

//date-fns examples  https://github.com/you-dont-need/You-Dont-Need-Momentjs#day-of-week
export const RoomSchedule: React.FC<RoomScheduleProps> = ({ room }) => {
  const { i18n } = useTranslation();
  const apolloClient = initializeApollo(i18n.language);

  const [timeslot, setTimeslot] = React.useState<RoomCalendarDayTimeslot | null>(null);
  const [dateFrom, setDateFrom] = React.useState<Date>(new Date()); //0 - january
  const [dateTo, setDateTo] = React.useState<Date>(addDays(new Date(), 6));
  const [schedule, setSchedule] = useState<RoomCalendarDay[] | null>(null)
  const [timeslots, setTimeslots] = useState<Timeslot[]>([])

  const nextScheduleHandle = () => {
    setDateFrom(addDays(dateFrom, 7))
    setDateTo(addDays(dateTo, 7))
  }

  const prevScheduleHandle = () => {
    setDateFrom(addDays(dateFrom, -7))
    setDateTo(addDays(dateTo, -7))
  }

  // Fetch timeslots for period between dateFrom, dateTo
  useEffect (() => {
    generateSchedule()

    apolloClient.query({
      query: GetTimeslots,
      variables: {
        from: dateFrom,
        to: dateTo,
      },
      fetchPolicy: 'no-cache' //отключить кеширование этого запроса
    }).then(({data, loading}) => {
      let _timeslots = data.timeslots.map(timeslot => ({...timeslot, start2: parse(timeslot.start, 'yyyy-MM-dd H:mm:ss', new Date(timeslot.start))}))

      let timeslotsUnion = _.unionBy(timeslots, _timeslots, 'start');
      setTimeslots(timeslotsUnion)

    })
  }, [dateFrom, dateTo])

  const timeslotColor = (start) => {
    return (timeslots.findIndex(timeslot => isSameHour(timeslot.start2, start))) > -1 ? 'success' : 'primary'
  }

  const timeslotOpen = (day: RoomCalendarDay, timeslot: RoomCalendarDayTimeslot) => {
    setTimeslot(timeslot)
  }

  const timeslotClose = () => {
    setTimeslot(null)
  }

  // Генерировать расписание слотов dateFrom, dateTo, room.schedule
  function generateSchedule() {
    let RoomCalendarDays: RoomCalendarDay[] = [];

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

    room.schedule?.forEach((schedule, index) => {
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

    setSchedule(RoomCalendarDays)
  }

  if (!schedule) return (
    <>
      <div className={styles.progress}>
        <LinearProgress />
      </div>
    </>
  )

  return (
    <>
      <Button variant="contained" onClick={() => {prevScheduleHandle()}}>prev</Button>
      <Button variant="contained" onClick={() => {nextScheduleHandle()}}>next</Button>

      <div className={styles.schedule}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {schedule &&
            schedule.map((day, index) => (
              <Card key={index} className={styles.day}>
                <Typography component="div">{format(day.date, 'eeee')}</Typography>
                <Typography component="div">{format(day.date, 'MMMM d')}</Typography>
                {day &&
                  day?.RoomCalendarDayTimeslots?.map((timeslot, index) => (
                    <div key={index}>
                      <Button  className={styles.timeslot} onClick={() => timeslotOpen(day, timeslot)} variant="contained" color={timeslotColor(timeslot.start)}>
                        <Typography component="div">
                          {format(timeslot.start, 'H:mm')} - {timeslot.price}$
                        </Typography>
                      </Button>
                    </div>
                  ))}
              </Card>
            ))}
        </Box>
      </div>

      {false && timeslots &&
        timeslots.map((timeslot, index) => (
          <div key={index}>{timeslot.start}-{timeslot.status}</div>
        ))
      }

      <RoomScheduleDialog room={room} timeslot={timeslot} timeslotClose={timeslotClose}/>
    </>
  );
};
