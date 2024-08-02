import React from 'react';
import classes from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={`${classes.button} ${props.className}`}>
      <span className={classes["button-content"]}>{children}</span>
    </button>
  );
};
export default Button;
