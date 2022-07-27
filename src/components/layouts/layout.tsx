import React, { ReactElement, useContext } from 'react'
// import {Header, Footer} from "@components/layout";
import { Header, Main, Cards, Footer } from "@components/scss";

const Layout: React.FC = ({children}) => {
  return (
    <>
      <Header/>
      <div className={`env-${process.env.NEXT_PUBLIC_ENV_MODE}`}>
        {children}
      </div>
      <Footer/>
    </>
  );
};

export default Layout;
