import React from 'react';

import {
  getEventType,
  EVENT_TYPES,
  fireCallbacksForEventAtFocusedMomentAsStream,
  getColorByEvent
} from 'in-stores/events';
import { highlightEventId } from 'in-views/eventView/stores/highlightedEvent';
import EventIcon from 'in-components/EventIcon';
import connectTo from 'in-hoc/connectTo';

import './Event.less';

const block = 'in-event-view-detail-chart-event';

export default connectTo(
  props => {
    return {
      color: fireCallbacksForEventAtFocusedMomentAsStream(
        props.event,
        e => getColorByEvent({ event: e.event, focusedMoment: e.focusedMoment }),
        () => '#40535b'
      ),
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
    };
  },
  function Event({ event, scale, color, isOpen }) {
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

    const iconSize = 10;
    const barOffset = iconSize + 2;
    const end = event.get('end');
    const right = end || isOpen
      ? scale.getRange(end)
      : // add 2 because we want to cut off the border of the events div
        scale.getRangeTo() + 2;

    const barWidth = right - left;

    return (
      <div
        className={block}
        style={{
          marginLeft: left - barOffset,

          // use full width to make event small events clickable over the hole line
          width: scale.getRangeTo() - left + barOffset
        }}
        onClick={() => onEventClick(event)}
      >

        <div className={`${block}__icon`}>
          <EventIcon event={event} useAlternativeChangeIcon={false} size={iconSize} />
        </div>

        <div
          className={`${block}__bar`}
          style={{
            width: barWidth,
            background: color
          }}
        />
      </div>
    );
  }
);

function onEventClick(event) {
  const eventId = event.get('id');
  highlightEventId(eventId);

  const scrollElement = document.querySelector('.in-event-view-details');
  const eventElement = document.getElementById(`event-${eventId}`);

  if (!scrollElement || !eventElement) {
    return;
  }

  scrollElement.scrollTop = eventElement.offsetTop;
}
