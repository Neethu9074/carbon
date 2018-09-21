import React from 'react';

import './Marker.less';

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
  const eventType = event.get('entityType');

  if (eventType === 'App20' || eventType === 'Service20' || eventType === 'Endpoint20') {
    return true;
  }

  return event.get('affectedService') != null;
}
