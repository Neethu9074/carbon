import React from 'react';

import './Lettering.less';

const block = 'in-lettering';

export default function Lettering({ className }) {
  let classes = block;
  if (className) {
    classes = `${block} ${className}`;
  }

  return <div className={classes}>instana Inc.</div>;
}
