/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { navigationParameters$ } from 'in-stores/navigation/navigation';

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

function getPredicateForPathsWithRouteParamPlaceholders() {
  const pattern = getRegexForPathPatternsWithRouteParamPlaceholders.apply(null, arguments);
  return pattern.test.bind(pattern);
}

// exported for testing purposes
export function getRegexForPathPatternsWithRouteParamPlaceholders(...paths) {
  return new RegExp(
    paths
      // 1.  For each path, replace all route parameter placeholders (something like ":id") in the path by the regex
      // syntax for a non-capturing group,
      .map(path => path.replace(/:[^/:]*/g, '(?:[^/]*)'))
      // 2. join all path patterns with '|',
      .join('|'),
    // 3. turn the whole resulting string into a new regex
    'i'
  );
}
