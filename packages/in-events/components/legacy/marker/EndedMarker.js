/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getEventType, EVENT_TYPES, fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import { formatDate, formatTime } from 'in-services/formatters/date';
import { alwaysNull } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

import './Marker.less';

export default connectTo(
  props => {
    // in theory, changes have an end date but we dont want to show it
    if (getEventType(props.event) === EVENT_TYPES.CHANGE) {
      return {
        isOpen: alwaysNull
      };
    }

    return {
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(
        props.event,
        () => true,
        () => false
      )
    };
  },
  function EndedMarker({ event, isOpen, justText }) {
    const timestamp = event.get('end');
    if (!timestamp || isOpen || isOpen == null) {
      return null;
    }

    if (justText) {
      return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
    }

    return (
      <LabeledValue label="ended">
        <span className="in-event-view-marker__time">{formatDate(timestamp)}</span>
        <span>{formatTime(timestamp)}</span>
      </LabeledValue>
    );
  }
);
