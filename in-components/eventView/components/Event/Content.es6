import React from 'react';

import ProblemDescription from 'in-components/eventView/components/ProblemDescription';
import EventChart from 'in-components/eventView/components/EventChart';
import Header from 'in-components/eventView/components/Event/Header';
import Section from 'in-components/eventView/components/Section';

import 'in-components/eventView/components/Event/Content.less';
// import EventDependecyGraph from 'in-components/eventView/components/EventDependecyGraph';
// import EventTraces from 'in-components/eventView/components/EventTraces';


export default function EventContent({event}) {
  return (
    <div>
      <Header event={event} />

      <Section>
        <ProblemDescription event={event}
                            className='in-event-view-event-content' />
      </Section>

      <Section>
        <EventChart event={event} />
      </Section>
    </div>
  );
  //
  // <Section>
  //   <EventDependecyGraph event={event} />
  // </Section>
  //
  // <Section>
  //   <EventTraces event={event} />
  // </Section>
}
