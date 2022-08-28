import React from 'react';
// import MainPage, { getServerSideProps as ChildrenGetServerSideProps } from '@pages/main-page';
// import serverProps from '../src/lib/serverProps';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetPage } from '@modules/page/graphql';
import getRoomsCarouselService from '../modules/room/services/get-rooms-carousel.service';
import { tryParseJSONObject } from '../src/helpers/string';
import { NextSeo } from 'next-seo';
import { Container, Grid, Paper, Slider, Typography } from '@mui/material';
import styles from '@styles/pages/home.module.scss';
import Button from '@mui/material/Button';
import classNames from 'classnames';
import { Room } from '@modules/room/types/room';
import { RoomCarousel } from '@modules/room/components/room-carousel/RoomCarousel';
import getLastArticlesService from '@modules/article/services/get-last-articles.service';
import { Article } from '@modules/article/types/article';
import { LastArticles } from '@modules/article/components/room-carousel/LastArticles';
import { RoomsFilter } from '@modules/room/components/rooms-filter/RoomsFilter';
import { useTranslation } from 'next-i18next';
import getRoomsFilterService from '@modules/room/services/get-rooms-filter.service';

type Props = {
  serverProps: any;
  page: any;
  roomsCarousel: Room[];
  roomsFilter: Room[];
  articles: Article[];
};

const Page: React.FC<Props> = ({ serverProps, page, roomsCarousel, roomsFilter, articles }) => {
  const content = page && tryParseJSONObject(page.content);
  // const { t } = useTranslation('room');

  // //example сброк кеша аполло
  // const apolloClient = initializeApollo('ru');
  // apolloClient.resetStore()

  // console.log(t('genres.0.title'));

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="Home" description="Home description" />

      <Container fixed className={styles.home}>
        <Typography variant="h2" component="div">
          {page?.title}
        </Typography>

        {/*<Button variant="contained">Hello World Red</Button>*/}

        {/*<Button variant="contained" sx={{ width: 300 }} className={styles.button}>*/}
        {/*  Hello World Green*/}
        {/*</Button>*/}

        {/*/!*Example - class for inside component thumb*!/*/}
        {/*<Slider defaultValue={30} className="slider" componentsProps={{ thumb: { className: 'thumb-qqq' } }} />*/}

        {/*<div className={classNames(styles.home, 'foo', 'bar')}>*/}
        {/*  <div dangerouslySetInnerHTML={{ __html: content?.description }} />*/}
        {/*</div>*/}
      </Container>

      <Container>
        <RoomsFilter rooms={roomsFilter} />
      </Container>

      <Container>
        <RoomCarousel rooms={roomsCarousel} />
      </Container>

      <Container>
        <LastArticles articles={articles} />
      </Container>
    </Layout>
  );
};

export default Page;

export async function getServerSideProps({ ctx, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data: page } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'homepage',
    },
  });

  return {
    props: {
      //...(await serverProps(locale)),
      ...(await serverSideTranslations(locale, ['common', 'menu', 'room'])),
      //...(await ChildrenGetServerSideProps(ctx, locale)),
      roomsCarousel: await getRoomsCarouselService(ctx, locale),
      roomsFilter: await getRoomsFilterService(ctx, locale),
      articles: await getLastArticlesService(ctx, locale),
      page: page.page,
    },
  };
}
