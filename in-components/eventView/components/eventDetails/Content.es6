import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/EventDetails';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {emptyList} from 'in-services/fixedImmutables';
import {eventsInTimeframe$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';


export default function Content({event}) {
  const eventType = getEventType(event);

  return eventType === EVENT_TYPES.INCIDENT
    ? <EventDetailList ids={event.get('recentEvents', emptyList)}/>
    : <EventDetails event={event}/>;
}

function EventDetailList({ids}) {
  return (
    <div>
      {ids.map(id => <EventDetailWrapper key={id}
                                         id={id} />)}
    </div>
  );
}

const EventDetailWrapper = connectTo({
  events: eventsInTimeframe$
}, function EventDetailWrapper({events, id}) {
  const event = getEventById(events, id);
  return event
    ? <EventDetails event={event} />
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
