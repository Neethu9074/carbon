/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getEventType, EVENT_TYPES, fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import EventIcon from 'in-events/components/EventIcon';
import connectTo from 'in-hoc/connectTo';

import './Event.less';

const block = 'in-event-view-detail-chart-event';

export default connectTo(
  props => {
    return {
      background: getColorForEventAtFocusedMomentAsStream(props.event, { defaultColor: '#bababa' }),
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(
        props.event,
        () => true,
        () => false
      )
    };
  },
  function Event({ event, scale, isOpen, background }) {
    // clamp events so that they are not going beyond the borders of the chart.
    // If they would do, the incident start and end properties are wrongly calculated
    const left = scale.getRange(event.get('start'));
    const eventType = getEventType(event);

    if (eventType === EVENT_TYPES.CHANGE) {
      return (
        <div
          className={block}
          style={{
            marginLeft: left,
            marginBottom: 4,

            // use full width to make event small events clickable over the hole line
            width: scale.getRangeTo() - left
          }}
          onClick={() => onEventClick(event)}
        >
          <div className={`${block}__change`} />
        </div>
      );
    }

    const end = event.get('end');
    const right =
      end || isOpen
        ? scale.getRange(end)
        : // add 2 because we want to cut off the border of the events div
          scale.getRangeTo() + 2;

    const barWidth = right - left;

    return (
      <div
        className={block}
        style={{
          marginLeft: left,

          // use full width to make event small events clickable over the hole line
          width: scale.getRangeTo() - left
        }}
        onClick={() => onEventClick(event)}
      >
        <div className={`${block}__icon`}>
          <EventIcon event={event} disableColorCalculation size="xs" />
        </div>

        <div
          className={`${block}__bar`}
          style={{
            width: barWidth,
            background
          }}
        />
      </div>
    );
  }
);

function onEventClick(event) {
  const eventId = event.get('id');

  const scrollElement = document.querySelector('.in-event-view-details');
  const eventElement = document.getElementById(`event-${eventId}`);

  if (!scrollElement || !eventElement) {
    return;
  }

  scrollElement.scrollTop = eventElement.offsetTop;
}
