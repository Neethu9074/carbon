import React from 'react';

import EventDependecyGraph from 'in-views/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-views/eventView/components/ProblemDescription';
import EventTraces from 'in-views/eventView/components/EventTraces';
import EventChart from 'in-views/eventView/components/EventChart';
import Header from 'in-views/eventView/components/Event/Header';

import 'in-views/eventView/components/Event/Content.less';


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
