/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { flatMap } from 'lodash';

export function find<T>(array: T[], predicate: (element: T) => boolean): T | undefined {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      // return fist match
      return array[i];
    }
  }
  // explicity return undefined
  return undefined;
}

interface DiffResult<T> {
  uniqueItemsA: T[];
  sharedItems: T[];
  uniqueItemsB: T[];
}

export function diff<T>(a: T[], b: T[]): DiffResult<T> {
  const result: DiffResult<T> = {
    uniqueItemsA: [],
    sharedItems: [],
    uniqueItemsB: []
  };

  for (let i = 0; i < a.length; i++) {
    const aItem = a[i];
    if (b.indexOf(aItem) === -1) {
      result.uniqueItemsA.push(aItem);
    } else {
      result.sharedItems.push(aItem);
    }
  }

  for (let i = 0; i < b.length; i++) {
    const bItem = b[i];
    if (a.indexOf(bItem) === -1) {
      result.uniqueItemsB.push(bItem);
    }
  }

  return result;
}

type Interspersee<T> = (i: number) => T;

/**
 * Inserts an element between every pair of elements in the source array.
 *
 * @param array: the array into which elements are inserted
 * @param interspersed: the element that is inserted or a function that receives the curreent index and creates a new
 * element for every index (the latter variant is useful if you are using this to intersperse React elements and need to
 * add a unique key property to each inserted element).
 * @returns a new array
 */
export function intersperse<T>(array: T[], interspersed: T | Interspersee<T>): T[] {
  const interspersee: Interspersee<T> =
    typeof interspersed === 'function' ? (interspersed as Interspersee<T>) : () => interspersed;
  return flatMap(array, (element, idx) => (idx ? [interspersee(idx), element] : [element]));
}

export function uniq<T>(array: T[], extractKey: (element: T) => any): T[] {
  const seen = new Set();
  return array.filter(item => {
    const key = extractKey(item);
    return seen.has(key) ? false : seen.add(key);
  });
}
