import React from 'react';

import './ContentHeading.less';

const block = 'in-dashboard__content-heading';

export default function ContentHeading({ children, className }) {
  let classes = block;
  if (className) {
    classes = `${classes} ${className}`;
  }
  return (
    <h2 className={classes}>
      {children}
    </h2>
  );
}
