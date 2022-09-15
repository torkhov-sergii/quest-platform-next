import React from 'react';
import styles from './index.module.scss';
import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import Link from 'next/link';
import { Article } from '@modules/article/types/article';
import Image from "next/image";

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
                  <div style={{width: '100%', height: '100px', position: 'relative'}}>
                    { article.preview?.url ? (
                        <Image src={article.preview?.url} alt="" width={'100%'} height={100} layout="fill" objectFit="cover" />
                      )
                      : (
                        <Skeleton animation="wave" variant="rectangular" width={'100%'} height={100} />
                      )
                    }
                  </div>

                  <Typography variant="h4" component="div">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
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
