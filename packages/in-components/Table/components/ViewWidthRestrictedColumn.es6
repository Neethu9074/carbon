import React from 'react';

import locals from './ViewWidthRestrictedColumn.mless';

export default function ViewWidthRestrictedColumnContent({ width, children }) {
  return (
    <div
      className={locals.column}
      style={{
        maxWidth: `${width}vw`
      }}
    >
      {children}
    </div>
  );
}
