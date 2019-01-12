import { physicalPath, containerPath, tablePath } from 'in-stores/navigation/paths/mainPaths';
import { stringify } from 'in-stores/navigation/routing/stringifier';
import { applyResets } from 'in-stores/navigation/parameterResets';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { onRouteChange } from 'in-services/tracking/appcues';
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
  store.mutateTo(cloneLocation(location));
  onRouteChange();
});

export function mutateUrl(mutator, replace = false) {
  navigationParameters$.once(currentLocation => {
    const newLocation = cloneLocation(currentLocation);
    mutator(newLocation);
    applyResets(currentLocation, newLocation);
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
    .map(currentLocation => {
      const newLocation = cloneLocation(currentLocation);
      mapParams(newLocation);
      applyResets(currentLocation, newLocation);
      return '/#' + stringify(newLocation);
    })
    .distinct();
}

export function buildPathStartsWithStream(path) {
  return navigationParameters$.map(params => params.pathname.indexOf(path) === 0).distinct();
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
    if (
      twoZeroModeEnabled &&
      params.query.q != undefined &&
      // delete the DF query when navigation from an infrastructure view (map, table) to another,
      // non-infrastructure view, or the other way around
      isInfrastructurePath(path) !== isInfrastructurePath(params.pathname)
    ) {
      delete params.query.q;
    }

    params.pathname = path;
  });
}
function isInfrastructurePath(path) {
  return path.indexOf(physicalPath) === 0 || path.indexOf(tablePath) === 0 || path.indexOf(containerPath) === 0;
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
