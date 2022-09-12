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
import getRoomsFilterService from '@modules/room/services/get-rooms-filter.service';
import { RoomsFilter } from '@modules/room/components/rooms-filter/RoomsFilter';
import getAdminRoomsFilterService from '@modules/admin/services/get-rooms-filter.service';
import { AdminRoomsFilter } from '@modules/admin/components/admin-rooms-filter/AdminRoomsFilter';

type Props = {
  serverProps: any;
  roomsFilter: Room[];
};

const PageAdminRoom: React.FC<Props> = ({ serverProps, roomsFilter }) => {
  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="Admin Moderate Rooms" description="Admin Moderate Rooms" />

      <Container>
        <Typography variant="h3" component="div">
          Admin Moderate Rooms
        </Typography>

        <AdminRoomsFilter rooms={roomsFilter} />
      </Container>
    </Layout>
  );
};

export default PageAdminRoom;

export async function getServerSideProps({ params, locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'room'])),
      roomsFilter: await getAdminRoomsFilterService(locale),
    },
  };
}
