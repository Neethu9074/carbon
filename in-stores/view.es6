import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {navigationParameters$} from 'in-stores/navigation';
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
      if (pathname.indexOf('/logical') === 0 ||
          pathname.indexOf('/webVR/logical') === 0) {
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
  observable: combineLatest([view, focusedMoment$])
    .flatMap(([viewType, focusedMoment]) => {
      return createViewStructureObservable({viewType, time: focusedMoment});
    })
}).observable;


export const physicalViewStructure$ = focusedMoment$.flatMap(focusedMoment =>
  createViewStructureObservable({viewType: types.physical, time: focusedMoment})
);
