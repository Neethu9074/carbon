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


// this is a somewhat stupid hack around some module loading shortcoming. This will
// be improved once we use the new react router
const initialValue = window.location.hash.replace(/^(.*)view=([^&]+)(.*)$/i, '$2');
if (initialValue.match(/\w+/i)) {
  setTimeout(() => {
    store.applyStateMutation(() => initialValue);
    setView(initialValue);
  }, 100);
}


navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('view' in query) {
    store.applyStateMutation(() => query.view);
  }
});


export function setView(newActiveView) {
  mutateUrl(navParams => {
    navParams.query.view = newActiveView;
    return navParams;
  });
}
