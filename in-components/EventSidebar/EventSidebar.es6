import { on } from 'reactive-observables';
import React from 'react';

import { selectedEventId$, selectedEvent$, selectedIncident$, selectedObjective$ } from 'in-stores/events';
import ObjectiveContent from 'in-views/eventView/components/Objective/Content';
import IncidentContent from 'in-views/eventView/components/Incident/Content';
import EventContent from 'in-views/eventView/components/Event/Content';
import { timelineHeight$ } from 'in-components/timeline/timelineStore';
import Header from 'in-components/EventSidebar/components/Header';
import { selectedSnapshot$ } from 'in-stores/snapshot';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/EventSidebar/EventSidebar.less';

const block = 'in-event-sidebar';

export default connectTo(
  {
    objective: selectedObjective$,
    snapshot: selectedSnapshot$,
    incident: selectedIncident$,
    event: selectedEvent$,
    eventId: selectedEventId$,
    timelineHeight: timelineHeight$,
    windowHeight: on(window, 'resize').map(() => window.innerHeight).startWithFn(() => window.innerHeight)
  },
  function EventSidebar({ snapshot, eventId, event, incident, objective, windowHeight, timelineHeight }) {
    if ((!incident && !event && !objective) || snapshot) {
      return null;
    }

    let content;
    if (incident) {
      content = <IncidentContent event={incident} />;
    } else if (objective) {
      content = <ObjectiveContent event={objective} />;
    } else {
      content = <EventContent event={event} />;
    }

    return (
      <div
        className={block}
        style={{
          maxHeight: toPx(windowHeight - timelineHeight - 150)
        }}
      >
        <Header eventId={eventId} />
        {content}
      </div>
    );
  }
);
