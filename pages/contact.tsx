import React from 'react';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/about.module.scss';
import { tryParseJSONObject } from '../src/helpers/string';
import { GetPage } from '@modules/page/graphql';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Container, Typography } from '@mui/material';

type Props = {
  serverProps: any,
  page: any
};

const Contact: React.FC<Props> = ({ serverProps, page }) => {
  const pageContent = tryParseJSONObject(page?.content);

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="Contact page" description="Contact page description" />

      <Container fixed className={styles.contact}>

        <Typography variant="h2" component="div">
          {page?.title}
        </Typography>

        <Typography>
          {pageContent?.description}
        </Typography>

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
      page: page.page
    },
  };
}
