import {on} from 'reactive-observables';
import React from 'react';

import IncidentContent from 'in-components/eventView/components/Incident/Content';
import EventContent from 'in-components/eventView/components/Event/Content';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {selectedEvent$, selectedIncident$} from 'in-stores/events';
import Header from 'in-components/EventSidebar/components/Header';
import {selectedSnapshot$} from 'in-stores/snapshot';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/EventSidebar/EventSidebar.less';


const block = 'in-event-sidebar';

export default connectTo({
  snapshot: selectedSnapshot$,
  incident: selectedIncident$,
  event: selectedEvent$,
  timelineHeight: timelineHeight$,
  windowHeight: on(window, 'resize')
    .map(() => window.innerHeight)
    .startWithFn(() => window.innerHeight)
},
function EventSidebar({snapshot, event, incident, windowHeight, timelineHeight}) {
  if ((!incident && !event) || snapshot) {
    return null;
  }

  return (
    <div className={block}
         style={{
           maxHeight: toPx(windowHeight - timelineHeight - 150)
         }}>
      <Header eventId={event.get('id')} />
      {incident
        ? <IncidentContent event={incident} />
        : <EventContent event={event} />
      }
    </div>
  );
});
