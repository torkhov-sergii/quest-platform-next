import React from 'react';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/about.module.scss';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Card, CardContent, Grid, Skeleton, Typography, Container } from '@mui/material';
import { GetArticle } from '@modules/article/graphql';
import { Article } from '@modules/article/types/article';
import Link from 'next/link';
import { tryParseJSONObject } from '../../src/helpers/string';
import Image from "next/image";

type Props = {
  serverProps: any;
  article: Article;
};

const About: React.FC<Props> = ({ serverProps, article }) => {
  const pageContent = tryParseJSONObject(article?.content);

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="About" description="About description" />

      <Container fixed className={styles.article}>

        <Typography variant="h2" component="div">
          {article?.title}
        </Typography>

        { article.preview?.url &&
            <Image src={article.preview?.url} alt="" width={200} height={100} />
        }

        <Typography>
          {pageContent?.description}
        </Typography>

      </Container>
    </Layout>
  );
};

export default About;

export async function getServerSideProps({ params, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetArticle,
    variables: {
      column: 'SLUG',
      slug: params.slug
    },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      article: data.article,
    },
  };
}
