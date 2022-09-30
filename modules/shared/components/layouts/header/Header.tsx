import React from 'react';
import styles from './index.module.scss';
import { GlobalContext } from '../../../../../pages/_app';
import classNames from 'classnames';
import { Menu } from '@modules/shared/components/layouts/header/Menu/Menu';
import LanguageSwitcher from '@modules/shared/components/layouts/header/LanguageSwitcher/LanguageSwitcher';
import Image from 'next/image';
import { useAuth } from "@modules/authentication/hooks/auth";
import Link from "next/link";
import { Button } from "@mui/material";

export const Header: React.FC = () => {
  const { logout } = useAuth({ middleware: 'guest' })
  const { auth } = useAuth({ middleware: 'guest' })

  return (
    <div className={styles.header}>
      <Image src="/icons/nextjs-icon.svg" alt="nextjs" width="96" height="58" />

      <Menu />

      <LanguageSwitcher />

      {auth?.isLoggedIn ? (
        <div>
          <span>{auth?.user?.name}</span>
          <Button onClick={logout}>logout</Button>
        </div>
        ) : (
          <Button href={'/login'}>login</Button>
      )}
    </div>
  );
};
