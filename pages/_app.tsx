import React from 'react';
import { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app';
import '@styles/global.scss';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import store from '@redux/store';
import type { NextPage } from 'next';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation } from 'next-i18next';
import { StyledEngineProvider } from '@mui/material/styles';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const GlobalContext = React.createContext<any>({}); // for pass from json files
export const GlobalLayoutContext = React.createContext<any>({}); // for pass serverProps

// Глобальный контекст, не работает динамически и нужен build для изменения
import globalData from '@settings/menu.json';
let GlobalContextData = {
  menu: globalData.menu,
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const apolloClient = initializeApollo(); //default
  //const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <GlobalContext.Provider value={GlobalContextData}>
          <ThemeProvider themes={['red', 'blue']} forcedTheme={'red'}>
            {/*{getLayout(*/}
              {/*MUI CSS injection order https://mui.com/material-ui/guides/interoperability*/}
              <StyledEngineProvider injectFirst>
                <Component {...pageProps} />
              </StyledEngineProvider>
            {/*)}*/}
          </ThemeProvider>
        </GlobalContext.Provider>
      </Provider>
    </ApolloProvider>
  );
}

export default appWithTranslation(MyApp);
