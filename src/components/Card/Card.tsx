import React from 'react';

import classes from "./Card.module.css";

interface CardProps {
    children: string | React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className={classes.card}>{children}</div>;
};

export default Card;
