import {create} from 'reactive-observables';
import Infinite from 'react-infinite';
import React from 'react';

import {shedEventList$, loadMoreShedEvents} from 'in-components/eventView/stores/shedEventListStore';
import EventTableRow from 'in-components/eventView/components/EventTableRow';
import {isLoading$} from 'in-components/eventView/stores/isLoadingStore';
import getElementDimensions from 'in-hoc/getElementDimensions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './EventTable.less';


const block = 'in-event-view-event-table';

export default getElementDimensions(connectTo({
  // HACK FOR FAKE EVENTS
  events: create().startWith([{
    id: 'event1',
    start: '2016-05-01 16:15:12',
    end: '2016-05-01 16:15:12',
    title: 'this is a real shit problem',
    severity: 10
  }, {
    id: 'event2',
    start: '2016-05-01 16:15:12',
    end: '2016-05-01 16:15:12',
    title: 'this one is not so important',
    severity: 5
  }, {
    id: 'event3',
    start: '2016-05-01 16:15:12',
    end: '2016-05-01 16:15:12',
    title: 'forget this one',
    severity: 0
  }]),
  events2: shedEventList$,
  isInfiniteLoading: create().startWith(false),
  isInfiniteLoading2: isLoading$
}, EventTable));

function EventTable({events, height, isInfiniteLoading}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  return (
    <div className={block}>
      <NoEventsMessage events={events}
                       isInfiniteLoading={isInfiniteLoading} />
      <InfiniteTable height={height}
                     events={events}
                     isInfiniteLoading={isInfiniteLoading} />
    </div>
  );
}

const rpt = React.PropTypes;
EventTable.propTypes = {
  isInfiniteLoading: rpt.bool.isRequired,
  events: rpt.array.isRequired,
  height: rpt.number
};

function NoEventsMessage({events, isInfiniteLoading}) {
  if (!isInfiniteLoading && events.length > 0) {
    return null;
  }

  return (
    <p className={`${block}__no-events`}>
      There are no events in the selected time window.
    </p>
  );
}

function InfiniteTable({height, events, isInfiniteLoading}) {
  if (!height || events.length === 0 || isInfiniteLoading) {
    return null;
  }

  return (
    <Infinite className={`${block}__scroll-area`}
              containerHeight={height - 24 /* Height of the header */}
              elementHeight={26}
              loadingSpinnerDelegate={<LoadingIndicator type='dark' />}
              infiniteLoadBeginEdgeOffset={height * 0.5}
              onInfiniteLoad={loadMoreShedEvents}
              isInfiniteLoading={isInfiniteLoading}>
      {events.map(event =>
        <EventTableRow key={event.id}
                       event={event} />
      )}
    </Infinite>
  );
}
