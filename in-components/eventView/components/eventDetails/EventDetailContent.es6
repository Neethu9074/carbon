import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/eventDetails/EventDependecyGraph.es6';
import EventTraces from 'in-components/eventView/components/eventDetails/EventTraces.es6';
import EventChart from 'in-components/eventView/components/eventDetails/EventChart.es6';
import {toHtml} from 'in-services/formatters/markdown';
import SvgIcon from 'in-components/SvgIcon';

import './EventDetailContent.less';


const block = 'in-event-view-event-details-content';

export default function EventDetailsContent({event}) {
  const fixSuggestion = toHtml(event.getIn(['problem', 'fixSuggestion']));

  return (
    <div>
      <div className={`${block}`}>
        <SvgIcon className={`${block}__icon`}
                 type='info_filled'
                 width={20}
                 height={20}
                 color={'#7b8e96'} />

        <div className={`${block}__text-wrapper`}>
          <span className={`${block}__heading`}>
            Fix suggestion
          </span>
          <span className={`${block}__suggestion`}
                dangerouslySetInnerHTML={{__html: fixSuggestion}} />
        </div>
      </div>

      <EventChart event={event} />
      <EventDependecyGraph event={event} />
      <EventTraces event={event} />
    </div>
  );
}
