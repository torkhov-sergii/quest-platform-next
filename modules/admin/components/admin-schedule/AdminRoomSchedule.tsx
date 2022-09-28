import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { parse, format, compareAsc, eachDayOfInterval, addMinutes, addDays, isSameHour, isBefore, isAfter, isWithinInterval, startOfDay, isSameDay, endOfDay } from 'date-fns';
import { Box, Button, Card, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { RoomScheduleDialog } from '@modules/room/components/schedule/dialog/RoomScheduleDialog';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetRoom } from '@modules/room/graphql';
import { useTranslation } from 'next-i18next';
import { GetTimeslot, GetTimeslots } from '@modules/timeslot/graphql';
import { Timeslot } from '@modules/timeslot/types/timeslot';
import _ from 'lodash';
import { generateSchedule } from '@modules/timeslot/utils/generate-schedule';
import { RoomCalendarDay, RoomCalendarDayTimeslot } from '@modules/room/types/calendar';
import { Room } from '@modules/room/types/room';
import { AdminRoomScheduleDialog } from '@modules/admin/components/admin-schedule/dialog/AdminRoomScheduleDialog';
import { integer } from 'vscode-languageserver-types';
import { findTimeslotByDatetime } from '@modules/timeslot/utils/find-temeslot-by-datetime';

interface AdminRoomScheduleProps {
  dateFromJoint: Date | null; //for page - /admin/rooms/
  dateToJoint: Date | null; //for page - /admin/rooms/
  room: Room;
}

//date-fns examples  https://github.com/you-dont-need/You-Dont-Need-Momentjs#day-of-week
export const AdminRoomSchedule: React.FC<AdminRoomScheduleProps> = ({ dateFromJoint, dateToJoint, room }) => {
  const { i18n } = useTranslation();
  const apolloClient = initializeApollo(i18n.language);

  const [calendarTimeslot, setCalendarTimeslot] = React.useState<RoomCalendarDayTimeslot | null>(null);
  const [dateFrom, setDateFrom] = React.useState<Date>(startOfDay(new Date())); //0 - january
  const [dateTo, setDateTo] = React.useState<Date>(addDays(endOfDay(new Date()), 6));
  const [schedule, setSchedule] = useState<RoomCalendarDay[]>([]);
  // const [timeslots, setTimeslots] = useState<Timeslot[]>([])
  const [timeslot, setTimeslot] = useState<Timeslot | null>(null);

  // For possibility to set dateFrom, dateTo for parent component
  if (dateFromJoint && dateToJoint) {
    React.useEffect(() => {
      setDateFrom(dateFromJoint);
      setDateTo(dateToJoint);
    }, [dateFromJoint, dateToJoint]);
  }

  const nextScheduleHandle = () => {
    setDateFrom(addDays(dateFrom, 7));
    setDateTo(addDays(dateTo, 7));
  };

  const prevScheduleHandle = () => {
    setDateFrom(addDays(dateFrom, -7));
    setDateTo(addDays(dateTo, -7));
  };

  // Fetch timeslots for period between dateFrom, dateTo
  const fetchTimeslots = () => {
    let scheduleGenerated = generateSchedule({
      dateFrom: dateFrom,
      dateTo: dateTo,
      room: room,
    });

    apolloClient
      .query({
        query: GetTimeslots,
        variables: {
          room_id: room.id,
          from: dateFrom,
          to: dateTo,
        },
        fetchPolicy: 'no-cache', //отключить кеширование этого запроса
      })
      .then(({ data, loading }) => {
        data.timeslots.map((timeslot) => {
          let timeslotFounded = findTimeslotByDatetime({ timeslot: timeslot, schedule: scheduleGenerated });
          if (timeslotFounded) timeslotFounded!.timeslot = timeslot;
        });

        setSchedule(scheduleGenerated);
      });
  };

  // Fetch timeslots for period between dateFrom, dateTo
  useEffect(() => {
    fetchTimeslots();
  }, [dateFrom, dateTo]);

  const timeslotColor = (calendarTimeslot) => {
    // return (timeslots.findIndex(timeslot => isSameHour(timeslot.start2, start))) > -1 ? 'success' : 'primary'
    return calendarTimeslot?.timeslot ? 'success' : 'primary';
  };

  const timeslotOpen = (calendarTimeslot) => {
    let timeslot = calendarTimeslot?.timeslot;

    if (timeslot) {
      apolloClient
        .query({
          query: GetTimeslot,
          variables: {
            id: timeslot.id,
          },
          fetchPolicy: 'no-cache', //отключить кеширование этого запроса
        })
        .then(({ data, loading }) => {
          let _timeslot = { ...data.timeslot, start2: parse(data.timeslot.start, 'yyyy-MM-dd H:mm:ss', new Date(data.timeslot.start)) };
          setTimeslot(_timeslot);
        });
    } else {
      setCalendarTimeslot(calendarTimeslot);
    }
  };

  const timeslotClose = () => {
    setTimeslot(null);
    setCalendarTimeslot(null);
  };

  const updateTimeslotById = (id: integer) => {
    apolloClient
      .query({
        query: GetTimeslot,
        variables: {
          id: id,
        },
        fetchPolicy: 'no-cache', //отключить кеширование этого запроса
      })
      .then(({ data, loading }) => {
        let timeslotFounded = findTimeslotByDatetime({ timeslot: data.timeslot, schedule: schedule });
        if (timeslotFounded) timeslotFounded!.timeslot = data.timeslot;
      })
      .then(() => fetchTimeslots());
  };

  if (!schedule)
    return (
      <>
        <div className={styles.progress}>
          <LinearProgress />
        </div>
      </>
    );

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          prevScheduleHandle();
        }}
      >
        prev
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          nextScheduleHandle();
        }}
      >
        next
      </Button>

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
                      <Button className={styles.timeslot} onClick={() => timeslotOpen(calendarTimeslot)} variant="contained" color={timeslotColor(calendarTimeslot)}>
                        <Typography component="div">
                          {format(calendarTimeslot.start, 'H:mm')} - {calendarTimeslot.price}$ - {calendarTimeslot?.timeslot?.players}pl - {calendarTimeslot?.timeslot?.status}
                        </Typography>
                      </Button>
                    </div>
                  ))}
              </Card>
            ))}
        </Box>
      </div>

      {timeslot && <AdminRoomScheduleDialog room={room} timeslot={timeslot} timeslotClose={timeslotClose} updateTimeslotById={updateTimeslotById} />}

      {calendarTimeslot && <RoomScheduleDialog room={room} timeslot={calendarTimeslot} timeslotClose={timeslotClose} updateTimeslotById={updateTimeslotById} />}
    </>
  );
};
