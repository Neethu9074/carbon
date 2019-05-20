import React from 'react';

import PopulationChart from 'in-views/eventView/components/Incident/PopulationChart';
import EventList from 'in-views/eventView/components/Incident/EventList';
import Header from 'in-views/eventView/components/Incident/Header';
import Section from 'in-views/eventView/components/Section';

export default function IncidentContent({ event }) {
  return (
    <div>
      <Header event={event} />

      <Section>
        <PopulationChart incidentId={event.get('id')} />
      </Section>

      <Section>
        <EventList incident={event} />
      </Section>
    </div>
  );
}
