import React, { useCallback } from 'react';
import styles from './index.module.scss';
import { Room } from '../../types/room';
import {
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { RoomsFilterSelect } from '@modules/room/components/rooms-filter/rooms-filter-select/RoomsFilterSelect';
import { Tag } from '@modules/tag/types/tag';
import _ from 'lodash';
import { Box } from '@mui/system';

interface RoomsFilterProps {
  rooms: Array<Room>;
}

export const RoomsFilter: React.FC<RoomsFilterProps> = ({ rooms }) => {
  const { t } = useTranslation('room');

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

  // // useCallback example
  // const genreOnSelect = useCallback((event: SelectChangeEvent) => {
  //   setGenre(event.target.value as string);
  // }, []);

  let roomTags: Array<Tag> = [];
  rooms.map((room) => (roomTags = _.union(roomTags, room.tags)));
  let [roomTagsUniq, setRoomTagsUniq] = React.useState(_.uniqBy(roomTags, 'slug'));
  const roomTagsRebuild = (arr) => {
    setRoomTagsUniq([...arr]);
  };

  const roomsFiltered = () => {
    let selectedTags = roomTagsUniq.filter(tag => tag.selected === true);

    let filter = (room) =>
      (player === '' || (room.players_from <= player && room.players_to >= player)) &&
      (genre === '' || room.genre === genre) &&
      (difficulty === '' || room.difficulty === difficulty) &&
      (fear === '' || room.fear === fear) &&
      (location === '' || room.location.slug === location) &&
      selectedTags.every(selectedTag => room.tags.find((tag) => tag.slug === selectedTag.slug)); //И
      //room.tags.find(tag => (selectedTags.find(selectedTag => selectedTag.slug === tag.slug))) //Или

      return rooms.filter(filter)
  }

  const tagOnClick = (item) => {
    let index = roomTagsUniq.findIndex((tag) => tag.id == item.id);

    roomTagsUniq[index].selected = !roomTagsUniq[index].selected;

    roomTagsRebuild(roomTagsUniq);
  };

  const getTagColor = (tag) => (
    tag.selected ? 'primary' : 'default'
  )

  const clearFiltersOnClick = () => {
    setGenre('');
    setPlayers('');
    setDifficulty('');
    setFear('');
    setLocation('');

    roomTagsUniq.map((tag => tag.selected = false))
    roomTagsRebuild(roomTagsUniq);
  }

  const isFilterShow = () => {
    return (genre || player || difficulty || fear || location || roomTagsUniq.some((tag => tag.selected == true))) ?? true
  }

  return (
    <>
      <div className={styles['room-filter']}>

        {roomTagsUniq.map((tag: Tag, index) => (
          <Chip key={index} label={tag.title} size={'small'} color={getTagColor(tag)} onClick={() => tagOnClick(tag)} />
        ))}

        {isFilterShow() && (
          <Button variant="contained" onClick={clearFiltersOnClick}>Clear filters</Button>
        )}

        <Box sx={{ display: 'flex' }}>
          <RoomsFilterSelect value={genre} label="Genre" options={genres} selectChangeEvent={genreOnSelect} />
          <RoomsFilterSelect value={player} label="Players" options={players} selectChangeEvent={playersOnSelect} />
          <RoomsFilterSelect
            value={difficulty}
            label="Difficulty"
            options={difficulties}
            selectChangeEvent={difficultyOnSelect}
          />
          <RoomsFilterSelect value={fear} label="Fear Level" options={fears} selectChangeEvent={fearOnSelect} />
          <RoomsFilterSelect
            value={location}
            label="Location"
            options={locations}
            selectChangeEvent={locationOnSelect}
          />
        </Box>

        {roomsFiltered().length ? (
          <Grid container spacing={2}>
            {rooms &&
              roomsFiltered().map((room: Room, index: number) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Skeleton animation="wave" variant="rectangular" width={'100%'} height={150} />
                      <Typography variant="h4" component="div">
                        <Link href={`/room/${room.slug}`}>{room.title}</Link>
                      </Typography>
                      <Typography variant="h5" component="div">
                        {room.duration}min / {room.players_from}-{room.players_to} / {room.difficulty}/10
                      </Typography>
                      <Typography variant="h5" component="div">
                        genre: {room.genre}
                      </Typography>
                      <Typography variant="h5" component="div">
                        difficulty: {room.difficulty}
                      </Typography>
                      <Typography variant="h5" component="div">
                        fear: {room.fear}
                      </Typography>
                      <Typography variant="h5" component="div">
                        location: {room.location.slug}
                      </Typography>
                      <Typography variant="h5" component="div">
                        tags:
                        {room.tags.map((tag: Tag, index) => (
                          <Chip key={index} label={tag.title} size={'small'} />
                        ))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Button variant="contained" onClick={clearFiltersOnClick}>Clear filters</Button>
        )}

        <h1>---</h1>
      </div>
    </>
  );
};
