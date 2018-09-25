import React from 'react';

import EntityWithParentInformation from 'in-components/EntityInformation/EntityWithParentInformation';
import { getTimeConfigFromEventForSnapshotRetrieval } from 'in-views/eventView/services/timeframe';
import EventDurationMarker from 'in-views/eventView/components/marker/EventDurationMarker';
import StartedMarker from 'in-views/eventView/components/marker/StartedMarker';
import EndedMarker from 'in-views/eventView/components/marker/EndedMarker';
import Header from 'in-views/eventView/components/Header';
import Marker from 'in-views/eventView/components/Marker';

import './Header.less';

const block = 'in-event-view-event-header';

export default function EventHeader({ event }) {
  const timeConfigFromEvent = getTimeConfigFromEventForSnapshotRetrieval(event);
  const entityId = event.get('entityId');
  const entityType = event.get('entityType');
  return (
    <Header heading={event.getIn(['problem', 'problemText'])} event={event}>
      <div>
        <EntityWithParentInformation entityId={entityId} entityType={entityType} timeConfig={timeConfigFromEvent} />

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
