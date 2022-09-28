import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { format, addHours, add, parse, setHours, setMinutes, isSameDay, startOfDay, endOfDay, isSameHour, isFuture, isPast } from 'date-fns';
import { Button, DialogContent, FormControl, Grid, InputLabel, MenuItem, TextField, Typography } from '@mui/material';
import { RoomCalendarDay, RoomCalendarDayTimeslot } from '@modules/room/types/calendar';
import { BootstrapDialog } from '@modules/shared/components/dialog/DialogContent';
import { Room } from '@modules/room/types/room';
import Select from '@mui/material/Select';
import { cancelTimeslot, createTimeslot, GetFinalPrice, GetTimeslots, updateTimeslot } from '@modules/timeslot/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { GetPage } from '@modules/page/graphql';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { i18n, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Timeslot } from '@modules/timeslot/types/timeslot';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { generateSchedule } from '@modules/timeslot/utils/generate-schedule';
import { findTimeslotByDatetime } from '@modules/timeslot/utils/find-temeslot-by-datetime';

interface AdminRoomScheduleDialogProps {
  room: Room;
  timeslot: Timeslot;
  timeslotClose: () => void;
  updateTimeslotById: (int) => void;
}

export const AdminRoomScheduleDialog: React.FC<AdminRoomScheduleDialogProps> = ({ room, timeslot, timeslotClose, updateTimeslotById }) => {
  const { i18n } = useTranslation();
  const apolloClient = initializeApollo(i18n.language);

  const [name, setName] = useState(timeslot.order?.customer.name);
  const [phone, setPhone] = useState(timeslot.order?.customer.phone);
  const [email, setEmail] = useState(timeslot.order?.customer.email);
  const [promo, setPromo] = useState('');
  const [customerComment, setCustomerComment] = useState(timeslot.order?.customer_comment);
  const [comment, setComment] = useState(timeslot.order?.comment);
  const [players, setPlayers] = useState(timeslot.players);
  const [status, setStatus] = useState(timeslot.status);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [DatePickerInjectTimes, setDatePickerInjectTimes] = useState<Date[]>([]);
  const [DatePickerIncludeTimes, setDatePickerIncludeTimes] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(timeslot.start2);

  const handleChangeStartDate = (date) => {
    // console.log(date);

    let _DatePickerInjectTimes: Date[] = [];
    let _DatePickerIncludeTimes: Date[] = [];

    let scheduleGenerated = generateSchedule({
      dateFrom: startOfDay(date),
      dateTo: endOfDay(date),
      room: room,
    });

    apolloClient
      .query({
        query: GetTimeslots,
        variables: {
          room_id: timeslot.room.id,
          from: startOfDay(date),
          to: endOfDay(date),
        },
        fetchPolicy: 'no-cache', //отключить кеширование этого запроса
      })
      .then(({ data, loading }) => {
        data.timeslots.map((timeslot) => {
          let timeslotFounded = findTimeslotByDatetime({ timeslot: timeslot, schedule: scheduleGenerated });
          if (timeslotFounded) timeslotFounded!.timeslot = timeslot;
        });

        scheduleGenerated[0].RoomCalendarDayTimeslots.map((RoomCalendarDayTimeslot) => {
          _DatePickerInjectTimes.push(RoomCalendarDayTimeslot.start);

          if (!RoomCalendarDayTimeslot.timeslot && isFuture(date)) {
            _DatePickerIncludeTimes.push(RoomCalendarDayTimeslot.start);
          }
        });

        if (isSameDay(date, timeslot.start2)) {
          _DatePickerIncludeTimes.push(timeslot.start2); //enable current time for select possibility
        }

        setDatePickerInjectTimes(_DatePickerInjectTimes);
        setDatePickerIncludeTimes(_DatePickerIncludeTimes);
      })
      .then(() => {
        let findIndex = _DatePickerIncludeTimes.findIndex((date2) => isSameHour(date2, date));

        if (findIndex > -1) {
          setStartDate(date);
        } else {
          setStartDate(null);
        }
      });
  };

  const handleDatePickerClose = () => {
    if (!startDate) setStartDate(timeslot.start2);
  };

  const handleClose = () => {
    timeslotClose();
  };

  const [handleSubmit, { data: submitData, loading: submitLoading, error: submitError }] = useMutation(updateTimeslot);

  const submit = () => {
    handleSubmit({
      client: initializeApollo(i18n.language),
      variables: {
        id: timeslot.id,
        room_id: timeslot.room_id,
        start: timeslot && startDate ? format(startDate, 'Y-MM-dd H:mm:ss') : null,
        status: status,
        players: players,
        price_final: finalPrice,
        order: {
          comment: comment,
          customer_comment: customerComment,
        },
        customer: {
          email: email,
          name: name,
          phone: phone,
        },
      },
    });

    updateTimeslotById(timeslot.id);
  };

  const [handleCancel, { data: cancelData, loading: cancelLoading, error: cancelError }] = useMutation(cancelTimeslot);

  const cancel = () => {
    handleCancel({
      client: initializeApollo(i18n.language),
      variables: {
        id: timeslot.id,
      },
    }).then(handleClose);
  };

  // Calc final price
  useEffect(() => {
    setFinalPrice(null);

    apolloClient
      .query({
        query: GetFinalPrice,
        variables: {
          room_id: timeslot.room_id,
          start: timeslot ? format(timeslot?.start2, 'Y-MM-dd H:mm:ss') : null,
          players: players,
          price: timeslot?.price,
        },
        fetchPolicy: 'no-cache', //отключить кеширование этого запроса
      })
      .then(({ data, loading }) => {
        setFinalPrice(data.finalPrice);
      });
  }, [players]);

  const playersOption = () => Array.from({ length: timeslot.room.players_to }, (_, i) => i + timeslot.room.players_from);

  const statusOption = () => ['new', 'confirmed', 'technical', 'arrived', 'canceled'];

  return (
    <>
      <BootstrapDialog onClose={handleClose} open={!!timeslot}>
        <DialogContent>
          <Typography variant="h4" component="div">
            Edit booking by Admin
          </Typography>

          {timeslot && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" component="div">
                    timeslot id: {timeslot.id}
                  </Typography>

                  <DatePicker
                    selected={startDate}
                    onChange={(date) => handleChangeStartDate(date)}
                    showTimeSelect
                    timeIntervals={9999999999}
                    minDate={new Date()}
                    onCalendarClose={handleDatePickerClose}
                    onCalendarOpen={() => handleChangeStartDate(startDate)}
                    includeTimes={DatePickerIncludeTimes}
                    injectTimes={DatePickerInjectTimes}
                    dateFormat="MMMM d, yyyy H:mm aa"
                    timeFormat="HH:mm"

                    // minTime={setHours(setMinutes(new Date(), 0), 17)}
                    // maxTime={setHours(setMinutes(new Date(), 30), 20)}

                    // excludeTimes={[
                    //   setHours(setMinutes(new Date(), 0), 17),
                    // ]}

                    // includeTimes={[
                    //   setHours(setMinutes(new Date(), 30), 17),
                    //   setHours(setMinutes(new Date(), 10), 18),
                    // ]}

                    // injectTimes={[
                    //   // setHours(setMinutes(new Date(), 1), 0),
                    // ]}
                  />

                  <Typography variant="h4" component="div">
                    {timeslot.room?.title}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {timeslot.room?.location?.title}
                  </Typography>

                  <FormControl fullWidth>
                    <InputLabel>Players</InputLabel>
                    <Select value={players} label="Players" onChange={(event) => setPlayers(Number(event.target.value))}>
                      {playersOption &&
                        playersOption().map((item: any, index) => (
                          <MenuItem value={item} key={index}>
                            {item}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select value={status} label="Status" onChange={(event) => setStatus(event.target.value)}>
                      {statusOption &&
                        statusOption().map((item: any, index) => (
                          <MenuItem value={item} key={index}>
                            {item}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <Typography gutterBottom>{format(timeslot.start2, 'MMMM dd H:mm')}</Typography>

                  <Typography gutterBottom>Price per person {timeslot.price}$</Typography>
                  <Typography gutterBottom>Final price {finalPrice}$</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField label="Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} />
                  <TextField label="Phone" variant="outlined" value={phone} onChange={(event) => setPhone(event.target.value)} />
                  <TextField label="Email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} />
                  <TextField label="Promo" variant="outlined" value={promo} onChange={(event) => setPromo(event.target.value)} />
                  <TextField label="Admin Comment" variant="outlined" value={comment} onChange={(event) => setComment(event.target.value)} />
                  <Typography gutterBottom>Customer Comment: {customerComment}</Typography>

                  <Button variant="contained" color={'error'} onClick={() => cancel()}>
                    Cancel
                  </Button>
                  <Button disabled={!finalPrice} variant="contained" onClick={() => submit()}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          {submitData && <>Saved</>}
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
