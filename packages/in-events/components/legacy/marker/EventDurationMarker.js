/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getEventType, EVENT_TYPES, fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { alwaysNull } from 'in-services/fixedStreams';
import { serverTime$ } from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
          ({ timeConfig }) => {
            return {
              to: timeConfig.focusedMoment ? end : serverTime,
              end: timeConfig.focusedMoment ? end : null,
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
        )
      )
    };
  },
  function EventDurationMarker({ event, config }) {
    if (!config) {
      return null;
    }

    return (
      <LabeledValue label={t('in-events:duration')}>{`${formatDurationAccurately(
        config.to - event.get('start'),
        1000
      )}`}</LabeledValue>
    );
  }
);
