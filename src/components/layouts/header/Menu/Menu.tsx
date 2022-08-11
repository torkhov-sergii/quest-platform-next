import React from "react";
import styles from "./index.module.scss";
import { Logo } from "@components/scss";
import { GlobalContext } from "../../../../../pages/_app";
import Link from "next/link";
import { IMenu } from "@components/layouts/header/Menu/type";

export const Menu: React.FC = () => {
  //const {mainMenu} = React.useContext<any>(GlobalLayoutContext); // example - get serverProps
  const { menu } = React.useContext<any>(GlobalContext);

  return (
    <>
      <ul className={ styles.menu }>
        { menu && menu.header?.map((item: IMenu, index: number) => (
          <li key={ index }>
            <Link href={ item.link }>
              <a>{ item.name }</a>
            </Link>
          </li>
        )) }
      </ul>
    </>
  );
};
