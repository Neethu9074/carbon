import { combineLatest } from 'reactive-observables';

import {
  buildUrlStream,
  mutateUrl,
  navigationParameters$,
  getModifiedUrlStream
} from 'in-stores/navigation/navigation';

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

export const isTraceView$ = navigationParameters$.map(params => params.pathname.indexOf('/traces') === 0).distinct();

export const isEventView$ = navigationParameters$.map(params => params.pathname.indexOf('/events') === 0).distinct();

export const traceViewLink$ = getModifiedUrlStream(params => (params.pathname = '/traces/search'));

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

export const eventViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/events;view=incident';
});

export function getEventViewWithEvent(eventId) {
  return getModifiedUrlStream(params => {
    params.pathname = '/events';
    params.eventId = eventId;
  });
}

export const physicalTableViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/table;view=physical;plugin=host';
});

export const logicalTableViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/table;view=logical;plugin=service';
});

export const websiteViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/website';
});

export const agentsViewLink$ = buildUrlStream({ path: '/agents' });

export const kubernetesViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/kubernetes';
});

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

export function getLinkToCurrentViewWithViewGrouping(view, vg) {
  return getModifiedUrlStream(params => (params.query[view] = vg));
}

export function setCurrentViewWithViewGrouping(view, vg) {
  mutateUrl(params => {
    delete params.query[view];
    params.query[view] = vg;
    return params;
  });
}
