import Infinite from 'react-infinite';
import React from 'react';

import {rawEventList$, loadMoreRawEvents} from 'in-components/eventView/stores/rawEventListStore';
import EventTableRow from 'in-components/eventView/components/EventTableRow';
import {isLoading$} from 'in-components/eventView/stores/isLoadingStore';
import getElementDimensions from 'in-hoc/getElementDimensions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './EventTable.less';


const block = 'in-event-view-event-table';

export default getElementDimensions(connectTo({
  events: rawEventList$,
  isInfiniteLoading: isLoading$
}, EventTable));

function EventTable({events, height, isInfiniteLoading}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  if (!isInfiniteLoading && events.length === 0) {
    return (
      <div className={block}>
        <p className={`${block}__no-events`}>
          There are no events in the selected time window.
        </p>
      </div>
    );
  }

  return (
    <div className={block}>
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

function InfiniteTable({height, events, isInfiniteLoading}) {
  if (!height || events.length === 0) {
    return null;
  }

  return (
    <Infinite className={`${block}__scroll-area`}
              containerHeight={height - 24 /* Height of the header */}
              elementHeight={26}
              loadingSpinnerDelegate={<LoadingIndicator type='dark' />}
              infiniteLoadBeginEdgeOffset={height * 0.5}
              onInfiniteLoad={loadMoreRawEvents}
              isInfiniteLoading={isInfiniteLoading}>
      {events.map(event =>
        <EventTableRow key={event.id}
                       event={event} />
      )}
    </Infinite>
  );
}
