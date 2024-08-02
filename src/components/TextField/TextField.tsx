import React from 'react';

import classes from "./TextField.module.css";

interface TextFieldProps {
    type?: 'text' | 'number' | 'date';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string | React.ReactNode;
    className?: string;
  }

const TextField: React.FC<TextFieldProps> = ({ type = 'text', value, onChange, placeholder, label }) => {
  return (
    <div className={classes["text-field-container"]}>
        {label && <label className={classes["text-field-label"]}>{label}</label>}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={classes["text-field"]}
        />
    </div>)
};

export default TextField;
