import {combineLatest} from 'reactive-observables';
import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/EventDetails';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import './IncidentEventList.less';


const block = 'in-event-incident-event-list';

export default connectTo(props => {
  return {
    events: combineLatest(props.toArray().map(id => getEvent(id)))
  };
},
function IncidentEventList({events}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  return (
    <div className={block}>
      {events.map(event => <EventDetails key={event.get('id')}
                                         event={event}
                                         isCollapsed={true} />)
      }
    </div>
  );
});
