import irpt from 'react-immutable-proptypes';
import React from 'react';

import getEventsWithinTimerange from 'in-hoc/getEventsWithinTimerange';
import Event from 'in-components/sidebars/Incident/components/Event';


export default getEventsWithinTimerange(EventList);

function EventList({events}) {
  if (!events || events.size === 0) {
    return null;
  }

  return (
    <div>
      {events.map(event =>
        <Event key={event.get('id')}
               event={event} />
      )}
    </div>
  );
}

EventList.propTypes = {
  events: irpt.list
};
