import React from 'react';

import EventDescription from 'in-components/EventDescription';
import getEvents from 'in-hoc/getEvents';

import './EventListing.less';

const block = 'in-event-listing';

export default getEvents(function EventListing({ snapshotId, events }) {
  if (!events) {
    return null;
  }

  events = events.sort((a, b) => a.get('severity') < b.get('severity'));

  return (
    <div>
      {events.map(event =>
        <EventDescription className={block + '__item'} key={event.get('id')} event={event} snapshotId={snapshotId} />
      )}
    </div>
  );
});
