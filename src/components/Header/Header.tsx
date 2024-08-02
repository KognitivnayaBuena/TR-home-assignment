import React from 'react';

import classes from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={classes.header}>
      <a href="/" className={classes["header-link"]}>
        <svg className={classes["header-logo"]} viewBox="0 0 74 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        </svg>
      </a>
    </header>
  );
};

export default Header;
