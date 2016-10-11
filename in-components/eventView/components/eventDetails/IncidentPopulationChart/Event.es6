import React from 'react';

import {getIconTypeForEventType, getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {highlightEventId} from 'in-components/eventView/stores/highlightedEvent';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Event.less';


const block = 'in-event-view-detail-chart-event';

export default connectTo(props => {
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#92a5ae')
  };
},
function Event({event, scale, color}) {
  // clamp events so that they are not going beyond the borders of the chart. If they would do, the incident
  // start and end properties are wrongly calculated
  const left = Math.max(0, scale.getRange(event.get('start')));
  const eventType = getEventType(event);
  const end = event.get('end');
  const right = end
    ? Math.min(scale.getRange(event.get('end')), scale.getRangeTo())
    : scale.getRangeTo();
  const barWidth = eventType === EVENT_TYPES.CHANGE ? 0 : right - left;

  return (
    <div className={block}
         style={{
           marginLeft: left,
           width: scale.getRangeTo() - left
         }}
         onClick={() => onEventClick(event)}>

      <Icon className={`${block}__icon`}
            type={getIconTypeForEventType(eventType)}
            style={{color}} />

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

  const scrollElement = document.querySelector('.in-trace-view-tree');
  const spanElement = document.getElementById(`span-${eventId}`);
  if (!scrollElement || !spanElement) {
    return;
  }

  scrollElement.scrollTop = spanElement.offsetTop;
}
