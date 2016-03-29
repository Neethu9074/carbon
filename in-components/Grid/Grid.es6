import React from 'react';

import './Grid.less';

export const Row = ({children}) => <div className='grid__row'>{children}</div>;
Row.propTypes = {
  children: React.PropTypes.any
};


export const Col = ({offset, cols, children}) => {
  let classes = 'grid__col--' + cols;
  if (offset) {
    classes += ' grid__col-offset--' + offset;
  }

  return <div className={classes}>{children}</div>;
};
Col.propTypes = {
  offset: React.PropTypes.number,
  cols: React.PropTypes.number.isRequired,
  children: React.PropTypes.any
};
