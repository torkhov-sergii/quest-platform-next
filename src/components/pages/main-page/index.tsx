import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { NextSeo } from 'next-seo';
import { IPage } from '@components/pages/type';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetPage } from '@components/pages/graphql';
import { tryParseJSONObject } from '../../../helpers/string';
import Button from '@mui/material/Button';
import { Container, Grid, Paper } from '@mui/material';
import { Box } from '@mui/system';

const MainPage: React.FC<IPage> = ({ data }) => {
  const page = data.page;
  const content = page && tryParseJSONObject(page.content);

  return (
    <>
      <NextSeo title="Home" description="Home description" />

      <Container>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Paper>xs=8</Paper>
          </Grid>
          <Grid item xs>
            <Paper>xs=4</Paper>
          </Grid>
        </Grid>
      </Container>

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

          <Button variant="contained">Hello World</Button>

          <Button variant="contained" sx={{ width: 300 }} className={styles.button}>
            Hello World
          </Button>

          <div className={classNames(styles.home, 'foo', 'bar')}>
            {page?.id}
            {page?.title}

            <div dangerouslySetInnerHTML={{ __html: content?.description }} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default MainPage;

export async function getServerSideProps(ctx: any, locale: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'home',
    },
  });

  return data;
}
