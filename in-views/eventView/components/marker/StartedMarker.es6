import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {formatDate, formatTime} from 'in-services/formatters/date';

import './Marker.less';


export default function StartedMarker({event}) {
  const timestamp = event.get('start');
  const label = (getEventType(event) === EVENT_TYPES.CHANGE) ? 'time' : 'started';

  return (
    <LabeledValue label={label}>
      <span className='in-event-view-marker__time'>
        {formatDate(timestamp)}
      </span>
      <span>
        {formatTime(timestamp)}
      </span>
    </LabeledValue>
  );
}
