import React from 'react';
import { initializeApollo } from "@services/graphql/conf/apollo";
import styles from "./index.module.scss";
import classNames from "classnames";
import { NextSeo } from 'next-seo';
import { tryParseJSONObject, tryParseJSONString, parseGraphQlResponse } from "../../../helpers/string";
import { IPage } from "@components/pages/type"
import { GetPage } from "@components/pages/graphql";
import { useTranslation, Trans } from 'next-i18next';
import { useQuery } from '@apollo/client'

const About: React.FC<IPage> = ({data}: any) => {
  const page = parseGraphQlResponse(data?.page)
  const { t, i18n } = useTranslation('common');

  const { data: ajaxData, loading, error } = useQuery(GetPage,{
    client: initializeApollo(i18n.language),
    ssr: false,
    variables: {
      slug: 'about',
    },
  })
  const ajaxData2 = parseGraphQlResponse(ajaxData?.page)

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error...</p>;

  return (
    <>
      <NextSeo
        title="About"
        description="About description"
      />

      <div className={styles.about}>
        <p>{ page?.id }</p>
        <p>{ page?.slug }</p>
        <p>{ page?.title }</p>

        {/*{qqq?.page.slug && !loading && (*/}
        {/*  <h2>useQuery: {qqq?.page.slug}</h2>*/}
        {/*)}*/}

        <p>ajaxData2.title: { ajaxData2?.title }</p>

        <p>t h1: {t('h1')}</p>

        <div className={classNames(styles.about, 'foo', 'bar')}>
          <div dangerouslySetInnerHTML={{ __html: page?.content?.description }}/>
        </div>
      </div>
    </>
  );
}

export default About;

export async function getServerSideProps(ctx: any, locale: any) {

  const apolloClient = initializeApollo(locale)

  const { data } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'about',
    },
  })

  return data;
}
