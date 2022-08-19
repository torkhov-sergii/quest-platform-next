import React from 'react';
import { initializeApollo } from '@services/graphql/conf/apollo';
import styles from './index.module.scss';
import classNames from 'classnames';
import { NextSeo } from 'next-seo';
import { tryParseJSONObject, tryParseJSONString } from '../../../helpers/string';
import { IPage } from '@components/pages/type';
import { GetPage } from '@components/pages/graphql';
import { useTranslation, Trans } from 'next-i18next';
import { IMenu } from '@components/layouts/header/Menu/type';
import Link from 'next/link';

const Faq: React.FC<IPage> = ({ data }: any) => {
  const { page } = data;
  const pageContent = tryParseJSONObject(page?.content);
  //const { t, i18n } = useTranslation('common');

  return (
    <>
      <NextSeo title="Faq" description="Faq description" />

      <div className={styles.faq}>
        {pageContent?.faq &&
          pageContent?.faq?.map((item: any, index: number) => (
            <div key={index}>
              <div>{item.question}</div>
              <div>{item.answer}</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Faq;

export async function getServerSideProps(ctx: any, locale: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'faq',
    },
  });

  return data;
}
