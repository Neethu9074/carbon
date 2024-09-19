/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useLocation } from 'react-router-dom';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { TableLoadingSkeletonRows } from '@instana/legacy';
import { useObservable } from '@instana/hooks';

import { useModifiedTimeConfig } from 'in-events/hooks/useModifiedTimeConfig';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useCursorPagination from 'in-hooks/useCursorPagination';
import getRawCVEEvents from 'in-subscription/getRawCVEEvents';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { spreadTimeConfig } from 'in-events/utils';
import { noop } from 'in-services/fixedObjects';
import { getEvent } from 'in-stores/events';

export default function AffectedCvePresenter({
  staticTimeConfigToUseForTable,
  defaultOrderBy = 'start',
  defaultOrderDirection = 'DESC',
  query = ''
}) {
  const eventType = 'cve_issue';
  const timeConfig = useTimeConfig();
  const location = useLocation();
  const appId = getMatrixParameter(location, '/application', 'appId') ?? '';
  const { mouseMoveSignal$ } = useModifiedTimeConfig();
  const eventId = getMatrixParameter(location, eventsPath, 'eventId');
  const eventObservable = getEvent(eventId ?? '').map(data => ({
    data,
    errors: [],
    progress: { percentage: null, loading: false }
  }));

  const fetchCVEEvents = useCallback(
    ({ cursor }) =>
      getRawCVEEvents({
        timeConfig,
        query: `event.type:${eventType} AND entity.application.id:"${appId}"`,
        pagination: {
          retrievalSize: 30,
          cursor
        },
        order: {
          by: defaultOrderBy,
          direction: defaultOrderDirection
        }
      }),
    [timeConfig, defaultOrderBy, defaultOrderDirection, eventType, appId]
  );

  const tableProps = useCursorPagination(fetchCVEEvents, [
    eventType,
    query,
    defaultOrderBy,
    defaultOrderDirection,
    ...spreadTimeConfig(staticTimeConfigToUseForTable, timeConfig)
  ]);

  const cveEventsResult = useObservable(fetchCVEEvents({ cursor: null }), [
    timeConfig,
    query,
    defaultOrderBy,
    defaultOrderDirection
  ]);

  if (isLoading(cveEventsResult)) {
    return <TableLoadingSkeletonRows />;
  }

  return (
    <EventTable
      {...tableProps}
      onChange={noop}
      mouseMoveSignal$={mouseMoveSignal$}
      eventObservable={eventObservable}
      eventType={eventType}
      timeConfig={timeConfig}
    />
  );
}

AffectedCvePresenter.propTypes = {
  staticTimeConfigToUseForTable: PropTypes.object,
  defaultOrderBy: PropTypes.string,
  defaultOrderDirection: PropTypes.string,
  query: PropTypes.string,
  location: PropTypes.any
};
