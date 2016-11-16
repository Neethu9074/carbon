import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {formatDate, formatTime} from 'in-services/formatters/date';

import 'in-views/eventView/components/Incident/Marker.less';


export default function StartedMarker({event}) {
  const timestamp = event.get('start');

  return (
    <LabeledValue label='started'>
      <span className='in-event-view-marker__time'>
        {formatDate(timestamp)}
      </span>
      <span>
        {formatTime(timestamp)}
      </span>
    </LabeledValue>
  );
}
