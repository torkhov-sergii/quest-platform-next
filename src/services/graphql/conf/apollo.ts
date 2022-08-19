//next + apollo + ssr https://blog.codepen.io/2021/09/01/331-next-js-apollo-server-side-rendering-ssr/

import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  uri: process.env.NEXT_PUBLIC_ENV_APP_GRAPHQL,
  cache: new InMemoryCache(),
});

const createApolloClientRu = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  uri: process.env.NEXT_PUBLIC_ENV_APP_GRAPHQL + '?locale=ru',
  cache: new InMemoryCache(),
});

export const initializeApollo = (locale?: any) => {
  // TODO найти лучшее решение
  if (locale === 'ru') {
    return createApolloClientRu;
  }
  if (locale === 'en') {
    return createApolloClient;
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return createApolloClient;
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = createApolloClient;
  }

  return apolloClient;
};
