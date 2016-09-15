import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/EventDetails';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import './IncidentEventList.less';


const block = 'in-event-incident-event-list';

export default function IncidentEventList({ids}) {
  return (
    <div className={block}>
      {ids.map(id => <EventDetailWrapper key={id}
                                         eventId={id} />)
      }
    </div>
  );
}

const EventDetailWrapper = connectTo(props => {
  return {
    event: getEvent(props.eventId)
  };
},
function EventDetailWrapper({event}) {
  return event
    ? <EventDetails event={event}
                    isCollapsed={true} />
    : null;
});
