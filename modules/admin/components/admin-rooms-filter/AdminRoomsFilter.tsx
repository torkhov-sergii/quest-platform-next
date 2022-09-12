import React, { useCallback } from 'react';
import styles from './index.module.scss';
import { Room } from '../../../room/types/room';
import { Button, Card, CardContent, Chip, FormControl, Grid, InputLabel, MenuItem, Skeleton, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { RoomsFilterSelect } from '@modules/room/components/rooms-filter/rooms-filter-select/RoomsFilterSelect';
import { Box } from '@mui/system';
import { integer } from 'vscode-languageserver-types';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { AdminRoomSchedule } from '@modules/admin/components/admin-schedule/AdminRoomSchedule';

interface RoomsFilterProps {
  rooms: Array<Room>;
}

interface RoomTag {
  id: integer;
  title: string;
  selected: boolean;
}

export const AdminRoomsFilter: React.FC<RoomsFilterProps> = ({ rooms }) => {
  const { t } = useTranslation('room');

  const [dateFrom, setDateFrom] = React.useState<Date>(startOfDay(new Date())); //0 - january
  const [dateTo, setDateTo] = React.useState<Date>(addDays(endOfDay(new Date()), 6));

  const genres = t('genres', { returnObjects: true }) as [];
  const [genre, setGenre] = React.useState('');
  const genreOnSelect = (event: SelectChangeEvent) => {
    setGenre(event.target.value as string);
  };

  const players = t('players', { returnObjects: true }) as [];
  const [player, setPlayers] = React.useState('');
  const playersOnSelect = (event: SelectChangeEvent) => {
    setPlayers(event.target.value as string);
  };

  const difficulties = t('difficulties', { returnObjects: true }) as [];
  const [difficulty, setDifficulty] = React.useState('');
  const difficultyOnSelect = (event: SelectChangeEvent) => {
    setDifficulty(event.target.value as string);
  };

  const fears = t('fears', { returnObjects: true }) as [];
  const [fear, setFear] = React.useState('');
  const fearOnSelect = (event: SelectChangeEvent) => {
    setFear(event.target.value as string);
  };

  const locations = t('locations', { returnObjects: true }) as [];
  const [location, setLocation] = React.useState('');
  const locationOnSelect = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const initializeRoomTagsState = () =>
    rooms.map((item) => ({
      id: item.id,
      title: item.title,
      selected: false,
    }));
  let [roomTags, setRoomTags] = React.useState<RoomTag[]>(initializeRoomTagsState);
  const roomTagsRebuild = () => {
    setRoomTags([...roomTags]);
  };

  const roomsFiltered = () => {
    let selectedTags = roomTags.filter((tag) => tag.selected);

    let filter = (room) =>
      (player === '' || (room.players_from <= player && room.players_to >= player)) &&
      (genre === '' || room.genre === genre) &&
      (difficulty === '' || room.difficulty === difficulty) &&
      (fear === '' || room.fear === fear) &&
      (location === '' || room.location.slug === location) &&
      selectedTags.every((selectedTag) => selectedTags.find((tag) => tag.id === room.id)); //И

    return rooms.filter(filter);
  };

  const tagOnClick = (item) => {
    let index = roomTags.findIndex((room) => room.id == item.id);

    roomTags[index].selected = !roomTags[index].selected;

    roomTagsRebuild();
  };

  const getTagColor = (room) => (room.selected ? 'primary' : 'default');

  const clearFiltersOnClick = () => {
    setGenre('');
    setPlayers('');
    setDifficulty('');
    setFear('');
    setLocation('');

    roomTags.map((tag) => (tag.selected = false));
    roomTagsRebuild();
  };

  const isFilterShow = () => {
    return (genre || player || difficulty || fear || location || roomTags.some((tag) => tag.selected)) ?? true;
  };

  const nextScheduleHandle = () => {
    setDateFrom(addDays(dateFrom, 7))
    setDateTo(addDays(dateTo, 7))
  }

  const prevScheduleHandle = () => {
    setDateFrom(addDays(dateFrom, -7))
    setDateTo(addDays(dateTo, -7))
  }

  return (
    <>
      <div className={styles['room-filter']}>
        {roomTags && roomTags.map((room, index) => <Chip key={index} label={room.title} size={'small'} color={getTagColor(room)} onClick={() => tagOnClick(room)} />)}

        {isFilterShow() && (
          <Button variant="contained" onClick={clearFiltersOnClick}>
            Clear filters
          </Button>
        )}

        <Box sx={{ display: 'flex' }}>
          <RoomsFilterSelect value={genre} label="Genre" options={genres} selectChangeEvent={genreOnSelect} />
          <RoomsFilterSelect value={player} label="Players" options={players} selectChangeEvent={playersOnSelect} />
          <RoomsFilterSelect value={difficulty} label="Difficulty" options={difficulties} selectChangeEvent={difficultyOnSelect} />
          <RoomsFilterSelect value={fear} label="Fear Level" options={fears} selectChangeEvent={fearOnSelect} />
          <RoomsFilterSelect value={location} label="Location" options={locations} selectChangeEvent={locationOnSelect} />
        </Box>

        <Button variant="contained" onClick={() => {prevScheduleHandle()}}>prev</Button>
        <Button variant="contained" onClick={() => {nextScheduleHandle()}}>next</Button>

        {roomsFiltered().length ? (
          <>
            {rooms && roomsFiltered().map((room: Room, index: number) => (
              <Card key={index}>
                <CardContent>
                  <Typography variant="h3" component="div">
                    { room.title }
                  </Typography>

                  <AdminRoomSchedule key={index} room={room} dateFromJoint={dateFrom} dateToJoint={dateTo} />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Button variant="contained" onClick={clearFiltersOnClick}>
            Clear filters
          </Button>
        )}
      </div>
    </>
  );
};
