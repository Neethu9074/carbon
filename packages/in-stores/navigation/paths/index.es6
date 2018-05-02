export function getRootPathPattern(...paths) {
  return new RegExp(`^(${paths.join('|')})(/.*)?$`, 'i');
}

export function getRootPathPredicate() {
  const pattern = getRootPathPattern.apply(null, arguments);
  return pattern.test.bind(pattern);
}
