import React, { Fragment } from 'react';

import { getColor } from 'in-applications/endpointTypes';
import Pill from 'in-new-components/Pill';

import locals from './EndpointTypeBadgeList.mless';

export default function EndpointTypeBadgeList({ type, types }) {
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
          <Pill key={type} className={locals.badge} color={getColor(type)} kind="light">
            {type}
          </Pill>
        ))}
    </Fragment>
  );
}
