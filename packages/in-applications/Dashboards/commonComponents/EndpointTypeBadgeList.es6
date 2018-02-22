import React, { Fragment } from 'react';

import { getColor } from 'in-applications/endpointTypes';
import Badge from 'in-new-components/Badge';

import locals from './EndpointTypeBadgeList.mless';

export default function EndpointTypeBadgeList({ type, types, size }) {
  if (type && !types) {
    types = [type];
  }
  if (!types || types.length === 0) {
    return null;
  }

  return (
    <Fragment>
      {types
        .slice()
        .sort()
        .map(type => (
          <Badge key={type} className={locals.badge} color={getColor(type)} size={size}>
            {type}
          </Badge>
        ))}
    </Fragment>
  );
}
