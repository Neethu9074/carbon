import React from 'react';

import PopulationChart from 'in-components/eventView/components/Incident/PopulationChart';
import EventList from 'in-components/eventView/components/Incident/EventList';
import Header from 'in-components/eventView/components/Incident/Header';
import Section from 'in-components/eventView/components/Section';
import {emptyList} from 'in-services/fixedImmutables';


export default function IncidentContent({event}) {
  return (
    <div>
      <Header event={event} />

      <Section>
        <PopulationChart incidentId={event.get('id')} />
      </Section>

      <Section>
        <EventList incident={event}
                   ids={event.get('recentEvents', emptyList)} />
      </Section>
    </div>
  );
}
