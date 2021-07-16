/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// exported for testing purposes
export function getRootPathPattern(...paths) {
  return new RegExp(`^(${paths.join('|')})(/.*)?$`, 'i');
}

export function getRootPathPredicate() {
  const pattern = getRootPathPattern.apply(null, arguments);
  return pattern.test.bind(pattern);
}
