import React from 'react';

import {changesAreVisible$, toggle} from 'in-views/eventView/stores/changesVisibilityStore';
import {sortedRecentEvents$} from 'in-views/eventView/stores/recentEventsStore';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-views/eventView/components/Incident/PopulationChart/ToggleChangesButton.less';


const block = 'in-event-view-toggle-changes-button';

export default connectTo({
  changesAreVisible: changesAreVisible$,
  events: sortedRecentEvents$
},
function ToggleChangesButton({events, changesAreVisible}) {
  if (!events) {
    return null;
  }

  let changesAreAvailable = false;
  for (let i = 0, length = events.length; i < length; i++) {
    const event = events[i];
    if (getEventType(event) === EVENT_TYPES.CHANGE) {
      changesAreAvailable = true;
      break;
    }
  }

  if (!changesAreAvailable) {
    return null;
  }

  return (
    <Button className={block}
            onClick={toggle}
            kind='secondary'>
      {changesAreVisible ? 'Hide changes' : 'Show changes'}
    </Button>
  );
});
