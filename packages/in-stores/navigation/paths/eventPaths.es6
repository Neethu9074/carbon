import { mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { twoZeroModeEnabled } from 'in-services/featureFlags';

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
    params.query.eventId = eventId;
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

    if (
      params.query.q &&
      // in 2.0 mode we don't want to retain the existing DF query
      !twoZeroModeEnabled
    ) {
      params.query.q += ` ${query}`;
    } else {
      params.query.q = query;
    }

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
  eventTypeFilter = null
}) {
  endpointId = resolvedEndpointId ? resolvedEndpointId : endpointId;
  if (endpointId) {
    query += ` entity.endpoint.id:"${endpointId}"`;
  } else if (serviceId) {
    query += ` entity.service.id:"${serviceId}"`;
  } else if (applicationId) {
    query += ` entity.application.id:"${applicationId}"`;
  } else if (snapshotId) {
    query += ` entity.id:"${snapshotId}"`;
  }
  query = query.trim();

  return getModifiedUrlStream(params => {
    params.pathname = eventsPath;
    if (query) {
      params.query.q = query;
    }
    if (eventId) {
      params.query.eventId = eventId;
    }

    if (eventTypeFilter) {
      setOrDeleteMatrixKey(params, eventsPath, 'view', eventTypeFilter);
    }
  });
}
