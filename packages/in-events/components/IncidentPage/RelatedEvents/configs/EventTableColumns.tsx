/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DateFormatterInput, formatDateTime } from '@instana/format-date';
import { RawEvent } from '@instana/types';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import { OnEntity, getEndValue, getStateBadge } from 'in-events/components/EventsListRow';
import TimelineCell from 'in-events/components/EventsPage/EventsTable/TimelineCell';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const eventsTableColumns = [
  {
    Header: '',
    accessor: 'severity',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      const timeConfig = useTimeConfig();
      return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
    },
    width: 50,
    disableSortBy: true
  },
  {
    Header: t('in-events:dataGridEventTable.title'),
    accessor: 'title',
    width: 350
  },
  {
    Header: t('in-events:dataGridEventTable.on'),
    accessor: 'entityLabel',
    width: 250,
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      return <OnEntity rawEvent={event} />;
    },
    disableSortBy: true
  },
  {
    Header: t('in-events:dataGridEventTable.started'),
    accessor: 'start',
    Cell: ({ cell: { value } }: { cell: { value: DateFormatterInput } }) => formatDateTime(value),
    width: 250
  },
  {
    Header: t('in-events:dataGridEventTable.end'),
    accessor: 'end',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      const eventType = getEventType(event);
      const isChangeEvent = eventType === EVENT_TYPES.CHANGE;
      const end = event.manualCloseTimestamp || event.end || Date.now();
      const start = event.start;
      const headers = eventsTableColumns;
      const endValue = getEndValue(event, isChangeEvent, end, start, headers, false) || '-';
      return endValue;
    },
    width: 250
  },
  {
    Header: 'Timeline',
    accessor: 'Timeline',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      return <TimelineCell event={event} />;
    },
    disableSortBy: true
  },
  {
    Header: t('in-events:dataGridEventTable.state'),
    accessor: 'state',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      return getStateBadge(event);
    }
  },
  {
    Header: 'Event type',
    accessor: 'Event type',
    width: 20,
    filter: 'checkbox',
    disableSortBy: true
  }
];

export default eventsTableColumns;
