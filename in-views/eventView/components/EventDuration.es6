import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {formatDate, formatTime} from 'in-services/formatters/date';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {formatDurationRaw} from 'in-services/formatters/date';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import 'in-views/eventView/components/Incident/Marker.less';


export default connectTo(props => {
  const end = props.event.get('end');

  return {
    config: serverTime$.flatMap(serverTime => fireCallbacksForEventAtFocusedMomentAsStream(props.event,
      ({focusedMoment}) => {
        return {
          to: focusedMoment ? end : serverTime,
          end: focusedMoment ? end : null,
          isOpen: true
        };
      },
      () => {
        return {
          to: end,
          end,
          isOpen: false
        };
      }
    ))
  };
},
function EventDuration({event, config}) {
  // in theory, changes have a duration but we dont want to show it
  if (!config || getEventType(event) === EVENT_TYPES.CHANGE) {
    return null;
  }

  const from = event.get('start');

  if (config.isOpen) {
    return (
      <LabeledValue label='duration'>
        {`${formatDurationRaw(config.to - from)}`}
      </LabeledValue>
    );
  }

  return (
    <LabeledValue label='ended'>
      <span className='in-event-view-marker__time'>
        {formatDate(config.end)}
      </span>
      <span>
        {formatTime(config.end)}
      </span>
    </LabeledValue>
  );
});
