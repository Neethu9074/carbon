import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/EventDetails';
import {eventsInTimeframe$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './IncidentEventList.less';


const block = 'in-event-incident-event-list';

export default function IncidentEventList({ids}) {
  return (
    <div className={block}>
      {ids.map(id => <EventDetailWrapper key={id}
                                         id={id} />)
      }
    </div>
  );
}

const EventDetailWrapper = connectTo({
  events: eventsInTimeframe$
},
function EventDetailWrapper({events, id}) {
  const event = getEventById(events, id);
  return event
    ? <EventDetails event={event}
                    isCollapsed={true} />
    : null;
});

function getEventById(events, id) {
  events = events.issues.concat(events.changes);
  for (let i = 0, length = events.length; i < length; i++) {
    const event = events[i];
    if (event.get('id') === id) {
      return event;
    }
  }
}
