import React from 'react';

import IncidentPopulationChart from 'in-components/eventView/components/eventDetails/IncidentPopulationChart';
import IncidentHeader from 'in-components/eventView/components/eventDetails/IncidentHeader';
import EventDetails from 'in-components/eventView/components/eventDetails/EventDetails';
import {emptyList} from 'in-services/fixedImmutables';
import {eventsInTimeframe$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';


export default function IncidentContent({event}) {
  return (
    <div>
      <IncidentHeader event={event} />
      <IncidentPopulationChart event={event} />
      {event.get('recentEvents', emptyList).map(id => <EventDetailWrapper key={id}
                                                                          id={id} />)}
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
