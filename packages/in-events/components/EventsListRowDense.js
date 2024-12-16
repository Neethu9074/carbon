/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Tr, Td } from '@instana/legacy';

import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { formatDateTime } from 'in-services/formatters/date';
import EventIcon from 'in-events/components/EventIcon';
import { getEvent } from 'in-stores/events';

import locals from './EventsListRowDense.mless';

export default function EventListRowDense({ event, active, onClick, timeConfig }) {
  const updatedEventInfo = useObservable(getEvent(event.id), [event]);
  const eventToUse = updatedEventInfo ? updatedEventInfo : event;

  return (
    <Tr size="compact" active={active} onClick={onClick}>
      <Td>
        <EventIcon event={eventToUse} tooltipLabel={getEventSeverityLabelWithEventType(eventToUse, timeConfig)} />
      </Td>
      <Td>
        <div
          className={classNames({
            [locals.item]: true,
            [locals.active]: active
          })}
          onClick={onClick}
        >
          <span className={locals.label} title={event.title}>
            {event.title}
          </span>
          <div className={locals.secondRow}>
            <time dateTime={new Date(event.start).toISOString()}>{formatDateTime(event.start)}</time>
          </div>
        </div>
      </Td>
    </Tr>
  );
}
