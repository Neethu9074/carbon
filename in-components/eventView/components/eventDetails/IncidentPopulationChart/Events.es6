import React from 'react';

import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import {getIconTypeForEventType, getEventType} from 'in-services/issueTracker';
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
  const left = scale.getRange(event.get('start'));
  const end = event.get('end');
  const right = end ? scale.getRange(end) : scale.getRangeTo();
  const width = right - left;

  const eventType = getEventType(event);

  return (
    <div className={`${block}__event`}
         style={{
           marginLeft: left,
           width
         }}>

      <Icon className={block + '__icon'}
            type={getIconTypeForEventType(eventType)}
            style={{color}} />

      <div className={block + '__bar'}
           style={{
             width,
             background: color
           }}>
      </div>
    </div>
  );
});
