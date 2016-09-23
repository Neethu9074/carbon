import {combineLatest} from 'reactive-observables';
import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/CollapsableEventDetails';
import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

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
    <div>
      {events.map(event => <EventDetails key={event.get('id')}
                                         event={event}
                                         isCollapsed={true} />)
      }
    </div>
  );
});
