/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { TableLoadingSkeletonRows } from '@instana/legacy';
import { useObservable } from '@instana/hooks';

import {
  eventIdUrlParameter,
  orderDirectionParameter,
  orderByUrlParameter,
  pageNumberUrlParameter
} from 'in-events/navigation/urlParameters';
import { useModifiedTimeConfig } from 'in-events/hooks/useModifiedTimeConfig';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useCursorPagination from 'in-hooks/useCursorPagination';
import getRawCVEEvents from 'in-subscription/getRawCVEEvents';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { spreadTimeConfig } from 'in-events/utils';
import useUrlState from 'in-hooks/useUrlState';
import { getEvent } from 'in-stores/events';

export default function AffectedCvePresenter({ staticTimeConfigToUseForTable, location }) {
  const eventType = 'cve_issue';
  const timeConfig = useTimeConfig();
  const appId = getMatrixParameter(location, '/application', 'appId') ?? '';
  const { mouseMoveSignal$ } = useModifiedTimeConfig();
  const eventId = getMatrixParameter(location, eventsPath, 'eventId');
  const urlSettingsConfig = {
    bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter, pageNumberUrlParameter],
    replaceHistory: false
  };
  const [urlState, onChange] = useUrlState(urlSettingsConfig);
  const eventObservable = getEvent(eventId ?? '').map(data => ({
    data,
    errors: [],
    progress: { percentage: null, loading: false }
  }));
  const { orderBy, orderDirection, relatedEventsPage } = urlState;

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
          by: orderBy,
          direction: orderDirection
        }
      }),
    [timeConfig, orderBy, orderDirection, eventType, appId]
  );

  const tableProps = useCursorPagination(fetchCVEEvents, [
    eventType,
    orderBy,
    orderDirection,
    ...spreadTimeConfig(staticTimeConfigToUseForTable, timeConfig)
  ]);

  const cveEventsResult = useObservable(fetchCVEEvents({ cursor: null }), [timeConfig, orderBy, orderDirection]);

  if (isLoading(cveEventsResult)) {
    return <TableLoadingSkeletonRows />;
  }

  return (
    <EventTable
      {...tableProps}
      orderBy={orderBy}
      orderDirection={orderDirection}
      relatedEventsPage={relatedEventsPage}
      onChange={onChange}
      mouseMoveSignal$={mouseMoveSignal$}
      eventObservable={eventObservable}
      eventType={eventType}
      timeConfig={timeConfig}
      isApplicationDirect
    />
  );
}

AffectedCvePresenter.propTypes = {
  staticTimeConfigToUseForTable: PropTypes.object,
  location: PropTypes.any
};
