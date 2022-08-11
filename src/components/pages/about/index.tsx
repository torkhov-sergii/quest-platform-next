import React from 'react';
import { getApolloClient } from "@services/graphql/conf/apolloClient";
import styles from "./index.module.scss";
import classNames from "classnames";
import { NextSeo } from 'next-seo';
import { tryParseJSONObject } from "../../../helpers/string";
import { IPage } from "@components/pages/type"
import { GetPage } from "@components/pages/graphql";
import { useTranslation, Trans } from 'next-i18next';

const About: React.FC<IPage> = ({data}) => {
  const page = data.page;
  const content = page && tryParseJSONObject(page.content);
  const { t } = useTranslation('common');

  return (
    <>
      <NextSeo
        title="About"
        description="About description"
      />

      <div className={styles.about}>
        <h1>About</h1>

        <p>{t('h1')}</p>

        <Trans i18nKey='h1'>
          Then you may have a look at <a href='https://locize.com/blog/next-i18next/'>this blog post</a>.
        </Trans>

        <div className={classNames(styles.about, 'foo', 'bar')}>
          { page?.id }{ page?.title }

          <div dangerouslySetInnerHTML={{ __html: content?.description }}/>
        </div>
      </div>
    </>
  );
}

export default About;

export async function getServerSideProps(ctx: any) {

  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'about',
    },
  })

  return data;
}
