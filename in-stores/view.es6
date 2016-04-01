import * as ro from 'reactive-observables';

import createIsMonitoringObservable from 'in-services/subscription/isMonitoring';
import createViewStructureObservable from 'in-services/subscription/view';

import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';
import * as timelineStore from 'in-stores/timeline';

export const types = {
  process: 'PROCESS',
  physical: 'PHYSICAL'
};

const store = createStore({
  name: 'view',
  initialValue: types.physical
});

export const view = store.observable.distinct();
export const viewStructure = createTrackingStore({
  name: 'viewStructure',
  observable: ro.combineLatest([view, timelineStore.timeframe])
    .flatMap(([viewType, timeframe]) => {
      return createViewStructureObservable(viewType, timeframe.to);
    })
}).observable;


export const isMonitoring = createTrackingStore({
  name: 'isMonitoring',
  observable: createIsMonitoringObservable()
}).observable.distinct();


if (window.location.hash) {
  const match = window.location.hash.match(/(\?|&)view=([^&]+)(&|$)/i);
  if (match && isValidView(match[2])) {
    const initialView = match[2];
    setView(initialView);
    store.applyStateMutation(() => initialView);
  } else {
    setView(types.physical);
  }
}


navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('view' in query) {
    if (isValidView(query.view)) {
      store.applyStateMutation(() => query.view);
    } else {
      store.applyStateMutation(() => types.physical);
    }
  }
});


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
