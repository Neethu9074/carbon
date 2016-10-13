import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {formatDate, formatTime} from 'in-services/formatters/date';

import 'in-components/eventView/components/Incident/Marker.less';


export default function EndedMarker({event}) {
  const timestamp = event.get('end');
  if (!timestamp) {
    return null;
  }

  return (
    <LabeledValue label='ended'>
      <span className='in-event-view-marker__time'>
        {formatDate(timestamp)}
      </span>
      <span>
        {formatTime(timestamp)}
      </span>
    </LabeledValue>
  );
}
