import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import { fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { getEventType, EVENT_TYPES } from 'in-services/issueTracker';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { alwaysNull } from 'in-services/fixedStreams';
import { serverTime$ } from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './Marker.less';

export default connectTo(
  props => {
    // in theory, changes have a duration but we dont want to show it
    if (getEventType(props.event) === EVENT_TYPES.CHANGE) {
      return {
        config: alwaysNull
      };
    }

    const end = props.event.get('end');
    return {
      config: serverTime$.flatMap(serverTime =>
        fireCallbacksForEventAtFocusedMomentAsStream(
          props.event,
          ({ focusedMoment }) => {
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
  function EventDurationMarker({ event, config }) {
    if (!config) {
      return null;
    }

    return (
      <LabeledValue label="duration">
        {`${formatDurationAccurately(config.to - event.get('start'))}`}
      </LabeledValue>
    );
  }
);
