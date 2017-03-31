import React from 'react';

import './Lettering.less';

const block = 'in-lettering';

export default function Lettering({ className, onClick }) {
  let classes = block;
  if (className) {
    classes = `${block} ${className}`;
  }

  if (onClick) {
    classes = `${classes} ${block}--clickable`;
  }

  return (
    <div className={classes} onClick={onClick}>
      instana Inc.
    </div>
  );
}
