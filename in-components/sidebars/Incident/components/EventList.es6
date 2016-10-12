import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Event from 'in-components/sidebars/Incident/components/Event';
import {emptyList} from 'in-services/fixedImmutables';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';


export default function EventList({incident}) {
  if (!incident) {
    return null;
  }

  return (
    <List incident={incident} />
  );
}

EventList.propTypes = {
  incident: irpt.map
};

const List = connectTo(props => {
  return {
    events: combineLatest(props.incident.get('recentEvents', emptyList).toArray().map(id => getEvent(id)))
  };
},
function RecentEventList({events}) {
  if (!events) {
    return null;
  }

  return (
    <div>
      {events.sort((a, b) => a.get('start') - b.get('start'))
             .map(event => <Event key={event.get('id')}
                                  event={event} />
      )}
    </div>
  );
});
