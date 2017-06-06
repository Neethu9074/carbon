import { combineLatest } from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import { navigationParameters$ } from 'in-stores/navigation';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
import { createTrackingStore } from 'in-stores/store';
import { focusedMoment$ } from 'in-stores/timeline';

export const types = {
  logical: 'LOGICAL',
  physical: 'PHYSICAL',
  container: 'CONTAINER'
};

const store = createTrackingStore({
  name: 'view/view',
  observable: navigationParameters$
    .map(params => {
      const pathname = params.pathname;
      if (pathname.indexOf('/logical') === 0 || pathname.indexOf('/webVR/logical') === 0) {
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
  name: 'view/viewStructure',
  observable: combineLatest([view, focusedMoment$, viewGrouping$]).flatMap(([viewType, time, grouping]) =>
    createViewStructureObservable({ viewType, time, grouping })
  )
}).observable;

export const physicalViewStructure$ = focusedMoment$.flatMap(focusedMoment =>
  createViewStructureObservable({ viewType: types.physical, time: focusedMoment })
);

export const logicalViewStructure$ = focusedMoment$.flatMap(focusedMoment =>
  createViewStructureObservable({ viewType: types.logical, time: focusedMoment })
);
