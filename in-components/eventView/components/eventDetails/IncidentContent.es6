import React from 'react';

import IncidentPopulationChart from
  'in-components/eventView/components/eventDetails/IncidentPopulationChart/IncidentPopulationChart';
import IncidentEventList from 'in-components/eventView/components/eventDetails/IncidentEventList';
import IncidentHeader from 'in-components/eventView/components/eventDetails/IncidentHeader';
import {emptyList} from 'in-services/fixedImmutables';


export default function IncidentContent({event}) {
  return (
    <div>
      <IncidentHeader event={event} />
      <IncidentPopulationChart incidentId={event.get('id')} />
      <IncidentEventList ids={event.get('recentEvents', emptyList)}/>
    </div>
  );
}
