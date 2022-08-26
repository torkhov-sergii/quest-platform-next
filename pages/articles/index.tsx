import React from 'react';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/about.module.scss';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Card, CardContent, Grid, Skeleton, Typography, Container } from '@mui/material';
import { GetLastArticles } from '@modules/article/graphql';
import { Article } from '@modules/article/types/article';
import Link from 'next/link';

type Props = {
  serverProps: any;
  articles: Array<Article>;
};

const About: React.FC<Props> = ({ serverProps, articles }) => {
  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="About" description="About description" />

      <Container fixed className={styles.articles}>
        <Typography variant="h2" component="div">
          Articles
        </Typography>

        <Grid container spacing={2}>
          {articles &&
            articles.map((article: Article, index: number) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={150} />

                    <Typography variant="h4" component="div">
                      <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default About;

export async function getServerSideProps({ ctx, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetLastArticles,
    variables: {
      first: 9999,
    },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      articles: data?.articles?.data,
    },
  };
}
