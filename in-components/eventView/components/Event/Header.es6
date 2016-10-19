import React from 'react';

import StartedMarker from 'in-components/eventView/components/Incident/StartedMarker';
import EntityInformation from 'in-components/eventView/components/EntityInformation';
import EventDuration from 'in-components/eventView/components/EventDuration';
import EventIcon from 'in-components/EventIcon';

import './Header.less';


const block = 'in-event-view-event-header';

export default function EventHeader({event}) {
  return (
    <div className={block}>
      <EventIcon event={event}
                 className={`${block}__icon`} />

      <div>
        <h1 className={`${block}__title`}>
          {event.getIn(['problem', 'problemText'])}
        </h1>
        <EntityInformation event={event} />

        <div style={{ height: '0.5rem' }} />
        <StartedMarker event={event} />
        <EventDuration event={event} />
      </div>
    </div>
  );
}
