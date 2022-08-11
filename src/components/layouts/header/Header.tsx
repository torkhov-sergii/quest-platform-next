import React from "react";
import styles from "./index.module.scss";
import { Logo } from "@components/scss";
import { GlobalContext } from "../../../../pages/_app";
import classNames from "classnames";
import { Menu } from "@components/layouts/header/Menu/Menu";
import LanguageSwitcher from "@components/layouts/header/LanguageSwitcher/LanguageSwitcher";

export const Header: React.FC = () => {
  return (
    <div className={ styles.header }>

      <Logo/>

      <Menu/>

      <LanguageSwitcher/>

    </div>
  );
};
