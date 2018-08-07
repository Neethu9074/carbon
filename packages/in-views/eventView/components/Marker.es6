import React from 'react';

import './Marker.less';

const block = 'in-event-view-marker';

export default function Marker({ event, className, label }) {
  if (!hasServiceOrApplicationImpact(event)) {
    return null;
  }

  let name = block;
  if (className) {
    name += ` ${className}`;
  }

  return <span className={name}>{label}</span>;
}

export function hasServiceOrApplicationImpact(event) {
  const eventType = event.get('entityType');

  if (eventType === 'Service20' || eventType === 'App20') {
    return true;
  }

  return event.get('affectedService') != null;
}
