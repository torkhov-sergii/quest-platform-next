import React from 'react';
import { GET_LAUNCHES } from "@components/pages/main-page/graphql";
import { getApolloClient } from "@services/graphql/conf/apolloClient";
import styles from "./index.module.scss";

interface IMainPage {
  data: any
}

const MainPage: React.FC<IMainPage> = ({data}) => {
  return (
    <div className={styles.home}>
      { data && data.launchesPast.map((val: any) => {
        return (
          <div key={val.mission_name}>
              <h3>{val.mission_name}</h3>
          </div>
        )
      }) }
    </div>
  );
}

export default MainPage;

export async function getServerSideProps(ctx: any) {

  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: GET_LAUNCHES,
    variables: {
      limit: 2,
    },
  })

  return data;
}
