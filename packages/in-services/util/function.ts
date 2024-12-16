/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { SyntheticEvent } from 'react';

export function stopPropagation(e: SyntheticEvent) {
  e.stopPropagation();
}

export function stopPropagationAndPreventDefault(e: SyntheticEvent) {
  e.stopPropagation();
  e.preventDefault();
}

export function noop() {
  // body...
}

export function createInverseComparator<T>(comp: (a: T, b: T) => number) {
  return (a: T, b: T) => comp(a, b) * -1;
}

export function identity<T>(v: T): T {
  return v;
}
