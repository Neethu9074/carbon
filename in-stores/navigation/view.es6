import {combineLatest} from 'reactive-observables';

import {mutateUrl, navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';


export const isPhysicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/physical') === 0)
  .distinct();


export const isLogicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/logical') === 0)
  .distinct();


export const isMapView$ = combineLatest([isPhysicalMapView$, isLogicalMapView$])
  .map(([physical, logical]) => physical || logical)
  .distinct();

export const traceViewLinkWithoutEumTraces$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/traces';
    params.query.q = encodeURIComponent('-type:eum');
    return params;
  })
  .map(toUrl)
  .distinct();


export function getTraceViewLinkWithQuery(query) {
  query = encodeURIComponent(query);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/traces';
      params.query.q = query;
      params.query.ss = '1';
      return params;
    })
    .map(toUrl)
    .distinct();
}


export function getTraceViewLinkShowingTrace(traceId) {
  const encodedTraceId = encodeURIComponent(traceId);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/traces';
      params.query.traceId = encodedTraceId;
      return params;
    })
    .map(toUrl)
    .distinct();
}

export const isTraceView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/traces') === 0)
  .distinct();


export const eventsLinkOnlyIncidents$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/events';
    params.query.q = encodeURIComponent('type:incident');
    return params;
  })
  .map(toUrl)
  .distinct();


export const isEventView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/events') === 0)
  .distinct();


export function getEventViewWithEvent(eventId) {
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/events';
      params.eventId = encodeURIComponent(eventId);
      return params;
    })
    .map(toUrl)
    .distinct();
}


export const tableViewLink$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/table';
    delete params.query.q;
    return params;
  })
  .map(toUrl)
  .distinct();


export const tableViewFilteredForServicesLink$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/table';
    params.query.q = 'type:service';
    return params;
  })
  .map(toUrl)
  .distinct();


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
