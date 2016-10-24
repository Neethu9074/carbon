import React from 'react';

import addSection from 'in-components/eventView/hocs/addSection';

import './EventTraces.less';


const block = 'in-event-details-traces';

export default addSection(function EventTraces({isProvided}) {
  if (!isProvided) {
    return null;
  }

  return (
    <div className={block}>
      Traces
    </div>
  );
});
