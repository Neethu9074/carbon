import React from 'react';

import {eventFilter$, FILTER} from 'in-components/eventView/stores/eventFilterStore';
import EventFilterBar from 'in-components/eventView/components/EventFilterBar';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {events$} from 'in-components/eventView/stores/eventsStore';
import connectTo from 'in-hoc/connectTo';

import './EventListHeader.less';


const block = 'in-event-view-event-list-header';

export default connectTo({
  events: events$,
  eventFilter: eventFilter$
},
function EventListHeader({events, eventFilter}) {
  return (
    <ViewHeader className={block}>
      <div className={`${block}__left-side`}>
        <h1 className={`${block}__title`}>
          {eventFilter === FILTER.INCIDENTS
            ? `Incidents (${events.incidents.length})`
            : `Events (${events.issues.length + events.changes.length})`
          }
        </h1>
        <EventFilterBar />
      </div>
    </ViewHeader>
  );
});
