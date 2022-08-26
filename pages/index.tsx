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
import { Container, Grid, Paper, Slider } from '@mui/material';
import styles from '@styles/pages/home.module.scss';
import Button from '@mui/material/Button';
import classNames from 'classnames';
import { Room } from '@modules/room/types/room';
import { RoomCarousel } from '@modules/room/components/room-carousel/RoomCarousel';
import getLastArticlesService from '@modules/article/services/get-last-articles.service';
import { Article } from '@modules/article/types/article';
import { LastArticles } from '@modules/article/components/room-carousel/LastArticles';

type Props = {
  serverProps: any,
  page: any
  rooms: Room[],
  articles: Article[],
};

const Page: React.FC<Props> = ({ serverProps, page, rooms, articles }) => {
  const content = page && tryParseJSONObject(page.content);

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="Home" description="Home description" />

      <Container fixed>
        <div className={styles.home}>
          <h1>home</h1>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper>xs=8</Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper>xs=4</Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper>xs=4</Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper>xs=8</Paper>
            </Grid>
          </Grid>

          <Button variant="contained">Hello World Red</Button>

          <Button variant="contained" sx={{ width: 300 }} className={styles.button}>
            Hello World Green
          </Button>

          {/*Example - class for inside component thumb*/}
          <Slider
            defaultValue={30}
            className="slider"
            componentsProps={{ thumb: { className: 'thumb-qqq' } }}
          />


          <div className={classNames(styles.home, 'foo', 'bar')}>
            {page?.id}
            {page?.title}

            <div dangerouslySetInnerHTML={{ __html: content?.description }} />
          </div>
        </div>
      </Container>

      <Container>
        <RoomCarousel rooms={rooms}/>
      </Container>

      <Container>
        <LastArticles articles={articles}/>
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
      slug: 'home',
    },
  });

  return {
    props: {
      //...(await serverProps(locale)),
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      //...(await ChildrenGetServerSideProps(ctx, locale)),
      rooms: await getRoomsCarouselService(ctx, locale),
      articles: await getLastArticlesService(ctx, locale),
      page: page.page
    },
  };
}
