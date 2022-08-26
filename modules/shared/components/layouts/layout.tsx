import React from 'react';
import { Header } from '@modules/shared/components/layouts/header/Header';
import { GlobalLayoutContext } from '../../../../pages/_app';
import { Footer } from '@modules/shared/components/layouts/footer/Footer';
import styles from './index.module.scss';

interface Layout {
  serverProps: any;
}

const Layout: React.FC<Layout> = ({ children, serverProps }) => {
  return (
    <>
      <GlobalLayoutContext.Provider value={serverProps}>
        <Header />

        <div className={styles.content}>
          <div className={`env-${process.env.NEXT_PUBLIC_ENV_MODE}`}>{children}</div>
        </div>

        <Footer/>
      </GlobalLayoutContext.Provider>
    </>
  );
};

export default Layout;
