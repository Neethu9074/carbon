import React from 'react';

import EventDetailsContent from 'in-components/eventView/components/eventDetails/EventDetailContent';
import Section from 'in-components/eventView/components/eventDetails/Section';


export default function EventContent({event}) {
  return (
    <Section>
      <EventDetailsContent event={event} />
    </Section>
  );
}
