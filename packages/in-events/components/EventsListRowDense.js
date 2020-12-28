import classNames from 'classnames';
import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import EventIcon from 'in-events/components/EventIcon';

import locals from './EventsListRowDense.mless';

export default function EventRow({ event, active, onClick }) {
  return (
    <Tr size="compact" active={active} onClick={onClick}>
      <Td>
        <EventIcon event={event} />
      </Td>
      <Td>
        <div
          className={classNames({
            [locals.item]: true,
            [locals.active]: active
          })}
          onClick={onClick}
        >
          <span className={locals.label}>{event.title}</span>
          <div className={locals.secondRow}>
            <time dateTime={new Date(event.start).toISOString()}>{formatDateTime(event.start)}</time>
          </div>
        </div>
      </Td>
    </Tr>
  );
}
