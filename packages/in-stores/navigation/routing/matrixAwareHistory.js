/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { stringify } from 'in-stores/navigation/routing/stringifier';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { emptyObject } from 'in-services/fixedObjects';

export function wrap(history) {
  // needed to resolve cases where a redirect is done via React components. This will then only
  // push via a string. In these cases, we want to potentially retain all matrix and query parameters.
  let currentLocation;

  const origPush = history.push;
  const origReplace = history.replace;
  const origListen = history.listen;

  history.location = parseUrl(window.location.hash.replace(/^#/, ''));

  history.listen = listener => origListen.call(history, wrapListener(listener));
  history.push = pathnameOrLocation => origPush.call(history, translate(pathnameOrLocation, currentLocation));
  history.replace = pathnameOrLocation => origReplace.call(history, translate(pathnameOrLocation, currentLocation));

  history.listen(location => (currentLocation = history.location = location));

  return history;
}

function wrapListener(listener) {
  return location => listener(parseUrl(location.pathname + (location.search || '')));
}

function translate(location, currentLocation) {
  currentLocation = currentLocation || emptyObject;

  // Pushing as string is supported in the history module. We will always normalize
  // to a location object, because we need to account for pushing strings without
  // query or matrix data.
  if (typeof location === 'string') {
    location = parseUrl(location);
  }

  return stringify({
    pathname: location.pathname || currentLocation.pathname || '',
    query: location.query || currentLocation.query || emptyObject,
    matrix: location.matrix || currentLocation.matrix || emptyObject
  });
}
