/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function getRootPathPattern(...paths) {
  return new RegExp(`^(${paths.join('|')})(/.*)?$`, 'i');
}

export function getRootPathPredicate() {
  const pattern = getRootPathPattern.apply(null, arguments);
  return pattern.test.bind(pattern);
}

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

export function getPredicateForPathsWithRouteParamPlaceholders() {
  const pattern = getRegexForPathPatternsWithRouteParamPlaceholders.apply(null, arguments);
  return pattern.test.bind(pattern);
}
