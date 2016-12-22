/* global process:false, require:false */
import {cloneDeep as loDashCloneDeep, isEqual} from 'lodash';

import {createStore} from 'in-stores/store';


export const PATH_NAMES = {
  DASHBOARD: '/dashboard',
  TRACES: '/traces',
  EVENTS: '/events',
  GRAPH: '/graph',
  MAP: '/',
  HOME: '/'
};

let hashHistory;

if (process.env.IS_TEST) {
  hashHistory = {
    push() {},
    listen() {}
  };
} else {
  hashHistory = require('react-router').hashHistory;
}


const store = createStore({
  name: 'navigation',
  initialValue: {
    pathname: '/',
    query: {}
  }
});
export const navigationParameters = store.observable;
export const navigationParameters$ = navigationParameters;

hashHistory.listen(location => {
  store.applyStateMutation(() => {
    return {
      pathname: location.pathname,
      query: location.query
    };
  });
});


export function mutateUrl(mutator) {
  navigationParameters$.once(currentLocation => {
    const newLocation = mutator(cloneDeep(currentLocation));

    if (!isEqual(newLocation, currentLocation)) {
      hashHistory.push(newLocation);
    }
  });
}


export function cloneDeep(obj) {
  return loDashCloneDeep(obj, true);
}


export function buildUrlStream({path}) {
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = path;
      delete params.query.q;
      return params;
    })
    .map(toUrl)
    .distinct();
}


export function buildPathStartsWithStream(path) {
  return navigationParameters$
    .map(params => params.pathname.indexOf(path) === 0)
    .distinct();
}


function getActiveView(params) {
  const match = params.pathname.match(/\/([a-z]+)\/?/i);
  return match ? match[1] : 'physical';
}


export function goHome() {
  mutateUrl(navParams => {
    navParams.pathname = PATH_NAMES.HOME;
    navParams.query = {};
    return navParams;
  });
}

export const homeLink$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/';
    params.query = {};
    return params;
  })
  .map(toUrl)
  .distinct();

export const instanaBaseUrl$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/';
    params.query = {};
    return params;
  })
  .map(toBaseUrl)
  .distinct();


export function goToDashboard(snapshotId) {
  mutateUrl(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}/dashboard`;
    params.query.snapshotId = encodeURIComponent(snapshotId);
    return params;
  });
}


export function getDashboardLink(snapshotId) {
  snapshotId = encodeURIComponent(snapshotId);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      const view = getActiveView(params);
      params.pathname = `/${view}/dashboard`;
      params.query.snapshotId = snapshotId;
      return params;
    })
    .map(toUrl)
    .distinct();
}


export const isDashboardOpen$ = navigationParameters$
  .map(params => {
    return /\/[a-z]+\/dashboard/i.test(params.pathname);
  })
  .distinct();


export function getLinkToSnapshotInCurrentView(snapshotId) {
  snapshotId = encodeURIComponent(snapshotId);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.query.snapshotId = snapshotId;
      return params;
    })
    .map(toUrl)
    .distinct();
}

export function closeDashboard() {
  mutateUrl(navParams => {
    navParams.pathname = navParams.pathname.replace(/^\/([a-z]+)\/.*/i, (all, view) => `/${view}`);
    return navParams;
  });
}

export function getFixedTimeframeUrl(windowSize, to, focusedMoment) {
  return navigationParameters$
    .map(cloneDeep)
    .map(navParams => {
      if (!focusedMoment) {
        delete navParams.query.fm;
      }

      navParams.query['timeline.to'] = encodeURIComponent(to == null ? '' : to);
      navParams.query['timeline.ws'] = encodeURIComponent(windowSize);
      delete navParams.query['tl.tf'];

      return navParams;
    })
    .map(toUrl)
    .distinct();
}

export const closeDashboardLink$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = params.pathname.replace(/\/dashboard/i, '');
    return params;
  })
  .map(toUrl)
  .distinct();


export function toUrl(params) {
  return `/#${toBaseUrl(params)}`;
}

export function toBaseUrl(params) {
  let url = params.pathname;

  let first = true;
  for (const key in params.query) {
    if (params.query.hasOwnProperty(key)) {
      if (first) {
        first = false;
        url = `${url}?${key}=${params.query[key]}`;
      } else {
        url = `${url}&${key}=${params.query[key]}`;
      }
    }
  }

  return url;
}


export function goToLogicalView() {
  mutateUrl(navParams => {
    navParams.pathname = '/logical';
    return navParams;
  });
}


export const logicalViewLink$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/logical';
    deleteQueryData(params.query);
    return params;
  })
  .map(toUrl)
  .distinct();


export function goToPhysicalView() {
  mutateUrl(navParams => {
    navParams.pathname = '/physical';
    return navParams;
  });
}

export const physicalViewLink$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    params.pathname = '/physical';
    deleteQueryData(params.query);
    return params;
  })
  .map(toUrl)
  .distinct();


function deleteQueryData(query) {
  delete query.q;
}

export function goToRootOfView() {
  mutateUrl(navParams => {
    navParams.pathname = navParams.pathname.replace(/^\/([a-z]+)\/.*/i, (all, view) => `/${view}`);
    return navParams;
  });
}


export function goToGraph() {
  mutateUrl(navParams => {
    navParams.pathname = PATH_NAMES.GRAPH;
    return navParams;
  });
}


export function goToTraceView() {
  mutateUrl(navParams => {
    navParams.pathname = PATH_NAMES.TRACES;
    return navParams;
  });
}

export function goToEventsView() {
  mutateUrl(navParams => {
    navParams.pathname = PATH_NAMES.EVENTS;
    return navParams;
  });
}


export function showHelp(id) {
  mutateUrl(navParams => {
    navParams.query.help = encodeURIComponent(id);
    return navParams;
  });
}


export function closeHelpIfOpen(id) {
  mutateUrl(navParams => {
    if (navParams.query.help && decodeURIComponent(navParams.query.help) === id) {
      delete navParams.query.help;
    }
    return navParams;
  });
}


export function closeCurrentHelpIfOpen() {
  mutateUrl(navParams => {
    if (navParams.query.help) {
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
