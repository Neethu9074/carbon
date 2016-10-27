import React from 'react';

import './Marker.less';


const block = 'in-event-view-marker';

export default function Marker({event, className, label}) {
  const hasServiceImpact = event.getIn(['metadata', 'triggering']);
  if (!hasServiceImpact) {
    return null;
  }

  let name = block;
  if (className) {
    name += ` ${className}`;
  }

  return (
    <span className={name}>
      {label}
    </span>
  );
}
