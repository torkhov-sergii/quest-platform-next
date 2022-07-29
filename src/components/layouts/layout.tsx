import React from 'react'
import { Header, Footer } from "@components/scss";
import { GlobalContext } from "../../../pages/_app";

interface Layout {
  serverProps: any
}

const Layout: React.FC<Layout> = ({children, serverProps}) => {

  return (
    <>
      <GlobalContext.Provider value={serverProps}>
        <Header/>
        <div className={`env-${process.env.NEXT_PUBLIC_ENV_MODE}`}>
          {children}
        </div>
        <Footer/>
      </GlobalContext.Provider>
    </>
  );
};

export default Layout;
