import React from 'react';

import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import EventChart from 'in-events/components/EventChart';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
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
