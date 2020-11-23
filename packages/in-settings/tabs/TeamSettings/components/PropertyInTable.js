import React, { forwardRef } from 'react';

import locals from './PropertyInTable.mless';

export default forwardRef(function PropertyInTable({ label, value }, ref) {
  if (value) {
    return (
      <div className={locals.propertyContainer} ref={ref}>
        <span className={locals.propertyLabel}>{label}</span>
        <span className={locals.propertyValue}>{value.join ? value.join(', ') : value}</span>
      </div>
    );
  }
  return null;
});
