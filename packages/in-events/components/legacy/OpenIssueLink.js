import React from 'react';

import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import Button from 'in-new-components/Button';

export default function OpenIssueLink({ event }) {
  const eventId = event?.get?.('id');
  const eventType = event.getIn(['type']);

  if (!eventId || eventType !== 'issue') return null;

  const eventsViewLinkForIssue = getEventsViewFilteredBy({ eventTypeFilter: 'issue', eventId });

  return (
    <Button kind="secondary" href$={eventsViewLinkForIssue} icon="lib_events_warning">
      Open Issue
    </Button>
  );
}
