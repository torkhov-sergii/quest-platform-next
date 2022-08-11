import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from 'next/router'
import styles from "./index.module.scss";

function LanguageSwitcher() {
  const {i18n} = useTranslation();
  const router = useRouter();

  // const changeLanguage = (nextLanguage: any) => {
  //   i18n.changeLanguage(nextLanguage)
  // };

  return (
    <div>
      {/*<select*/ }
      {/*  value={ i18n.language }*/ }
      {/*  onChange={ (e) =>*/ }
      {/*    changeLanguage(e.target.value)*/ }
      {/*  }*/ }
      {/*>*/ }
      {/*  <option value="en">en</option>*/ }
      {/*  <option value="ru">ру</option>*/ }
      {/*</select>*/ }

      <div className={ styles.language_switcher }>
        <Link href={ router.pathname } locale="en">
          <a>en</a>
        </Link>

        <Link href={ router.pathname } locale="ru">
          <a>ru</a>
        </Link>
      </div>
    </div>
  );
}

export default LanguageSwitcher;
