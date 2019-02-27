import { flatMap } from 'lodash';

export function find(array, predicate) {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      // return fist match
      return array[i];
    }
  }
  // explicity return undefined
  return undefined;
}

export function diff(a, b) {
  const result = {
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

/**
 * Inserts an element between every pair of elements in the source array.
 *
 * @param array the array into which elements are inserted
 * @param interspersee the element that is inserted
 * @returns a new array
 */
export function intersperse(array, interspersed) {
  return flatMap(array, (element, idx) => (idx ? [interspersed, element] : [element]));
}
