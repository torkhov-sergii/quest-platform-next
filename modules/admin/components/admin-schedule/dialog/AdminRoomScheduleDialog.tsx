import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { format, addHours, add, parse } from 'date-fns';
import { Button, DialogContent, FormControl, Grid, InputLabel, MenuItem, TextField, Typography } from '@mui/material';
import { RoomCalendarDayTimeslot } from '@modules/room/types/calendar';
import { BootstrapDialog } from '@modules/shared/components/dialog/DialogContent';
import { Room } from '@modules/room/types/room';
import Select from '@mui/material/Select';
import { cancelTimeslot, createTimeslot, GetFinalPrice, updateTimeslot } from "@modules/timeslot/graphql";
import { useMutation, useQuery } from '@apollo/client';
import { GetPage } from '@modules/page/graphql';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { i18n, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Timeslot } from '@modules/timeslot/types/timeslot';

interface AdminRoomScheduleDialogProps {
  timeslot: Timeslot;
  timeslotClose: () => void;
  updateTimeslotById: (int) => void
}

export const AdminRoomScheduleDialog: React.FC<AdminRoomScheduleDialogProps> = ({ timeslot, timeslotClose, updateTimeslotById }) => {
  const { i18n } = useTranslation();
  const apolloClient = initializeApollo(i18n.language);

  const [name, setName] = useState<string>(timeslot.order?.customer.name)
  const [phone, setPhone] = useState<string>(timeslot.order?.customer.phone)
  const [email, setEmail] = useState<string>(timeslot.order?.customer.email)
  const [promo, setPromo] = useState('')
  const [customerComment, setCustomerComment] = useState<string>(timeslot.order?.customer_comment)
  const [comment, setComment] = useState<string>(timeslot.order?.comment)
  const [players, setPlayers] = useState<any>(timeslot.players)
  const [status, setStatus] = useState<any>(timeslot.status)
  const [finalPrice, setfinalPrice] = useState<any>(null)

  const handleClose = () => {
    timeslotClose()
  };

  const [handleSubmit, {data: submitData, loading: submitLoading, error: submitError}] = useMutation(updateTimeslot)

  const submit = () => {
    handleSubmit({
      client: initializeApollo(i18n.language),
      variables: {
        id: timeslot.id,
        room_id: timeslot.room_id,
        start: (timeslot) ? format(timeslot?.start2, 'Y-MM-dd H:mm:ss') : null,
        status: status,
        players: players,
        price_final: finalPrice,
        order: {
          comment: comment,
          customer_comment: customerComment
        },
        customer: {
          email: email,
          name: name,
          phone: phone,
        }
      }
    })
  }

  const [handleCancel, {data: cancelData, loading: cancelLoading, error: cancelError}] = useMutation(cancelTimeslot)

  const cancel = () => {
    handleCancel({
      client: initializeApollo(i18n.language),
      variables: {
        id: timeslot.id,
      }
    }).then(handleClose)
  }

  useEffect (() => {
    updateTimeslotById(timeslot.id)
  }, [submitData, cancelData])

  // Calc final price
  useEffect (() => {
    setfinalPrice(null)

    apolloClient.query({
      query: GetFinalPrice,
      variables: {
        room_id: timeslot.room_id,
        start: (timeslot) ? format(timeslot?.start2, 'Y-MM-dd H:mm:ss') : null,
        players: players,
        price: timeslot?.price,
      },
      fetchPolicy: 'no-cache' //отключить кеширование этого запроса
    }).then(({data, loading}) => {
      setfinalPrice(data.finalPrice)
    })
  }, [players])

  const playersOption = () => (
    Array.from({length: timeslot.room.players_to}, (_, i) => i + timeslot.room.players_from)
  )

  const statusOption = () => (
    ['new', 'confirmed', 'technical', 'arrived', 'canceled']
  )

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

                <Typography variant="h4" component="div">
                  {timeslot.room?.title}
                </Typography>
                <Typography variant="h6" component="div">
                  {timeslot.room?.location?.title}
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

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={status} label='Status' onChange={(event) => setStatus(event.target.value)}>
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
                <TextField label="Customer Comment" variant="outlined" value={customerComment} onChange={(event) => setCustomerComment(event.target.value)} />

                <Button variant="contained" color={'error'} onClick={() => cancel()}>Cancel</Button>
                <Button disabled={!finalPrice} variant="contained" onClick={() => submit()}>Save</Button>
              </Grid>
            </Grid>
            </>
          )}

          {submitData && (
            <>
              Saved
            </>
          )}
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
