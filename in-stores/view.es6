import * as ro from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';

import {navigationParameters$, isMapVisible$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {focusedMoment$} from 'in-stores/timeline';

export const types = {
  logical: 'LOGICAL',
  process: 'LOGICAL', // TODO can we remove this?
  physical: 'PHYSICAL'
};

const store = createTrackingStore({
  name: 'view',
  observable: navigationParameters$
    .map(params => {
      const pathname = params.pathname;
      if (pathname.indexOf('/logical') === 0) {
        return types.logical;
      }
      return types.physical;
    })
    .distinct()
});
export const view = store.observable;
export const view$ = view;

export const viewStructure = createTrackingStore({
  name: 'viewStructure',
  observable: ro.combineLatest([view, focusedMoment$])
    .flatMap(([viewType, focusedMoment]) => {
      return createViewStructureObservable({viewType, time: focusedMoment});
    })
}).observable;


export const physicalViewStructure$ = focusedMoment$.flatMap(focusedMoment =>
  createViewStructureObservable({viewType: types.physical, time: focusedMoment})
);

export const isPhysicalViewVisible$ = ro.combineLatest([view$, isMapVisible$])
  .map(([activeView, isMapVisible]) => isMapVisible && activeView === types.physical);
