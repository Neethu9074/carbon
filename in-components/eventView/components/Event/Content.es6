import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-components/eventView/components/ProblemDescription';
import EventTraces from 'in-components/eventView/components/EventTraces';
import EventChart from 'in-components/eventView/components/EventChart';
import Header from 'in-components/eventView/components/Event/Header';

import 'in-components/eventView/components/Event/Content.less';


export default function EventContent({event}) {
  return (
    <div>
      <Header event={event} />

        <ProblemDescription event={event}
                            sectionized={true}
                            className='in-event-view-event-content' />

        <EventChart event={event}
                    sectionized={true} />

        <EventTraces event={event}
                    sectionized={true} />

        <EventDependecyGraph event={event}
                             sectionized={true} />
    </div>
  );
}
