import React from 'react';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/about.module.scss';
import { tryParseJSONObject } from '../src/helpers/string';
import { GetPage } from '@modules/page/graphql';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Container, Typography } from '@mui/material';
import ContactForm from '@modules/notification/components/contact-form/ContactForm';
import { GoogleMapComponent } from "@modules/location/components/google-map/GoogleMapComponent";
import getLastArticlesService from "@modules/article/services/get-last-articles.service";
import getLocationsService from "@modules/location/services/get-locations.service";
import { Location } from "@modules/location/types/location";

type Props = {
  serverProps: any;
  page: any;
  locations: Location[];
};

const Contact: React.FC<Props> = ({ serverProps, page, locations }) => {
  const pageContent = tryParseJSONObject(page?.content);

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="Contact page" description="Contact page description" />

      <Container fixed className={styles.contact}>
        <Typography variant="h2" component="div">
          {page?.title}
        </Typography>

        <Typography>{pageContent?.description}</Typography>

        <ContactForm />

        <GoogleMapComponent locations={locations}/>
      </Container>
    </Layout>
  );
};

export default Contact;

export async function getServerSideProps({ ctx, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data: page } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'contact',
    },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      locations: await getLocationsService(ctx, locale),
      page: page.page,
    },
  };
}
