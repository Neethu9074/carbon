import {createStore} from './store';
import {mutateUrl, navigationParameters} from './navigation';
import * as views from '../views';
import {getStructure} from '../wiring';

const store = createStore({
  name: 'view',
  initialValue: views.physical
});

export const view = store.observable.distinct();
export const viewStructure = view.flatMap(theView => getStructure(theView, true));


if (window.location.hash) {
  const match = window.location.hash.match(/(\?|&)view=([^&]+)(&|$)/i);
  if (match && isValidView(match[2])) {
    const initialView = match[2];
    setView(initialView);
    store.applyStateMutation(() => initialView);
  } else {
    setView(views.physical);
  }
}


navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('view' in query) {
    if (isValidView(query.view)) {
      store.applyStateMutation(() => query.view);
    } else {
      store.applyStateMutation(() => views.physical);
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
  for (const key in views) {
    if (views.hasOwnProperty(key) && views[key] === givenView) {
      return true;
    }
  }
  return false;
}
