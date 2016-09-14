import React from 'react';

import IncidentContent from 'in-components/eventView/components/eventDetails/IncidentContent';
import EventContent from 'in-components/eventView/components/eventDetails/EventContent';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {eventsInTimeframe$} from 'in-stores/events';
import {selectedEventId$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './DetailPanel.less';


const block = 'in-event-view-detail-panel';

export default connectTo({
  selectedEventId: selectedEventId$,

  // event hack ahead: this one needs to be replaced with a "getSnapshot" for events logic
  events: eventsInTimeframe$
},
function DetailPanel({selectedEventId, events}) {
  if (!selectedEventId) {
    return null;
  }

  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  const event = getEventById(events, selectedEventId);
  if (!event) {
    return <LoadingIndicator type='dark' />;
  }

  const eventType = getEventType(event);

  return (
    <div className={block}>
      {eventType === EVENT_TYPES.INCIDENT
        ? <IncidentContent event={event} />
        : <EventContent event={event} />
      }
    </div>
  );
});

function getEventById(events, id) {
  events = events.incidents.concat(events.issues).concat(events.changes);
  for (let i = 0, length = events.length; i < length; i++) {
    const event = events[i];
    if (event.get('id') === id) {
      return event;
    }
  }
}
