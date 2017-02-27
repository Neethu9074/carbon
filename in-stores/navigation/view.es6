import {combineLatest} from 'reactive-observables';

import {mutateUrl, navigationParameters$, getModifiedUrlStream} from 'in-stores/navigation/navigation';


export const isPhysicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/physical') === 0)
  .distinct();


export const isLogicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/logical') === 0)
  .distinct();


export const isMapView$ = combineLatest([isPhysicalMapView$, isLogicalMapView$])
  .map(([physical, logical]) => physical || logical)
  .distinct();

export const traceViewLinkWithoutEumTraces$ = getModifiedUrlStream(params => {
    params.pathname = '/traces';
    params.query.q = encodeURIComponent('-spanType:eum');
  });


export const logView$ = getModifiedUrlStream(params => {
  params.pathname = '/logs';
  delete params.query.q;
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

export const isTraceView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/traces') === 0)
  .distinct();


export const eventsLinkOnlyIncidents$ = getModifiedUrlStream(params => {
  params.pathname = '/events';
  params.query.q = encodeURIComponent('eventType:incident');
});


export const isEventView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/events') === 0)
  .distinct();


export function getEventViewWithEvent(eventId) {
  return getModifiedUrlStream(params => {
    params.pathname = '/events';
    params.eventId = encodeURIComponent(eventId);
  });
}


export const tableViewLink$ = getModifiedUrlStream(params => {
    params.pathname = '/table';
    delete params.query.q;
  });


export const tableViewFilteredForServicesLink$ = getModifiedUrlStream(params => {
  params.pathname = '/table';
  params.query.q = 'selftype:service';
});


export const isTableView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/table') === 0)
  .distinct();


export function focusEvent(eventId) {
  mutateUrl(params => {
    const match = params.pathname.match(/\/(logical|physical)/i);
    if (match) {
      params.pathname = `/${match[1]}`;
    } else if (params.pathname.match(/\/events/i)) {
      params.pathname = '/events';
    } else {
      params.pathname = '/events';
      delete params.query.q;
    }
    params.query.eventId = encodeURIComponent(eventId);
    delete params.query.snapshotId;
    return params;
  });
}
