import React from 'react';

import {highlightEventId} from 'in-components/eventView/stores/highlightedEvent';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import EventIcon from 'in-components/EventIcon';
import connectTo from 'in-hoc/connectTo';

import './Event.less';


const block = 'in-event-view-detail-chart-event';

export default connectTo(props => {
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#92a5ae')
  };
},
function Event({event, scale, color}) {
  // clamp events so that they are not going beyond the borders of the chart.
  // If they would do, the incident start and end properties are wrongly calculated
  const left = scale.getRange(event.get('start'));

  const eventType = getEventType(event);
  const end = event.get('end');
  const right = end
    ? scale.getRange(end)

    // add 2 because we want to cut off the border of the events div
    : scale.getRangeTo() + 2;

  const barWidth = eventType === EVENT_TYPES.CHANGE ? 0 : right - left;

  return (
    <div className={block}
         style={{
           marginLeft: left,
           width: scale.getRangeTo() - left // use full width to make event small events clickable over the hole line
         }}
         onClick={() => onEventClick(event)}>

      <div className={`${block}__icon`}>
        <EventIcon event={event}
                   color={color}
                   size={10} />
      </div>

      {barWidth > 0
        ? <div className={`${block}__bar`}
               style={{
                 width: barWidth,
                 background: color
               }}>
          </div>
        : null
      }
    </div>
  );
});

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
