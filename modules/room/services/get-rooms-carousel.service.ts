import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetRoomsCarousel } from '../graphql';

export default async function   getRoomsCarouselService(ctx: any, locale: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetRoomsCarousel,
    variables: {
    },
  });

  return data.rooms;
}
