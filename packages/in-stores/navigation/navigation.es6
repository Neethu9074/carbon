import { stringify } from 'in-stores/navigation/routing/stringifier';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { parseUrl } from 'in-stores/navigation/routing/parser';
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

const store = createStore({
  name: 'navigation',
  initialValue: parseUrl(window.location.hash.replace(/^#/, ''))
});
export const navigationParameters = store.observable;
export const navigationParameters$ = navigationParameters;

history.listen(location => {
  ineum('page', location.pathname);
  ineum('startSpaPageTransition');
  store.mutateTo(cloneLocation(location));
  ineum('endSpaPageTransition', {
    url: location.pathname,
    status: 'completed'
  });
});

export function mutateUrl(mutator) {
  navigationParameters$.once(currentLocation => {
    const newLocation = cloneLocation(currentLocation);
    mutator(newLocation);
    if (stringify(newLocation) !== stringify(currentLocation)) {
      history.push(newLocation);
    }
  });
}

export function getModifiedUrlStream(mapParams) {
  return navigationParameters$
    .map(params => {
      params = cloneLocation(params);
      mapParams(params);
      return '/#' + stringify(params);
    })
    .distinct();
}

export function buildUrlStream({ path }) {
  return getModifiedUrlStream(params => {
    params.pathname = path;
  });
}

export function buildPathStartsWithStream(path) {
  return navigationParameters$.map(params => params.pathname.indexOf(path) === 0).distinct();
}

export function getActiveView(params) {
  return params.pathname.replace(/\/dashboard($|\/.*)/, '').replace(/^\//, '');
}

export function getLinkToPath(pathname) {
  return getModifiedUrlStream(params => (params.pathname = pathname));
}

export function goToDashboard(snapshotId) {
  mutateUrl(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}/dashboard`;
    params.query.snapshotId = snapshotId;
    return params;
  });
}

export function getDashboardLink(snapshotId, { windowSize, to, focusedMoment, pathname } = {}) {
  return getModifiedUrlStream(params => {
    if (pathname) {
      params.pathname = pathname;
    } else {
      const view = getActiveView(params);
      params.pathname = `/${view}/dashboard`;
    }
    if (windowSize != null) {
      params.query['timeline.ws'] = windowSize;
    }
    if (to !== undefined) {
      params.query['timeline.to'] = to == null ? '' : to;
    }
    if (focusedMoment !== undefined) {
      params.query['timeline.fm'] = focusedMoment == null ? '' : focusedMoment;
    }
    params.query.snapshotId = snapshotId;
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

export const kubernetesViewLink$ = getModifiedUrlStream(params => {
  params.pathname = '/kubernetes';
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
      params.query.q += ` entity.id:"${luceneEscapeString(entityId)}"`;
    } else {
      params.query.q = `entity.id:"${luceneEscapeString(entityId)}"`;
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

export function setOrDeleteMatrixKey(path, key, value) {
  mutateUrl(params => {
    if (value) {
      params.matrix[path] = params.matrix[path] || {};
      params.matrix[path][key] = value;
    } else {
      if (params.matrix[path]) {
        delete params.matrix[path][key];
      }
    }
    return params;
  });
}
