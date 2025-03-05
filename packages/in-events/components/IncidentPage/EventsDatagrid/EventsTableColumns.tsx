/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { formatDateTime } from '@instana/format-date';
import { RawEvent } from '@instana/types';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import { OnEntity, getEndValue, getStateBadge } from 'in-events/components/EventsListRow';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const useEventTableColumns = () => {
  const columnHelper = createColumnHelper<RawEvent>();
  const timeConfig = useTimeConfig();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'severity',
        cell: ({ row }) => {
          const event = row.original;
          return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
        },
        size: 10
      }),
      columnHelper.display({
        id: 'title',
        header: t('in-events:dataGridEventTable.title'),
        cell: ({ row }) => {
          return row.original.title;
        },
        size: 200
      }),
      columnHelper.display({
        id: 'on',
        header: t('in-events:dataGridEventTable.on'),
        cell: ({ row }) => {
          const event = row.original;
          return <OnEntity rawEvent={event} />;
        }
      }),
      columnHelper.display({
        id: 'started',
        header: t('in-events:dataGridEventTable.started'),
        cell: ({ row }) => {
          const event = row.original;
          const time = event.start;
          return formatDateTime(time);
        }
      }),
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
      }),
      columnHelper.display({
        id: 'state',
        header: t('in-events:dataGridEventTable.state'),
        cell: ({ row }) => {
          const event = row.original;
          return getStateBadge(event);
        }
      })
    ],
    [columnHelper, timeConfig]
  );

  return columns;
};

export default useEventTableColumns;
