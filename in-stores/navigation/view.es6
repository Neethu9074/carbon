import {combineLatest} from 'reactive-observables';

import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';
import {eumTracingEnabled} from 'in-services/featureFlags';


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
    if (eumTracingEnabled) {
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

export function getEventViewWithIncident(incidentId) {
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/events';
      params.query.q = encodeURIComponent('type=incident');
      params.eventId = encodeURIComponent(incidentId);
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

export const isTableView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/table') === 0)
  .distinct();


export function goToTableView() {
  tableViewLink$.once(link => window.location.href = link);
}
