import React from 'react';
import {ReactElement, ReactNode} from 'react';
import { AppProps } from "next/app";
import "@styles/global.scss"
import { initializeApollo } from "@services/graphql/conf/apollo";
import { ApolloProvider } from "@apollo/client";
import { Provider } from 'react-redux'
import store from '@redux/store'
import type {NextPage} from 'next'
import Layout from "@components/layouts/layout";
import { ThemeProvider } from 'next-themes'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout,
}

function MyApp({Component, pageProps}: AppPropsWithLayout): JSX.Element {
  const apolloClient = initializeApollo(); //default
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <ApolloProvider client={ apolloClient }>
      <Provider store={ store }>
        <ThemeProvider themes={['red', 'blue']} forcedTheme={'red'}>
          {getLayout(
            <Component { ...pageProps } />
          )}
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default MyApp;
