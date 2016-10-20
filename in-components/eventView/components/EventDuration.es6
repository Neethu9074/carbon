import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {formatDurationRaw} from 'in-services/formatters/date';
import {formatTime} from 'in-services/formatters/date';
import {serverTime$} from 'in-stores/serverTime';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  const end = props.event.get('end');

  return {
    config: serverTime$.flatMap(serverTime => fireCallbacksForEventAtFocusedMomentAsStream(props.event,
      ({focusedMoment}) => {
        return {
          to: focusedMoment ? end : serverTime,
          end: focusedMoment ? end : null
        };
      },
      () => {
        return {
          to: end,
          end
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
  return (
    <Tooltip content={'Duration of the event'}>
      <LabeledValue label={`${formatDurationRaw(config.to - from)}`}>
        {config.end
          ? `(${formatTime(config.end)})`
          : null
        }
      </LabeledValue>
    </Tooltip>
  );
});
