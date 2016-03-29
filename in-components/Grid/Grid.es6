import React from 'react';

import './Grid.less';

const rpt = React.PropTypes;

export const Row = ({children}) => <div className='grid__row'>{children}</div>;
Row.propTypes = {
  children: rpt.any
};


export const Col = ({offset, cols, children}) => {
  let classes = 'grid__col--' + cols;
  if (offset) {
    classes += ' grid__col-offset--' + offset;
  }

  return <div className={classes}>{children}</div>;
};
Col.propTypes = {
  offset: rpt.number,
  cols: rpt.number.isRequired,
  children: rpt.any
};
