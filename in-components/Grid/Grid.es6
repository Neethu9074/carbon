import React from 'react';

import './Grid.less';

const rpt = React.PropTypes;

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

Row.propTypes = {
  children: rpt.any,
  className: rpt.string,
  onClick: rpt.func
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

Col.propTypes = {
  offset: rpt.number,
  cols: rpt.number.isRequired,
  children: rpt.any,
  className: rpt.string
};
