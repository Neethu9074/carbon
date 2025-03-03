/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TableLoadMoreRow } from '@instana/components';
import { RawEvent, TimeConfig } from '@instana/types';

// @ts-expect-error no typedef yet
import EventsListRow from 'in-events/components/EventsListRow.js';

import locals from './EventsNavItems.mless';

interface EventsNavItemsProps {
  items: RawEvent[];
  onItemClicked: (eventId: string) => void;
  selectedEventId?: string;
  canLoadMore: boolean;
  loadMore: () => void;
  timeConfig: TimeConfig;
}

// Side panel for the events list while showing a particular event.
// Breaks away from `isDenseList` for EventList.js
const EventsNavItems = (props: EventsNavItemsProps) => {
  const { items, onItemClicked, selectedEventId, loadMore, canLoadMore, timeConfig } = props;

  return (
    <div className={locals.container}>
      {items.map(event => (
        <EventsListRow
          event={event}
          selectedEventId={selectedEventId}
          isDenseList
          state={event.state}
          onItemClicked={onItemClicked}
          timeConfig={timeConfig}
        />
      ))}
      {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={2} />}
    </div>
  );
};

export default EventsNavItems;
