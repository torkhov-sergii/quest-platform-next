import React from 'react';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/about.module.scss';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Card, CardContent, Grid, Skeleton, Typography, Container, Button, Chip } from '@mui/material';
import { GetOrder } from '@modules/shop/graphql';
import { Order } from '@modules/shop/types/order';
import { format } from 'date-fns';

type Props = {
  serverProps: any;
  order: Order;
  params: any;
};

const ThanksForBooking: React.FC<Props> = ({ serverProps, order, params }) => {
  console.log(order);

  return order && (
    <Layout serverProps={serverProps}>
      <NextSeo title="THANKS FOR BOOKING" description="THANKS FOR BOOKING description" />

      <Container fixed className={styles.articles}>
        <Typography variant="h2" component="div">
          THANKS FOR BOOKING
        </Typography>

        <Typography variant="h4" component="div">
          { order.number }
        </Typography>

        <Typography variant="h3" component="div">
          Order Timeslots:
        </Typography>
        {order &&
          order?.timeslots?.map((timeslot, index) => (
            <Card key={index}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="div">{ timeslot.room.title }</Typography>
                    <Typography component="div">{ timeslot.room.location.content.city }, { timeslot.room.location.content.address }</Typography>
                    <Typography component="div">{ timeslot.room.location.content.phone }</Typography>

                    <hr/>

                    <Typography component="div">{ timeslot.start }</Typography>
                    <Typography component="div">players: { timeslot.players }</Typography>
                    <Typography component="div">price_final: { timeslot.price_final }</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h5" component="div">Booking number: { timeslot.number }</Typography>
                    <Chip label={timeslot.status} size={'small'} />

                    <Typography variant="h5" component="div">ADDITIONAL INFORMATION</Typography>
                    <Typography component="div">name: { order.customer.name }</Typography>
                    <Typography component="div">phone: { order.customer.phone }</Typography>
                  </Grid>
                </Grid>

              </CardContent>

            </Card>
          ))}
      </Container>
    </Layout>
  );
};

export default ThanksForBooking;

export async function getServerSideProps({ params, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetOrder,
    variables: {
      column: 'SECRET_KEY',
      value: params.key,
    },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      order: data?.order,
      params: params,
    },
  };
}
