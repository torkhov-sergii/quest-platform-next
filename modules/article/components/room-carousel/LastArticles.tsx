import React from 'react';
import styles from './index.module.scss';
import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';
import { Article } from '@modules/article/types/article';

interface LastArticlesProps {
  articles: Array<Article>;
}

export const LastArticles: React.FC<LastArticlesProps> = ({ articles }) => {
  return (
    <>
      <div className={styles['last-articles']}>
        <Typography variant="h2" component="div">
          OUR BLOG
        </Typography>

        <Grid container spacing={2}>
        {articles &&
          articles.map((article: Article, index: number) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton animation="wave" variant="rectangular" width={'100%'} height={150} />

                  <Typography variant="h4" component="div">
                    <Link href={article.slug}>{article.title}</Link>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          </Grid>
      </div>
    </>
  );
};
