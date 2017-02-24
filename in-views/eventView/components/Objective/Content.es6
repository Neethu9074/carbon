import React from 'react';

import EventList from 'in-views/eventView/components/Incident/EventList';
import Header from 'in-views/eventView/components/Objective/Header';
import Section from 'in-views/eventView/components/Section';


export default function ObjectiveContent({event}) {
  return (
    <div>
      <Header event={event} />

      <Section>
        {event.getIn(['problem', 'problemText'])}
      </Section>

      <Section>
        <EventList incident={event} />
      </Section>
    </div>
  );
}
