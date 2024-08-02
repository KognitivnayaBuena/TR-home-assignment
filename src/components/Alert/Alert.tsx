import React from 'react';

import classes from './Alert.module.css';

export enum AlertType {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info'
}

interface AlertProps {
    type: AlertType;
    message: string;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, ...props }) => {
    return (
        <div className={`${classes.alert} ${classes[`alert-${type}`]} ${props.className}`.trim()}>
            <div className={classes['icon-container']}>
                <i className="icon">i</i>
            </div>
            <span>{message}</span>
        </div>
    );
};

export default Alert;