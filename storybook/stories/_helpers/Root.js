import React from 'react';

import locals from './Root.mless';

export default function Root({children, style}) {
  return (
    <div style={style} className={locals.root}>
      {children}
    </div>
  );
}
