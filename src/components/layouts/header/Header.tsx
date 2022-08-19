import React from 'react';
import styles from './index.module.scss';
import { GlobalContext } from '../../../../pages/_app';
import classNames from 'classnames';
import { Menu } from '@components/layouts/header/Menu/Menu';
import LanguageSwitcher from '@components/layouts/header/LanguageSwitcher/LanguageSwitcher';
import Image from "next/image";

export const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Image src="/icons/nextjs-icon.svg" alt="nextjs" width="96" height="58" />

      <Menu />

      <LanguageSwitcher />
    </div>
  );
};
