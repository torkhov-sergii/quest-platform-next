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
  isWithinInterval, startOfDay, endOfDay,
} from 'date-fns';
import { Box, Button, Card, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { RoomScheduleDialog } from '@modules/room/components/schedule/dialog/RoomScheduleDialog';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetRoom } from '@modules/room/graphql';
import { useTranslation } from 'next-i18next';
import { GetTimeslots } from '@modules/timeslot/graphql';
import { Timeslot } from '@modules/timeslot/types/timeslot';
import _ from 'lodash';
import { generateSchedule } from '@modules/timeslot/utils/generate-schedule';

interface RoomScheduleProps {
  room: Room;
}

//date-fns examples  https://github.com/you-dont-need/You-Dont-Need-Momentjs#day-of-week
export const RoomSchedule: React.FC<RoomScheduleProps> = ({ room }) => {
  const { i18n } = useTranslation();
  const apolloClient = initializeApollo(i18n.language);

  const [calendarTimeslot, setCalendarTimeslot] = React.useState<RoomCalendarDayTimeslot | null>(null);
  const [dateFrom, setDateFrom] = React.useState<Date>(startOfDay(new Date())); //0 - january
  const [dateTo, setDateTo] = React.useState<Date>(addDays(endOfDay(new Date()), 6));
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
    setSchedule(generateSchedule({
      dateFrom: dateFrom,
      dateTo: dateTo,
      room: room
    }))

    apolloClient.query({
      query: GetTimeslots,
      variables: {
        room_id: room.id,
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

  const isTimeslotDisabled = (start) => {
    return (timeslots.findIndex(timeslot => isSameHour(timeslot.start2, start))) > -1
  }

  const timeslotOpen = (calendarTimeslot: RoomCalendarDayTimeslot) => {
    setCalendarTimeslot(calendarTimeslot)
  }

  const timeslotClose = () => {
    setCalendarTimeslot(null)
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
                  day?.RoomCalendarDayTimeslots?.map((calendarTimeslot, index) => (
                    <div key={index}>
                      <Button disabled={isTimeslotDisabled(calendarTimeslot.start)} className={styles.timeslot} onClick={() => timeslotOpen(calendarTimeslot)} variant="contained">
                        <Typography component="div">
                          {format(calendarTimeslot.start, 'H:mm')} - {calendarTimeslot.price}$
                        </Typography>
                      </Button>
                    </div>
                  ))}
              </Card>
            ))}
        </Box>
      </div>

      {calendarTimeslot && (
        <RoomScheduleDialog room={room} timeslot={calendarTimeslot} timeslotClose={timeslotClose} updateTimeslotById={() => {}}/>
      )}
    </>
  );
};
