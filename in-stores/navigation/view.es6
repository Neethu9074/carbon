import {combineLatest} from 'reactive-observables';

import {navigationParameters$} from 'in-stores/navigation/navigation';


export const isPhysicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/physical') === 0)
  .distinct();


export const isLogicalMapView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/logical') === 0)
  .distinct();


export const isMapView$ = combineLatest([isPhysicalMapView$, isLogicalMapView$])
  .map(([physical, logical]) => physical || logical)
  .distinct();


export const isTraceView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/traces') === 0)
  .distinct();

export const isIncidentView$ = navigationParameters$
  .map(params => params.pathname.indexOf('/incidents') === 0)
  .distinct();
