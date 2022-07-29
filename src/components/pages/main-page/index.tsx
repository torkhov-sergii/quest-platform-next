import React from 'react';
import { GET_LAUNCHES } from "@components/pages/main-page/graphql";
import { getApolloClient } from "@services/graphql/conf/apolloClient";
import styles from "./index.module.scss";
import classNames from "classnames";
import { NextSeo } from 'next-seo';

interface IMainPage {
  data: any
}

const MainPage: React.FC<IMainPage> = ({data}) => {
  return (
    <>
      <NextSeo
        title="Simple Usage Example"
        description="A short description goes here."
      />
      <div className={styles.home}>
        <h1>main page</h1>
        <div className={classNames(styles.home, 'foo', 'bar')}>
          { data && data.map((val: any) => {
            return (
              <div key={val.mission_name}>
                <h3>{val.mission_name}</h3>
              </div>
            )
          }) }
        </div>
      </div>
    </>
  );
}

export default MainPage;

export async function getServerSideProps(ctx: any) {

  // const apolloClient = getApolloClient()
  //
  // const { data } = await apolloClient.query({
  //   query: GET_LAUNCHES,
  //   variables: {
  //     limit: 2,
  //   },
  // })

  let data = [
    {
      "mission_name": 'Mission 1',
    },
    {
      "mission_name": 'Mission 2',
    }
  ]

  return data;
}
