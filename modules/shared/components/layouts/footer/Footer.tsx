import React from 'react';
import styles from './index.module.scss';
import { Menu } from '@modules/shared/components/layouts/header/Menu/Menu';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <Image src="/icons/nextjs-icon.svg" alt="nextjs" width="96" height="58" />

      <Menu />
    </div>
  );
};
