import {hashHistory} from 'react-router';
import {cloneDeep, isEqual} from 'lodash';

import {createStore} from './store';


const store = createStore({
  name: 'navigation',
  initialValue: {
    pathname: '/',
    query: {}
  }
});
export const navigationParameters = store.observable;

hashHistory.listen(location => {
  store.applyStateMutation(() => {
    return {
      pathname: location.pathname,
      query: location.query
    };
  });
});


export function mutateUrl(mutator) {
  navigationParameters.once(currentLocation => {
    const newLocation = mutator(cloneDeep(currentLocation, true));

    if (!isEqual(newLocation, currentLocation)) {
      hashHistory.push(newLocation);
    }
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


export function showHelp(id) {
  mutateUrl(navParams => {
    navParams.query.help = id;
    return navParams;
  });
}


export function closeHelpIfOpen(id) {
  mutateUrl(navParams => {
    if (navParams.query.help && parseInt(navParams.query.help, 10) === id) {
      delete navParams.query.help;
    }
    return navParams;
  });
}


export function closeHelp() {
  mutateUrl(navParams => {
    delete navParams.query.help;
    return navParams;
  });
}
