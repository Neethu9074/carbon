import React from 'react';

import IncidentContent from 'in-views/eventView/components/Incident/Content';
import EventContent from 'in-views/eventView/components/Event/Content';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {selectedEventId$, selectedEvent$} from 'in-stores/events';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './EventDetails.less';


const block = 'in-event-view-details';

export default connectTo({
  selectedEventId: selectedEventId$,
  event: selectedEvent$
},
function EventDetails({selectedEventId, event}) {
  if (!selectedEventId) {
    return <p className={`${block}__no-event-selected`}>No event selected.</p>;
  }

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
