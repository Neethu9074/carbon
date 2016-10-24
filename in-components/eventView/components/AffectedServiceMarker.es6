import React from 'react';

import './AffectedServiceMarker.less';


const block = 'in-event-view-affected-service-marker';

export default function AffectedServiceMarker({className}) {
  let name = block;
  if (className) {
    name += ` ${className}`;
  }

  return (
    <span className={name}>
      service impact
    </span>
  );
}
