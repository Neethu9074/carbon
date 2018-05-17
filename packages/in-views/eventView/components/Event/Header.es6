import React from 'react';

import EventDurationMarker from 'in-views/eventView/components/marker/EventDurationMarker';
import StartedMarker from 'in-views/eventView/components/marker/StartedMarker';
import { getTimeConfigFromEvent } from 'in-views/eventView/services/timeframe';
import EndedMarker from 'in-views/eventView/components/marker/EndedMarker';
import EntityInformation from 'in-components/EntityInformation';
import Header from 'in-views/eventView/components/Header';
import Marker from 'in-views/eventView/components/Marker';

import './Header.less';

const block = 'in-event-view-event-header';

export default function EventHeader({ event, timeConfig }) {
  const timeConfigFromEvent = getTimeConfigFromEvent(event, timeConfig);
  return (
    <Header heading={event.getIn(['problem', 'problemText'])} event={event}>
      <div>
        <EntityInformation
          entityId={event.get('entityId')}
          entityType={event.get('entityType')}
          time={event.get('start')}
          timeConfig={timeConfigFromEvent}
        />

        <div className={`${block}__status-line`}>
          <Marker className={`${block}__affected-service-marker`} label="service impact" event={event} />
          <StartedMarker event={event} />
          <EndedMarker event={event} />
          <EventDurationMarker event={event} />
        </div>
      </div>
    </Header>
  );
}
