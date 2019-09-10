import React from 'react';

import IncidentContent from 'in-views/eventView/components/Incident/Content';
import EventContent from 'in-views/eventView/components/Event/Content';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getEventType, EVENT_TYPES } from 'in-stores/events';

import './EventDetails.less';

const block = 'in-event-view-details';

export default function EventDetails({ selectedEventId, event }) {
  if (!selectedEventId) {
    return <p className={`${block}__no-event-selected`}>No event selected.</p>;
  }

  if (!event) {
    return <LoadingIndicator type="dark" />;
  }

  const eventType = getEventType(event);
  let content;
  if (eventType === EVENT_TYPES.INCIDENT) {
    content = <IncidentContent event={event} />;
  } else {
    content = <EventContent event={event} />;
  }
  return <div className={block}>{content}</div>;
}
