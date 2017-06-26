import { combineLatest } from 'reactive-observables';

import { mutateUrl, navigationParameters$, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { trySetField, removeField } from 'in-stores/search/manipulation';

export const cockpitLink$ = getModifiedUrlStream(params => (params.pathname = '/cockpit'));

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

export const traceViewLink$ = getModifiedUrlStream(params => (params.pathname = '/traces/search'));
export const traceAnalyticsViewLink$ = getModifiedUrlStream(params => (params.pathname = '/traces/analytics'));

export function getTraceViewLinkWithQuery(query) {
  return getModifiedUrlStream(params => {
    params.pathname = '/traces/search';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewLinkShowingTrace(traceId) {
  return getModifiedUrlStream(params => {
    params.pathname = '/traces/search';
    params.query.traceId = traceId;
  });
}

export const logView$ = getModifiedUrlStream(params => {
  params.pathname = '/logs';
});

export function getLogViewLinkWithQuery(query) {
  return getModifiedUrlStream(params => {
    params.pathname = '/logs';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export const isTraceView$ = navigationParameters$.map(params => params.pathname.indexOf('/traces') === 0).distinct();

export const eventViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/events';
  try {
    if (params.query.q) {
      params.query.q = removeField(params.query.q, 'event.type');
    }
    params.query.q = trySetField(params.query.q || '', 'event.type', 'incident');
  } catch (e) {
    params.query.q = (params.query.q || '') + ' event.type:incident';
  }
});

export const isEventView$ = navigationParameters$.map(params => params.pathname.indexOf('/events') === 0).distinct();

export function getEventViewWithEvent(eventId) {
  return getModifiedUrlStream(params => {
    params.pathname = '/events';
    params.eventId = eventId;
  });
}

export const tableViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/table';
});

export const eumViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/eum';
});

export const tableViewFilteredForServicesLink$ = getModifiedUrlStream(params => {
  params.pathname = '/table';
  params.query.q = trySetField(params.query.q || '', 'entity.selfType', 'service');
});

export const isTableView$ = navigationParameters$.map(params => params.pathname.indexOf('/table') === 0).distinct();

export function focusEvent(event) {
  const eventId = event.get('id');
  mutateUrl(params => {
    const match = params.pathname.match(/\/(logical|physical)/i);
    if (match) {
      params.pathname = `/${match[1]}`;
    } else if (params.pathname.match(/\/events/i)) {
      params.pathname = '/events';
    } else {
      params.pathname = '/events';
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

export function getLinkToCurrentViewWithViewGrouping(vg) {
  return getModifiedUrlStream(params => (params.query.vg = vg));
}

export function setCurrentViewWithViewGrouping(vg) {
  mutateUrl(params => {
    delete params.query.vg;
    params.query.vg = vg;
    return params;
  });
}
