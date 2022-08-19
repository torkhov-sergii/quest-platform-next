import React from 'react';
import styles from './index.module.scss';
import { GlobalContext } from '../../../../../pages/_app';
import Link from 'next/link';
import { IMenu } from '@components/layouts/header/Menu/type';
import { useTranslation } from 'next-i18next';

export const Menu: React.FC = () => {
  //const {mainMenu} = React.useContext<any>(GlobalLayoutContext); // example - get serverProps
  //const { menu } = React.useContext<any>(GlobalContext); // example get from settings json
  const { t } = useTranslation('menu');

  const header: Array<any> = t('header', { returnObjects: true });

  return (
    <>
      <ul className={styles.menu}>
        {header &&
          header.map((item: IMenu, index: number) => (
            <li key={index}>
              <Link href={item.link}>
                <a>{item.name}</a>
              </Link>
            </li>
          ))}
      </ul>

      {/*<ul className={ styles.menu }>*/}
      {/*  { menu && menu.header?.map((item: IMenu, index: number) => (*/}
      {/*    <li key={ index }>*/}
      {/*      <Link href={ item.link }>*/}
      {/*        <a>{ item.name }</a>*/}
      {/*      </Link>*/}
      {/*    </li>*/}
      {/*  )) }*/}
      {/*</ul>*/}
    </>
  );
};
