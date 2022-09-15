import React from 'react';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/room/room.module.scss';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Card, CardContent, Grid, Skeleton, Typography, Container, Chip } from '@mui/material';
import { Article } from '@modules/article/types/article';
import Link from 'next/link';
import { tryParseJSONObject } from '../../src/helpers/string';
import { GetRoom } from '@modules/room/graphql';
import { Room } from '@modules/room/types/room';
import { Tag } from '@modules/tag/types/tag';
import { RoomSchedule } from '@modules/room/components/schedule/RoomSchedule';
import Image from "next/image";

type Props = {
  serverProps: any;
  room: Room;
};

const PageRoom: React.FC<Props> = ({ serverProps, room }) => {
  const pageContent = tryParseJSONObject(room?.content);

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="Room" description="About description" />

      <Container fixed className={styles.room}>
        <RoomSchedule room={room} />

        <Typography variant="h2" component="div">
          {room?.title}
        </Typography>

        { room.preview?.url &&
          <Image src={room.preview?.url} alt="" width={200} height={100} />
        }

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

        <Typography>{pageContent?.description}</Typography>

        { room.images.map((image, index) => (
            <Image key={index} src={image.url} alt="" width={100} height={50} />
        ))}
      </Container>
    </Layout>
  );
};

export default PageRoom;

export async function getServerSideProps({ params, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetRoom,
    variables: {
      column: 'SLUG',
      slug: params.slug,
    },
    //fetchPolicy: 'no-cache' //отключить кеширование этого запроса
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      room: data.room,
    },
  };
}
