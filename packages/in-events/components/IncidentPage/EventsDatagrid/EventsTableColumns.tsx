/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { Tag } from '@carbon/react';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { isEmpty, isUndefined } from 'lodash';
import React, { useMemo } from 'react';

import { formatDateTime } from '@instana/format-date';
import { Link } from '@instana/components';
import { RawEvent } from '@instana/types';

import { OnEntity, getEndValue, getStateBadge, getColorForState } from 'in-events/components/EventsListRow';
import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import TimelineCell from 'in-events/components/EventsPage/EventsTable/TimelineCell';
import { useNavigateToEvent } from 'in-events/navigation/useNavigateToEvent';
import { eventsTransientEventEnabled } from 'in-services/featureFlags';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-events/components/IncidentPage/EventsDatagrid/EventsTableColumns.mless';

const defaultHeaders = ['severity', 'problem.problemText', 'on', 'start', 'end', 'state', 'timeline'] as const;
export type EventHeaderType = (typeof defaultHeaders)[number];

const TitleCell = ({ row }: { row: Row<RawEvent> }) => {
  const navigateToEvent = useNavigateToEvent();

  const handleClick = () => {
    if (row.original.id) {
      navigateToEvent(row.original.id);
    }
  };

  return (
    <Link
      className={locals.titleLink}
      style={{ cursor: 'pointer', display: 'block', width: '100%' }}
      // @ts-expect-error
      tabIndex={0}
      onClick={handleClick}
    >
      {row.original.title}
    </Link>
  );
};

const useEventTableColumns = (
  headers?: EventHeaderType[],
  sortableHeaders?: EventHeaderType[],
  enableSorting = false
) => {
  const calculatedHeaders = isEmpty(headers) || isUndefined(headers) ? defaultHeaders : headers;
  const columnHelper = createColumnHelper<RawEvent>();
  const timeConfig = useTimeConfig();

  const columns = useMemo(() => {
    const retColumns = [];

    if (calculatedHeaders.includes('severity')) {
      retColumns.push(
        columnHelper.display({
          id: 'severity',
          size: 28, // Small width for severity column
          cell: ({ row }) => {
            const event = row.original;
            return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
          },
          enableSorting: (enableSorting && sortableHeaders?.includes('severity')) || false
        })
      );
    }

    if (calculatedHeaders.includes('problem.problemText')) {
      retColumns.push(
        columnHelper.display({
          id: 'problem.problemText',
          header: t('in-events:dataGridEventTable.title'),
          size: 300, // Wide width for title column
          cell: ({ row }) => <TitleCell row={row} />,
          enableSorting: (enableSorting && sortableHeaders?.includes('problem.problemText')) || false
        })
      );
    }

    if (calculatedHeaders.includes('on')) {
      retColumns.push(
        columnHelper.display({
          id: 'on',
          header: t('in-events:dataGridEventTable.on'),
          size: 200, // Medium width for 'on' column
          cell: ({ row }) => {
            const event = row.original;
            return <OnEntity rawEvent={event} />;
          },
          enableSorting: (enableSorting && sortableHeaders?.includes('on')) || false
        })
      );
    }

    if (calculatedHeaders.includes('start')) {
      retColumns.push(
        columnHelper.display({
          id: 'start',
          header: t('in-events:dataGridEventTable.started'),
          size: 150, // Medium width for 'started' column
          cell: ({ row }) => {
            const event = row.original;
            const time = event.start;
            return formatDateTime(time);
          },
          enableSorting: (enableSorting && sortableHeaders?.includes('start')) || false
        })
      );
    }

    if (calculatedHeaders.includes('end')) {
      retColumns.push(
        columnHelper.display({
          id: 'end',
          header: t('in-events:dataGridEventTable.end'),
          size: 150, // Medium width for 'end' column
          cell: ({ row }) => {
            const event = row.original;
            const eventType = getEventType(event);
            const isChangeEvent = eventType === EVENT_TYPES.CHANGE;
            const end = event.manualCloseTimestamp || event.end || Date.now();
            const start = event.start;
            const headers = [1, 2, 3, 4, 5];
            const endValue = getEndValue(event, isChangeEvent, end, start, headers, false) || '-';
            return endValue;
          },
          enableSorting: (enableSorting && sortableHeaders?.includes('end')) || false
        })
      );
    }

    if (calculatedHeaders.includes('timeline')) {
      retColumns.push(
        columnHelper.display({
          id: 'timeline',
          header: t('in-events:dataGridEventTable.timeline'),
          size: 150, // Medium width for 'timeline' column
          cell: ({ row }) => {
            const event = row.original;
            return <TimelineCell event={event} />;
          },
          enableSorting: (enableSorting && sortableHeaders?.includes('timeline')) || false
        })
      );
    }

    if (calculatedHeaders.includes('state')) {
      retColumns.push(
        columnHelper.display({
          id: 'state',
          header: t('in-events:dataGridEventTable.state'),
          size: 150, // Small-medium width for 'state' column
          cell: ({ row }) => {
            const event = row.original;
            return (
              <>
                {getStateBadge(event)}
                {eventsTransientEventEnabled && getIsTransientBadge(event)}
              </>
            );
          },
          enableSorting: (enableSorting && sortableHeaders?.includes('state')) || false
        })
      );
    }

    return retColumns;
  }, [columnHelper, timeConfig, calculatedHeaders, sortableHeaders, enableSorting]);

  return columns;
};

const getIsTransientBadge = (event: RawEvent) => {
  // @ts-expect-error no def available yet.
  if (event?.transient) {
    return (
      <Tag size="sm" type={getColorForState(event)}>
        {t('in-events:stateTransient')}
      </Tag>
    );
  }
  return null;
};

export default useEventTableColumns;
