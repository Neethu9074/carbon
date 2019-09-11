import React from 'react';

import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-event-view/navigation/paths';
import ViewSwitcher from 'in-event-view/ViewSwitcher';
import EventChart from 'in-event-view/EventChart';
import EventTable from 'in-event-view/EventTable';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function EventViewInternal({ location }) {
  const eventType = getMatrixParameter(location, eventsPath, 'view');
  const eventId = getMatrixParameter(location, eventsPath, 'eventId');

  return (
    <Sticky header={<SearchBar />}>
      <Title title="Events" />
      <Sticky header={<ViewSwitcher selectedEventType={eventType} darkTheme />}>
        <>
          {!eventId && <EventChart />}
          <EventTable eventType={eventType} selectedEventId={eventId} />
        </>
      </Sticky>
    </Sticky>
  );
}
