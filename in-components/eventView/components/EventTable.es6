import React from 'react';

import {eventFilter$, FILTER} from 'in-components/eventView/stores/eventFilterStore';
import {shedEventList$} from 'in-components/eventView/stores/shedEventListStore';
import EventTableRow from 'in-components/eventView/components/EventTableRow';
import {isLoading$} from 'in-components/eventView/stores/isLoadingStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './EventTable.less';


const block = 'in-event-view-event-table';

export default connectTo({
  events: shedEventList$,
  eventFilter: eventFilter$,
  isInfiniteLoading: isLoading$
},
function EventTable({events, eventFilter}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  events = getEvents(events, eventFilter);

  return (
    <div className={block}>
      {events.map(event => {
        return (
          <EventTableRow key={event.get('id')}
                         activeEventFilter={eventFilter}
                         event={event} />
        );
      })}
    </div>
  );
});

function getEvents(events, eventFilter) {
  return eventFilter === FILTER.INCIDENTS
    ? events.incidents
    :  events.issues.concat(events.changes);
}
