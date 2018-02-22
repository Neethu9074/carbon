import React from 'react';

import { getColor } from 'in-applications/endpointTypes';

import locals from './VerticalTypesIndicator.mless';

export default function VerticalTypesIndicator({ type, types }) {
  if (type && !types) {
    types = [type];
  }
  if (!types || types.length === 0) {
    return null;
  }

  return (
    <div className={locals.verticalTypesIndicator}>
      {types
        .slice()
        .sort()
        .map(type => <div key={type} style={{ background: getColor(type) }} className={locals.typeIndicator} />)}
    </div>
  );
}
