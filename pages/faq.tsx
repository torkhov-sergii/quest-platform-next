import React from 'react';
import serverProps from '../src/lib/serverProps';
import Layout from '@modules/shared/components/layouts/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import styles from '@styles/pages/faq.module.scss';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetPage } from '@modules/page/graphql';
import { tryParseJSONObject } from '../src/helpers/string';
import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from '@mui/material';

type Props = {
  serverProps: any,
  page: any
};

const Faq: React.FC<Props> = ({ serverProps, page }) => {
  const pageContent = tryParseJSONObject(page?.content);

  return (
    <Layout serverProps={serverProps}>
      <NextSeo title="Faq" description="Faq description" />

      <Container fixed className={styles.faq}>
        <Typography variant="h2" component="div">
          FAQ
        </Typography>

        {pageContent?.faq &&
          pageContent?.faq?.map((item: any, index: number) => (
            <Accordion key={index}>
              <AccordionSummary
              >
                <Typography>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
      </Container>
    </Layout>
  );
};

export default Faq;

export async function getServerSideProps({ ctx, locale }: any) {
  const apolloClient = initializeApollo(locale);

  const { data: page } = await apolloClient.query({
    query: GetPage,
    variables: {
      slug: 'faq',
    },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      page: page.page
    },
  };
}
