import React, { Fragment } from 'react';

import { getColor } from 'in-applications/typesTranslation/service';
import Badge from 'in-new-components/Badge';

import locals from './EndpointTypeBadgeList.mless';

export default function EndpointTypeBadgeList({ types }) {
  return (
    <Fragment>
      {types
        .slice()
        .sort()
        .map(type => (
          <Badge key={type} className={locals.badge} color={getColor(type)}>
            {type}
          </Badge>
        ))}
    </Fragment>
  );
}
