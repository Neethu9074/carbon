import * as ro from 'reactive-observables';

import createIsMonitoringObservable from 'in-services/subscription/isMonitoring';
import {getProcessViewStructureObservable} from 'in-stores/processViewDummyData';
import createViewStructureObservable from 'in-services/subscription/view';

import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {focusedMoment$} from 'in-stores/timeline';

export const types = {
  process: 'PROCESS',
  physical: 'PHYSICAL'
};

const store = createTrackingStore({
  name: 'view',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('view' in query) {
        const view = decodeURIComponent(query.view);
        if (isValidView(view)) {
          return view;
        }

        return types.physical;
      }

      return types.physical;
    })
    .distinct()
});
export const view = store.observable;

export const viewStructure = createTrackingStore({
  name: 'viewStructure',
  observable: ro.combineLatest([view, focusedMoment$])
    .flatMap(([viewType, focusedMoment]) => {
      // TODO TEMPORARY HACK FOR PROCESS VIEW
      if (viewType === types.process) {
        return getProcessViewStructureObservable();
      }
      return createViewStructureObservable({viewType, time: focusedMoment});
    })
}).observable;


export const isMonitoring = createTrackingStore({
  name: 'isMonitoring',
  observable: createIsMonitoringObservable()
}).observable.distinct();


export function setView(newActiveView) {
  mutateUrl(navParams => {
    navParams.query.view = newActiveView;
    return navParams;
  });
}


function isValidView(givenView) {
  for (const key in types) {
    if (types.hasOwnProperty(key) && types[key] === givenView) {
      return true;
    }
  }
  return false;
}
