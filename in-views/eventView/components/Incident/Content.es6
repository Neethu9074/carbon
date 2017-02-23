import React from 'react';

import ObjectiveViolationMessage from 'in-views/eventView/components/Incident/ObjectiveViolationMessage';
import PopulationChart from 'in-views/eventView/components/Incident/PopulationChart';
import EventList from 'in-views/eventView/components/Incident/EventList';
import Header from 'in-views/eventView/components/Incident/Header';
import Section from 'in-views/eventView/components/Section';
import {emptyList} from 'in-services/fixedImmutables';


export default function IncidentContent({event}) {
  return (
    <div>
      <Header event={event} />

      <Section>
        <ObjectiveViolationMessage event={event} />
      </Section>

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
