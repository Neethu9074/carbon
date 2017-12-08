import React from 'react';

import { selectedEventId$, selectedEvent$, selectedIncident$ } from 'in-stores/events';
import IncidentContent from 'in-views/eventView/components/Incident/Content';
import EventContent from 'in-views/eventView/components/Event/Content';
import { timelineHeight$ } from 'in-components/timeline/timelineStore';
import Header from 'in-components/EventSidebar/components/Header';
import { selectedSnapshotId$ } from 'in-stores/snapshot';
import { debouncedResize$ } from 'in-services/browser';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/EventSidebar/EventSidebar.less';

const block = 'in-event-sidebar';

export default connectTo(
  {
    snapshotId: selectedSnapshotId$,
    incident: selectedIncident$,
    event: selectedEvent$,
    eventId: selectedEventId$,
    timelineHeight: timelineHeight$,
    windowHeight: debouncedResize$.map(() => window.innerHeight).startWithFn(() => window.innerHeight)
  },
  function EventSidebar({ snapshotId, eventId, event, incident, windowHeight, timelineHeight }) {
    if ((!incident && !event) || snapshotId) {
      return null;
    }

    let content;
    if (incident) {
      content = <IncidentContent event={incident} />;
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
