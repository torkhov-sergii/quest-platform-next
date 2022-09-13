import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetLocations } from "../graphql";

export default async function getLocationsService(ctx: any, locale: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetLocations,
    variables: {
    },
  });

  return data.locations;
}
