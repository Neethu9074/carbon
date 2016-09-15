import irpt from 'react-immutable-proptypes';
import React from 'react';

import Event from 'in-components/sidebars/Incident/components/Event';
import {emptyList} from 'in-services/fixedImmutables';


export default function EventList({incident}) {
  if (!incident) {
    return null;
  }

  return (
    <div>
      {incident.get('recentEvents', emptyList).map(id =>
        <Event key={id}
               eventId={id} />
      )}
    </div>
  );
}

EventList.propTypes = {
  incident: irpt.map
};
