import React from 'react';

import PopulationChart from 'in-components/eventView/components/eventDetails/PopulationChart';
import Content from 'in-components/eventView/components/eventDetails/Content';
import Header from 'in-components/eventView/components/eventDetails/Header';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {eventsInTimeframe$} from 'in-stores/events';
import {selectedEventId$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './DetailPanel.less';


const block = 'in-event-view-detail-panel';

export default connectTo({
  selectedEventId: selectedEventId$,

  // event hack ahead: this one needs to be replaced with a "getSnapshot" for events logic
  events: eventsInTimeframe$
},
function DetailPanel({selectedEventId, events}) {
  if (!selectedEventId || !events) {
    return null;
  }

  const event = getEventById(events, selectedEventId);
  if (!event) {
    return null;
  }

  const eventType = getEventType(event);

  return (
    <div className={block}>
      {eventType === EVENT_TYPES.INCIDENT
        ? [
          <Header key='header'
                  event={event} />,
          <PopulationChart key='chart'
                           event={event} />,
          <Content key='content'
                   event={event} />
        ]
        : <Content event={event} />
      }
    </div>
  );
});

function getEventById(events, id) {
  events = events.incidents.concat(events.issues).concat(events.changes);
  for (let i = 0, length = events.length; i < length; i++) {
    const event = events[i];
    if (event.get('id') === id) {
      return event;
    }
  }
}
