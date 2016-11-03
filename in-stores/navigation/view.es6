import {combineLatest} from 'reactive-observables';

import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';
import {isEumEnabled} from 'in-services/featureFlags';


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
    if (isEumEnabled) {
      params.query.q = encodeURIComponent('type!=eum');
    } else {
      delete params.query.q;
    }
    return params;
  })
  .map(toUrl)
  .distinct();


export const isTraceView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/traces') === 0)
  .distinct();

export const eventsLinkOnlyIncidents$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/events';
    params.query.q = encodeURIComponent('type=incident');
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
    params.query.q = 'type=service';
    return params;
  })
  .map(toUrl)
  .distinct();

export const isTableView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/table') === 0)
  .distinct();
