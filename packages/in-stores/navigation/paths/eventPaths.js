/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { eventId as eventIdMatricParam } from 'in-events/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import { setTimeConfig } from 'in-stores/time/config';

export function focusEvent(eventId) {
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
  mutateUrl(navParams => {
    delete navParams.query.eventId;
    return navParams;
  });
}

export function getEventViewWithEvent(eventId) {
  return getModifiedUrlStream(params => {
    params.pathname = eventsPath;
    params.eventId = eventId;
  });
}

export function getEventsViewFilteredByEntity(entityId, eventTypeFilter) {
  return getModifiedUrlStream(params => {
    const query = `entity.id:"${entityId}"`;
    params.pathname = eventsPath;
    params.query.q = query;

    if (eventTypeFilter) {
      setOrDeleteMatrixKey(params, eventsPath, 'view', eventTypeFilter);
    }
  });
}

export function getEventsViewFilteredBy({
  query = '',
  applicationId = null,
  serviceId = null,
  endpointId = null,
  resolvedEndpointId = null,
  snapshotId = null,
  eventId = null,
  eventTypeFilter = null,
  timeConfig = null
}) {
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
  query = query.trim();

  return getModifiedUrlStream(params => {
    params.pathname = eventsPath;
    if (query) {
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
