import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/eventDetails/EventDependecyGraph.es6';
import EventProblem from 'in-components/eventView/components/eventDetails/EventProblem.es6';
import EventTraces from 'in-components/eventView/components/eventDetails/EventTraces.es6';
import EventChart from 'in-components/eventView/components/eventDetails/EventChart.es6';

import './EventDetailContent.less';


const block = 'in-event-view-event-details-content';

export default function EventDetailContent({event}) {
  return (
    <div className={`${block}`}>
      <EventProblem event={event} />
      <EventChart event={event} />
      <EventDependecyGraph event={event} />
      <EventTraces event={event} />
    </div>
  );
}
