import React from 'react';

import EventListItem from 'in-views/eventView/components/Incident/EventListItem';
import { sortedRecentEvents$ } from 'in-views/eventView/stores/recentEventsStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import 'in-views/eventView/components/Incident/EventList.less';

const block = 'in-event-view-incident-event-list';

export default connectTo(
  {
    events: sortedRecentEvents$
  },
  function IncidentEventList({ events, incident }) {
    if (!events) {
      return <LoadingIndicator type="dark" />;
    }

    const triggeringProblemId = incident.getIn(['problem', 'id']);

    return (
      <div className={block}>
        <div className={`${block}__counter`}>
          {`Events (${events.length})`}
        </div>
        <List events={events} triggeringProblemId={triggeringProblemId} />
      </div>
    );
  }
);

function List({ events, triggeringProblemId }) {
  return (
    <div className={`${block}__timeline`}>
      {events.map(_event => (
        <EventListItem key={_event.get('id')} triggeringProblemId={triggeringProblemId} event={_event} />
      ))}
    </div>
  );
}
