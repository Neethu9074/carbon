import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {formatDurationRaw} from 'in-services/formatters/date';
import {formatTime} from 'in-services/formatters/date';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';


export default connectTo(props =>{
  return {
    config: serverTime$.flatMap(serverTime => fireCallbacksForEventAtFocusedMomentAsStream(props.event,
      ({focusedMoment, severity}) => {
        return {
          to: focusedMoment ? props.event.get('end') : serverTime,
          end: focusedMoment ? props.event.get('end') : null,
          color: severity <= 0 ? '#92a5ae' : theme.health[severity]
        };
      },
      () => {
        return {
          to: props.event.get('end'),
          end: props.event.get('end'),
          color: '#92a5ae'
        };
      }
    )).distinct()
  };
},
function EventDuration({event, config}) {
  if (!config || getEventType(event) === EVENT_TYPES.CHANGE) {
    return null;
  }

  const from = event.get('start');

  return (
    <LabeledValue label={`${formatDurationRaw(config.to - from)}`}>
      {config.end
        ? <span>
            {`(${formatTime(config.end)})`}
          </span>
        : null
      }
    </LabeledValue>
  );
});
