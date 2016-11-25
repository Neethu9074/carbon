import React from 'react';

import './Grid.less';

export const Row = ({children, className, onClick, style}) => {
  let classes = 'grid__row';
  if (className) {
    classes += ' ' + className;
  }

  return (
    <div className={classes}
         onClick={onClick}
         style={style}>
      {children}
    </div>
  );
};


export const Col = ({offset, cols, children, className, style}) => {
  let classes = 'grid__col--' + cols;
  if (offset) {
    classes += ' grid__col-offset--' + offset;
  }
  if (className) {
    classes += ' ' + className;
  }

  return <div className={classes} style={style}>{children}</div>;
};
