import React from "react";
import MainPage, { getServerSideProps as MainPageComponentGetServerSideProps } from "@components/pages/main-page";
import serverProps from "../src/lib/serverProps";
import Layout from "@components/layouts/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Home: React.FC = ({serverProps, data, ctx}: any) => {

  return (
    <Layout serverProps={serverProps}>
      <MainPage data={data}/>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps({ ctx, locale }: any) {
  return {
    props: {
      ...(await serverProps(locale)),
      ...(await serverSideTranslations(locale, ['common', 'menu'])),
      data: await MainPageComponentGetServerSideProps(ctx, locale)
    },
  }
}

