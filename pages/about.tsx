import React from "react";
import About, { getServerSideProps as AboutComponentGetServerSideProps } from "@components/pages/about";
import serverProps from "../src/lib/serverProps";
import Layout from "@components/layouts/layout";

const Page: React.FC = ({serverProps, data, ctx}: any) => {

  return (
    <Layout serverProps={serverProps}>
      <About data={data}/>
    </Layout>
  );
};

export default Page;

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      ...(await serverProps(ctx)),
      data: await AboutComponentGetServerSideProps(ctx)
    },
  }
}

