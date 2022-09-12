import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { format, addHours, add, parse } from 'date-fns';
import { Button, DialogContent, FormControl, Grid, InputLabel, MenuItem, TextField, Typography } from '@mui/material';
import { RoomCalendarDayTimeslot } from '@modules/room/types/calendar';
import { BootstrapDialog } from '@modules/shared/components/dialog/DialogContent';
import { Room } from '@modules/room/types/room';
import Select from '@mui/material/Select';
import { createTimeslot, updateTimeslot } from '@modules/timeslot/graphql';
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

  const [name, setName] = useState<string>(timeslot.order?.customer.name)
  const [phone, setPhone] = useState<string>(timeslot.order?.customer.phone)
  const [email, setEmail] = useState<string>(timeslot.order?.customer.email)
  const [promo, setPromo] = useState('')
  const [comment, setComment] = useState<string>(timeslot.order?.customer_comment)
  const [adminComment, setAdminComment] = useState<string>(timeslot.order?.comment)
  const [players, setPlayers] = useState<any>(timeslot.players)
  const [status, setStatus] = useState<any>(timeslot.status)

  const handleClose = () => {
    timeslotClose();
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
        price_final: 5555,
        order: {
          comment: adminComment,
          customer_comment: comment
        },
        customer: {
          email: email,
          name: name,
          phone: phone,
        }
      }
    })
  }

  useEffect (() => {
    updateTimeslotById(timeslot.id)
  }, [submitData])

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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} />
                <TextField label="Phone" variant="outlined" value={phone} onChange={(event) => setPhone(event.target.value)} />
                <TextField label="Email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} />
                <TextField label="Promo" variant="outlined" value={promo} onChange={(event) => setPromo(event.target.value)} />
                <TextField label="Comment" variant="outlined" value={comment} onChange={(event) => setComment(event.target.value)} />
                <TextField label="Admin Comment" variant="outlined" value={adminComment} onChange={(event) => setAdminComment(event.target.value)} />

                <Button variant="contained" onClick={() => submit()}>Save</Button>
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
