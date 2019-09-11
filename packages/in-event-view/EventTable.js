import { combineLatest } from 'reactive-observables';
import { compose } from 'recompose';
import { findIndex } from 'lodash';
import React from 'react';

import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import { eventIdUrlParameter } from 'in-event-view/navigation/urlParameters';
import createRawEventsObservable from 'in-subscription/rawEvents';
import EventDetails from 'in-event-view/EventDetails';
import { timeConfig$ } from 'in-stores/time/config';
import EventsList from 'in-event-view/EventsList';
import { query$ } from 'in-stores/search/query';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withUrlState({
    bind: [eventIdUrlParameter],
    reducerName: 'onChange'
  }),
  connectTo(({ eventType }) => ({
    rawEventList: combineLatest([timeConfig$, query$]).flatMap(([timeConfig, query]) =>
      createRawEventsObservable({
        timeConfig,
        query: concatQueries(query, eventType),
        sortByField: 'start',
        sortMode: 'DESC',
        offset: 0,
        size: 200
      })
    )
  }))
)(EventTable);

function EventTable(props) {
  const { selectedEventId, rawEventList, items, onChange } = props;
  if (!rawEventList) {
    return null;
  }

  function onItemClicked(eventId) {
    onChange({ eventId: selectedEventId === eventId ? null : eventId });
  }

  if (!selectedEventId) {
    return <EventsList rawEventList={rawEventList} onItemClicked={onItemClicked} />;
  }

  return (
    <NavigatorSplitScreen
      {...props}
      items={rawEventList}
      navigator={
        <EventsList selectedEventId={selectedEventId} rawEventList={rawEventList} onItemClicked={onItemClicked} />
      }
      typeLabel="event"
      openItemIndex={findIndex(items, item => item.event.id === selectedEventId)}
    >
      <EventDetails selectedEventId={selectedEventId} />
    </NavigatorSplitScreen>
  );
}

function concatQueries(userQuery, eventFilter) {
  if (userQuery && eventFilter) {
    return `(${userQuery}) AND (event.type:${eventFilter})`;
  } else if (!userQuery && eventFilter) {
    return `event.type:${eventFilter}`;
  } else if (userQuery && !eventFilter) {
    return userQuery;
  }
  return '';
}
