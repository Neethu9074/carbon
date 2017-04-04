import { combineLatest } from 'reactive-observables';

import { mutateUrl, navigationParameters$, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { trySetField } from 'in-stores/search/manipulation';

export const isPhysicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/physical') === 0)
  .distinct();

export const isContainerMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/container') === 0)
  .distinct();

export const isLogicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/logical') === 0)
  .distinct();

export const isMapView$ = combineLatest([isPhysicalMapView$, isLogicalMapView$, isContainerMapView$])
  .map(([physical, logical, container]) => physical || logical || container)
  .distinct();

export const traceViewLinkWithoutEumTraces$ = getModifiedUrlStream(params => {
  params.pathname = '/traces';
  params.query.q = trySetField(decodeURIComponent(params.query.q || ''), 'trace.type', 'server');
});

export const logView$ = getModifiedUrlStream(params => {
  params.pathname = '/logs';
});

export function getLogViewLinkWithQuery(query) {
  query = encodeURIComponent(query);
  return getModifiedUrlStream(params => {
    params.pathname = '/logs';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewLinkWithQuery(query) {
  query = encodeURIComponent(query);
  return getModifiedUrlStream(params => {
    params.pathname = '/traces';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewLinkShowingTrace(traceId) {
  const encodedTraceId = encodeURIComponent(traceId);
  return getModifiedUrlStream(params => {
    params.pathname = '/traces';
    params.query.traceId = encodedTraceId;
  });
}

export const isTraceView$ = navigationParameters$.map(params => params.pathname.indexOf('/traces') === 0).distinct();

export const eventsLinkOnlyIncidents$ = getModifiedUrlStream(params => {
  params.pathname = '/events';
  params.query.q = trySetField(decodeURIComponent(params.query.q || ''), 'event.type', 'incident');
});

export const isEventView$ = navigationParameters$.map(params => params.pathname.indexOf('/events') === 0).distinct();

export function getEventViewWithEvent(eventId) {
  return getModifiedUrlStream(params => {
    params.pathname = '/events';
    params.eventId = encodeURIComponent(eventId);
  });
}

export const tableViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/table';
});

export const tableViewFilteredForServicesLink$ = getModifiedUrlStream(params => {
  params.pathname = '/table';
  params.query.q = trySetField(decodeURIComponent(params.query.q || ''), 'entity.selfType', 'service');
});

export const isTableView$ = navigationParameters$.map(params => params.pathname.indexOf('/table') === 0).distinct();

export function focusEvent(eventId) {
  mutateUrl(params => {
    const match = params.pathname.match(/\/(logical|physical)/i);
    if (match) {
      params.pathname = `/${match[1]}`;
    } else if (params.pathname.match(/\/events/i)) {
      params.pathname = '/events';
    } else {
      params.pathname = '/events';
    }
    params.query.eventId = encodeURIComponent(eventId);
    delete params.query.snapshotId;
    return params;
  });
}

export function getLinkToCurrentViewWithViewGrouping(vg) {
  return getModifiedUrlStream(params => params.query.vg = vg);
}

export function setCurrentViewwWithViewGrouping(vg) {
  mutateUrl(params => {
    delete params.query.vg;
    params.query.vg = vg;
    return params;
  });
}
