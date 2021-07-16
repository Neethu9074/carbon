/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// exported for testing purposes
export function getRootPathPattern(...paths: string[]) {
  return new RegExp(`^(${paths.join('|')})(/.*)?$`, 'i');
}

export function getRootPathPredicate(...paths: string[]) {
  const pattern = getRootPathPattern(...paths);
  return pattern.test.bind(pattern);
}
