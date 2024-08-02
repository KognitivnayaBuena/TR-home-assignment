import React, { useState } from 'react';

import classes from "./Tooltip.module.css";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div
      className={classes.tooltip}
    >
      {children}
      <div className={classes["tooltip-content"]}>{content}</div>
    </div>
  );
};

export default Tooltip;