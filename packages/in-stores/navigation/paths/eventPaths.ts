/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
// eslint-disable-next-line import/no-deprecated
import { mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { removeDFQueryFromLocationWhenChangingArea } from 'in-stores/navigation/utils';
import { eventId as eventIdMatricParam } from 'in-events/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import { setTimeConfig } from 'in-stores/time/config';
import { TimeConfig } from 'in-types';

export function focusEvent(eventId: string) {
  // This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
  // eslint-disable-next-line import/no-deprecated
  mutateUrl(params => {
    const match = params.pathname.match(/\/(logical|physical)/i);
    if (match) {
      params.pathname = `/${match[1]}`;
    } else if (params.pathname.match(/\/events/i)) {
      params.pathname = eventsPath;
    } else {
      params.pathname = eventsPath;
    }
    setOrDeleteMatrixKey(params, eventsPath, eventIdMatricParam, eventId);
    delete params.query.snapshotId;
    return params;
  });
}

export function clearSelectedEvent() {
  // This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
  // eslint-disable-next-line import/no-deprecated
  mutateUrl(navParams => {
    delete navParams.query.eventId;
    return navParams;
  });
}

export function getEventsViewFilteredByEntity(entityId: string, eventTypeFilter: string) {
  // This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
  // eslint-disable-next-line import/no-deprecated
  return getModifiedUrlStream(params => {
    const query = `entity.id:"${entityId}"`;
    params.pathname = eventsPath;
    params.query.q = query;

    if (eventTypeFilter) {
      setOrDeleteMatrixKey(params, eventsPath, 'view', eventTypeFilter);
    }
  });
}
export interface GetEventsViewProps {
  query?: string;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  resolvedEndpointId?: string;
  snapshotId?: string;
  eventId?: string;
  eventTypeFilter?: string;
  timeConfig?: TimeConfig;
  additionalDFQFilter?: string;
}
export function getEventsViewFilteredBy({
  query = '',
  applicationId,
  serviceId,
  endpointId,
  resolvedEndpointId,
  snapshotId,
  eventId,
  eventTypeFilter,
  timeConfig,
  additionalDFQFilter
}: GetEventsViewProps) {
  endpointId = resolvedEndpointId ? resolvedEndpointId : endpointId;
  if (endpointId) {
    query += ` entity.endpoint.id:"${endpointId}"`;
  }
  if (serviceId) {
    query += ` entity.service.id:"${serviceId}"`;
  }
  if (applicationId) {
    query += ` entity.application.id:"${applicationId}"`;
  }
  if (snapshotId) {
    query += ` entity.id:"${snapshotId}"`;
  }
  if (additionalDFQFilter) {
    query += ` ${additionalDFQFilter}`;
  }
  query = query.trim();

  // This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
  // eslint-disable-next-line import/no-deprecated
  return getModifiedUrlStream(params => {
    // While tackling QA-finding https://instana.kanbanize.com/ctrl_board/37/cards/69751
    // we figured out, that the DFQ as part of the URL query
    // should only be carried over, when navigating inside of events view (or infra),
    // but not when switching areas.
    // In the main navigation, for getView, this was already done:
    removeDFQueryFromLocationWhenChangingArea(params, eventsPath);

    params.pathname = eventsPath;
    if (query) {
      // this would not clean out any existing DFQ if new query is empty:
      params.query.q = query;
    }

    setOrDeleteMatrixKey(params, eventsPath, eventIdMatricParam, eventId || params.query.eventId);
    delete params.query.eventId;

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }

    if (eventTypeFilter) {
      setOrDeleteMatrixKey(params, eventsPath, 'view', eventTypeFilter);
    }
  });
}
