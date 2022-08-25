import React from 'react';
import Layout from '@components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/about.module.scss';
import classNames from 'classnames';
import { tryParseJSONObject } from '../src/helpers/string';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@apollo/client';
import { GetPage } from '@modules/page/graphql';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from '@mui/material';

type Props = {
  serverProps: any,
  page: any
};

const About: React.FC<Props> = ({ serverProps, page }) => {
  const pageContent = tryParseJSONObject(page?.content);
  const { t, i18n } = useTranslation('common');

  // const {
  //   data: ajaxData,
  //   loading,
  //   error,
  // } = useQuery(GetPage, {
  //   client: initializeApollo(i18n.language),
  //   ssr: false,
  //   variables: {
  //     slug: 'about',
  //   },
  // });
  // const ajaxData2 = tryParseJSONObject(!loading && ajaxData?.page);
  // // <p>ajaxData2.title: {ajaxData2?.title}</p>

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="About" description="About description" />

      <Container fixed className={styles.about}>
        <Typography variant="h2" component="div">
          {page?.title}
        </Typography>

        <Typography>
          {pageContent?.description}
        </Typography>

        {/*<p>t h1: {t('h1')}</p>*/}

        {/*<div className={classNames(styles.about, 'foo', 'bar')}>*/}
        {/*  <div dangerouslySetInnerHTML={{ __html: pageContent?.description }} />*/}
        {/*</div>*/}
      </Container>
    </Layout>
  );
};

export default About;

export async function getServerSideProps({ ctx, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data: page } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'about',
    },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      page: page.page
    },
  };
}
