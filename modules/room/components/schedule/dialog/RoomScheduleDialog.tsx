import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { format, addHours, add, parse } from 'date-fns';
import { Button, DialogContent, FormControl, Grid, InputLabel, MenuItem, TextField, Typography } from '@mui/material';
import { RoomCalendarDayTimeslot } from '@modules/room/types/calendar';
import { BootstrapDialog } from '@modules/shared/components/dialog/DialogContent';
import { Room } from '@modules/room/types/room';
import Select from '@mui/material/Select';
import { createTimeslot } from '@modules/timeslot/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { GetPage } from '@modules/page/graphql';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { i18n, useTranslation } from 'next-i18next';
import Link from 'next/link';

interface RoomScheduleDialogProps {
  room: Room
  timeslot: RoomCalendarDayTimeslot | null;
  timeslotClose: () => void;
}

export const RoomScheduleDialog: React.FC<RoomScheduleDialogProps> = ({ room, timeslot, timeslotClose }) => {
  const { i18n } = useTranslation();

  const [name, setName] = useState<string>('test')
  const [phone, setPhone] = useState<string>('123-456-789')
  const [email, setEmail] = useState<string>('test@test.com')
  const [promo, setPromo] = useState('')
  const [comment, setComment] = useState<string>('test comment')
  const [players, setPlayers] = useState<any>(room.players_from)

  const handleClose = () => {
    timeslotClose();
  };

  // const [handleSubmit, {data: submitData, loading: submitLoading, error: submitError}] = useMutation(createTimeslot, {
  //   client: initializeApollo(i18n.language),
  //   variables: {
  //     start: '2022-08-27 10:55:28',
  //     status: 'new',
  //   }
  // })

  const [handleSubmit, {data: submitData, loading: submitLoading, error: submitError}] = useMutation(createTimeslot)

  const submit = () => {
    handleSubmit({
      client: initializeApollo(i18n.language),
      variables: {
        room_id: room.id,
        // start: (date && timeslot) ? (format(date, 'Y-MM-dd') + ' ' + format(timeslot.time, 'H:mm:ss')) : null,
        // start: timeslot?.start,
        start: (timeslot) ? format(timeslot?.start, 'Y-MM-dd H:mm:ss') : null,
        status: 'new',
        players: players,
        price_final: 12345,
        price: timeslot?.price,
        players_from: room.players_from,
        players_to: room.players_to,
        order: {
          comment: "test"
        },
        customer: {
          email: email,
          name: name,
          phone: phone,
        }
      }
    })
  }

  // useEffect (() => {
  //   // Your code to triggered when we get the data from graphql
  //   if (submitData){
  //     console.log(submitData.createTimeslot);
  //   }
  // }, [submitData])

  const playersOption = () => (
    Array.from({length: room.players_to}, (_, i) => i + room.players_from)
  )

  // if (submitLoading) return (<>`Submitting...`</>);
  // if (submitError) return (<>`Submission error! ${submitError.message}`</>);

  return (
    <>
      <BootstrapDialog onClose={handleClose} open={!!timeslot}>
        <DialogContent>
          {timeslot && (
            <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="div">
                  {room?.title}
                </Typography>
                <Typography variant="h6" component="div">
                  {room?.location?.title}
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Players</InputLabel>
                  <Select value={players} label='Players' onChange={(event) => setPlayers(event.target.value)}>
                    {playersOption &&
                      playersOption().map((item: any, index) => (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <Typography gutterBottom>{format(timeslot.start, 'MMMM dd H:mm')}</Typography>

                <Typography gutterBottom>Price per person {timeslot.price}$</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} />
                <TextField label="Phone" variant="outlined" value={phone} onChange={(event) => setPhone(event.target.value)} />
                <TextField label="Email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} />
                <TextField label="Promo" variant="outlined" value={promo} onChange={(event) => setPromo(event.target.value)} />
                <TextField label="Comment" variant="outlined" value={comment} onChange={(event) => setComment(event.target.value)} />

                <Button variant="contained" onClick={() => submit()}>Book a Room</Button>
              </Grid>
            </Grid>
            </>
          )}

          {submitData && (
            <>
              <Link href={`/thanks-for-booking/${submitData?.createTimeslot?.order?.secret_key}`}>Thanks For Booking</Link>
            </>
          )}
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
