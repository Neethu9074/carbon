import React from 'react';

import EventListItem from 'in-components/eventView/components/Incident/EventListItem';
import StartedMarker from 'in-components/eventView/components/Incident/StartedMarker';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import EndedMarker from 'in-components/eventView/components/Incident/EndedMarker';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import 'in-components/eventView/components/Incident/EventList.less';


const block = 'in-event-view-incident-event-list';

export default connectTo({
  events: sortedRecentEvents$
},
function IncidentEventList({events, incident}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  const triggeringProblemId = incident.getIn(['problem', 'id']);

  return (
    <div className={block}>
      <div className={`${block}__counter`}>
        {`Events (${events.length})`}
      </div>

      <StartedMarker event={incident} />
      <List events={events}
            triggeringProblemId={triggeringProblemId} />
      <EndedMarker event={incident} />
    </div>
  );
});

function List({events, triggeringProblemId}) {
  return (
    <div className={`${block}__timeline`}>
      {events.map(_event => <EventListItem key={_event.get('id')}
                                           triggeringProblemId={triggeringProblemId}
                                           event={_event} />)
      }
    </div>
  );
}
