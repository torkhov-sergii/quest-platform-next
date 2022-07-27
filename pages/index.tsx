import React from "react";

import { Header, Main, Cards, Footer } from "@components/scss";
import Counter from "@components/examples/counter"
import { EnvExample } from "@components/examples/env";
// import MainPage from "@components/pages/main-page";
import MainPage, { getServerSideProps as MainPageComponentGetServerSideProps } from "@components/pages/main-page";
import { useQuery } from "@apollo/client";
import { GetLaunches, GetLaunchesVariables } from "@graphqlTypes/GetLaunches";
import { GET_LAUNCHES } from "@components/pages/main-page/graphql";
import { getApolloClient } from '@services/graphql/conf/apolloClient'

const Home: React.FC = ({data, ctx}: any) => {
  return (
    <div
      style={ {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      } }
    >
      <Header/>

      <MainPage data={data}/>

      <Counter/>
      <EnvExample/>

      <Main/>
      <Cards/>
      <Footer/>
    </div>
  );
};

export default Home;

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      data: await MainPageComponentGetServerSideProps(ctx)
    }
  }
}
