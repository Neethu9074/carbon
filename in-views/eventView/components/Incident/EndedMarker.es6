import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {formatDate, formatTime} from 'in-services/formatters/date';
import connectTo from 'in-hoc/connectTo';

import 'in-views/eventView/components/Incident/Marker.less';


export default connectTo(props => {
  return {
    isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
  };
},
function EndedMarker({event, isOpen}) {
  const timestamp = event.get('end');
  if (!timestamp || isOpen) {
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
});
