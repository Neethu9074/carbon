import React from 'react';

import EventDescription from 'in-components/EventDescription';

import locals from './EventListingPresenter.mless';

export default function EventListingPresenter({ snapshotId, events }) {
  if (!events) {
    return null;
  }

  events = events.sort((a, b) => a.get('severity') < b.get('severity'));

  return (
    <div>
      {events.map(event => (
        <EventDescription className={locals.item} key={event.get('id')} event={event} snapshotId={snapshotId} />
      ))}
    </div>
  );
}
