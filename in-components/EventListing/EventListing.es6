import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getEvent, getHealthInfoAtFocusedMoment } from 'in-stores/events';
import EventDescription from 'in-components/EventDescription';
import connectTo from 'in-hoc/connectTo';

import './EventListing.less';

const block = 'in-event-listing';

export default connectTo(
  props => {
    return {
      events: getEventsForEntityAtFocusedMoment(props.snapshotId)
    };
  },
  function EventListing({ snapshotId, events }) {
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
  }
);

function getEventsForEntityAtFocusedMoment(snapshotId) {
  return getHealthInfoAtFocusedMoment(snapshotId).flatMap(healthInfo =>
    combineLatest(healthInfo.get('eventIds').toArray().map(getEvent))
  );
}
