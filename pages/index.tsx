import React from "react";
import MainPage, { getServerSideProps as MainPageComponentGetServerSideProps } from "@components/pages/main-page";

const Home: React.FC = ({data, ctx}: any) => {
  return (
    <>
      <MainPage data={data}/>
    </>
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
