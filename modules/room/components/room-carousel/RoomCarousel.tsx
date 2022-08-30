import React from 'react';
import styles from './index.module.scss';
import { Room } from '../../types/room';
import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';

interface RoomCarouselProps {
  rooms: Array<Room>;
}

export const RoomCarousel: React.FC<RoomCarouselProps> = ({ rooms }) => {
  return (
    <>
      <div className={styles['room-carousel']}>
        <Typography variant="h2" component="div">
          YOU MAY ALSO LIKE
        </Typography>

        <Grid container spacing={2}>
        {rooms &&
          rooms.map((room: Room, index: number) => (
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
                </CardContent>
              </Card>
            </Grid>
          ))}
          </Grid>
      </div>
    </>
  );
};
