import React, { forwardRef } from 'react';

import locals from './ViewWidthRestrictedColumn.mless';

export default forwardRef(function ViewWidthRestrictedColumnContent({ width, children }, ref) {
  return (
    <div
      className={locals.column}
      style={{
        maxWidth: `${width}vw`
      }}
      ref={ref}
    >
      {children}
    </div>
  );
});
