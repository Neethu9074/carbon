/* global process:false, require:false */
import { isEqual } from 'lodash';

import { createStore } from 'in-stores/store';

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
    const newLocation = cloneNavigationParameters(currentLocation);
    mutator(newLocation);

    if (!isEqual(newLocation, currentLocation)) {
      hashHistory.push(newLocation);
    }
  });
}

export function getModifiedUrlStream(mapParams) {
  return navigationParameters$
    .map(params => {
      params = cloneNavigationParameters(params);
      mapParams(params);
      return toUrl(params);
    })
    .distinct();
}

// We explicitly clone this manually for the best performance we can get.
// We have a terribly large number of navigation object clone instructions which we
// need to keep fast.
function cloneNavigationParameters(params) {
  const query = {};
  for (let key in params.query) {
    query[key] = params.query[key];
  }

  const cloned = {
    pathname: params.pathname,
    query
  };

  return cloned;
}

function toUrl(params) {
  return `/#${toBaseUrl(params)}`;
}

function toBaseUrl(params) {
  let url = params.pathname;

  let first = true;
  for (const key in params.query) {
    if (first) {
      first = false;
      url = `${url}?${key}=${params.query[key]}`;
    } else {
      url = `${url}&${key}=${params.query[key]}`;
    }
  }

  return url;
}

export function buildUrlStream({ path }) {
  return getModifiedUrlStream(params => {
    params.pathname = path;
  });
}

export function buildPathStartsWithStream(path) {
  return navigationParameters$.map(params => params.pathname.indexOf(path) === 0).distinct();
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

export const homeLink$ = getModifiedUrlStream(params => {
  params.pathname = '/';
  params.query = {};
});

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
  return getModifiedUrlStream(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}/dashboard`;
    params.query.snapshotId = snapshotId;
  });
}

export const isDashboardOpen$ = navigationParameters$
  .map(params => {
    return /\/[a-z]+\/dashboard/i.test(params.pathname);
  })
  .distinct();

export function getLinkToSnapshotInCurrentView(snapshotId) {
  snapshotId = encodeURIComponent(snapshotId);
  return getModifiedUrlStream(params => {
    params.query.snapshotId = snapshotId;
  });
}

export function closeDashboard() {
  mutateUrl(navParams => {
    navParams.pathname = navParams.pathname.replace(/^\/([a-z]+)\/.*/i, (all, view) => `/${view}`);
    return navParams;
  });
}

export function getFixedTimeframeUrl({ windowSize, to, focusedMoment, clearHighlightedTimeframe = false }) {
  return getModifiedUrlStream(navParams => {
    if (!focusedMoment) {
      navParams.query['timeline.fm'] = encodeURIComponent('');
    } else {
      navParams.query['timeline.fm'] = encodeURIComponent(focusedMoment);
    }

    navParams.query['timeline.to'] = encodeURIComponent(to == null ? '' : to);

    if (windowSize) {
      navParams.query['timeline.ws'] = encodeURIComponent(windowSize);
    }

    if (clearHighlightedTimeframe) {
      delete navParams.query['tl.tf'];
    }
  });
}

export function getTimelineLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query['timeline.to'] = encodeURIComponent('');
    navParams.query['timeline.fm'] = encodeURIComponent('');
  });
}

export const closeDashboardLink$ = getModifiedUrlStream(params => {
  params.pathname = params.pathname.replace(/\/dashboard/i, '');
});

export function goToLogicalView() {
  mutateUrl(navParams => {
    navParams.pathname = '/logical';
    return navParams;
  });
}

export const logicalViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/logical';
  delete params.query.vg;
});

export function goToPhysicalView() {
  mutateUrl(navParams => {
    navParams.pathname = '/physical';
    return navParams;
  });
}

export const physicalViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/physical';
  delete params.query.vg;
});

export const containerViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/container';
  delete params.query.vg;
});

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
