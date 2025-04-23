/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// This will be addressed via https://instana.kanbanize.com/ctrl_board/103/cards/102691/details/
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

export function useFocusEvent() {
  const { location, navigate } = useNavigation();

  const focusEvent = (eventId: string) => {
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
    navigate(focusLocation);
  };

  return focusEvent;
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

    // The DFQ as part of the URL query
    // should only be carried over, when navigating inside of events view (or infra),
    // but not when switching areas.
    removeDFQueryFromLocationWhenChangingArea(location, eventsPath); // TODO check: should it be targetPath? see below

    const targetPath = eventTypeFilter === 'cve_issue' ? vulnerabilitydetectionPath : eventsPath;

    let eventViewFilteredByLocation = {
      ...location,
      pathname: targetPath
    };

    if (query) {
      eventViewFilteredByLocation = {
        ...eventViewFilteredByLocation,
        query: {
          ...eventViewFilteredByLocation.query,
          q: query
        }
      };
    }
    setOrDeleteMatrixKey(
      eventViewFilteredByLocation,
      targetPath,
      eventIdMatricParam,
      eventId || location.query.eventId
    );

    delete eventViewFilteredByLocation.query.eventId;

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
