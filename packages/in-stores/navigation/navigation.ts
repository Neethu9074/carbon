/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import { IsViewArg, IsViewPredicate, removeDFQueryFromLocationWhenChangingArea } from 'in-stores/navigation/utils';
import { applyResets } from 'in-stores/navigation/urlParameterResets';
import { stringify } from 'in-stores/navigation/routing/stringifier';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { formatPathWithTU } from 'in-services/formatters/url';
import { Location } from 'in-stores/navigation/types';
import history from 'in-stores/navigation/history';
import { ineum } from 'in-services/tracking/ineum';
import { createStore } from 'in-stores/store';

const store = createStore<Location>({
  name: 'navigation',
  initialValue: history.location
});
export const navigationParameters$ = store.observable;

// Synchronously set the page name to ensure that the page load beacon does carry the right page name.
ineum('page', history.location.pathname);

history.listen(location => {
  ineum('page', location.pathname);
  store.mutateTo(cloneLocation(location));
});

export type LocationMutator = (location: Location) => void;

/**
 * @deprecated - Deprecated in favour of hook based navigation. Please use useNavigate instead
 */
export function mutateUrl(mutator: LocationMutator, replace = false) {
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

/**
 * @deprecated - Deprecated in favour of hook based navigation. Please use useNavigate instead
 */
export function getModifiedUrl(currentLocation: Location, modifyLocation: LocationMutator): string {
  const newLocation = cloneLocation(currentLocation);
  modifyLocation(newLocation);
  applyResets(currentLocation, newLocation);
  return formatPathWithTU(`/#${stringify(newLocation)}`);
}

/**
 * @deprecated - Deprecated in favour of hook based navigation. Please use useNavigate instead
 */
export function getModifiedUrlStream(modifyLocation: LocationMutator) {
  return navigationParameters$.map(currentLocation => getModifiedUrl(currentLocation, modifyLocation)).distinct();
}
/**
 * @deprecated - Deprecated in favour of hook based navigation. Please use useNavigate instead
 */
export function getView(path: string) {
  return getModifiedUrlStream((location: Location) => {
    // checks the current and next path if navigating into another area.
    removeDFQueryFromLocationWhenChangingArea(location, path);
    location.pathname = path;
  });
}

/**
 * @deprecated - Deprecated in favour of hook based navigation. Please use useNavigate instead
 */
export function isView(...args: IsViewArg[]) {
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
  }, [] as Array<IsViewPredicate>);

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

export const propTypeLocation = PropTypes.shape({
  pathname: PropTypes.string.isRequired,
  matrix: PropTypes.object,
  query: PropTypes.object
});
