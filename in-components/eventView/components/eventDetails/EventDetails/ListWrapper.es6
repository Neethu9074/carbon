import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/EventDetails/EventDetails';
import {formatTime} from 'in-services/formatters/date';

import './ListWrapper.less';


const block = 'in-event-view-event-details-list-wrapper';

export default function({event}) {
  return (
    <div className={block}
         id={`event-${event.get('id')}`}>
      <div className={`${block}__time-indicator`}>
        <div className={`${block}__time`}>
          {formatTime(event.get('start'))}
        </div>
        <div className={`${block}__line`} />
        <div className={`${block}__dot`} />
      </div>

      <div className={`${block}__right`}>
        <EventDetails event={event}
                      isCollapsable={true} />
      </div>
    </div>
  );
}
