import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDescription from 'in-components/EventDescription';

import 'in-components/sidebars/Incident/components/Event.less';


const block = 'in-sidebar-incident-event';

export default function Event({event}) {
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
