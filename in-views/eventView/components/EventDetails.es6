import React from 'react';

import ObjectiveContent from 'in-views/eventView/components/Objective/Content';
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
  let content;
  if (eventType === EVENT_TYPES.INCIDENT) {
    content = <IncidentContent event={event} />;
  } else if (eventType === EVENT_TYPES.OBJECTIVE) {
    content = <ObjectiveContent event={event} />;
  } else {
    content = <EventContent event={event} />;
  }
  return (
    <div className={block}>
      {content}
    </div>
  );
});
