/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
// eslint-disable-next-line import/no-deprecated
import { mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
// eslint-disable-next-line no-restricted-imports
import { removeDFQueryFromLocationWhenChangingArea } from 'in-stores/navigation/utils';
// eslint-disable-next-line no-restricted-imports
import { vulnerabilitydetectionPath } from 'in-vulnerability-center/navigation/paths';
import { eventId as eventIdMatricParam } from 'in-events/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
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

export function useFocusEvent(eventId: string) {
  const { location } = useNavigation();
  let focusLocation;
  const match = location.pathname.match(/\/(logical|physical)/i);

  if (match) {
    focusLocation = { ...location, pathname: `/${match[1]}` };
  } else if (location.pathname.match(/\/events/i)) {
    focusLocation = { ...location, pathname: eventsPath };
  } else {
    focusLocation = { ...location, pathname: eventsPath };
  }
  setOrDeleteMatrixKey(focusLocation, eventsPath, eventIdMatricParam, eventId);
  delete focusLocation.query.snapshotId;
  return focusLocation;
}

export function clearSelectedEvent() {
  // This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
  // eslint-disable-next-line import/no-deprecated
  mutateUrl(navParams => {
    delete navParams.query.eventId;
    return navParams;
  });
}

export function useClearSelectedEvent() {
  const { location } = useNavigation();
  delete location.query.eventId;
  return () => location;
}

export function useGetEventsViewFilteredByEntity(entityId: string, eventTypeFilter: string) {
  // This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
  // eslint-disable-next-line import/no-deprecated

  const { location, createHref } = useNavigation();
  const query = `entity.id:"${entityId}"`;
  const viewFilterFilteredLocation = {
    ...location,
    pathname: eventTypeFilter === 'cve_issue' ? vulnerabilitydetectionPath : eventsPath,
    query: { q: query }
  };

  if (eventTypeFilter && eventTypeFilter !== 'cve_issue') {
    setOrDeleteMatrixKey(viewFilterFilteredLocation, eventsPath, 'view', eventTypeFilter);
  }

  return createHref(viewFilterFilteredLocation);
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

export function useGetEventsViewFilteredBy() {
  const { location, createHref } = useNavigation();
  const getEventsViewFilteredBy = ({
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
  }: GetEventsViewProps) => {
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
    if (eventId) {
      query = ` event.id:"${eventId}"`;
    }
    query = query.trim();

    removeDFQueryFromLocationWhenChangingArea(location, eventsPath);

    const targetPath = eventTypeFilter === 'cve_issue' ? vulnerabilitydetectionPath : eventsPath;

    let eventViewFilteredByLocation = {
      ...location,
      pathname: targetPath
    };

    if (query) {
      eventViewFilteredByLocation = { ...eventViewFilteredByLocation, query: { q: query } };
    }

    setOrDeleteMatrixKey(
      eventViewFilteredByLocation,
      targetPath,
      eventIdMatricParam,
      eventId || location.query.eventId
    );
    delete location.query.eventId;

    if (timeConfig) {
      setTimeConfig(eventViewFilteredByLocation, timeConfig);
    }

    if (eventTypeFilter) {
      setOrDeleteMatrixKey(eventViewFilteredByLocation, targetPath, 'view', eventTypeFilter);
    }

    return createHref(eventViewFilteredByLocation);
  };
  return { getEventsViewFilteredBy };
}
