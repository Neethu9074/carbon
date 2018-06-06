import { mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { luceneEscapeString } from 'in-stores/search/manipulation';
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

export function getEventsViewFilteredByEntity(entityId) {
  return getModifiedUrlStream(params => {
    const query = `entity.id:"${luceneEscapeString(entityId)}"`;
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
  });
}
