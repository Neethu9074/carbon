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

  return (
    <div className={block}>
      <div className={`${block}__counter`}>
        {`Events (${events.length})`}
      </div>

      <StartedMarker event={incident} />
      <List events={events} />
      <EndedMarker event={incident} />
    </div>
  );
});

function List({events}) {
  return (
    <div className={`${block}__timeline`}>
      {events.map(_event => <EventListItem key={_event.get('id')}
                                           event={_event} />)
      }
    </div>
  );
}
