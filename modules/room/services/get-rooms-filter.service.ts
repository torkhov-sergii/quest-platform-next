import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetRoomsFilter } from '../graphql';

export default async function   getRoomsFilterService(ctx: any, locale: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetRoomsFilter,
    variables: {
    },
    //fetchPolicy: 'no-cache' //отключить кеширование этого запроса https://github.com/harryheman/React-Total/blob/main/md/apollo/client.md
  });

  return data.rooms;
}
