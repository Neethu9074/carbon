import React from 'react';

import LegacyEventDetails from 'in-views/eventView/components/EventDetails';
import { getEvent } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import locals from './EventDetails.mless';

export default connectTo(
  ({ selectedEventId }) => ({
    event: getEvent(selectedEventId)
  }),
  function EventDetails({ selectedEventId, event }) {
    return (
      <div className={locals.wrapper}>
        <LegacyEventDetails selectedEventId={selectedEventId} event={event} />
      </div>
    );
  }
);
