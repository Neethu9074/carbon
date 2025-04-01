/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { TableLoadMoreRow } from '@instana/components';
import { RawEvent, TimeConfig } from '@instana/types';
import { formatDateTime } from '@instana/format-date';
import { useObservable } from '@instana/hooks';

// @ts-expect-error no typedef for getEvent
import { getEvent, getEventSeverityLabelWithEventType } from 'in-stores/events';
import EventIcon from 'in-events/components/EventIcon';

import locals from './EventsNavItems.mless';

interface EventsNavItemsProps {
  items: RawEvent[];
  onItemClicked: (eventId: string) => void;
  selectedEventId?: string;
  canLoadMore: boolean;
  loadMore: () => void;
  timeConfig: TimeConfig;
}

interface EventListItemProps {
  event: RawEvent;
  key: string;
  timeConfig: TimeConfig;
  onItemClicked: (eventId: string) => void;
  active: boolean;
}

const EventListItem = ({ event, key, timeConfig, onItemClicked, active }: EventListItemProps) => {
  const updatedEventInfo = useObservable<RawEvent, any[]>(getEvent(event.id), [event]);
  const eventToUse = updatedEventInfo ? updatedEventInfo : event;
  return (
    <div
      key={key}
      className={classNames({
        [locals.item]: true,
        [locals.active]: active
      })}
      onClick={() => onItemClicked(event?.id || '')}
    >
      <EventIcon event={eventToUse} tooltipLabel={getEventSeverityLabelWithEventType(eventToUse, timeConfig)} />
      <div className={locals.titleContainer}>
        <p
          className={classNames({
            [locals.title]: true,
            [locals.active]: active
          })}
        >
          {event.title}
        </p>
        <time dateTime={new Date(event.start).toISOString()}>{formatDateTime(event.start)}</time>
      </div>
    </div>
  );
};

// Side panel for the events list while showing a particular event.
// Breaks away from `isDenseList` for EventList.js
const EventsNavItems = (props: EventsNavItemsProps) => {
  const { items, onItemClicked, selectedEventId, loadMore, canLoadMore, timeConfig } = props;

  return (
    <div className={locals.container}>
      {items.map((event, idx) => (
        <EventListItem
          event={event}
          key={event.id || idx.toString()}
          timeConfig={timeConfig}
          onItemClicked={onItemClicked}
          active={selectedEventId === event.id}
        />
      ))}
      {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={2} />}
    </div>
  );
};

export default EventsNavItems;
