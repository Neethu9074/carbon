import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDescription from 'in-components/EventDescription';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/Incident/components/Event.less';


const block = 'in-sidebar-incident-event';

export default connectTo(props => {
  return {
    event: getEvent(props.eventId)
  };
}, Event);

function Event({event}) {
  if (!event) {
    return null;
  }

  return (
    <div className={block}>
      <EventDescription className={block + '__description'}
                        event={event}
                        snapshotId={event.getIn(['problem', 'snapshotId'], '')}/>
    </div>
  );
}

Event.propTypes = {
  event: irpt.map
};
