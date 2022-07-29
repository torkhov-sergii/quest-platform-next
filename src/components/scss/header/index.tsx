import React from "react";
import styles from "./index.module.scss";
import { Logo } from "@components/scss";
import { GlobalContext } from "../../../../pages/_app";
import classNames from "classnames";

export const Header: React.FC = () => {
  const {mainMenu} = React.useContext<any>(GlobalContext);

  return (
    <div className={ styles.header }>
      <div className={ classNames(styles.home, 'foo', 'bar') }>
        { mainMenu && mainMenu.launchesPast.map((val: any) => {
          return (
            <div key={ val.mission_name }>
              { val.mission_name }
            </div>
          )
        }) }
      </div>

      <Logo/>
    </div>
  );
};
