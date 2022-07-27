import React from 'react';
import { GET_LAUNCHES } from "@components/pages/main-page/graphql";
import { useQuery } from "@apollo/client";
import { GetLaunches, GetLaunchesVariables } from "@graphqlTypes/GetLaunches";
import { getApolloClient } from "@services/graphql/conf/apolloClient";

interface IMainPage {
  data: any
}

const MainPage: React.FC<IMainPage> = ({data}) => {
  // const {data : dataApollo, loading, error} = useQuery(GET_LAUNCHES, {
  //   ssr: true,
  //   variables: {
  //     limit: 2
  //   },
  // })

  return (
    <div>
      test

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
