import React from 'react';

import LegacyEventDetails from 'in-views/eventView/components/EventDetails';
import { getEvent } from 'in-stores/events';

import locals from './EventDetails.mless';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ eventId }) => ({
    event: eventId && getEvent(eventId)
  }),
  function EventDetails({ eventId, event, openItem }) {
    if (!eventId) {
      return null;
    }

    return (
      <div className={locals.wrapper} onClick={() => openItem('42')}>
        <LegacyEventDetails selectedEventId={eventId} event={event} />
      </div>
    );
  }
);
