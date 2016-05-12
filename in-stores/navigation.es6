import {clone} from 'lodash';

import {createStore} from './store';

// will be set to true to avoid circular navigation updates
let settingUpdatedNavigationParameters = false;

let transitionTo;
const store = createStore({
  name: 'navigation',
  initialValue: {
    pathname: '/',
    params: {},
    query: {}
  }
});
export const navigationParameters = store.observable;


// make sure that our internal representation is in sync with the URL at all times
store.observable.subscribe(navParams => {
  if (!settingUpdatedNavigationParameters && transitionTo) {
    transitionTo(navParams.pathname, navParams.params, navParams.query);
  }
});


export function setUpdatedNavigationParameters(transitionToParam, pathname, params, query) {
  try {
    settingUpdatedNavigationParameters = true;
    transitionTo = transitionToParam;
    store.applyStateMutation(() => {
      return {
        pathname,
        params,
        query
      };
    });
  } finally {
    settingUpdatedNavigationParameters = false;
  }
}


export function mutateUrl(mutator) {
  store.applyStateMutation(prevNavParams => {
    return mutator(clone(prevNavParams, true));
  });
}


export function goToDashboard() {
  mutateUrl(navParams => {
    navParams.pathname = 'dashboard';
    return navParams;
  });
}


export function goToMap() {
  mutateUrl(navParams => {
    navParams.pathname = 'map';
    return navParams;
  });
}


export function goToTraceView() {
  mutateUrl(navParams => {
    navParams.pathname = 'traces';
    return navParams;
  });
}
