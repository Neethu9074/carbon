export function stopPropagation(e) {
  e.stopPropagation();
}

export function noop() {
  // body...
}

export function createInverseComparator(comp) {
  return (a, b) => comp(a, b) * -1;
}
