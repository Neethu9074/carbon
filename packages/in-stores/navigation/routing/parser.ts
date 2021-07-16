/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Location, MatrixParameters, Parameters } from 'in-stores/navigation/types';
import { emptyObject } from 'in-services/fixedObjects';

export function parseUrl(href: string) {
  href = href || '/';

  let location = parseQueryParameters(href);
  location = parseMatrix(location);

  return location;
}

function parseQueryParameters(href: string): Location {
  const match = href.match(/^(.*)\?([^#$]*)/);
  if (!match) {
    return {
      pathname: href,
      query: emptyObject,
      matrix: emptyObject
    };
  }

  const pathname = match[1];
  const query = match[2].split('&').reduce(paramReducer, {});
  return { pathname, query, matrix: emptyObject };
}

function paramReducer(agg: Parameters, parameter: string) {
  let [key, value] = parameter.split('=');
  if (!key) {
    return agg;
  }
  if (value == null) {
    value = '';
  }
  agg[decodeURIComponent(key)] = decodeURIComponent(value);
  return agg;
}

function parseMatrix(location: Location): Location {
  location.matrix = location.pathname
    .split('/')
    .slice(1)
    .reduce(segmentReducer.bind(null), {});

  let pathname = '';
  for (let key in location.matrix) {
    pathname += key;
  }
  location.pathname = pathname;

  return location;
}

function segmentReducer(agg: MatrixParameters, pathname: string) {
  pathname = '/' + pathname;
  const split = pathname.split(';');
  const pathnameSegment = split[0];
  if (split.length <= 0) {
    agg[pathnameSegment] = emptyObject;
    return agg;
  }
  agg[pathnameSegment] = split.slice(1).reduce(paramReducer, {});
  return agg;
}
