import createViewStructureObservable from 'in-services/subscription/view';

import {mutateUrl, navigationParameters} from './navigation';
import {createStore, createTrackingStore} from './store';

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
  observable: view.flatMap(viewType => createViewStructureObservable({viewType}))
}).observable;


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
