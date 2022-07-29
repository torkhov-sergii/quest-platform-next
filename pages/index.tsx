import React from "react";
import MainPage, { getServerSideProps as MainPageComponentGetServerSideProps } from "@components/pages/main-page";
import serverProps from "../src/lib/serverProps";
import Layout from "@components/layouts/layout";

const Home: React.FC = ({serverProps, data, ctx}: any) => {

  return (
    <Layout serverProps={serverProps}>
      <MainPage data={data}/>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      ...(await serverProps(ctx)),
      data: await MainPageComponentGetServerSideProps(ctx)
    },
  }
}

