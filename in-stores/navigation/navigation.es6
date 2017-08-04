/* global process:false */
import qs from 'qs';

import history from 'in-stores/navigation/history';
import { createStore } from 'in-stores/store';
import { ineum } from 'in-services/eum';

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
  hashHistory = history;
}

const store = createStore({
  name: 'navigation',
  initialValue: {
    pathname: getCurrentPath(),
    query: getInitParams()
  }
});
export const navigationParameters = store.observable;
export const navigationParameters$ = navigationParameters;

hashHistory.listen(location => {
  const pathname = getCurrentPath();
  ineum('page', pathname);
  ineum('startSpaPageTransition');
  store.mutateTo({
    pathname,
    query: qs.parse(location.search.replace('?', ''))
  });
  ineum('endSpaPageTransition', {
    url: window.location.href,
    status: 'completed'
  });
});

export function mutateUrl(mutator) {
  navigationParameters$.once(currentLocation => {
    const newLocation = cloneNavigationParameters(currentLocation);
    mutator(newLocation);

    Object.assign(newLocation, {
      search: qs.stringify(newLocation.query)
    });

    if (!isEqualLocation(newLocation, currentLocation)) {
      hashHistory.push(newLocation);
    }
  });
}

function isEqualLocation(a, b) {
  if (a.pathname !== b.pathname) {
    return false;
  }

  const aKeys = Object.keys(a.query);
  const bKeys = Object.keys(b.query);
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (let i = 0, length = aKeys.length; i < length; i++) {
    const key = aKeys[i];
    if (String(a.query[key]) !== String(b.query[key])) {
      return false;
    }
  }

  return true;
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

function getCurrentPath() {
  const hash = window.location.hash;
  if (!hash || hash.length === 2) {
    return '/';
  } else {
    return hash.substring(hash.indexOf('#/') + 1, hash.indexOf('?'));
  }
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
  const queryString = qs.stringify(params.query);
  if (queryString.length === 0) {
    return url;
  } else {
    return `${url}?${queryString}`;
  }
}

export function buildUrlStream({ path }) {
  return getModifiedUrlStream(params => {
    params.pathname = path;
  });
}

export function buildPathStartsWithStream(path) {
  return navigationParameters$.map(params => params.pathname.indexOf(path) === 0).distinct();
}

function getInitParams() {
  const hash = window.location.hash;
  if (!hash || hash.indexOf('?') === -1) {
    return {};
  } else {
    return qs.parse(hash.substring(hash.indexOf('?') + 1, hash.length));
  }
}

function getActiveView(params) {
  const match = params.pathname.match(/([a-z]+)/i);
  return match ? match[1] : 'physical';
}

export function getFullNavigationPath(subPath, navigationParams) {
  let path = '#';
  const dashboard = 'dashboard';
  path += navigationParams.pathname.substring(0, navigationParams.pathname.indexOf(dashboard) + dashboard.length);
  path += subPath;
  path += `?${qs.stringify(navigationParams.query)}`;
  return path;
}

export function getPartialNavigationPath(subPath, navigationParams) {
  return `#${subPath}?${qs.stringify(navigationParams.query)}`;
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
    params.query.snapshotId = snapshotId;
    return params;
  });
}

export function getDashboardLink(snapshotId) {
  return getModifiedUrlStream(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}/dashboard`;
    params.query.snapshotId = snapshotId;
  });
}

export function getSubDashboardLink(subViewPath) {
  return getModifiedUrlStream(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}/dashboard/${subViewPath}`;
  });
}

export const isDashboardOpen$ = navigationParameters$
  .map(params => {
    return /\/[a-z]+\/dashboard/i.test(params.pathname);
  })
  .distinct();

export function getLinkToSnapshotInCurrentView(snapshotId) {
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
      navParams.query['timeline.fm'] = '';
    } else {
      navParams.query['timeline.fm'] = focusedMoment;
    }

    navParams.query['timeline.to'] = to == null ? '' : to;

    if (windowSize) {
      navParams.query['timeline.ws'] = windowSize;
    }

    if (clearHighlightedTimeframe) {
      delete navParams.query['tl.tf'];
    }
  });
}

export function getTimelineLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query['timeline.to'] = '';
    navParams.query['timeline.fm'] = '';
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
});

export function goToPhysicalView() {
  mutateUrl(navParams => {
    navParams.pathname = '/physical';
    return navParams;
  });
}

export const physicalViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/physical';
});

export const websiteViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/website';
});

export const containerViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/container';
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

export function getEventsViewFilteredByEntity(entityId) {
  return getModifiedUrlStream(params => {
    params.pathname = '/events';
    if (params.query.q) {
      params.query.q += ` entity.id:${entityId}`;
    } else {
      params.query.q = `entity.id:${entityId}`;
    }
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
    if (navParams.query.help && navParams.query.help === id) {
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
