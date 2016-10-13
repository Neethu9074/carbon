import React from 'react';

import ProblemDescription from 'in-components/eventView/components/ProblemDescription';
import Header from 'in-components/eventView/components/Event/Header';
import Section from 'in-components/eventView/components/Section';

import 'in-components/eventView/components/Event/Content.less';
// import EventDependecyGraph from 'in-components/eventView/components/EventDependecyGraph';
// import EventTraces from 'in-components/eventView/components/EventTraces';
// import EventChart from 'in-components/eventView/components/EventChart';


export default function EventContent({event}) {
  return (
    <div>
      <Section>
        <Header event={event} />
      </Section>

      <Section>
        <ProblemDescription event={event}
                            className='in-event-view-event-content' />
      </Section>

    </div>
  );
  // <Section>
  //   <EventChart event={event} />
  // </Section>
  //
  // <Section>
  //   <EventDependecyGraph event={event} />
  // </Section>
  //
  // <Section>
  //   <EventTraces event={event} />
  // </Section>
}
