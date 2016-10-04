import React from 'react';

import {getIconTypeForEventType, getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Events.less';


const block = 'in-event-view-detail-chart-events';

export default connectTo({
  events: sortedRecentEvents$
},
function Events({scale, events}) {
  if (!events) {
    return (
      <div className={block}>
        <LoadingIndicator type='dark'
                          style={{
                            height: '1rem'
                          }} />
      </div>
    );
  }

  return (
    <div className={block}>
      {events.map(event => {
        return (
          <Event key={event.get('id')}
                 event={event}
                 scale={scale} />
        );
      })}
    </div>
  );
});


const Event = connectTo(props => {
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#92a5ae')
  };
},
({event, scale, color}) => {
  // clamp events so that they are not going beyond the borders of the chart. If they would do, the incident
  // start and end properties are wrongly calculated
  const left = Math.max(0, scale.getRange(event.get('start')));
  const eventType = getEventType(event);
  const right = (event.get('state') === 'open')
    ? Math.min(scale.getRange(event.get('end')), scale.getRangeTo())
    : scale.getRangeTo();
  const barWidth = eventType === EVENT_TYPES.CHANGE ? 0 : right - left;

  return (
    <div className={`${block}__event`}
         style={{
           marginLeft: left,
           width: scale.getRangeTo() - left
         }}>

      <Icon className={block + '__icon'}
            type={getIconTypeForEventType(eventType)}
            style={{color}} />

      {barWidth > 0
        ? <div className={block + '__bar'}
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
