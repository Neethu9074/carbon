/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactElement } from 'react';

import { DateFormatterInput, DateFormatterOutput, formatDateTime } from '@instana/format-date';
import { Link } from '@instana/components';
import { RawEvent } from '@instana/types';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import { OnEntity, getEndValue, getStateBadge } from 'in-events/components/EventsListRow';
import TimelineCell from 'in-events/components/EventsPage/EventsTable/TimelineCell';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface ColumnDefinition {
  Header: string;
  accessor: string;
  Cell?: (props: {
    cell: { row: { original: RawEvent }; value: DateFormatterInput | any };
    initialState: { onItemClicked: (eventId: string) => {} };
  }) => ReactElement<any, any> | DateFormatterOutput;
  disableSortBy?: boolean;
  width?: number;
  filter?: string;
}

export const severity: ColumnDefinition = {
  Header: '',
  accessor: 'severity',
  Cell: ({ cell }) => {
    const event = cell.row.original;
    const timeConfig = useTimeConfig();
    return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
  },
  width: 50,
  disableSortBy: true
};

export const title: ColumnDefinition = {
  Header: t('in-events:dataGridEventTable.title'),
  accessor: 'title',
  width: 350,
  Cell: props => {
    const event = props.cell.row.original;
    const { location, createHref } = useNavigation();

    function getEventUrl(eventId: string): string {
      // clicking into event list should re-enable tracking Event page view
      setOrDeleteMatrixKey(location, eventsPath, 'track', true);

      setOrDeleteMatrixKey(location, eventsPath, 'eventId', eventId);
      // remove referrer from URL as it already has been recorded
      const referrer = location.query['ref'];
      if (referrer) {
        delete location.query['ref'];
      }

      return createHref(location);
    }

    return (
      <Link
        ellipsis
        style={{
          cursor: 'pointer'
        }}
        // @ts-expect-error
        tabIndex={0}
        href={getEventUrl(event.id || '')}
      >
        {event.title}
      </Link>
    );
  }
};

export const on: ColumnDefinition = {
  Header: t('in-events:dataGridEventTable.on'),
  accessor: 'entityLabel',
  width: 250,
  Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
    const event = cell.row.original;
    return <OnEntity rawEvent={event} />;
  },
  disableSortBy: true
};

export const started: ColumnDefinition = {
  Header: t('in-events:dataGridEventTable.started'),
  accessor: 'start',
  Cell: ({ cell: { value } }) => formatDateTime(value),
  width: 250
};

export const end: ColumnDefinition = {
  Header: t('in-events:dataGridEventTable.end'),
  accessor: 'end',
  Cell: ({ cell }) => {
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
};

export const timeline: ColumnDefinition = {
  Header: 'Timeline',
  accessor: 'Timeline',
  Cell: ({ cell }) => {
    const event = cell.row.original;
    return <TimelineCell event={event} />;
  },
  disableSortBy: true
};

export const state: ColumnDefinition = {
  Header: t('in-events:dataGridEventTable.state'),
  accessor: 'state',
  Cell: ({ cell }) => {
    const event = cell.row.original;
    return getStateBadge(event);
  }
};

export const eventType: ColumnDefinition = {
  Header: 'Event type',
  accessor: 'Event type',
  width: 20,
  filter: 'checkbox',
  disableSortBy: true
};

const eventsTableColumns: ColumnDefinition[] = [severity, title, on, started, end, timeline, state, eventType];

export default eventsTableColumns;
