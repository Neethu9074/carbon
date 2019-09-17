import React from 'react';

import './Marker.less';

import { isAppDataEntityType } from 'in-services/entityUtils';
const block = 'in-event-view-marker';

export default function Marker({ event, className, label }) {
  if (!hasServiceImpact(event)) {
    return null;
  }

  let name = block;
  if (className) {
    name += ` ${className}`;
  }

  return <span className={name}>{label}</span>;
}

export function hasServiceImpact(event) {
  const entityType = event.get('entityType');
  return isAppDataEntityType(entityType);
}
