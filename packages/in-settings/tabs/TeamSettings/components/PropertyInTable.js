import React from 'react';

import locals from './PropertyInTable.mless';

export default function PropertyInTable({ label, value }) {
  if (value) {
    return (
      <div className={locals.propertyContainer}>
        <span className={locals.propertyLabel}>{label}</span>
        <span className={locals.propertyValue}>{value.join ? value.join(', ') : value}</span>
      </div>
    );
  }
  return null;
}
