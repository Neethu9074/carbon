/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import { getRootPathPredicate, getPredicateForPathsWithRouteParamPlaceholders } from 'in-stores/navigation/paths';
import { physicalPath, containerPath, tablePath } from 'in-stores/navigation/paths/mainPaths';
import { applyResets } from 'in-stores/navigation/urlParameterResets';
import { stringify } from 'in-stores/navigation/routing/stringifier';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import history from 'in-stores/navigation/history';
import { ineum } from 'in-services/tracking/ineum';
import { createStore } from 'in-stores/store';

const store = createStore({
  name: 'navigation',
  initialValue: history.location
});
export const navigationParameters = store.observable;
export const navigationParameters$ = navigationParameters;

// Synchronously set the page name to ensure that the page load beacon does carry the right page name.
ineum('page', history.location.pathname);

history.listen(location => {
  ineum('page', location.pathname);
  store.mutateTo(cloneLocation(location));
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

export function getModifiedUrl(currentLocation, modifyLocation) {
  const newLocation = cloneLocation(currentLocation);
  modifyLocation(newLocation);
  applyResets(currentLocation, newLocation);
  return '/#' + stringify(newLocation);
}

export function getModifiedUrlStream(modifyLocation) {
  return navigationParameters$.map(currentLocation => getModifiedUrl(currentLocation, modifyLocation)).distinct();
}

export function toAbsoluteUrl(partialUrl) {
  return window.location.origin + partialUrl;
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

export function goToPath(path) {
  mutateUrl(location => (location.pathname = path));
}

export function getView(path) {
  return getModifiedUrlStream(params => {
    if (
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

export function isView(...args) {
  const predicates = args.reduce((agg, arg) => {
    if (typeof arg === 'function') {
      agg.push(arg);
    } else if (typeof arg === 'string') {
      agg.push(getRootPathPredicate(arg));
    } else {
      if (__DEV__) {
        throw new Error(`Unsupported isView predicate of type ${typeof arg}: ${arg}`);
      }
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

// A variant of isView that can handle routing parameter placeholders.
export function isViewWithRouteParam(...args) {
  const predicates = args.reduce((agg, arg) => {
    if (typeof arg === 'string') {
      agg.push(getPredicateForPathsWithRouteParamPlaceholders(arg));
    } else {
      if (__DEV__) {
        throw new Error(`Unsupported isViewWithRouteParam predicate of type ${typeof arg}: ${arg}`);
      }
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

function isInfrastructurePath(path) {
  return path.indexOf(physicalPath) === 0 || path.indexOf(tablePath) === 0 || path.indexOf(containerPath) === 0;
}

export const propTypeLocation = PropTypes.shape({
  pathname: PropTypes.string.isRequired,
  matrix: PropTypes.object,
  query: PropTypes.object
});
