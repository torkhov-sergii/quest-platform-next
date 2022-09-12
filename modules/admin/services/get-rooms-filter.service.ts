import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetAdminRoomsFilter } from '../graphql';

export default async function   getAdminRoomsFilterService(locale: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetAdminRoomsFilter,
    variables: {
    },
    //fetchPolicy: 'no-cache' //отключить кеширование этого запроса https://github.com/harryheman/React-Total/blob/main/md/apollo/client.md
  });

  return data.rooms;
}
