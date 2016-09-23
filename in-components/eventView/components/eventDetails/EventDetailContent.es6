import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/eventDetails/EventDependecyGraph.es6';
import EventTraces from 'in-components/eventView/components/eventDetails/EventTraces.es6';
import EventChart from 'in-components/eventView/components/eventDetails/EventChart.es6';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {toHtml} from 'in-services/formatters/markdown';

import './EventDetailContent.less';


const block = 'in-event-view-event-details-content';

export default function EventDetailsContent({event}) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion']));

  return (
    <Section>
      <div>
        <span className={`${block}__problem-text`}>
          {event.get('title')}
        </span>

        <div className={`${block}__suggestion`}
             dangerouslySetInnerHTML={{__html: fixSuggestion}} />

        <EventChart event={event} />
        <EventDependecyGraph event={event} />
        <EventTraces event={event} />
      </div>
    </Section>
  );
}
