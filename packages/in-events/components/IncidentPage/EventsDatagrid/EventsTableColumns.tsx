/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Row, createColumnHelper } from '@tanstack/react-table';
import { isEmpty, isUndefined } from 'lodash';
import React, { useMemo } from 'react';

import { formatDateTime } from '@instana/format-date';
import { Link } from '@instana/components';
import { RawEvent } from '@instana/types';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import { OnEntity, getEndValue, getStateBadge } from 'in-events/components/EventsListRow';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-events/components/IncidentPage/EventsDatagrid/EventsTableColumns.mless';

const defaultHeaders = ['severity', 'title', 'on', 'started', 'end', 'state'];

const TitleCell = ({ row }: { row: Row<RawEvent> }) => {
  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  return (
    <Link
      ellipsis
      className={locals.title}
      href={getEventsViewFilteredBy({
        eventId: row.original.id
      })}
    >
      {row.original.title}
    </Link>
  );
};

const useEventTableColumns = (headers?: string[]) => {
  const calculatedHeaders = isEmpty(headers) || isUndefined(headers) ? defaultHeaders : headers;
  const columnHelper = createColumnHelper<RawEvent>();
  const timeConfig = useTimeConfig();

  const columns = useMemo(() => {
    const retColumns = [];

    if (calculatedHeaders.includes('severity')) {
      retColumns.push(
        columnHelper.display({
          id: 'severity',
          cell: ({ row }) => {
            const event = row.original;
            return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
          },
          size: 10
        })
      );
    }

    if (calculatedHeaders.includes('title')) {
      retColumns.push(
        columnHelper.display({
          id: 'title',
          header: t('in-events:dataGridEventTable.title'),
          cell: ({ row }) => <TitleCell row={row} />,
          size: 200
        })
      );
    }

    if (calculatedHeaders.includes('on')) {
      retColumns.push(
        columnHelper.display({
          id: 'on',
          header: t('in-events:dataGridEventTable.on'),
          cell: ({ row }) => {
            const event = row.original;
            return <OnEntity rawEvent={event} />;
          }
        })
      );
    }

    if (calculatedHeaders.includes('started')) {
      retColumns.push(
        columnHelper.display({
          id: 'started',
          header: t('in-events:dataGridEventTable.started'),
          cell: ({ row }) => {
            const event = row.original;
            const time = event.start;
            return formatDateTime(time);
          }
        })
      );
    }

    if (calculatedHeaders.includes('end')) {
      retColumns.push(
        columnHelper.display({
          id: 'end',
          header: t('in-events:dataGridEventTable.end'),
          cell: ({ row }) => {
            const event = row.original;
            const eventType = getEventType(event);
            const isChangeEvent = eventType === EVENT_TYPES.CHANGE;
            const end = event.manualCloseTimestamp || event.end || Date.now();
            const start = event.start;
            const headers = [1, 2, 3, 4, 5];
            const endValue = getEndValue(event, isChangeEvent, end, start, headers, false) || '-';
            return endValue;
          }
        })
      );
    }

    if (calculatedHeaders.includes('state')) {
      retColumns.push(
        columnHelper.display({
          id: 'state',
          header: t('in-events:dataGridEventTable.state'),
          cell: ({ row }) => {
            const event = row.original;
            return getStateBadge(event);
          }
        })
      );
    }

    return retColumns;
  }, [columnHelper, timeConfig, calculatedHeaders]);

  return columns;
};

export default useEventTableColumns;
