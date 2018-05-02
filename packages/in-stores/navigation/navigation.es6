import { stringify } from 'in-stores/navigation/routing/stringifier';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import history from 'in-stores/navigation/history';
import { createStore } from 'in-stores/store';
import { ineum } from 'in-services/eum';

const store = createStore({
  name: 'navigation',
  initialValue: history.location
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

export function mutateUrl(mutator, replace = false) {
  navigationParameters$.once(currentLocation => {
    const newLocation = cloneLocation(currentLocation);
    mutator(newLocation);
    if (stringify(newLocation) !== stringify(currentLocation)) {
      if (replace) {
        history.replace(newLocation);
      } else {
        history.push(newLocation);
      }
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

export function buildPathStartsWithStream(path) {
  return navigationParameters$.map(params => params.pathname.indexOf(path) === 0).distinct();
}

export function getLinkToSnapshotInCurrentView(snapshotId) {
  return getModifiedUrlStream(params => {
    params.query.snapshotId = snapshotId;
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

export function getTimeframeLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query['timeline.to'] = '';
    navParams.query['timeline.fm'] = '';
  });
}

export function goToRootOfView() {
  mutateUrl(navParams => {
    navParams.pathname = navParams.pathname.replace(/^\/([a-z]+)\/.*/i, (all, view) => `/${view}`);
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

export function goToPath(path) {
  mutateUrl(location => (location.pathname = path));
}

export function getView(path) {
  return getModifiedUrlStream(params => {
    params.pathname = path;
  });
}

export function isView(...args) {
  const predicates = args.reduce((agg, arg) => {
    if (typeof arg === 'function') {
      agg.push(arg);
    } else if (typeof arg === 'string') {
      agg.push(getRootPathPredicate(arg));
    } else {
      // eslint-disable-next-line no-console
      console.error('Unsupport isView predicate of type %s: %s', typeof arg, arg);
    }
    return agg;
  }, []);

  return navigationParameters$
    .map(location => {
      for (let i = 0; i < predicates.length; i++) {
        if (predicates[i](location.pathname)) {
          return true;
        }
      }
      return false;
    })
    .distinct();
}
