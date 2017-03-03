import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {focusedMoment$} from 'in-stores/timeline';


export const types = {
  logical: 'LOGICAL',
  physical: 'PHYSICAL',
  container: 'CONTAINER'
};

const store = createTrackingStore({
  name: 'view',
  observable: navigationParameters$
    .map(params => {
      const pathname = params.pathname;
      if (pathname.indexOf('/logical') === 0 ||
          pathname.indexOf('/webVR/logical') === 0) {
        return types.logical;
      } else if (pathname.indexOf('/container') === 0) {
        return types.container;
      }
      return types.physical;
    })
    .distinct()
});
export const view = store.observable;
export const view$ = view;

export const viewStructure = createTrackingStore({
  name: 'viewStructure',
  observable: combineLatest([view, focusedMoment$])
    .flatMap(([viewType, focusedMoment]) => {
      return createViewStructureObservable({viewType, time: focusedMoment});
    })
}).observable;


export const physicalViewStructure$ = focusedMoment$.flatMap(focusedMoment =>
  createViewStructureObservable({viewType: types.physical, time: focusedMoment})
);
