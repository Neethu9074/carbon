import {combineLatest} from 'reactive-observables';
import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/CollapsableEventDetails';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import 'in-components/eventView/components/eventDetails/IncidentEventList.less';


const block = 'in-event-view-incident-event-list';

export default connectTo(props => {
  return {
    // HACK FOR FAKE EVENTS
    events: sortedRecentEvents$,
    events2: combineLatest(props.ids.map(id => getEvent(id)))
  };
},
function IncidentEventList({events}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  return (
    <div className={block}>
      <TimeMarker text='started' />
      {events.map(event => <EventDetails key={event.get('id')}
                                         event={event}
                                         isCollapsed={true} />)
      }
      <TimeMarker text='ended' />
    </div>
  );
});

function TimeMarker({text}) {
  return (
    <div className={`${block}__time-marker ${block}__time-marker__${text}`}>
      {text}
    </div>
  );
}
