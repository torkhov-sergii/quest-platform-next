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

type Props = {
  serverProps: any,
  page: any
};

const About: React.FC<Props> = ({ serverProps, page }) => {
  // const { page } = data;
  const pageContent = tryParseJSONObject(page?.content);
  const { t, i18n } = useTranslation('common');

  const {
    data: ajaxData,
    loading,
    error,
  } = useQuery(GetPage, {
    client: initializeApollo(i18n.language),
    ssr: false,
    variables: {
      slug: 'about',
    },
  });
  const ajaxData2 = tryParseJSONObject(!loading && ajaxData?.page);


  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="About" description="About description" />

      <div className={styles.about}>
        <p>id- {page?.id}</p>
        <p>slug- {page?.slug}</p>
        <p>title- {page?.title}</p>

        {/*{qqq?.page.slug && !loading && (*/}
        {/*  <h2>useQuery: {qqq?.page.slug}</h2>*/}
        {/*)}*/}

        <p>ajaxData2.title: {ajaxData2?.title}</p>

        <p>t h1: {t('h1')}</p>

        <div className={classNames(styles.about, 'foo', 'bar')}>
          <div dangerouslySetInnerHTML={{ __html: pageContent?.description }} />
        </div>
      </div>
    </Layout>
  );
};

export default About;

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
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      page: page.page
    },
  };
}
