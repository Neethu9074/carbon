/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function stopPropagation(e) {
  e.stopPropagation();
}

export function stopPropagationAndPreventDefault(e) {
  e.stopPropagation();
  e.preventDefault();
}

export function noop() {
  // body...
}

export function createInverseComparator(comp) {
  return (a, b) => comp(a, b) * -1;
}

export function identity(v) {
  return v;
}
