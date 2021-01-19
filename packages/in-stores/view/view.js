/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';

import { containerPath } from 'in-stores/navigation/paths/mainPaths';
import createViewStructureObservable from 'in-subscription/view';
import { navigationParameters$ } from 'in-stores/navigation';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
import { createTrackingStore } from 'in-stores/store';
import { timeConfig$ } from 'in-stores/time/config';

export const types = {
  physical: 'PHYSICAL',
  container: 'CONTAINER'
};

const store = createTrackingStore({
  name: 'view/view',
  observable: navigationParameters$
    .map(params => {
      const pathname = params.pathname;
      if (pathname.indexOf(containerPath) >= 0) {
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
  observable: combineLatest([view, timeConfig$, viewGrouping$]).flatMap(([viewType, timeConfig, grouping]) =>
    createViewStructureObservable({ viewType, timeConfig, grouping })
  )
}).observable;

export const physicalViewStructure$ = timeConfig$.flatMap(timeConfig =>
  createViewStructureObservable({ viewType: types.physical, timeConfig })
);
