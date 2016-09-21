import React from 'react';

import './EventTraces.less';


const block = 'in-event-details-traces';

export default function EventTraces({isProvided}) {
  if (!isProvided) {
    return null;
  }

  return (
    <div className={block}>
      Traces
    </div>
  );
}
