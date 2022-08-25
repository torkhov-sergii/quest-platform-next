import { initializeApollo } from '@services/graphql/conf/apollo';
import { GetLastArticles } from '../graphql';

export default async function getLastArticlesService(ctx: any, locale: any) {
  const apolloClient = initializeApollo(locale);

  const { data } = await apolloClient.query({
    query: GetLastArticles,
    variables: {
      first: 3
    },
  });

  return data.articles?.data;
}
