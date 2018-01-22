// @flow

export function stopPropagation(e: Event) {
  e.stopPropagation();
}

export function stopPropagationAndPreventDefault(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

export function noop() {
  // body...
}

export function createInverseComparator<T>(comp: Comparator<T>): Comparator<T> {
  return (a, b) => comp(a, b) * -1;
}

export function identity<T>(v: T): T {
  return v;
}
